import { LANGUAGE_OPTIONS } from "@/data/mockData";
import type { Language, SimilarityLevel } from "@/types";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Returns the similarity level tier for a given score */
export function getSimilarityLevel(score: number): SimilarityLevel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

/** Returns Tailwind CSS class string for a similarity score */
export function getSimilarityClass(score: number): string {
  const level = getSimilarityLevel(score);
  const map: Record<SimilarityLevel, string> = {
    high: "similarity-high",
    medium: "similarity-medium",
    low: "similarity-low",
  };
  return map[level];
}

/** Returns a human-readable label for a similarity score */
export function getSimilarityLabel(score: number): string {
  const level = getSimilarityLevel(score);
  const map: Record<SimilarityLevel, string> = {
    high: "High Match",
    medium: "Medium Match",
    low: "Low Match",
  };
  return map[level];
}

/** Get language option by code */
export function getLanguageOption(code: Language) {
  return LANGUAGE_OPTIONS.find((l) => l.code === code);
}

/** Returns flag emoji for a language code */
export function getLanguageFlag(code: Language): string {
  return getLanguageOption(code)?.flag ?? "🌐";
}

/** Highlight matching tokens in a text string */
export function highlightTokens(text: string, tokens: string[]): string {
  if (!tokens.length) return text;
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.replace(regex, '<mark class="token-highlight">$1</mark>');
}

/** Format processing time in a human-readable way */
export function formatProcessingTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/** Debounce helper for search inputs */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
