import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_OPTIONS } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";
import type { Language } from "@/types";
import { Search } from "lucide-react";
import { motion } from "motion/react";

export function SearchFilter() {
  const {
    searchFilter,
    languageFilter,
    similarityFilter,
    setSearchFilter,
    setLanguageFilter,
    setSimilarityFilter,
  } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col gap-3 lg:flex-row"
      data-ocid="results.filters.section"
    >
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search records by name or content..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          data-ocid="results.search.search_input"
          className="pl-9 glass-card"
          aria-label="Search duplicate records"
        />
      </div>

      {/* Language filter */}
      <Select
        value={languageFilter}
        onValueChange={(v) => setLanguageFilter(v as Language | "all")}
      >
        <SelectTrigger
          className="w-full glass-card lg:w-44"
          data-ocid="results.language.select"
          aria-label="Filter by language"
        >
          <SelectValue placeholder="All Languages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">🌐 All Languages</SelectItem>
          {LANGUAGE_OPTIONS.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Similarity filter */}
      <Select
        value={similarityFilter}
        onValueChange={(v) =>
          setSimilarityFilter(v as "all" | "high" | "medium" | "low")
        }
      >
        <SelectTrigger
          className="w-full glass-card lg:w-44"
          data-ocid="results.similarity.select"
          aria-label="Filter by similarity level"
        >
          <SelectValue placeholder="All Matches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Matches</SelectItem>
          <SelectItem value="high">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-chart-1 inline-block" />
              High Match (≥75%)
            </span>
          </SelectItem>
          <SelectItem value="medium">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-chart-4 inline-block" />
              Medium (50–74%)
            </span>
          </SelectItem>
          <SelectItem value="low">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
              Low (&lt;50%)
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
