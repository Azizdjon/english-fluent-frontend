import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { translations, type Lang } from "./translations";

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "pragmalearn.lang";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "uz") return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

function resolve(dict: Record<string, unknown>, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as object)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from localStorage on the client after mount (SSR-safe).
  useEffect(() => {
    const initial = readInitialLang();
    setLangState(initial);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "en" ? "uz" : "en");
  }, [lang, setLang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let val = resolve(translations[lang] as Record<string, unknown>, key);
      if (typeof val !== "string") {
        // fall back to English, then to the key itself
        val = resolve(translations.en as Record<string, unknown>, key);
      }
      if (typeof val !== "string") return key;
      if (vars) {
        return val.replace(/\{(\w+)\}/g, (_, k) =>
          k in vars ? String(vars[k]) : `{${k}}`
        );
      }
      return val;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so components never crash if used outside a provider.
    return {
      lang: "en",
      setLang: () => {},
      toggle: () => {},
      t: (key: string) => {
        const val = resolve(translations.en as Record<string, unknown>, key);
        return typeof val === "string" ? val : key;
      },
    };
  }
  return ctx;
}

/** Convenience hook returning just the translate function. */
export function useT() {
  return useI18n().t;
}
