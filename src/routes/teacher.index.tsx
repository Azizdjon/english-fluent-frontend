import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, ClipboardList, TrendingUp } from "lucide-react";
import { mockStudents, mockHomework } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/")({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const { t } = useI18n();
  const stats = [
    { icon: Users, label: t("dash.teacher.students"), value: "24", tint: "bg-indigo-100 text-indigo-700" },
    { icon: BookOpen, label: t("dash.teacher.activeClasses"), value: "3", tint: "bg-emerald-100 text-emerald-700" },
    { icon: ClipboardList, label: t("dash.teacher.pendingGrades"), value: "12", tint: "bg-amber-100 text-amber-700" },
    { icon: TrendingUp, label: t("dash.teacher.avgScore"), value: "83%", tint: "bg-violet-100 text-violet-700" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("dash.teacher.greeting")} 👋</h1>
        <p className="text-muted-foreground mt-1">{t("dash.teacher.submissionsAwaiting")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="text-2xl font-bold mt-1">{s.value}</div>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.tint}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("dash.teacher.recentStudents")}</h2>
            <Link to="/teacher/students"><Button variant="ghost" size="sm">{t("dash.viewAll")} →</Button></Link>
          </div>
          <div className="space-y-2">
            {mockStudents.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    {s.name.split(" ").map(p => p[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.lastActive}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{s.level}</Badge>
                  <div className="text-sm font-semibold w-12 text-right">{s.score}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("dash.teacher.homework")}</h2>
            <Link to="/teacher/homework"><Button variant="ghost" size="sm">{t("dash.manage")} →</Button></Link>
          </div>
          <div className="space-y-3">
            {mockHomework.map((h) => (
              <div key={h.id} className="p-3 rounded-lg border">
                <div className="font-medium text-sm mb-1">{h.title}</div>
                <div className="text-xs text-muted-foreground mb-2">{t("dash.teacher.due", { date: h.due })}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("dash.teacher.submitted", { n: h.submitted, total: h.assigned })}</span>
                  <div className="w-20 h-1.5 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(h.submitted / h.assigned) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
