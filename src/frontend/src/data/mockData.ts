import type { DuplicateResult, LanguageOption, SimilarityGroup } from "@/types";

// Language options with flag emojis
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "ja", label: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
  { code: "zh", label: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "ar", label: "Arabic", flag: "🇸🇦", nativeName: "العربية" },
  { code: "fr", label: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", label: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "es", label: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "ko", label: "Korean", flag: "🇰🇷", nativeName: "한국어" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷", nativeName: "Português" },
  { code: "ru", label: "Russian", flag: "🇷🇺", nativeName: "Русский" },
];

// Mock similarity groups showing cross-language duplicates
export const MOCK_SIMILARITY_GROUPS: SimilarityGroup[] = [
  {
    id: "grp-001",
    original: {
      id: "rec-001",
      name: "John Doe — 123 Maple Street, Springfield",
      description: "Customer account with billing address in Springfield",
      language: "en",
      tags: ["customer", "billing"],
      createdAt: "2025-03-15T10:30:00Z",
    },
    similar: [
      {
        record: {
          id: "rec-002",
          name: "Juan Doe — Calle Maple 123, Springfield",
          description: "Cuenta de cliente con dirección en Springfield",
          language: "es",
          tags: ["cliente", "facturación"],
          createdAt: "2025-03-22T14:00:00Z",
        },
        matchedTokens: ["Maple", "Springfield", "Doe"],
        translatedName: "John Doe — 123 Maple Street, Springfield",
      },
      {
        record: {
          id: "rec-003",
          name: "Jean Doe — 123 rue Maple, Springfield",
          description:
            "Compte client avec adresse de facturation à Springfield",
          language: "fr",
          tags: ["client", "facturation"],
          createdAt: "2025-04-01T09:15:00Z",
        },
        matchedTokens: ["rue Maple", "Springfield"],
        translatedName: "John Doe — 123 Maple Street, Springfield",
      },
    ],
    topScore: 85,
    processedAt: "2025-04-17T08:00:00Z",
  },
  {
    id: "grp-002",
    original: {
      id: "rec-010",
      name: "Global Tech Solutions Inc.",
      description:
        "Software development company headquartered in San Francisco",
      language: "en",
      tags: ["company", "tech"],
      createdAt: "2025-02-10T11:00:00Z",
    },
    similar: [
      {
        record: {
          id: "rec-011",
          name: "グローバルテックソリューションズ株式会社",
          description: "サンフランシスコを本社とするソフトウェア開発会社",
          language: "ja",
          tags: ["企業", "テック"],
          createdAt: "2025-02-18T16:45:00Z",
        },
        matchedTokens: ["グローバルテック", "ソリューションズ"],
        translatedName: "Global Tech Solutions Co., Ltd.",
      },
    ],
    topScore: 72,
    processedAt: "2025-04-17T08:00:05Z",
  },
  {
    id: "grp-003",
    original: {
      id: "rec-020",
      name: "Ahmed Al-Rashid — Riyadh, Saudi Arabia",
      description: "Corporate client, financial services sector",
      language: "ar",
      tags: ["corporate", "finance"],
      createdAt: "2025-01-05T08:30:00Z",
    },
    similar: [
      {
        record: {
          id: "rec-021",
          name: "احمد الراشد — الرياض، المملكة العربية السعودية",
          description: "عميل مؤسسي في قطاع الخدمات المالية",
          language: "ar",
          tags: ["شركة", "مالية"],
          createdAt: "2025-01-12T10:00:00Z",
        },
        matchedTokens: ["الراشد", "الرياض"],
        translatedName: "Ahmad Al-Rashid — Riyadh, Saudi Arabia",
      },
    ],
    topScore: 45,
    processedAt: "2025-04-17T08:00:10Z",
  },
  {
    id: "grp-004",
    original: {
      id: "rec-030",
      name: "Beijing Zhongguancun Science Park",
      description: "High-tech industry development zone in Beijing, China",
      language: "en",
      tags: ["location", "tech-park"],
      createdAt: "2025-03-01T07:00:00Z",
    },
    similar: [
      {
        record: {
          id: "rec-031",
          name: "北京中关村科技园",
          description: "北京高新技术产业开发区",
          language: "zh",
          tags: ["地点", "科技园"],
          createdAt: "2025-03-08T12:00:00Z",
        },
        matchedTokens: ["北京", "中关村"],
        translatedName: "Beijing Zhongguancun Science and Technology Park",
      },
    ],
    topScore: 91,
    processedAt: "2025-04-17T08:00:15Z",
  },
];

// Full mock detection result
export const MOCK_DETECTION_RESULT: DuplicateResult = {
  groups: MOCK_SIMILARITY_GROUPS,
  totalRecordsAnalyzed: 247,
  duplicatesFound: MOCK_SIMILARITY_GROUPS.reduce(
    (acc, g) => acc + g.similar.length,
    0,
  ),
  processingTimeMs: 1842,
};

// Processing steps shown during analysis animation
export const PROCESSING_STEPS = [
  "Parsing input records...",
  "Detecting languages...",
  "Translating to embedding space...",
  "Running semantic similarity...",
  "Clustering near-duplicates...",
  "Ranking results by confidence...",
  "Finalizing report...",
];
