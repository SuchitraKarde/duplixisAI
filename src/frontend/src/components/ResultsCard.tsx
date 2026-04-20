import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cn,
  getLanguageFlag,
  getSimilarityClass,
  getSimilarityLabel,
  getSimilarityLevel,
} from "@/lib/utils";
import type { SimilarityGroup } from "@/types";
import { ChevronDown, Eye, Merge, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function HighlightedText({
  text,
  tokens,
}: {
  text: string;
  tokens: string[];
}) {
  if (!tokens.length) return <>{text}</>;

  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const partKey = `${i}-${part.slice(0, 8)}`;
        return regex.test(part) ? (
          <mark
            key={partKey}
            className="rounded-sm bg-primary/20 px-0.5 font-medium not-italic text-primary"
          >
            {part}
          </mark>
        ) : (
          <span key={partKey}>{part}</span>
        );
      })}
    </>
  );
}

interface ResultsCardProps {
  group: SimilarityGroup;
  index: number;
  onDismiss: (groupId: string) => void;
  onMerge: (groupId: string) => void;
  onReviewDecisions: (groupId: string, recordIdsToDelete: string[]) => void;
}

export function ResultsCard({
  group,
  index,
  onDismiss,
  onMerge,
  onReviewDecisions,
}: ResultsCardProps) {
  const { original, similar, topScore } = group;
  const level = getSimilarityLevel(topScore);
  const simClass = getSimilarityClass(topScore);
  const simLabel = getSimilarityLabel(topScore);
  const [isMatchesOpen, setIsMatchesOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [recordsMarkedForDeletion, setRecordsMarkedForDeletion] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (isReviewing) {
      setIsMatchesOpen(true);
    }
  }, [isReviewing]);

  const indicatorColor =
    level === "high"
      ? "bg-[oklch(0.62_0.24_135)]"
      : level === "medium"
        ? "bg-[oklch(0.82_0.15_80)]"
        : "bg-destructive";

  const handleMerge = () => {
    onMerge(group.id);
    toast.success("Records merged successfully", {
      description: `Kept "${original.name.slice(0, 40)}${original.name.length > 40 ? "..." : ""}" and removed the duplicates.`,
    });
  };

  const handleDismiss = () => {
    onDismiss(group.id);
    toast.info("Match dismissed", {
      description: "These duplicate records were left unchanged.",
    });
  };

  const toggleRecordDecision = (recordId: string) => {
    setRecordsMarkedForDeletion((current) =>
      current.includes(recordId)
        ? current.filter((id) => id !== recordId)
        : [...current, recordId],
    );
  };

  const stopReview = () => {
    setRecordsMarkedForDeletion([]);
    setIsReviewing(false);
  };

  const handleApplyReview = () => {
    if (!recordsMarkedForDeletion.length) {
      setIsReviewing(false);
      toast.info("No records deleted", {
        description: "All duplicate records were kept.",
      });
      return;
    }

    onReviewDecisions(group.id, recordsMarkedForDeletion);
    setIsReviewing(false);
    setRecordsMarkedForDeletion([]);
    toast.success("Review decisions applied", {
      description:
        recordsMarkedForDeletion.length === similar.length
          ? "All duplicate records were deleted and the base record was kept."
          : `${recordsMarkedForDeletion.length} duplicate record${recordsMarkedForDeletion.length === 1 ? "" : "s"} deleted.`,
    });
  };

  const ocid = `results.item.${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        type: "spring",
        stiffness: 240,
        damping: 22,
      }}
      className="glass-card overflow-hidden rounded-2xl"
      data-ocid={ocid}
    >
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <span className="font-display font-semibold text-foreground">
            Duplicate Match
          </span>
          <Badge
            className={cn("rounded-full border-0 px-2.5 py-0.5 text-xs", simClass)}
          >
            {simLabel}
          </Badge>
        </div>
        <div className="flex items-center gap-2 self-start shrink-0 sm:self-auto">
          <span className="font-display text-lg font-bold text-foreground sm:text-xl">
            {topScore}%
          </span>
          <span
            className={cn("h-2.5 w-2.5 rounded-full", indicatorColor)}
            title={simLabel}
          />
        </div>
      </div>

      <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="space-y-2.5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Original Record
            </span>
            <span className="text-base">{getLanguageFlag(original.language)}</span>
            <span className="font-mono text-xs uppercase text-muted-foreground">
              {original.language}
            </span>
          </div>

          <p className="break-words text-sm font-medium leading-relaxed text-foreground">
            {original.name}
          </p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {original.description}
          </p>

          {original.tags && original.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {original.tags.map((tag) => (
                <span
                  key={tag}
                  className="glass-card rounded-full px-2 py-0.5 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {isReviewing && (
            <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
              <Badge className="border-0 bg-primary/15 text-primary">
                Keep base record
              </Badge>
              <p className="mt-2 text-xs text-muted-foreground">
                Review mode is active. Use the controls beside each matched record
                to decide what gets deleted.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Potential Matches
              </span>
              <span className="text-base">
                {getLanguageFlag(similar[0]?.record.language ?? "en")}
              </span>
              <Badge className="border-0 bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {similar.length} record{similar.length === 1 ? "" : "s"}
              </Badge>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMatchesOpen((value) => !value)}
              className="w-full shrink-0 sm:w-auto"
              data-ocid={`results.matches_toggle.${index}`}
            >
              <ChevronDown
                className={cn(
                  "mr-2 h-4 w-4 transition-transform",
                  isMatchesOpen && "rotate-180",
                )}
              />
              {isMatchesOpen ? "Hide duplicate records" : "See duplicate records"}
            </Button>
          </div>

          {isMatchesOpen && (
            <div className="space-y-3">
              {similar.map((s, si) => {
                const markedForDeletion = recordsMarkedForDeletion.includes(
                  s.record.id,
                );

                return (
                  <div
                    key={s.record.id}
                    className={cn(
                      "space-y-1 pb-3",
                      si < similar.length - 1 && "border-b border-border/60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-xs">
                            {getLanguageFlag(s.record.language)}
                          </span>
                          <span className="font-mono text-xs uppercase text-muted-foreground">
                            {s.record.language}
                          </span>
                          {isReviewing && (
                            <Badge
                              className={cn(
                                "border-0",
                                markedForDeletion
                                  ? "bg-destructive/15 text-destructive"
                                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
                              )}
                            >
                              {markedForDeletion ? "Will delete" : "Will keep"}
                            </Badge>
                          )}
                        </div>
                        <p className="break-words text-sm font-medium leading-relaxed text-foreground">
                          <HighlightedText
                            text={s.record.name}
                            tokens={s.matchedTokens}
                          />
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          <HighlightedText
                            text={s.record.description}
                            tokens={s.matchedTokens}
                          />
                        </p>
                        {s.translatedName && (
                          <p className="text-xs italic text-muted-foreground opacity-70">
                            ~ {s.translatedName}
                          </p>
                        )}
                      </div>

                      {isReviewing && (
                        <Button
                          type="button"
                          variant={markedForDeletion ? "outline" : "destructive"}
                          size="sm"
                          onClick={() => toggleRecordDecision(s.record.id)}
                          className="shrink-0 self-start"
                        >
                          {markedForDeletion ? "Keep" : "Delete"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-muted/10 px-5 py-4 sm:flex-row sm:flex-wrap sm:justify-end sm:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDismiss}
          data-ocid={`results.dismiss_button.${index}`}
          className="w-full text-muted-foreground hover:text-foreground sm:w-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Dismiss
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsReviewing((value) => {
              const nextValue = !value;
              if (!nextValue) {
                setRecordsMarkedForDeletion([]);
              }
              return nextValue;
            });
          }}
          data-ocid={`results.review_button.${index}`}
          className="w-full text-muted-foreground hover:text-foreground sm:w-auto"
        >
          <Eye className="mr-2 h-4 w-4" />
          {isReviewing ? "Cancel Review" : "Review"}
        </Button>
        {isReviewing && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={stopReview}
              className="w-full sm:w-auto"
            >
              Keep All
            </Button>
            <Button
              size="sm"
              onClick={handleApplyReview}
              className="btn-primary w-full border-0 text-primary-foreground sm:w-auto"
            >
              Apply Decisions
            </Button>
          </>
        )}
        <Button
          size="sm"
          onClick={handleMerge}
          data-ocid={`results.merge_button.${index}`}
          className="btn-primary w-full border-0 text-xs text-primary-foreground sm:w-auto"
        >
          <Merge className="mr-2 h-4 w-4" />
          Merge Records
        </Button>
      </div>
    </motion.div>
  );
}
