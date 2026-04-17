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
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
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
            "group-hover:scale-110 transition-smooth shadow-sm",
          )}
        >
          <Icon className="w-6 h-6 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-semibold text-foreground text-base tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Optional stat */}
        {stat && (
          <div className="pt-2 border-t border-border/40 flex items-baseline gap-1.5">
            <span className="font-display text-xl font-bold text-accent-ai">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
