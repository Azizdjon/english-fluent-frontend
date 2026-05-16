import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Users, Shield, Sparkles, BookOpen, Mic, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PragmaLearn — English Learning Platform" },
      { name: "description", content: "Master English with personalized lessons, AI-powered speaking practice, and expert teachers." },
    ],
  }),
  component: Landing,
});

const roles = [
  { name: "Student", to: "/student", icon: GraduationCap, desc: "Learn at your own pace", color: "from-indigo-500 to-blue-500" },
  { name: "Teacher", to: "/teacher", icon: Users, desc: "Manage classes & grade", color: "from-violet-500 to-purple-500" },
  { name: "Admin", to: "/admin", icon: Shield, desc: "Platform analytics", color: "from-emerald-500 to-teal-500" },
] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
      <header className="border-b border-border/50 backdrop-blur bg-background/70 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">L</div>
            <span className="font-bold text-lg">PragmaLearn</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#login" className="hover:text-foreground">Sign in</a>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" /> AI-powered English learning
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
          Master English with a <span className="text-primary">personalized path</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Adaptive lessons, real-time speaking feedback, and expert teachers — all in one beautifully designed platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16">
          {[
            { icon: BookOpen, label: "60+ modules" },
            { icon: Mic, label: "AI Speaking Lab" },
            { icon: Trophy, label: "CEFR aligned" },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-center gap-2 p-4 rounded-lg bg-card border">
              <f.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="login" className="max-w-5xl mx-auto px-6 pb-24">
        <Card className="p-8 md:p-10 shadow-xl border-border/60">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Sign in to continue — pick a role below to explore the demo</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" defaultValue="alex@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" />
              </div>
              <Button className="w-full" disabled>Sign in</Button>
              <p className="text-xs text-center text-muted-foreground">
                Demo mode — pick a role on the right to enter
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Continue as
              </div>
              {roles.map((r) => (
                <Link key={r.name} to={r.to}>
                  <button className="w-full group flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all text-left">
                    <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white`}>
                      <r.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Login as {r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © 2026 PragmaLearn. Crafted for learners.
      </footer>
    </div>
  );
}
