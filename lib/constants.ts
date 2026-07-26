export const siteConfig = {
  name: "Tập huấn Google AI Studio",
  shortName: "Google AI Studio",
  description: "Nền tảng tập huấn giúp giáo viên biến bài học thành game và website học tập với Google AI Studio.",
  aiStudioUrl: "https://aistudio.google.com/apps",
};

export const subjects = ["Toán", "Ngữ văn", "Tiếng Anh", "Khoa học", "Lịch sử", "Địa lý", "Tin học", "Khác"] as const;

export const gameTypes = [
  { value: "quiz", label: "Quiz", icon: "CircleHelp", color: "blue" },
  { value: "crossword", label: "Ô chữ", icon: "Grid3X3", color: "amber" },
  { value: "matching", label: "Ghép đôi", icon: "Combine", color: "green" },
  { value: "memory", label: "Lật thẻ", icon: "Brain", color: "pink" },
  { value: "millionaire", label: "Ai là triệu phú", icon: "Trophy", color: "amber" },
  { value: "drag-drop", label: "Kéo & thả", icon: "MousePointer2", color: "blue" },
  { value: "escape-room", label: "Escape Room", icon: "DoorOpen", color: "pink" },
  { value: "timeline", label: "Dòng thời gian", icon: "History", color: "green" },
  { value: "flashcard", label: "Flashcard", icon: "GalleryHorizontal", color: "blue" },
  { value: "wheel", label: "Vòng quay", icon: "Disc3", color: "pink" },
] as const;
