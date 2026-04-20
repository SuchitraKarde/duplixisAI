import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  /** Optional stat shown at the bottom of the card */
  stat?: { value: string; label: string };
  delay?: number;
  index: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  stat,
  delay = 0,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] }}
      data-ocid={`features.item.${index}`}
      className="group relative glass-card-hover p-6 space-y-4 overflow-hidden"
    >
      {/* Subtle background glow on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br",
          gradient,
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative space-y-4">
        {/* Icon */}
        <div
          className={cn(
            "w-13 h-13 rounded-xl flex items-center justify-center p-3",
            "bg-gradient-to-br",
            gradient,
            "transition-smooth shadow-sm",
          )}
        >
          <Icon className="w-6 h-6 text-primary transition-smooth group-hover:text-black dark:group-hover:text-white" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-base font-semibold tracking-tight text-foreground transition-smooth group-hover:text-black dark:group-hover:text-white">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground transition-smooth group-hover:text-black/80 dark:group-hover:text-white/85">
            {description}
          </p>
        </div>

        {/* Optional stat */}
        {stat && (
          <div className="pt-2 border-t border-border/40 flex items-baseline gap-1.5">
            <span className="font-display text-xl font-bold text-accent-ai transition-smooth group-hover:text-black dark:group-hover:text-white">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground transition-smooth group-hover:text-black/70 dark:group-hover:text-white/75">
              {stat.label}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
