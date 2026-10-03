import { cn } from "@/lib/utils";

export interface CategoryColor {
  iconBg: string;
  iconText: string;
  chipBg: string;
  chipText: string;
  border: string;
  text: string;
  dot: string;
}

const colors: Record<string, CategoryColor> = {
  amber: { iconBg: "bg-amber-100 dark:bg-amber-500/15", iconText: "text-amber-600 dark:text-amber-400", chipBg: "bg-amber-50 dark:bg-amber-500/10", chipText: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-500/30", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  orange: { iconBg: "bg-orange-100 dark:bg-orange-500/15", iconText: "text-orange-600 dark:text-orange-400", chipBg: "bg-orange-50 dark:bg-orange-500/10", chipText: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-500/30", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500" },
  red: { iconBg: "bg-red-100 dark:bg-red-500/15", iconText: "text-red-600 dark:text-red-400", chipBg: "bg-red-50 dark:bg-red-500/10", chipText: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-500/30", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  green: { iconBg: "bg-green-100 dark:bg-green-500/15", iconText: "text-green-600 dark:text-green-400", chipBg: "bg-green-50 dark:bg-green-500/10", chipText: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-500/30", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
  teal: { iconBg: "bg-teal-100 dark:bg-teal-500/15", iconText: "text-teal-600 dark:text-teal-400", chipBg: "bg-teal-50 dark:bg-teal-500/10", chipText: "text-teal-700 dark:text-teal-300", border: "border-teal-200 dark:border-teal-500/30", text: "text-teal-600 dark:text-teal-400", dot: "bg-teal-500" },
  blue: { iconBg: "bg-blue-100 dark:bg-blue-500/15", iconText: "text-blue-600 dark:text-blue-400", chipBg: "bg-blue-50 dark:bg-blue-500/10", chipText: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-500/30", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  cyan: { iconBg: "bg-cyan-100 dark:bg-cyan-500/15", iconText: "text-cyan-600 dark:text-cyan-400", chipBg: "bg-cyan-50 dark:bg-cyan-500/10", chipText: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-200 dark:border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400", dot: "bg-cyan-500" },
  indigo: { iconBg: "bg-indigo-100 dark:bg-indigo-500/15", iconText: "text-indigo-600 dark:text-indigo-400", chipBg: "bg-indigo-50 dark:bg-indigo-500/10", chipText: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500" },
  violet: { iconBg: "bg-violet-100 dark:bg-violet-500/15", iconText: "text-violet-600 dark:text-violet-400", chipBg: "bg-violet-50 dark:bg-violet-500/10", chipText: "text-violet-700 dark:text-violet-300", border: "border-violet-200 dark:border-violet-500/30", text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500" },
  purple: { iconBg: "bg-purple-100 dark:bg-purple-500/15", iconText: "text-purple-600 dark:text-purple-400", chipBg: "bg-purple-50 dark:bg-purple-500/10", chipText: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-500/30", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500" },
  rose: { iconBg: "bg-rose-100 dark:bg-rose-500/15", iconText: "text-rose-600 dark:text-rose-400", chipBg: "bg-rose-50 dark:bg-rose-500/10", chipText: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-500/30", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
};

export function getColor(color: string): CategoryColor {
  return colors[color] ?? colors.blue;
}

export const ecosystemAccent: Record<string, string> = {
  gold: "text-amber-600 dark:text-amber-400",
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
};

export function accentText(accent: string): string {
  return ecosystemAccent[accent] ?? ecosystemAccent.blue;
}
