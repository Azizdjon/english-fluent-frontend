import { Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const queryClient = new QueryClient();
const PUBLIC_PATHS = ['/login', '/'];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const timeout = setTimeout(() => setChecking(false), 4000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout);
        if (!session && !PUBLIC_PATHS.includes(currentPath)) {
          window.location.replace('/login');
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setChecking(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') window.location.replace('/login');
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
    <QueryClientProvider client={queryClient}>
      <AuthGuard><Outlet /></AuthGuard>
      <Toaster />
    </QueryClientProvider>
  );
}

export const Route = createRootRoute({ component: RootComponent });
