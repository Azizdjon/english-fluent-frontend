import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Award, ClipboardList, TrendingUp,
  ChevronRight, ChevronLeft, X, Star, Clock, CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ONBOARDING_KEY = "pragmalearn_onboarding_done";

const onboardingColors = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-orange-500 to-amber-600",
  "from-yellow-500 to-orange-500",
];
const onboardingEmojis = ["👋", "📚", "🎤", "📈", "🏆"];

function OnboardingModal() {
  const { t } = useI18n();
  const onboardingSteps = onboardingColors.map((color, i) => ({
    emoji: onboardingEmojis[i],
    color,
    title: t(`dash.onboarding.s${i + 1}Title`),
    description: t(`dash.onboarding.s${i + 1}Desc`),
  }));
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setTimeout(() => setOpen(true), 800);
    }
  }, []);

  const done = () => { localStorage.setItem(ONBOARDING_KEY, "true"); setOpen(false); };
  if (!open) return null;

  const cur = onboardingSteps[step];
  const isLast = step === onboardingSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={done} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <button onClick={done} className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
        <div className={"bg-gradient-to-br " + cur.color + " py-10 flex flex-col items-center justify-center gap-2"}>
          <span className="text-5xl">{cur.emoji}</span>
          <div className="flex gap-1.5 mt-3">
            {onboardingSteps.map((_, i) => (
              <div key={i} className={i === step ? "rounded-full w-6 h-2 bg-white" : "rounded-full w-2 h-2 bg-white/40"} />
            ))}
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cur.title}</h2>
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-6">{cur.description}</p>
          <div className="flex gap-3">
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm font-medium">
                <ChevronLeft className="w-4 h-4" /> {t("dash.onboarding.back")}
              </button>
            ) : (
              <button onClick={done} className="flex-1 px-4 py-2.5 rounded-lg text-gray-400 hover:text-gray-600 transition text-sm">
                {t("dash.onboarding.skip")}
              </button>
            )}
            <button
              onClick={isLast ? done : () => setStep(s => s + 1)}
              className={"flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg bg-gradient-to-r " + cur.color + " text-white font-semibold text-sm hover:opacity-90 transition"}
            >
              {isLast ? t("dash.onboarding.getStarted") : <><span>{t("dash.onboarding.next")}</span><ChevronRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

function SkeletonLine({ w = "w-full", h = "h-4" }: { w?: string; h?: string }) {
  return <div className={w + " " + h + " bg-slate-700 rounded animate-pulse"} />;
}
function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-5 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonLine key={i} w={i === 0 ? "w-1/3" : i === 1 ? "w-full" : "w-2/3"} />
        ))}
      </CardContent>
    </Card>
  );
}

interface Profile { full_name: string; level: string; avatar_initials: string; }
interface Lesson { id: string; title: string; modules: { title: string } | null; }
interface Homework { id: string; title: string; due_date: string; status?: string; }

