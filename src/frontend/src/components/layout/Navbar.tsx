import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Link, useLocation } from "@tanstack/react-router";
import { Cpu, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const resetDetection = useAppStore((state) => state.resetDetection);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  const pathname = location.pathname;
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally tracking pathname only
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-card border-b border-border shadow-glass"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="navbar.logo.link"
          >
            <div className="relative w-9 h-9 rounded-xl gradient-ai flex items-center justify-center shadow-glass group-hover:scale-110 transition-smooth">
              <Cpu className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl gradient-ai opacity-0 group-hover:opacity-30 blur-lg transition-smooth" />
            </div>
            <span className="font-display font-bold text-lg text-accent-ai">
              duplixisAI
            </span>
          </Link>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/detect"
              onClick={() => resetDetection()}
              data-ocid="navbar.try-now.button"
            >
              <Button
                size="sm"
                className="hidden sm:flex btn-primary border-0 text-primary-foreground"
              >
                Try Now
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              data-ocid="navbar.mobile-menu.toggle"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="md:hidden glass-card border-t border-border mx-4 mb-2 rounded-xl overflow-hidden animate-slide-in-right"
          data-ocid="navbar.mobile-menu"
        >
          <nav className="flex flex-col p-3 gap-1">
            <Link to="/detect" onClick={() => resetDetection()} className="mt-1">
              <Button
                className="w-full btn-primary border-0 text-primary-foreground"
                size="sm"
              >
                Try Now
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
