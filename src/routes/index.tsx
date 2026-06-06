import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  GraduationCap,
  Users,
  Shield,
  Sparkles,
  BookOpen,
  Mic,
  Trophy,
  ArrowRight,
  Play,
  Globe2,
  MessageSquare,
  Brain,
  Headphones,
  Star,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PragmaLearn — Speak English with Confidence" },
      {
        name: "description",
        content:
          "A cinematic English learning experience: adaptive lessons, AI speaking lab, pragmatic dialogues, and expert teachers — all in one beautiful platform.",
      },
    ],
  }),
  component: Landing,
});

const roles = [
  {
    name: "Student",
    to: "/student",
    icon: GraduationCap,
    desc: "Learn at your own pace",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "Teacher",
    to: "/teacher",
    icon: Users,
    desc: "Manage classes & grade",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Admin",
    to: "/admin",
    icon: Shield,
    desc: "Platform analytics",
    color: "from-emerald-500 to-teal-500",
  },
] as const;

const features = [
  {
    icon: Brain,
    title: "Adaptive AI Path",
    desc: "Your curriculum reshapes itself after every answer — never too easy, never too hard.",
  },
  {
    icon: Mic,
    title: "AI Speaking Lab",
    desc: "Real-time pronunciation, fluency, and intonation feedback from your browser microphone.",
  },
  {
    icon: MessageSquare,
    title: "Pragmatic Dialogues",
    desc: "Rehearse real B2/C1 scenarios — interviews, presentations, doctor visits, business meetings.",
  },
  {
    icon: Headphones,
    title: "Cinematic Lessons",
    desc: "HD video lessons with native speakers, paired with interactive grammar drills.",
  },
  {
    icon: Globe2,
    title: "CEFR Aligned",
    desc: "Every module maps to A1–C2 outcomes, with a diagnostic test that places you in minutes.",
  },
  {
    icon: Trophy,
    title: "Certificates",
    desc: "Earn shareable proof of progress at the end of each level — verified by your teacher.",
  },
];

const stats = [
  { value: "60+", label: "Interactive modules" },
  { value: "12k", label: "Active learners" },
  { value: "4.9★", label: "Average rating" },
  { value: "98%", label: "Pass rate" },
];

const journey = [
  {
    step: "01",
    title: "Take the diagnostic",
    desc: "A 10-minute adaptive test pinpoints your CEFR level across grammar, vocab, and listening.",
  },
  {
    step: "02",
    title: "Get your path",
    desc: "An AI tutor assembles a weekly plan from 60+ modules, drills, and pragmatic scenarios.",
  },
  {
    step: "03",
    title: "Practice out loud",
    desc: "Speak into the Speaking Lab — get instant feedback on rhythm, stress, and clarity.",
  },
  {
    step: "04",
    title: "Earn your certificate",
    desc: "Complete the level, get verified by a teacher, and share your CEFR certificate.",
  },
];

const testimonials = [
  {
    quote:
      "The Speaking Lab finally fixed my pronunciation. I went from B1 to C1 in eight months.",
    name: "Sofía R.",
    role: "Medical student, Madrid",
  },
  {
    quote:
      "Pragmatic Dialogues nailed my job interview prep. I got hired by a London startup.",
    name: "Kenji T.",
    role: "Software engineer, Tokyo",
  },
  {
    quote:
      "As a teacher, the homework grader saves me six hours a week. My students love it too.",
    name: "Emma W.",
    role: "English teacher, Berlin",
  },
];

