import type { DuplicateResult, Language } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  // Detection state
  detectionResults: DuplicateResult | null;
  isProcessing: boolean;
  processingProgress: number;
  processingStep: string;
  setDetectionResults: (results: DuplicateResult | null) => void;
  setIsProcessing: (value: boolean) => void;
  setProcessingProgress: (progress: number, step?: string) => void;

  // Search & filters
  searchFilter: string;
  languageFilter: Language | "all";
  similarityFilter: "all" | "high" | "medium" | "low";
  setSearchFilter: (query: string) => void;
  setLanguageFilter: (lang: Language | "all") => void;
  setSimilarityFilter: (filter: "all" | "high" | "medium" | "low") => void;

  // Reset
  resetDetection: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: "dark",
      setTheme: (theme) => set({ theme }),

      // Detection state
      detectionResults: null,
      isProcessing: false,
      processingProgress: 0,
      processingStep: "",
      setDetectionResults: (results) => set({ detectionResults: results }),
      setIsProcessing: (value) => set({ isProcessing: value }),
      setProcessingProgress: (progress, step = "") =>
        set({ processingProgress: progress, processingStep: step }),

      // Search & filters
      searchFilter: "",
      languageFilter: "all",
      similarityFilter: "all",
      setSearchFilter: (query) => set({ searchFilter: query }),
      setLanguageFilter: (lang) => set({ languageFilter: lang }),
      setSimilarityFilter: (filter) => set({ similarityFilter: filter }),

      // Reset
      resetDetection: () =>
        set({
          detectionResults: null,
          isProcessing: false,
          processingProgress: 0,
          processingStep: "",
          searchFilter: "",
          languageFilter: "all",
          similarityFilter: "all",
        }),
    }),
    {
      name: "dupeguard-store",
      // Only persist theme preference
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
