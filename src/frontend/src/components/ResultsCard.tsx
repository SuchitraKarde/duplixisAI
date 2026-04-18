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
import { motion } from "motion/react";
import { toast } from "sonner";

/** Inline token highlighter — renders JSX with <mark> */
function HighlightedText({
  text,
  tokens,
}: {
  text: string;
  tokens: string[];
}) {
  if (!tokens.length) return <>{text}</>;

  // Build a regex from all tokens
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
            className="bg-primary/20 text-primary rounded-sm px-0.5 not-italic font-medium"
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
  /** 1-based display index */
  index: number;
}

export function ResultsCard({ group, index }: ResultsCardProps) {
  const { original, similar, topScore } = group;
  const level = getSimilarityLevel(topScore);
  const simClass = getSimilarityClass(topScore);
  const simLabel = getSimilarityLabel(topScore);

  const indicatorColor =
    level === "high"
      ? "bg-[oklch(0.62_0.24_135)]"
      : level === "medium"
        ? "bg-[oklch(0.82_0.15_80)]"
        : "bg-destructive";

  const handleMerge = () =>
    toast.success("Records merged successfully", {
      description: `Group "${original.name.slice(0, 40)}${original.name.length > 40 ? "..." : ""}" resolved.`,
    });

  const handleDismiss = () =>
    toast.info("Match dismissed", {
      description: "This pair will not be flagged again.",
    });

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
      className="glass-card rounded-2xl overflow-hidden"
      data-ocid={ocid}
    >
      {/* Card header */}
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <span className="font-display font-semibold text-foreground">
            Duplicate Match
          </span>
          <Badge
            className={cn(
              "px-2.5 py-0.5 text-xs rounded-full border-0",
              simClass,
            )}
          >
            {simLabel}
          </Badge>
        </div>
        <div className="flex items-center gap-2 self-start shrink-0 sm:self-auto">
          <span className="font-display text-lg font-bold text-foreground sm:text-xl">
            {topScore}%
          </span>
          <span
            className={cn("w-2.5 h-2.5 rounded-full", indicatorColor)}
            title={simLabel}
          />
        </div>
      </div>

      {/* Two-column layout: original | similar */}
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Original record */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Original Record
            </span>
            <span className="text-base">
              {getLanguageFlag(original.language)}
            </span>
            <span className="text-xs uppercase text-muted-foreground font-mono">
              {original.language}
            </span>
          </div>

          <p className="text-sm font-medium text-foreground leading-relaxed break-words">
            {original.name}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {original.description}
          </p>

          {original.tags && original.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {original.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full glass-card text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Similar records */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Potential Matches
            </span>
            <span className="text-base">
              {getLanguageFlag(similar[0]?.record.language ?? "en")}
            </span>
          </div>

          <div className="space-y-3">
            {similar.map((s, si) => (
              <div
                key={s.record.id}
                className={cn(
                  "space-y-1 pb-3",
                  si < similar.length - 1 && "border-b border-border/60",
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">
                    {getLanguageFlag(s.record.language)}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase font-mono">
                    {s.record.language}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed break-words">
                  <HighlightedText
                    text={s.record.name}
                    tokens={s.matchedTokens}
                  />
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  <HighlightedText
                    text={s.record.description}
                    tokens={s.matchedTokens}
                  />
                </p>
                {s.translatedName && (
                  <p className="text-xs text-muted-foreground italic opacity-70">
                    ≈ {s.translatedName}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-border bg-muted/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDismiss}
          data-ocid={`results.dismiss_button.${index}`}
          className="w-full text-muted-foreground hover:text-foreground sm:w-auto"
        >
          Dismiss
        </Button>
        <Button
          size="sm"
          onClick={handleMerge}
          data-ocid={`results.merge_button.${index}`}
          className="btn-primary w-full border-0 text-xs text-primary-foreground sm:w-auto"
        >
          Merge Records
        </Button>
      </div>
    </motion.div>
  );
}
