/**
 * Hero — full-viewport hero section for the landing page.
 * Contains animated gradient orbs, AI visualization image,
 * floating metric badges, language pills, and primary CTAs.
 */
import { LanguageBadges } from "@/components/LanguageBadges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

/* ── Animated network SVG ─────────────────────────────────────────── */
function AINetworkViz() {
  const nodes = [
    { cx: 300, cy: 100, r: 22, label: "EN", delay: 0 },
    { cx: 520, cy: 70, r: 18, label: "JA", delay: 0.15 },
    { cx: 650, cy: 200, r: 20, label: "ZH", delay: 0.3 },
    { cx: 580, cy: 350, r: 16, label: "AR", delay: 0.45 },
    { cx: 370, cy: 380, r: 18, label: "FR", delay: 0.6 },
    { cx: 180, cy: 280, r: 16, label: "DE", delay: 0.75 },
    { cx: 440, cy: 210, r: 28, label: "AI", delay: 0.1 },
  ];

  const edges = [
    [0, 6],
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 6],
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
  ] as const;

  return (
    <svg viewBox="0 0 740 460" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="glow-primary" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.68 0.22 280)"
            stopOpacity="0.6"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.68 0.22 280)"
            stopOpacity="0"
          />
        </radialGradient>
        <radialGradient id="glow-accent" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.2 290)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.72 0.2 290)" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
        <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor="oklch(0.68 0.22 280)"
            stopOpacity="0.6"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.72 0.2 290)"
            stopOpacity="0.3"
          />
        </linearGradient>
      </defs>

      {/* Edges */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={`${nodes[a].label}-${nodes[b].label}`}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke="url(#edge-grad)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 + i * 0.08 }}
        />
      ))}

      {/* Glow blobs */}
      {nodes.map((n) => (
        <ellipse
          key={`glow-${n.label}`}
          cx={n.cx}
          cy={n.cy}
          rx={n.r * 4}
          ry={n.r * 4}
          fill="url(#glow-primary)"
          filter="url(#blur-glow)"
          opacity="0.4"
        />
      ))}

      {/* Nodes */}
      {nodes.map((n) => (
        <motion.g
          key={n.label}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: n.delay,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
        >
          {/* Outer ring */}
          <circle
            cx={n.cx}
            cy={n.cy}
            r={n.r + 6}
            fill="none"
            stroke="oklch(0.68 0.22 280 / 0.3)"
            strokeWidth="1"
          />
          {/* Main circle */}
          <circle
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill={
              n.label === "AI"
                ? "url(#glow-accent)"
                : "oklch(0.18 0.04 260 / 0.8)"
            }
            stroke={
              n.label === "AI"
                ? "oklch(0.72 0.2 290)"
                : "oklch(0.68 0.22 280 / 0.5)"
            }
            strokeWidth="1.5"
          />
          {/* Label */}
          <text
            x={n.cx}
            y={n.cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={n.label === "AI" ? "10" : "8"}
            fontWeight="600"
            fill={
              n.label === "AI" ? "oklch(0.95 0.02 240)" : "oklch(0.75 0.08 270)"
            }
            fontFamily="monospace"
          >
            {n.label}
          </text>
        </motion.g>
      ))}

      {/* Pulsing animation ring on AI node */}
      <motion.circle
        cx={nodes[6].cx}
        cy={nodes[6].cy}
        r={nodes[6].r + 14}
        fill="none"
        stroke="oklch(0.68 0.22 280 / 0.4)"
        strokeWidth="1"
        animate={{ r: [34, 50], opacity: [0.5, 0] }}
        transition={{
          duration: 2,
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
      className="relative min-h-screen flex items-center justify-center pt-16 pb-20 overflow-hidden"
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* ── Left: text block ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="space-y-8 z-10"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-xs font-medium glass-card border-primary/30 text-primary"
            >
              ✨ AI-Powered · Cross-Language · Real-Time
            </Badge>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Detect Duplicate Records{" "}
            <span className="text-accent-ai">Across Languages</span> Instantly
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
            Our multilingual NLP engine identifies near-duplicate records across
            10+ languages using semantic embeddings — even when phrased
            completely differently.
          </p>

          {/* Language badges */}
          <LanguageBadges />

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/detect" data-ocid="hero.try-now.primary_button">
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
          <div className="flex gap-8 pt-2 border-t border-border/30">
            {[
              { value: "10+", label: "Languages" },
              { value: "99.2%", label: "Accuracy" },
              { value: "<2s", label: "Avg. Time" },
              { value: "1M+", label: "Records/batch" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="font-display text-2xl font-bold text-accent-ai">
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
          {/* Main image with glass overlay */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-float w-full">
            <img
              src="/assets/generated/hero-ai-multilingual.dim_1200x700.jpg"
              alt="AI Multilingual Duplicate Detection Visualization"
              className="w-full h-auto object-cover rounded-2xl"
              loading="eager"
            />
            {/* Gloss border overlay */}
            <div className="absolute inset-0 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
          </div>

          {/* SVG network visualization overlay (semi-transparent) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <AINetworkViz />
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
