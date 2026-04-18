import { Badge } from "@/components/ui/badge";
import { BarChart3, GitCompare, Languages, Upload } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Records",
    description:
      "Upload CSV/JSON or enter records manually. We accept any text data in any language — no preprocessing needed.",
    color: "text-primary",
    iconBg: "from-primary/25 to-primary/5",
    accent: "oklch(0.68 0.22 280 / 0.6)",
  },
  {
    step: 2,
    icon: Languages,
    title: "Translate & Embed",
    description:
      "Our multilingual model translates and generates semantic vector embeddings for every record instantly.",
    color: "text-accent",
    iconBg: "from-accent/25 to-accent/5",
    accent: "oklch(0.72 0.2 290 / 0.6)",
  },
  {
    step: 3,
    icon: GitCompare,
    title: "Compare",
    description:
      "Vector similarity search identifies near-duplicates across all language pairs simultaneously at scale.",
    color: "text-chart-2",
    iconBg: "from-chart-2/25 to-chart-2/5",
    accent: "oklch(0.68 0.2 280 / 0.5)",
  },
  {
    step: 4,
    icon: BarChart3,
    title: "Results",
    description:
      "Duplicate groups ranked by confidence score with highlighted matches, similarity badges, and merge actions.",
    color: "text-chart-1",
    iconBg: "from-chart-1/25 to-chart-1/5",
    accent: "oklch(0.62 0.24 135 / 0.6)",
  },
] as const;

export function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
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
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          From raw multilingual data to actionable duplicate groups in under two
          seconds.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Connector line (desktop) */}
        <div
          className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px z-0"
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
            className="relative z-10 flex flex-col items-center text-center space-y-4 group"
            data-ocid={`how-it-works.step.${step.step}`}
          >
            {/* Step number pill */}
            <div
              className={`text-[10px] font-bold uppercase tracking-widest ${step.color} mb-1`}
            >
              Step {step.step}
            </div>

            {/* Icon circle */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`w-28 h-28 rounded-2xl glass-card bg-gradient-to-br ${step.iconBg} flex items-center justify-center relative overflow-hidden`}
              style={{ boxShadow: `0 0 0 1px ${step.accent}` }}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: `1px solid ${step.accent}` }}
                animate={{ scale: [1, 1.12], opacity: [0.5, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeOut",
                  delay: i * 0.5,
                }}
              />
              <step.icon className={`w-10 h-10 ${step.color}`} />
            </motion.div>

            <h3 className="font-display font-semibold text-base text-foreground leading-snug">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Arrow indicators between steps (mobile) */}
      <div className="flex justify-center mt-10 lg:hidden">
        <p className="text-xs text-muted-foreground tracking-wide">
          Upload → Embed → Compare → Results
        </p>
      </div>
    </div>
  );
}
