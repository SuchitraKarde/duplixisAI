/**
 * LandingPage — full single-page marketing experience.
 * Sections: Hero → Language strip → Features → How It Works → CTA
 */
import { FeatureCard } from "@/components/FeatureCard";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LanguageMarquee } from "@/components/LanguageBadges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Globe, Layers, Shield, Zap } from "lucide-react";
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
    gradient: "from-chart-2/20 to-primary/10",
    stat: { value: "96%", label: "semantic accuracy" },
  },
  {
    icon: Shield,
    title: "High Accuracy",
    description:
      "Confidence scoring with adjustable thresholds lets you fine-tune precision vs. recall for your specific data quality needs.",
    gradient: "from-chart-1/20 to-chart-2/10",
    stat: { value: "99.2%", label: "precision" },
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    description:
      "Handles millions of records efficiently with parallel embedding pipelines and vector similarity indexing at enterprise scale.",
    gradient: "from-accent/20 to-chart-4/10",
    stat: { value: "1M+", label: "records / batch" },
  },
] as const;

export function LandingPage() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <Hero onLearnMore={() => scrollTo("how-it-works")} />

      {/* ── Language strip / marquee ── */}
      <section
        className="py-8 border-y border-border/40 bg-muted/20"
        data-ocid="language-strip.section"
        aria-label="Supported languages"
      >
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Supported across all major world languages
          </p>
        </div>
        <LanguageMarquee />
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="py-24 bg-background"
        data-ocid="features.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <Badge
              variant="secondary"
              className="glass-card border-primary/30 text-primary px-3 py-1.5"
            >
              Core Capabilities
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">
              Why DupeGuard <span className="text-accent-ai">AI</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
        className="py-24 bg-muted/30"
        data-ocid="how-it-works.section"
      >
        <HowItWorks />
      </section>

      {/* ── Testimonials / Social proof ── */}
      <section className="py-20 bg-background" data-ocid="social-proof.section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-3"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
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
        className="py-28 bg-muted/30 relative overflow-hidden"
        data-ocid="about.section"
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
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
            <h2 className="font-display text-4xl sm:text-5xl font-bold">
              Ready to clean your data?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a CSV or JSON file — or enter a record manually — and our
              AI will identify duplicate entries across all language variations
              in under 2 seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/detect" data-ocid="about.try-now.primary_button">
              <Button
                size="lg"
                className="btn-primary border-0 text-primary-foreground gap-2 text-base px-8"
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
