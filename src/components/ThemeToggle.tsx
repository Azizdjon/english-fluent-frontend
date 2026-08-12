import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

/**
 * Sun / moon theme switch.
 * `variant="dark"` for dark surfaces (landing hero, headers),
 * `variant="light"` for the dashboard sidebars.
 */
export function ThemeToggle({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();

  const base =
    variant === "dark"
      ? "border-white/20 bg-white/10 text-white/80 hover:text-white"
      : "border-gray-200 bg-gray-50 text-gray-600 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border transition ${base} ${className}`}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
