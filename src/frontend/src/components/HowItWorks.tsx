import { Badge } from "@/components/ui/badge";
import { BarChart3, GitCompare, Languages, Upload } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Records",
    description:
      "Upload CSV/JSON or enter records manually. We accept any text data in any language - no preprocessing needed.",
  },
  {
    step: 2,
    icon: Languages,
    title: "Translate & Embed",
    description:
      "Our multilingual model translates and generates semantic vector embeddings for every record instantly.",
  },
  {
    step: 3,
    icon: GitCompare,
    title: "Compare",
    description:
      "Vector similarity search identifies near-duplicates across all language pairs simultaneously at scale.",
  },
  {
    step: 4,
    icon: BarChart3,
    title: "Results",
    description:
      "Duplicate groups ranked by confidence score with highlighted matches, similarity badges, and merge actions.",
  },
] as const;

export function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 space-y-4 text-center sm:mb-16"
      >
        <Badge
          variant="secondary"
          className="glass-card border-primary/30 text-primary px-3 py-1.5"
        >
          4-Stage Pipeline
        </Badge>
        <h2 className="font-display text-3xl font-bold sm:text-5xl">
          How It <span className="text-accent-ai">Works</span>
        </h2>
      </motion.div>

      <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="absolute left-[12.5%] right-[12.5%] top-14 z-0 hidden h-px lg:block"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.68 0.22 280 / 0.2), oklch(0.72 0.2 290 / 0.5), oklch(0.62 0.24 135 / 0.2))",
          }}
          aria-hidden="true"
        />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.12,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="group relative z-10 flex flex-col items-center space-y-4 text-center"
            data-ocid={`how-it-works.step.${step.step}`}
          >
            <div
              className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              Step {step.step}
            </div>

            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass-card relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5"
              style={{ boxShadow: "0 0 0 1px oklch(0.68 0.22 280 / 0.6)" }}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: "1px solid oklch(0.68 0.22 280 / 0.6)" }}
                animate={{ scale: [1, 1.12], opacity: [0.5, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeOut",
                  delay: i * 0.5,
                }}
              />
              <step.icon className="h-10 w-10 text-primary" />
            </motion.div>

            <h3 className="font-display text-base font-semibold leading-snug text-foreground">
              {step.title}
            </h3>
            <p className="max-w-[200px] text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
