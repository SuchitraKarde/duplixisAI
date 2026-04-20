// Core type definitions for the multilingual duplicate detection system

export type Language =
  | "en"
  | "hi"
  | "mr"
  | "ja"
  | "zh"
  | "ar"
  | "fr"
  | "de"
  | "es"
  | "ko"
  | "pt"
  | "ru"
  | "it"
  | "id";

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  nativeName: string;
}

export interface RecordEntry {
  id: string;
  name: string;
  description: string;
  language: Language;
  tags?: string[];
  createdAt?: string;
}

export interface SimilarRecord {
  record: RecordEntry;
  matchedTokens: string[];
  translatedName?: string;
}

export interface SimilarityGroup {
  id: string;
  original: RecordEntry;
  similar: SimilarRecord[];
  topScore: number;
  processedAt: string;
}

export interface DuplicateResult {
  sourceRecords: RecordEntry[];
  cleanedRecords: RecordEntry[];
  groups: SimilarityGroup[];
  totalRecordsAnalyzed: number;
  duplicatesFound: number;
  processingTimeMs: number;
}

export type SimilarityLevel = "high" | "medium" | "low";

export interface DetectionInput {
  mode: "file" | "manual";
  file?: File;
  manualRecord?: Omit<RecordEntry, "id" | "createdAt">;
}
