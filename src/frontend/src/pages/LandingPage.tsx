/**
 * LandingPage — full single-page marketing experience.
 * Sections: Hero → Language strip → Features → How It Works → CTA
 */
import { FeatureCard } from "@/components/FeatureCard";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, Globe, Layers, Shield, Zap } from "lucide-react";
import { useEffect } from "react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: Globe,
    title: "Multilingual NLP",
    description:
      "Detects duplicates across 10+ languages including English, Japanese, Chinese, and Arabic using advanced transformer models.",
    gradient: "from-primary/20 to-accent/10",
    stat: { value: "10+", label: "languages" },
  },
  {
    icon: Zap,
    title: "Semantic Similarity",
    description:
      "Goes beyond keyword matching — understands meaning and context to find near-duplicates even with completely different phrasing.",
    gradient: "from-primary/20 to-accent/10",
    stat: { value: "96%", label: "semantic accuracy" },
  },
  {
    icon: Shield,
    title: "High Accuracy",
    description:
      "Confidence scoring with adjustable thresholds lets you fine-tune precision vs. recall for your specific data quality needs.",
    gradient: "from-primary/20 to-accent/10",
    stat: { value: "99.2%", label: "precision" },
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    description:
      "Handles millions of records efficiently with parallel embedding pipelines and vector similarity indexing at enterprise scale.",
    gradient: "from-primary/20 to-accent/10",
    stat: { value: "1M+", label: "records / batch" },
  },
] as const;

export function LandingPage() {
  const location = useLocation();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const targetId = location.hash.replace("#", "");
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [location.hash]);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <Hero />

      {/* ── Features ── */}
      <section
        id="features"
        className="bg-background py-20 sm:py-24"
        data-ocid="features.section"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/8 blur-[110px]" />
          <div className="absolute -bottom-24 -right-24 w-[360px] h-[360px] rounded-full bg-accent/8 blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Core Capabilities
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-5xl">
              Why Duplixis <span className="text-accent-ai">AI</span>?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              Enterprise-grade duplicate detection powered by state-of-the-art
              multilingual transformer models.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={i * 0.1}
                index={i + 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        className="bg-muted/30 py-20 sm:py-24"
        data-ocid="how-it-works.section"
      >
        <HowItWorks />
      </section>

      {/* ── Testimonials / Social proof ── */}
      <section
        className="bg-background py-16 sm:py-20"
        data-ocid="social-proof.section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 space-y-3 text-center sm:mb-12"
          >
            <h2 className="font-display text-2xl font-bold sm:text-4xl">
              Built for data quality teams
            </h2>
            <p className="text-muted-foreground">
              Trusted by data engineers tackling multilingual deduplication at
              scale.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Found 34% duplicate entries in our Japanese and English customer records that we had no idea existed.",
                name: "Aiko Tanaka",
                role: "Data Engineer, FinTech Corp",
                flag: "🇯🇵",
              },
              {
                quote:
                  "Processing 500K Arabic-English records in under 90 seconds was honestly unbelievable.",
                name: "Omar Al-Rashid",
                role: "ML Lead, Logistics Co.",
                flag: "🇸🇦",
              },
              {
                quote:
                  "The semantic similarity beats every regex dedup script we had — and it just works out of the box.",
                name: "Clara Meier",
                role: "Senior Analyst, Retail Group",
                flag: "🇩🇪",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                data-ocid={`social-proof.item.${i + 1}`}
                className="glass-card-hover p-6 space-y-4"
              >
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / CTA ── */}
      <section
        id="about"
        className="relative overflow-hidden bg-muted/30 py-20 sm:py-28"
        data-ocid="about.section"
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/8 blur-[110px]" />
          <div className="absolute -bottom-24 -right-24 w-[360px] h-[360px] rounded-full bg-accent/8 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-8 px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge
              variant="secondary"
              className="glass-card border-primary/30 text-primary px-3 py-1.5"
            >
              Built at Hackathon 2025
            </Badge>
            <h2 className="font-display text-3xl font-bold sm:text-5xl">
              Ready to clean your data?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              Upload a CSV or JSON file — or enter a record manually — and our
              AI will identify duplicate entries across all language
              variations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/detect"
              data-ocid="about.try-now.primary_button"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="btn-primary w-full gap-2 border-0 px-8 text-base text-primary-foreground"
              >
                Start Detecting Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => scrollTo("features")}
              data-ocid="about.features.secondary_button"
              className="btn-secondary gap-2 flex items-center justify-center text-base px-8"
            >
              Explore Features
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