function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        toast.error(error?.message ?? "Sign-in failed");
        return;
      }
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (pErr || !profile) {
        toast.error("Could not load profile");
        return;
      }
      const role = profile.role as string;
      if (role === "student") navigate({ to: "/student" });
      else if (role === "teacher") navigate({ to: "/teacher" });
      else if (role === "admin") navigate({ to: "/admin" });
      else toast.error("Unknown role: " + role);
    } catch (e: any) {
      toast.error(e?.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ============ NAV ============ */}
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 text-white">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
              PL
            </div>
            <span className="font-bold text-lg tracking-tight">PragmaLearn</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#journey" className="hover:text-white transition">How it works</a>
            <a href="#stories" className="hover:text-white transition">Stories</a>
            <a href="#login" className="hover:text-white transition">Sign in</a>
          </nav>
          <a href="#login">
            <Button size="sm" className="bg-white text-slate-900 hover:bg-white/90 font-semibold">
              Get started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </header>

      {/* ============ HERO with video bg ============ */}
      <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-a-group-of-young-students-studying-1572/1080p.mp4"
            type="video/mp4"
          />
        </video>
        {/* gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.25),transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-medium mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              AI-powered English, designed like cinema
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6 animate-fade-in">
              Speak English
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                like the world is listening.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-2xl mb-10 leading-relaxed">
              Adaptive lessons, a real-time AI Speaking Lab, and pragmatic
              dialogues that drop you into the rooms you actually want to walk
              into — interviews, presentations, classrooms, boardrooms.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#login">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 font-semibold h-12 px-6">
                  Start learning free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="#journey">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/5 border-white/30 text-white hover:bg-white/10 hover:text-white h-12 px-6 backdrop-blur"
                >
                  <Play className="w-4 h-4 mr-2 fill-white" />
                  See how it works
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-2xl">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl md:text-4xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 text-xs flex flex-col items-center gap-2 animate-bounce">
          <span className="uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-white/40" />
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-28 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-indigo-300 mb-3">What's inside</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Six tools. One fluent you.
            </h2>
            <p className="text-white/60 text-lg">
              Every feature is built around one promise: turn passive study
              into active, confident speech.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 hover:bg-white/[0.06] transition-all overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ JOURNEY ============ */}
      <section id="journey" className="py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.15),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-violet-300 mb-3">The journey</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              From hesitant to fluent, in four steps.
            </h2>
            <p className="text-white/60 text-lg mb-10">
              No more endless feeds of random tips. A clear path, measurable
              progress, and a teacher who knows your name.
            </p>

            <div className="space-y-6">
              {journey.map((j) => (
                <div key={j.step} className="flex gap-5">
                  <div className="text-3xl font-bold text-indigo-300/80 w-12 shrink-0">
                    {j.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{j.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{j.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/30 to-fuchsia-500/30 rounded-3xl blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80"
              alt="Students learning together"
              loading="lazy"
              className="relative rounded-3xl border border-white/10 shadow-2xl w-full object-cover aspect-[4/5]"
            />
            <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-2xl p-5 shadow-xl max-w-[230px]">
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm font-medium">Loved by 12,000+ learners across 47 countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPEAKING LAB SHOWCASE ============ */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video bg-black order-2 lg:order-1">
            <video
              className="w-full h-full object-cover opacity-80"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1600&q=80"
            >
              <source
                src="https://cdn.coverr.co/videos/coverr-a-woman-talking-on-the-phone-7050/1080p.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/60 via-transparent to-fuchsia-900/40" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-white/70 mb-1">Live demo</div>
                <div className="font-semibold text-lg">AI Speaking Lab</div>
              </div>
              <div className="flex items-end gap-1 h-10">
                {[0.4, 0.7, 0.9, 0.5, 0.8, 0.6, 0.95, 0.45].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-white rounded-full wave-bar"
                    style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="text-xs uppercase tracking-[0.2em] text-fuchsia-300 mb-3">Speaking Lab</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Your mouth, finally trained.
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Most apps test what you can read. We train what you can say.
              Tap record, speak a sentence, and watch waveforms turn into
              actionable feedback — rhythm, stress, vowels, and confidence.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Phoneme-level pronunciation scoring",
                "Pragmatic dialogue role-play (B2/C1)",
                "Filler-word and pacing analysis",
                "Shareable progress reports for teachers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/student/speaking">
              <Button className="bg-white text-slate-900 hover:bg-white/90 font-semibold">
                Try the Speaking Lab
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="stories" className="py-28 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-300 mb-3">Stories</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Learners shipping their dreams in English.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-7 bg-white/[0.04] border-white/10 text-white">
                <Quote className="w-8 h-8 text-indigo-300 mb-4" />
                <p className="text-white/85 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="pt-4 border-t border-white/10">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LOGIN / ROLES ============ */}
      <section
        id="login"
        className="py-28 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.35),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-indigo-300 mb-3">Step inside</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Pick your portal.
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Demo mode — choose a role to explore the full experience instantly.
            </p>
          </div>

          <Card className="p-8 md:p-10 bg-white/[0.04] border-white/10 backdrop-blur-xl text-white shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              <form
                onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/80">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-slate-900 hover:bg-white/90 font-semibold"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                  Continue as
                </div>
                {roles.map((r) => (
                  <Link key={r.name} to="/login">
                    <button className="w-full group flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.06] transition-all text-left">
                      <div
                        className={`w-11 h-11 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        <r.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">Login as {r.name}</div>
                        <div className="text-xs text-white/50">{r.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition" />
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-slate-950 text-white/60 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              PL
            </div>
            <span className="font-semibold text-white">PragmaLearn</span>
          </div>
          <p className="text-sm">© 2026 PragmaLearn. Crafted for learners, everywhere.</p>
          <div className="flex gap-5 text-sm">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#journey" className="hover:text-white">How it works</a>
            <a href="#login" className="hover:text-white">Sign in</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
