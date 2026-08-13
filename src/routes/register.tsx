import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, GraduationCap, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Route = createFileRoute('/register')({
  head: () => ({
    meta: [
      { title: 'Create your PragmaLearn account' },
      { name: 'description', content: 'Sign up for PragmaLearn as a student or teacher and start learning English with interactive lessons.' },
      { property: 'og:title', content: 'Create your PragmaLearn account' },
      { property: 'og:description', content: 'Sign up for PragmaLearn as a student or teacher and start learning English with interactive lessons.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email || !password || !confirm) {
      toast.error(t('loginPage.enterCreds'));
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName.trim(), role },
        },
      });
      if (error) throw error;

      if (data.session && data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName.trim(),
          email,
          role,
        });
        toast.success(t('loginPage.welcome'));
        navigate({ to: role === 'teacher' ? '/teacher' : '/student' });
        return;
      }
      setSent(true);
      toast.success('Check your email to confirm your account');
    } catch (err: any) {
      toast.error(err?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { key: 'student' as const, label: t('roles.student'), icon: GraduationCap },
    { key: 'teacher' as const, label: t('roles.teacher'), icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageToggle variant="dark" />
        <ThemeToggle variant="dark" />
      </div>
      <div className="w-full max-w-md">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">PL</div>
              <span className="text-white font-semibold">PragmaLearn</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1">Join PragmaLearn and start learning today.</p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm">
                We sent a confirmation link to <span className="text-white font-medium">{email}</span>.
                Confirm your email, then sign in.
              </p>
              <Link to="/login">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                  {t('common.signIn')}
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-slate-300 text-sm">Full name</Label>
                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Aziz Karimov" disabled={loading}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-300 text-sm">{t('common.email')}</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com" disabled={loading}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-300 text-sm">{t('common.password')}</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••" disabled={loading}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-slate-300 text-sm">Confirm password</Label>
                <Input id="confirm" type={showPassword ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)} placeholder="••••••••" disabled={loading}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setRole(opt.key)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                        role === opt.key
                          ? 'border-indigo-500 bg-indigo-600/20 text-white'
                          : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <opt.icon className="w-4 h-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                {loading ? 'Creating account...' : 'Create account'}
              </Button>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  {t('common.signIn')}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
