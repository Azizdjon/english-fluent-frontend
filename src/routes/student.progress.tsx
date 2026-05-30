import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, ClipboardList, GraduationCap, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/student/progress")({
  component: ProgressPage,
});

interface Enrollment {
  id: string;
  progress: number | null;
  courses: { title: string } | null;
}

interface ActivityDay {
  day: string;
  count: number;
}

function startOfWeek() {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = (day + 6) % 7; // make Monday start
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activity, setActivity] = useState<ActivityDay[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const weekStart = startOfWeek();

        const [
          { count: lessonsDone },
          { count: enrCount },
          { count: subCount },
          { count: certs },
          { data: enrs },
          { data: weekProgress },
        ] = await Promise.all([
          supabase.from("lesson_progress").select("*", { count: "exact", head: true }).eq("student_id", user.id).eq("completed", true),
          supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("student_id", user.id),
          supabase.from("submissions").select("*", { count: "exact", head: true }).eq("student_id", user.id),
          supabase.from("certificates").select("*", { count: "exact", head: true }).eq("student_id", user.id),
          supabase.from("enrollments").select("id, progress, courses(title)").eq("student_id", user.id),
          supabase.from("lesson_progress").select("completed_at").eq("student_id", user.id).eq("completed", true).gte("completed_at", weekStart.toISOString()),
        ]);

        setLessonsCompleted(lessonsDone ?? 0);
        setEnrolledCount(enrCount ?? 0);
        setSubmissionsCount(subCount ?? 0);
        setCertCount(certs ?? 0);
        setEnrollments((enrs ?? []) as unknown as Enrollment[]);

        // Build weekly activity (Mon..Sun)
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const buckets = days.map((day) => ({ day, count: 0 }));
        (weekProgress ?? []).forEach((row: { completed_at: string | null }) => {
          if (!row.completed_at) return;
          const d = new Date(row.completed_at);
          const idx = (d.getDay() + 6) % 7;
          buckets[idx].count += 1;
        });
        setActivity(buckets);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh] text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading progress…
      </div>
    );
  }

  const maxCount = Math.max(1, ...activity.map((d) => d.count));

  const stats = [
    { label: "Lessons Completed", value: lessonsCompleted, icon: BookOpen, color: "text-blue-600" },
    { label: "Enrolled Courses", value: enrolledCount, icon: GraduationCap, color: "text-indigo-600" },
    { label: "Homework Submitted", value: submissionsCount, icon: ClipboardList, color: "text-orange-600" },
    { label: "Certificates", value: certCount, icon: Award, color: "text-emerald-600" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">Progress</Badge>
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mt-1">Track your activity and course progress.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Per-course progress */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-5">Course Progress</h2>
        {enrollments.length === 0 ? (
          <p className="text-sm text-muted-foreground">You are not enrolled in any courses yet.</p>
        ) : (
          <div className="space-y-4">
            {enrollments.map((e) => {
              const pct = Math.max(0, Math.min(100, Number(e.progress ?? 0)));
              return (
                <div key={e.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{e.courses?.title ?? "Untitled course"}</span>
                    <span className="text-sm font-semibold">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Weekly activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-5">This Week (lessons completed)</h2>
        <div className="flex items-end gap-3 h-32">
          {activity.map((d) => (
            <div key={d.day} className="flex flex-col items-center flex-1 gap-1">
              <span className="text-xs text-muted-foreground">{d.count}</span>
              <div
                className="w-full rounded-t-md bg-primary/80 min-h-[4px]"
                style={{ height: `${(d.count / maxCount) * 100}%` }}
              />
              <span className="text-xs font-medium">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
