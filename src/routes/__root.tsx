import { Outlet, useNavigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/react-start';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const queryClient = new QueryClient();
const PUBLIC_PATHS = ['/login', '/'];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const timeout = setTimeout(() => setChecking(false), 4000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout);
        if (!session && !PUBLIC_PATHS.includes(currentPath)) {
          navigate({ to: '/login' });
        }
        setChecking(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setChecking(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') navigate({ to: '/login' });
    });

    return () => { clearTimeout(timeout); subscription.unsubscribe(); };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="animate-spin w-6 h-6" />
          <span>Yuklanmoqda...</span>
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

export const Route = createRootRoute({ component: RootComponent });
