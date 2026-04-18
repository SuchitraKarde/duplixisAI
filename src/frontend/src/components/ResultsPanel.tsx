import { ResultsCard } from "@/components/ResultsCard";
import { SearchFilter } from "@/components/SearchFilter";
import { Button } from "@/components/ui/button";
import { formatProcessingTime, getSimilarityLevel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  AlertCircle,
  Download,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      data-ocid="results.export.button"
      className="flex items-center gap-2 glass-card"
    >
      <Download className="w-4 h-4" />
      Export JSON
    </Button>
  );
}

export function ResultsPanel() {
  const {
    detectionResults,
    searchFilter,
    languageFilter,
    similarityFilter,
    setSearchFilter,
    setLanguageFilter,
    setSimilarityFilter,
    resetDetection,
  } = useAppStore();

  if (!detectionResults) return null;

  const { groups, totalRecordsAnalyzed, duplicatesFound, processingTimeMs } =
    detectionResults;

  // Filter groups by search, language, and similarity
  const filtered = groups.filter((g) => {
    const q = searchFilter.toLowerCase();
    const matchesSearch =
      !q ||
      g.original.name.toLowerCase().includes(q) ||
      g.original.description.toLowerCase().includes(q) ||
      g.similar.some(
        (s) =>
          s.record.name.toLowerCase().includes(q) ||
          s.record.description.toLowerCase().includes(q),
      );

    const matchesLang =
      languageFilter === "all" ||
      g.original.language === languageFilter ||
      g.similar.some((s) => s.record.language === languageFilter);

    const matchesSim =
      similarityFilter === "all" ||
      getSimilarityLevel(g.topScore) === similarityFilter;

    return matchesSearch && matchesLang && matchesSim;
  });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(detectionResults, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dupeguard-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    {
      icon: TrendingUp,
      label: "Records Analyzed",
      value: totalRecordsAnalyzed,
      colorClass: "text-primary",
    },
    {
      icon: AlertCircle,
      label: "Duplicates Found",
      value: duplicatesFound,
      colorClass: "text-chart-1",
    },
    {
      icon: SlidersHorizontal,
      label: "Groups",
      value: groups.length,
      colorClass: "text-accent",
    },
  ] as const;

  return (
    <div
      className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6"
      data-ocid="results.panel"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              Detection <span className="text-accent-ai">Results</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Analyzed {totalRecordsAnalyzed} records in{" "}
              {formatProcessingTime(processingTimeMs)} · {groups.length}{" "}
              duplicate {groups.length === 1 ? "group" : "groups"} found
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <ExportButton onClick={handleExport} />
            <Button
              variant="outline"
              size="sm"
              onClick={resetDetection}
              data-ocid="results.reset.button"
              className="flex items-center gap-2 glass-card"
            >
              <RotateCcw className="w-4 h-4" />
              New Search
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card rounded-xl p-4 text-center space-y-1"
            >
              <stat.icon className={cn("w-5 h-5 mx-auto", stat.colorClass)} />
              <div className="font-display font-bold text-2xl text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search / filter bar */}
      <SearchFilter />

      {/* Results count badge */}
      {(searchFilter ||
        languageFilter !== "all" ||
        similarityFilter !== "all") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-foreground font-medium">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-medium">{groups.length}</span>{" "}
            groups
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchFilter("");
              setLanguageFilter("all");
              setSimilarityFilter("all");
            }}
            className="text-xs text-primary hover:underline underline-offset-2"
            data-ocid="results.clear-filters.button"
          >
            Clear all filters
          </button>
        </motion.div>
      )}

      {/* Results list / empty state */}
      {filtered.length > 0 ? (
        <div className="space-y-5" data-ocid="results.list">
          {filtered.map((group, i) => (
            <ResultsCard key={group.id} group={group} index={i + 1} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-16 text-center space-y-5"
          data-ocid="results.empty_state"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/30 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground text-lg">
              No matches found
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              Try adjusting your search query or filters to see more results.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchFilter("");
              setLanguageFilter("all");
              setSimilarityFilter("all");
            }}
            data-ocid="results.clear-filters.secondary.button"
            className="glass-card"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
