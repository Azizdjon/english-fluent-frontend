import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  Outlet,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-start";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const publicPaths = ["/login", "/"];
    const currentPath = window.location.pathname;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !publicPaths.includes(currentPath)) {
        navigate({ to: "/login" });
      }
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate({ to: "/login" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-slate-400 text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function RootComponent() {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthGuard>
            <Outlet />
          </AuthGuard>
          <Toaster />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
