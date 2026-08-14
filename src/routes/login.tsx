import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error(t('loginPage.enterCreds')); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
      const role = profile?.role || 'student';
      toast.success(t('loginPage.welcome'));
      if (role === 'teacher') navigate({ to: '/teacher' });
      else if (role === 'admin') navigate({ to: '/admin' });
      else navigate({ to: '/student' });
    } catch (err: any) {
      toast.error(err.message || t('loginPage.wrongCreds'));
    } finally { setLoading(false); }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <Link to="/" className="absolute top-4 left-4 flex items-center gap-2 font-semibold text-white hover:opacity-90 transition-opacity">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">PL</div>
        PragmaLearn
      </Link>
      <div className="absolute top-4 right-4">
        <LanguageToggle variant="dark" />
        <ThemeToggle variant="dark" />
      </div>
      <div className="w-full max-w-md">


        {/* Login form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">PL</div>
              <span className="text-white font-semibold">PragmaLearn</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{t('loginPage.heading')}</h1>
            <p className="text-slate-400 text-sm mt-1">{t('loginPage.subtitle')}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-sm">{t('common.email')}</Label>
              <Input id="email" type="email" placeholder="email@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                disabled={loading} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300 text-sm">{t('common.password')}</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 pr-10"
                  disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
              {loading ? t('common.signingIn') : t('common.signIn')}
            </Button>
          </form>
        </div>

      </div>
    </div>

  );
}
