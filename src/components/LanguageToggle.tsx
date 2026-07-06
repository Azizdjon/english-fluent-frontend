import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

/**
 * Compact EN / UZ language switch.
 * `variant="dark"` for dark backgrounds (landing/hero),
 * `variant="light"` for the dashboards' white sidebars.
 */
export function LanguageToggle({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const { lang, setLang } = useI18n();

  const wrap =
    variant === "dark"
      ? "border-white/20 bg-white/10 text-white/80"
      : "border-gray-200 bg-gray-50 text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";

  const activeCls =
    variant === "dark"
      ? "bg-white text-slate-900"
      : "bg-blue-600 text-white";

  const inactiveCls =
    variant === "dark"
      ? "text-white/70 hover:text-white"
      : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border p-0.5 ${wrap} ${className}`}
    >
      <Globe className="w-3.5 h-3.5 ml-1.5 opacity-70" />
      {(["en", "uz"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase transition ${
            lang === l ? activeCls : inactiveCls
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
