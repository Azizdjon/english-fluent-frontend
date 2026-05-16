import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Trophy, CalendarCheck, GraduationCap, Flame, ArrowRight,
  BookOpen, Library, Mic, MessageSquare, BookMarked, Headphones,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockStudent, modules, recommended } from "@/lib/mock-data";

const iconMap = { BookOpen, Library, Mic, MessageSquare, BookMarked, Headphones };

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});

function StatCard({
  icon: Icon, label, value, sub, tint,
}: { icon: typeof Trophy; label: string; value: string; sub: string; tint: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground mb-1">{label}</div>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground mt-2">{sub}</div>
        </div>
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${tint}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}

function StudentDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {mockStudent.name.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">
          You're at level <Badge variant="secondary" className="ml-1">{mockStudent.level}</Badge> — keep the momentum going.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Trophy} label="Total Score" value={mockStudent.totalScore.toLocaleString()} sub="+320 this week" tint="bg-amber-100 text-amber-700" />
        <StatCard icon={CalendarCheck} label="Attendance" value={`${mockStudent.attendance}%`} sub="Above class average" tint="bg-emerald-100 text-emerald-700" />
        <StatCard icon={GraduationCap} label="Lessons" value={`${mockStudent.completedLessons}/${mockStudent.totalLessons}`} sub="78% complete" tint="bg-indigo-100 text-indigo-700" />
        <StatCard icon={Flame} label="Streak" value={`${mockStudent.streak} days`} sub="Personal best!" tint="bg-rose-100 text-rose-700" />
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recommended for you</h2>
          <Badge variant="outline">Path · {mockStudent.level}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommended.map((r) => (
            <Card key={r.title} className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <Badge variant="secondary" className="mb-3">{r.type}</Badge>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{r.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{r.duration} · Level {r.level}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Study modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = iconMap[m.icon as keyof typeof iconMap];
            const isSpeaking = m.id === "speaking";
            const card = (
              <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">{m.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{m.lessons} lessons</p>
                <Progress value={m.progress} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{m.progress}% complete</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">Continue →</Button>
                </div>
              </Card>
            );
            return isSpeaking ? (
              <Link key={m.id} to="/student/speaking">{card}</Link>
            ) : (
              <div key={m.id}>{card}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
