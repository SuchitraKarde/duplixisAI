/**
 * LandingPage - full single-page marketing experience.
 */
import { FeatureCard } from "@/components/FeatureCard";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
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
      "Detects duplicates across 108 languages including English, Japanese, Chinese, and Arabic using advanced transformer models.",
    gradient: "from-primary/20 to-accent/10",
    stat: { value: "108", label: "languages" },
  },
  {
    icon: Zap,
    title: "Semantic Similarity",
    description:
      "Goes beyond keyword matching - understands meaning and context to find near-duplicates even with completely different phrasing.",
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
    if (!location.hash) return;

    const targetId = location.hash.replace("#", "");
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [location.hash]);

  return (
    <div className="overflow-x-hidden">
      <Hero onLearnMore={() => scrollTo("how-it-works")} />

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
            <h2 className="font-display text-3xl font-bold sm:text-5xl">
              Why duplixisAI?
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <section
        id="how-it-works"
        className="bg-muted/30 py-20 sm:py-24"
        data-ocid="how-it-works.section"
      >
        <HowItWorks />
      </section>

      <section
        id="about"
        className="relative overflow-hidden bg-muted/30 py-20 sm:py-28"
        data-ocid="about.section"
      >
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
            <h2 className="font-display text-3xl font-bold sm:text-5xl">
              Ready to clean your data?
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              Upload a CSV or JSON file and our AI will identify duplicate
              entries across all language variations.
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
              className="btn-secondary flex items-center justify-center gap-2 px-8 text-base"
            >
              Explore Features
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
