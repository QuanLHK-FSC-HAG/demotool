import { createHash } from "node:crypto";

const ONLINE_SECONDS = 5 * 60;
const DAILY_TTL_SECONDS = 8 * 24 * 60 * 60;

const TOTAL_KEY = "analytics:visits:total";
const ONLINE_KEY = "analytics:visitors:online";

type UpstashResult<T> = {
  result?: T;
  error?: string;
};

export type VisitStats = {
  total: number;
  today: number;
  online: number;
  updatedAt: string;
};

export class AnalyticsNotConfiguredError extends Error {
  constructor() {
    super("Analytics service is not configured");
  }
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new AnalyticsNotConfiguredError();
  return { url, token };
}

async function redisRequest<T>(path: string, body: unknown): Promise<T> {
  const { url, token } = getRedisConfig();
  const response = await fetch(`${url}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Analytics storage request failed");
  return response.json() as Promise<T>;
}

function vietnamDateKey(date = new Date()) {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return `analytics:visits:day:${day}`;
}

function visitorHash(visitorId: string) {
  return createHash("sha256").update(visitorId).digest("hex");
}

const RECORD_VISIT_SCRIPT = `
redis.call("INCR", KEYS[1])
redis.call("INCR", KEYS[2])
redis.call("EXPIRE", KEYS[2], ARGV[1])
redis.call("ZADD", KEYS[3], ARGV[2], ARGV[3])
redis.call("ZREMRANGEBYSCORE", KEYS[3], 0, ARGV[4])
redis.call("EXPIRE", KEYS[3], ARGV[1])
return 1
`;

export async function recordVisit(visitorId: string) {
  const hash = visitorHash(visitorId);
  const now = Date.now();
  const command = [
    "EVAL",
    RECORD_VISIT_SCRIPT,
    "3",
    TOTAL_KEY,
    vietnamDateKey(),
    ONLINE_KEY,
    String(DAILY_TTL_SECONDS),
    String(now),
    hash,
    String(now - ONLINE_SECONDS * 1000),
  ];
  const response = await redisRequest<UpstashResult<number>>("", command);
  if (response.error) throw new Error("Analytics storage command failed");
  return response.result === 1;
}

export async function getVisitStats(): Promise<VisitStats> {
  const now = Date.now();
  const commands = [
    ["ZREMRANGEBYSCORE", ONLINE_KEY, "0", String(now - ONLINE_SECONDS * 1000)],
    ["GET", TOTAL_KEY],
    ["GET", vietnamDateKey()],
    ["ZCARD", ONLINE_KEY],
  ];
  const results = await redisRequest<Array<UpstashResult<string | number | null>>>("/pipeline", commands);
  if (results.some((item) => item.error)) throw new Error("Analytics storage command failed");

  return {
    total: Number(results[1]?.result || 0),
    today: Number(results[2]?.result || 0),
    online: Number(results[3]?.result || 0),
    updatedAt: new Date().toISOString(),
  };
}

export const analyticsConfig = {
  onlineMinutes: ONLINE_SECONDS / 60,
};
