import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

const queryClient = new QueryClient();
const PUBLIC_PATHS = ["/login", "/", "/research"];

// Inline script to apply the stored theme before first paint (prevents FOUC). Dark is the default.
const darkModeScript = `try{if(localStorage.getItem('pragmalearn-theme')!=='light'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}`;

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const timeout = setTimeout(() => setChecking(false), 4000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout);
        if (!session && !PUBLIC_PATHS.includes(currentPath)) {
          window.location.replace("/login");
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setChecking(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") window.location.replace("/login");
    });

    return () => { clearTimeout(timeout); subscription.unsubscribe(); };
  }, []);

  if (checking) {
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
