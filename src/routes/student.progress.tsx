import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { modules, mockStudent } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, BookOpen, Headphones, Mic, PenLine, Library, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/student/progress")({
  component: ProgressPage,
});

const skillIcons: Record<string, React.ElementType> = {
  grammar: BookOpen,
  vocabulary: Library,
  speaking: Mic,
  pragmatic: MessageSquare,
  reading: BookOpen,
  listening: Headphones,
};

const weeklyActivity = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 30 },
  { day: "Wed", minutes: 60 },
  { day: "Thu", minutes: 20 },
  { day: "Fri", minutes: 75 },
  { day: "Sat", minutes: 50 },
  { day: "Sun", minutes: 35 },
];

const maxMinutes = Math.max(...weeklyActivity.map((d) => d.minutes));

function ProgressPage() {
  const sorted = [...modules].sort((a, b) => a.progress - b.progress);
  const weakSkills = sorted.slice(0, 3);
  const strongSkills = sorted.slice(-3).reverse();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">Progress</Badge>
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mt-1">Track your skill levels and weekly activity.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 text-center">
          <p className="text-3xl font-bold text-primary">{mockStudent.totalScore.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Score</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{mockStudent.attendance}%</p>
          <p className="text-sm text-muted-foreground mt-1">Attendance</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-3xl font-bold text-indigo-600">{mockStudent.completedLessons}/{mockStudent.totalLessons}</p>
          <p className="text-sm text-muted-foreground mt-1">Lessons Done</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-3xl font-bold text-rose-600">{mockStudent.streak}</p>
          <p className="text-sm text-muted-foreground mt-1">Day Streak</p>
        </Card>
      </div>

      {/* All skills bar chart */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-5">Skill Levels</h2>
        <div className="space-y-4">
          {modules.map((mod) => {
            const Icon = skillIcons[mod.id] ?? BookOpen;
            return (
              <div key={mod.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    {mod.name}
                  </div>
                  <span className="text-sm font-semibold">{mod.progress}%</span>
                </div>
                <Progress value={mod.progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Weak & Strong skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold">Needs Improvement</h2>
          </div>
          <div className="space-y-3">
            {weakSkills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10">
                <span className="text-sm font-medium">{skill.name}</span>
                <Badge variant="destructive">{skill.progress}%</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Strong Skills</h2>
          </div>
          <div className="space-y-3">
            {strongSkills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                <span className="text-sm font-medium">{skill.name}</span>
                <Badge className="bg-emerald-500 hover:bg-emerald-600">{skill.progress}%</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-5">Weekly Activity (minutes)</h2>
        <div className="flex items-end gap-3 h-32">
          {weeklyActivity.map((d) => (
            <div key={d.day} className="flex flex-col items-center flex-1 gap-1">
              <span className="text-xs text-muted-foreground">{d.minutes}m</span>
              <div
                className="w-full rounded-t-md bg-primary/80"
                style={{ height: `${(d.minutes / maxMinutes) * 100}%` }}
              />
              <span className="text-xs font-medium">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
