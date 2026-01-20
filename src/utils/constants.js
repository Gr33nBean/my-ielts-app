export const API_URL =
  "https://script.google.com/macros/s/AKfycbzugm-73odoB5H86X3uasCQ_XjpYTu_yoSfLH55mGB2MnvAbHKHxnCS00INXkW85IbHiA/exec";

export const TASK_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  ALL: "all",
  OVERDUE: "overdue",
  ACTIVE: "active",
};

export const TASK_LABELS = {
  [TASK_STATUS.PENDING]: "Cần làm",
  [TASK_STATUS.COMPLETED]: "Đã xong",
  [TASK_STATUS.ALL]: "Tất cả",
  [TASK_STATUS.OVERDUE]: "Trễ hạn",
  [TASK_STATUS.ACTIVE]: "Còn hạn",
};

export const TOPIC_CATEGORIES = {
  SPEAKING_P1: "Speaking Part 1",
  SPEAKING_P23: "Speaking Part 2 & 3",
  WRITING_T1: "Writing Task 1",
  WRITING_T2: "Writing Task 2",
  READING: "Reading (Context)",
  LISTENING: "Listening (Context)",
  GRAMMAR: "Grammar",
  VOCABULARY: "Vocabulary",
};

export const CATEGORY_TYPES = {
  SPEAKING: "speaking",
  READING: "reading",
  LISTENING: "listening",
  WRITING: "writing",
  GRAMMAR: "grammar",
  VOCABULARY: "vocab",
};

export const CATEGORY_CONFIG = {
  SPEAKING: {
    icon: "🎙️",
    colorClass: "orange",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-900/50",
    badge:
      "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  },
  READING: {
    icon: "📖",
    colorClass: "emerald",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/50",
    badge:
      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  LISTENING: {
    icon: "🎧",
    colorClass: "purple",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-900/50",
    badge:
      "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  WRITING: {
    icon: "✍️",
    colorClass: "blue",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/50",
    badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  GRAMMAR: {
    icon: "⚙️",
    colorClass: "indigo",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900/50",
    badge:
      "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  },
  DEFAULT: {
    icon: "📚",
    colorClass: "slate",
    bg: "bg-slate-50 dark:bg-slate-800",
    text: "text-slate-400 dark:text-slate-500",
    border: "border-slate-100 dark:border-slate-800",
    badge: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  },
};

export const getBaseCategory = (categoryName = "") => {
  const name = (categoryName || "").toLowerCase();
  if (name.includes("speaking")) return CATEGORY_TYPES.SPEAKING;
  if (name.includes("reading")) return CATEGORY_TYPES.READING;
  if (name.includes("listening")) return CATEGORY_TYPES.LISTENING;
  if (name.includes("writing")) return CATEGORY_TYPES.WRITING;
  if (name.includes("grammar")) return CATEGORY_TYPES.GRAMMAR;
  if (name.includes("vocab")) return CATEGORY_TYPES.VOCABULARY;
  return null;
};

export const getCategoryConfig = (categoryName = "") => {
  const base = getBaseCategory(categoryName);
  switch (base) {
    case CATEGORY_TYPES.SPEAKING:
      return CATEGORY_CONFIG.SPEAKING;
    case CATEGORY_TYPES.READING:
      return CATEGORY_CONFIG.READING;
    case CATEGORY_TYPES.LISTENING:
      return CATEGORY_CONFIG.LISTENING;
    case CATEGORY_TYPES.WRITING:
      return CATEGORY_CONFIG.WRITING;
    case CATEGORY_TYPES.GRAMMAR:
      return CATEGORY_CONFIG.GRAMMAR;
    case CATEGORY_TYPES.VOCABULARY:
      return {
        icon: "🧠",
        colorClass: "rose",
        bg: "bg-rose-50 dark:bg-rose-900/20",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-100 dark:border-rose-900/50",
        badge:
          "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
      };
    default:
      return CATEGORY_CONFIG.DEFAULT;
  }
};

export const USER_ROLES = {
  ADMIN: "admin",
  MEMBER: "member", // Updated to match backend Auth.js and Schema
};
