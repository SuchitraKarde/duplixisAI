import { Cpu, Github, Linkedin, Twitter } from "lucide-react";

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com",
    ocid: "footer.github.link",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com",
    ocid: "footer.linkedin.link",
  },
  {
    icon: Twitter,
    label: "Twitter / X",
    href: "https://x.com",
    ocid: "footer.twitter.link",
  },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Try Now", href: "/detect" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      className="bg-card border-t border-border"
      data-ocid="footer.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand column */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center gap-2.5 md:justify-start">
              <div className="w-9 h-9 rounded-xl gradient-ai flex items-center justify-center shadow-glass">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-accent-ai">
                duplixisAI
              </span>
            </div>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground md:mx-0">
              AI-powered multilingual duplicate record detection. Find
              near-duplicates across languages instantly with semantic NLP.
            </p>
            <div className="flex justify-center gap-3 md:justify-start">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href, ocid }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-ocid={ocid}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-smooth"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-full text-sm text-muted-foreground transition-smooth hover:text-foreground md:w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Hackathon column */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Project Info
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">Team:</span> NLP
                Fusion Team
              </p>
              <p>
                <span className="text-foreground font-medium">Hackathon:</span>{" "}
                AI Innovation Challenge 2025
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-xs font-medium text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-chart-1 animate-pulse-glow" />
                  Model Status: Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p>Multilingual AI · Semantic Deduplication · Cross-Language NLP</p>
        </div>
      </div>
    </footer>
  );
}
