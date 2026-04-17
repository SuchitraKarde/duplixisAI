import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-ocid="theme.toggle"
      className={cn(
        "relative w-10 h-10 rounded-xl flex items-center justify-center",
        "glass-card text-muted-foreground hover:text-foreground transition-smooth",
        "hover:-translate-y-0.5 hover:shadow-glass",
        className,
      )}
    >
      <span
        className={cn(
          "absolute transition-smooth",
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-75",
        )}
      >
        <Moon className="w-4.5 h-4.5" />
      </span>
      <span
        className={cn(
          "absolute transition-smooth",
          !isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-75",
        )}
      >
        <Sun className="w-4.5 h-4.5" />
      </span>
    </button>
  );
}
