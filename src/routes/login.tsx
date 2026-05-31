import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { BookOpen, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'student' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.full_name, role: form.role } },
        });
        if (error) throw error;
        toast.success('Registered successfully!', { description: 'You can now sign in.' });
        setMode('login');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        const profile = data.user?.user_metadata;
        const role = profile?.role || 'student';
        toast.success('Welcome!');
        if (role === 'admin') navigate({ to: '/admin' });
        else if (role === 'teacher') navigate({ to: '/teacher' });
        else navigate({ to: '/student' });
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">PragmaLearn</span>
          </div>
          <p className="text-slate-400 text-sm">Speak English with Confidence</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {mode === 'login' ? 'Enter your email and password' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="space-y-1">
                    <Label className="text-slate-300">Full name</Label>
                    <Input
                      placeholder="Alex Johnson"
                      value={form.full_name}
                      onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-300">Role</Label>
                    <select
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full rounded-md bg-slate-700 border border-slate-600 text-white px-3 py-2 text-sm"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </>
              )}
              <div className="space-y-1">
                <Label className="text-slate-300">Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300">Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  minLength={6}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-slate-400">
              {mode === 'login' ? (
                <span>Don't have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-emerald-400 hover:underline">
                    Register
                  </button>
                </span>
              ) : (
                <span>Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-emerald-400 hover:underline">
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
