import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

const queryClient = new QueryClient();
const PUBLIC_PATHS = ["/login", "/register", "/", "/research"];

function isPublic(path: string) {
  const clean = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return PUBLIC_PATHS.includes(clean);
}

// Inline script to apply the stored theme before first paint (prevents FOUC). Dark is the default.
const darkModeScript = `try{if(localStorage.getItem('pragmalearn-theme')!=='light'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}`;

function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setAuthed(!!session);
      setChecking(false);
      if (!session && !isPublic(window.location.pathname)) {
        window.location.replace("/login");
      }
    }).catch(() => {
      if (!cancelled) setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthed(!!session);
      if (event === "SIGNED_OUT") window.location.replace("/login");
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  // Re-check on every client-side navigation so protected routes can't be reached without a session.
  useEffect(() => {
    if (checking) return;
    if (!authed && !isPublic(pathname)) {
      window.location.replace("/login");
    }
  }, [pathname, authed, checking]);

  const blocked = !checking && !authed && !isPublic(pathname);

  if (checking || blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="animate-spin w-6 h-6" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}


function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LanguageProvider>
              <AuthGuard>
                <Outlet />
              </AuthGuard>
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
  }),
});
