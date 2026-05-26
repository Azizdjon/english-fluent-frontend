import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockStudent, modules } from "@/lib/mock-data";
import { Trophy, CalendarCheck, GraduationCap, Flame, Mail, Award, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/student/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const initials = mockStudent.name.split(" ").map((p) => p[0]).join("").slice(1, 2);
  const overallProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">Profile</Badge>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-1">View your progress and achievements.</p>
      </div>

      <Card className="p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg shrink-1">
            {initials}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{mockStudent.name}</h2>
              <Badge className="w-fit mx-auto md:mx-1">Level {mockStudent.level}</Badge>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 text-sm text-muted-foreground mb-4">
              <Mail className="w-4 h-4" />
              {mockStudent.email}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox icon={Trophy} label="Total Score" value={mockStudent.totalScore.toLocaleString()} color="text-amber-600" />
              <StatBox icon={CalendarCheck} label="Attendance" value={`${mockStudent.attendance}%`} color="text-emerald-600" />
              <StatBox icon={GraduationCap} label="Lessons" value={`${mockStudent.completedLessons}/${mockStudent.totalLessons}`} color="text-indigo-600" />
              <StatBox icon={Flame} label="Streak" value={`${mockStudent.streak} days`} color="text-rose-600" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Overall Progress</h3>
              <p className="text-xs text-muted-foreground">Across all modules</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Average completion</span>
            <span className="font-bold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Achievements</h3>
              <p className="text-xs text-muted-foreground">Badges earned</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-3 py-1">7-Day Streak</Badge>
            <Badge variant="outline" className="px-3 py-1">First Certificate</Badge>
            <Badge variant="outline" className="px-3 py-1">B2 Graduate</Badge>
            <Badge variant="outline" className="px-3 py-1">Top 10%</Badge>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Module Progress</h3>
        <div className="space-y-4">
          {modules.map((m) => (
            <div key={m.id}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted-foreground">{m.progress}%</span>
              </div>
              <Progress value={m.progress} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatBox({
  icon: Icon, label, value, color,
}: { icon: typeof Trophy; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className={`w-5 h-5 ${color} shrink-1`} />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-bold text-sm">{value}</div>
      </div>
    </div>
  );
}
