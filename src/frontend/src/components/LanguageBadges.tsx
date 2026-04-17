import { motion } from "motion/react";

interface LanguageBadgesProps {
  className?: string;
}

const LANGUAGES: { code: string; flag: string; name: string }[] = [
  { code: "EN", flag: "🇬🇧", name: "English" },
  { code: "JA", flag: "🇯🇵", name: "Japanese" },
  { code: "ZH", flag: "🇨🇳", name: "Chinese" },
  { code: "AR", flag: "🇸🇦", name: "Arabic" },
  { code: "FR", flag: "🇫🇷", name: "French" },
  { code: "DE", flag: "🇩🇪", name: "German" },
  { code: "ES", flag: "🇪🇸", name: "Spanish" },
  { code: "KO", flag: "🇰🇷", name: "Korean" },
  { code: "PT", flag: "🇵🇹", name: "Portuguese" },
  { code: "IT", flag: "🇮🇹", name: "Italian" },
];

/** Inline, interactive language pill row (for hero) */
export function LanguageBadges({ className = "" }: LanguageBadgesProps) {
  return (
    <ul
      className={`flex flex-wrap gap-2 list-none p-0 m-0 ${className}`}
      aria-label="Supported languages"
    >
      {LANGUAGES.slice(0, 8).map((lang, i) => (
        <motion.li
          key={lang.code}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.6 + i * 0.06,
            duration: 0.35,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          aria-label={lang.name}
          data-ocid={`hero.lang-badge.${lang.code.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs font-medium text-foreground/80 hover:text-foreground hover:border-primary/40 transition-smooth cursor-default select-none"
        >
          <span aria-hidden="true">{lang.flag}</span>
          <span>{lang.code}</span>
        </motion.li>
      ))}
    </ul>
  );
}

/** Scrolling marquee strip (for feature sections) */
export function LanguageMarquee() {
  // duplicate array for seamless loop
  const doubled = [...LANGUAGES, ...LANGUAGES];

  return (
    <div className="relative overflow-hidden py-3 w-full" aria-hidden="true">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 22,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {doubled.map((lang, i) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`${lang.code}-${i}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground/70 whitespace-nowrap border-border/50"
          >
            <span>{lang.flag}</span>
            <span>{lang.code}</span>
            <span className="hidden sm:inline text-muted-foreground">
              · {lang.name}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
