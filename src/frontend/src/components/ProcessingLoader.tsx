import { PROCESSING_STEPS } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// Named step labels matching the requirements
const STEP_LABELS = [
  "Loading Records",
  "Detecting Language",
  "Embedding Vectors",
  "Comparing Similarity",
  "Ranking Results",
];

export function ProcessingLoader() {
  const { processingProgress, processingStep, resetDetection } = useAppStore();

  // Circular progress ring
  const size = 100;
  const strokeWidth = 5;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (processingProgress / 100) * circumference;

  // Which step label is active (map from 0–100 to 0–4)
  const activeStep = Math.min(
    Math.floor((processingProgress / 100) * STEP_LABELS.length),
    STEP_LABELS.length - 1,
  );

  // Map mock processing steps to a more controlled sequence
  const displayStep =
    processingStep ||
    PROCESSING_STEPS[
      Math.floor((processingProgress / 100) * PROCESSING_STEPS.length)
    ] ||
    "Analyzing multilingual similarity...";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.45,
        type: "spring",
        stiffness: 250,
        damping: 22,
      }}
      className="glass-card rounded-3xl p-10 sm:p-12 text-center space-y-8 max-w-md w-full mx-4 shadow-2xl relative"
      data-ocid="processing.loader"
    >
      {/* Cancel button */}
      <button
        type="button"
        onClick={resetDetection}
        data-ocid="processing.cancel.button"
        aria-label="Cancel processing"
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-smooth"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Circular progress ring */}
      <div className="relative w-[100px] h-[100px] mx-auto">
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{ stroke: "oklch(var(--primary))" }}
          />
        </svg>

        {/* Percentage */}
        <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl text-foreground">
          {processingProgress}%
        </span>
      </div>

      {/* Title + animated step text */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-xl text-foreground">
          Analyzing...
        </h3>
        <AnimatePresence mode="wait">
          <motion.p
            key={displayStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-muted-foreground"
            data-ocid="processing.step.loading_state"
          >
            {displayStep}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Linear progress bar */}
      <div className="space-y-2">
        <div
          className="h-1.5 rounded-full bg-muted overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="h-full rounded-full gradient-ai"
            initial={{ width: 0 }}
            animate={{ width: `${processingProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step pill labels */}
        <div className="flex items-center justify-between gap-1 mt-3">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 flex-1 min-w-0"
            >
              <motion.div
                animate={{
                  background:
                    i <= activeStep
                      ? "oklch(var(--primary))"
                      : "oklch(var(--muted))",
                  scale: i === activeStep ? 1.25 : 1,
                }}
                transition={{ duration: 0.35 }}
                className="w-2 h-2 rounded-full"
              />
              <span
                className={`text-[9px] text-center leading-tight truncate w-full transition-colors duration-300 ${
                  i <= activeStep
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
