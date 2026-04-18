/**
 * Hero — full-viewport hero section for the landing page.
 * Contains animated gradient orbs, AI visualization image,
 * floating metric badges and the AI visualization image.
 */
import { LanguageBadges } from "@/components/LanguageBadges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

/* ── Animated network SVG ─────────────────────────────────────────── */
function AINetworkViz() {
  const languages = [
    { cx: 372, cy: 58, r: 24, label: "EN", delay: 0 },
    { cx: 545, cy: 118, r: 22, label: "JA", delay: 0.1 },
    { cx: 612, cy: 232, r: 22, label: "ZH", delay: 0.2 },
    { cx: 552, cy: 345, r: 20, label: "AR", delay: 0.3 },
    { cx: 372, cy: 405, r: 22, label: "FR", delay: 0.4 },
    { cx: 190, cy: 345, r: 20, label: "DE", delay: 0.5 },
    { cx: 128, cy: 232, r: 22, label: "ES", delay: 0.6 },
    { cx: 192, cy: 118, r: 20, label: "KO", delay: 0.7 },
  ] as const;

  const center = { cx: 372, cy: 232 };
  const databaseLayers = [
    { y: 160, rx: 112, ry: 34, h: 34 },
    { y: 208, rx: 126, ry: 38, h: 38 },
    { y: 260, rx: 112, ry: 34, h: 34 },
  ] as const;

  return (
    <svg viewBox="0 0 740 460" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="database-core" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="oklch(0.9 0.02 270)" stopOpacity="0.92" />
          <stop offset="55%" stopColor="oklch(0.63 0.1 272)" stopOpacity="0.88" />
          <stop offset="100%" stopColor="oklch(0.4 0.08 265)" stopOpacity="0.94" />
        </radialGradient>
        <radialGradient id="glow-primary" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.68 0.22 280)"
            stopOpacity="0.24"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.68 0.22 280)"
            stopOpacity="0"
          />
        </radialGradient>
        <radialGradient id="glow-accent" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.2 290)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.72 0.2 290)" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
        </filter>
        <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            stopColor="oklch(0.68 0.22 280)"
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.72 0.2 290)"
            stopOpacity="0.18"
          />
        </linearGradient>
        <linearGradient id="database-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.74 0.04 278 / 0.62)" />
          <stop offset="100%" stopColor="oklch(0.34 0.05 262 / 0.92)" />
        </linearGradient>
      </defs>

      <ellipse
        cx={center.cx}
        cy={center.cy}
        rx="220"
        ry="150"
        fill="url(#glow-primary)"
        filter="url(#blur-glow)"
        opacity="0.18"
      />

      {languages.map((lang, i) => (
        <motion.line
          key={`link-${lang.label}`}
          x1={center.cx}
          y1={center.cy}
          x2={lang.cx}
          y2={lang.cy}
          stroke="url(#edge-grad)"
          strokeWidth="1.8"
          strokeDasharray="7 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.18, 0.45, 0.18] }}
          transition={{
            pathLength: { duration: 1, delay: 0.15 + i * 0.08 },
            opacity: {
              duration: 3.2,
              delay: i * 0.16,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
      ))}

      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        style={{ transformOrigin: `${center.cx}px ${center.cy}px` }}
      >
        {databaseLayers.map((layer, index) => {
          const top = layer.y - layer.h / 2;
          return (
            <g key={`db-${layer.y}`}>
              <ellipse
                cx={center.cx}
                cy={layer.y}
                rx={layer.rx + 24}
                ry={layer.ry + 14}
                fill="url(#glow-accent)"
                filter="url(#blur-glow)"
                opacity={0.08 - index * 0.015}
              />
              <path
                d={`M ${center.cx - layer.rx} ${top} A ${layer.rx} ${layer.ry} 0 0 1 ${center.cx + layer.rx} ${top} L ${center.cx + layer.rx} ${top + layer.h} A ${layer.rx} ${layer.ry} 0 0 1 ${center.cx - layer.rx} ${top + layer.h} Z`}
                fill="url(#database-side)"
                stroke="oklch(0.75 0.05 280 / 0.38)"
                strokeWidth="1.2"
              />
              <ellipse
                cx={center.cx}
                cy={top}
                rx={layer.rx}
                ry={layer.ry}
                fill="url(#database-core)"
                stroke="oklch(0.98 0.01 0 / 0.18)"
                strokeWidth="1.2"
              />
              <ellipse
                cx={center.cx}
                cy={top + layer.h}
                rx={layer.rx}
                ry={layer.ry}
                fill="oklch(0.31 0.05 262 / 0.92)"
                stroke="oklch(0.75 0.05 276 / 0.14)"
                strokeWidth="1"
              />
            </g>
          );
        })}

        <motion.g
          animate={{ y: [-4, 4, -4] }}
          transition={{
            duration: 3.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <text
            x={center.cx}
            y={center.cy + 6}
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fill="oklch(0.98 0.01 0 / 0.78)"
            fontFamily="monospace"
            letterSpacing="5"
          >
            DB
          </text>
        </motion.g>
      </motion.g>

      {languages.map((lang) => (
        <motion.g
          key={lang.label}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: lang.delay,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{ transformOrigin: `${lang.cx}px ${lang.cy}px` }}
        >
          <ellipse
            cx={lang.cx}
            cy={lang.cy}
            rx={lang.r * 2.6}
            ry={lang.r * 2.2}
            fill="url(#glow-primary)"
            filter="url(#blur-glow)"
            opacity="0.12"
          />
          <circle
            cx={lang.cx}
            cy={lang.cy}
            r={lang.r + 7}
            fill="none"
            stroke="oklch(0.68 0.12 280 / 0.18)"
            strokeWidth="1"
          />
          <circle
            cx={lang.cx}
            cy={lang.cy}
            r={lang.r}
            fill="oklch(0.17 0.03 258 / 0.9)"
            stroke="oklch(0.7 0.11 286 / 0.45)"
            strokeWidth="1.5"
          />
          <text
            x={lang.cx}
            y={lang.cy + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fontWeight="600"
            fill="oklch(0.9 0.015 248)"
            fontFamily="monospace"
          >
            {lang.label}
          </text>
        </motion.g>
      ))}

      <motion.circle
        cx={center.cx}
        cy={center.cy}
        r="118"
        fill="none"
        stroke="oklch(0.68 0.12 280 / 0.22)"
        strokeWidth="1"
        strokeDasharray="8 12"
        animate={{ r: [118, 144], opacity: [0.22, 0] }}
        transition={{
          duration: 2.6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
        }}
      />
    </svg>
  );
}

/* ── Floating info badge ─────────────────────────────────────────── */
interface FloatingBadgeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  initialY?: number;
}

function FloatingBadge({
  children,
  className = "",
  delay = 0,
  initialY = 10,
}: FloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: initialY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`glass-card px-4 py-3 rounded-xl shadow-lg border-primary/20 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ── Hero component ───────────────────────────────────────────────── */
interface HeroProps {
  onLearnMore?: () => void;
}

export function Hero({ onLearnMore }: HeroProps) {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 pb-16 sm:pt-20 sm:pb-20"
      data-ocid="hero.section"
    >
      {/* ── Background gradient orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[140px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-primary/5 blur-[160px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.68 0.22 280) 1px, transparent 1px), linear-gradient(90deg, oklch(0.68 0.22 280) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* ── Left: text block ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="z-10 space-y-6 sm:space-y-8"
        >
          {/* Headline */}
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Find duplicates{" "}
            <span className="text-accent-ai">Across Languages.</span> Instantly.
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-xl">
            Our multilingual NLP engine identifies near-duplicate records across
            10+ languages using semantic embeddings — even when phrased
            completely differently.
          </p>

          {/* Language badges */}
          <LanguageBadges />

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/detect"
              data-ocid="hero.try-now.primary_button"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="btn-primary border-0 text-primary-foreground gap-2 w-full sm:w-auto animate-pulse-glow"
              >
                Try Now — It's Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <button
              type="button"
              onClick={onLearnMore}
              data-ocid="hero.how-it-works.secondary_button"
              className="btn-secondary gap-2 flex items-center justify-center"
            >
              How It Works
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 border-t border-border/30 pt-4 sm:flex sm:flex-wrap sm:gap-8">
            {[
              { value: "10+", label: "Languages" },
              { value: "99.2%", label: "Accuracy" },
              { value: "<2s", label: "Avg. Time" },
              { value: "1M+", label: "Records/batch" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="font-display text-xl font-bold text-accent-ai sm:text-2xl">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: AI visualization ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="relative hidden lg:flex flex-col items-center"
        >
          <div className="relative w-full animate-float">
            <div className="aspect-[12/9] w-full">
              <AINetworkViz />
            </div>
          </div>

          {/* Floating: Duplicate Match badge */}
          <FloatingBadge
            className="absolute -bottom-5 -left-8 min-w-[180px]"
            delay={0.65}
            initialY={10}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full gradient-ai flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                85%
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">
                  Duplicate Match
                </div>
                <div className="text-xs text-muted-foreground">
                  EN ↔ ES detected
                </div>
              </div>
            </div>
          </FloatingBadge>

          {/* Floating: Model Active badge */}
          <FloatingBadge
            className="absolute -top-3 -right-5"
            delay={0.85}
            initialY={-10}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-chart-1 animate-pulse" />
              <span className="text-foreground font-medium">Model Active</span>
            </div>
          </FloatingBadge>

          {/* Floating: processed count */}
          <FloatingBadge
            className="absolute top-1/3 -left-10"
            delay={1}
            initialY={0}
          >
            <div className="text-center">
              <div className="text-sm font-bold text-accent-ai">1.2M</div>
              <div className="text-[10px] text-muted-foreground">
                records scanned
              </div>
            </div>
          </FloatingBadge>
        </motion.div>
      </div>
    </section>
  );
}