function StudentDashboard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const [
          { data: prof },
          { data: recentLessons },
          { data: hw },
          { data: certs },
          { data: progress },
          { count: total },
        ] = await Promise.all([
          supabase.from("profiles").select("full_name, level, avatar_initials").eq("id", user.id).single(),
          supabase.from("lessons").select("id, title, modules(title)").limit(5).order("created_at", { ascending: false }),
          supabase.from("homework").select("id, title, due_date").order("due_date", { ascending: true }).limit(4),
          supabase.from("certificates").select("id", { count: "exact" }).eq("student_id", user.id),
          supabase.from("lesson_progress").select("id", { count: "exact" }).eq("student_id", user.id).eq("completed", true),
          supabase.from("lessons").select("*", { count: "exact", head: true }),
        ]);
        setProfile(prof ?? { full_name: "Student", level: "Beginner", avatar_initials: "ST" });
        setLessons(((recentLessons ?? []).map((l: any) => ({
          id: l.id, title: l.title,
          modules: Array.isArray(l.modules) ? (l.modules[0] ?? null) : l.modules,
        }))) as Lesson[]);
        setHomework((hw ?? []) as Homework[]);
        setCertCount(certs?.length ?? 0);
        setCompletedLessons((progress as any)?.count ?? 0);
        setTotalLessons((total as any) ?? 0);
      } catch {
        setProfile({ full_name: "Student", level: "Beginner", avatar_initials: "ST" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const initials = (profile?.avatar_initials ?? "ST").replace(/[^A-Z]/gi, "").substring(0, 2).toUpperCase() || "ST";

  const stats = [
    { label: t("dash.student.completedLessons"), value: completedLessons, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10" },
    { label: t("dash.student.certificates"), value: certCount, icon: Award, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: t("dash.student.pendingHomework"), value: homework.filter(h => h.status !== "completed").length, icon: ClipboardList, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: t("dash.student.overallProgress"), value: progressPct + "%", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <>
      <OnboardingModal />
      <div className="min-h-screen bg-slate-900 p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-700 animate-pulse" />
              <div className="space-y-2 flex-1">
                <SkeletonLine w="w-48" h="h-6" />
                <SkeletonLine w="w-32" h="h-4" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {initials}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {t("dash.student.welcome", { name: profile?.full_name?.split(" ")[0] ?? t("dash.student.defaultName") })}
                </h1>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 mt-1">
                  {profile?.level ?? "Beginner"}
                </Badge>
              </div>
            </div>
          )}
          {loading ? (
            <div className="bg-slate-800 rounded-xl p-4 space-y-2">
              <SkeletonLine w="w-40" h="h-4" />
              <SkeletonLine w="w-full" h="h-3" />
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">{t("dash.student.overallProgress")}</span>
                <span className="text-blue-400 font-bold">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2.5 bg-slate-700" />
              <p className="text-slate-500 text-xs mt-2">{t("dash.student.lessonsCompleted", { done: completedLessons, total: totalLessons })}</p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-4 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 animate-pulse" />
                  <SkeletonLine w="w-12" h="h-6" />
                  <SkeletonLine w="w-full" h="h-3" />
                </div>
              ))
              : stats.map((s) => (
                <Card key={s.label} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className={"w-8 h-8 rounded-lg " + s.bg + " flex items-center justify-center mb-3"}>
                      <s.icon className={"w-4 h-4 " + s.color} />
                    </div>
                    <p className={"text-2xl font-bold " + s.color}>{s.value}</p>
                    <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" /> {t("dash.student.recentLessons")}
                </h2>
                <button onClick={() => navigate({ to: "/student/lessons" })} className="text-blue-400 text-xs hover:underline flex items-center gap-1">
                  {t("dash.seeAll")} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} rows={2} />)
                  : lessons.length === 0
                  ? (
                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6 text-center">
                        <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">{t("dash.student.noLessons")}</p>
                      </CardContent>
                    </Card>
                  )
                  : lessons.map((lesson) => (
                    <button key={lesson.id} onClick={() => navigate({ to: "/student/lessons/$id", params: { id: lesson.id } })}
                      className="w-full text-left bg-slate-800 border border-slate-700 hover:border-blue-500/40 rounded-xl p-3 flex items-center gap-3 transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-blue-300 transition-colors">{lesson.title}</p>
                        {lesson.modules && <p className="text-slate-500 text-xs truncate">{lesson.modules.title}</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </button>
                  ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-orange-400" /> {t("dash.student.homework")}
                </h2>
                <button onClick={() => navigate({ to: "/student/homework" })} className="text-blue-400 text-xs hover:underline flex items-center gap-1">
                  {t("dash.seeAll")} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} rows={2} />)
                  : homework.length === 0
                  ? (
                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6 text-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">{t("dash.student.allCaughtUp")}</p>
                      </CardContent>
                    </Card>
                  )
                  : homework.map((hw) => {
                    const due = new Date(hw.due_date);
                    const isOverdue = due < new Date() && hw.status !== "completed";
                    return (
                      <div key={hw.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-start gap-3">
                        <div className={"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 " + (hw.status === "completed" ? "bg-green-600/20" : isOverdue ? "bg-red-600/20" : "bg-orange-600/20")}>
                          <Clock className={"w-4 h-4 " + (hw.status === "completed" ? "text-green-400" : isOverdue ? "text-red-400" : "text-orange-400")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{hw.title}</p>
                          <p className={"text-xs mt-0.5 " + (isOverdue ? "text-red-400" : "text-slate-500")}>
                            {isOverdue ? t("dash.student.overdue") : t("dash.student.due")}{due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <Badge className={"text-xs flex-shrink-0 " + (hw.status === "completed" ? "bg-green-600" : isOverdue ? "bg-red-600" : "bg-orange-600") + " text-white"}>
                          {hw.status === "completed" ? t("dash.student.done") : isOverdue ? t("dash.student.late") : t("dash.student.pending")}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button onClick={() => navigate({ to: "/student/progress" })} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-9">
                  <TrendingUp className="w-3 h-3 mr-1.5" /> {t("dash.student.myProgress")}
                </Button>
                <Button onClick={() => navigate({ to: "/student/certificates" })} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-9">
                  <Award className="w-3 h-3 mr-1.5" /> {t("dash.student.certificates")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
