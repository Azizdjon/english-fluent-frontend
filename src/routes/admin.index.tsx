import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, UserPlus, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { adminStats, signupChartData, usageData } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { t } = useI18n();
  const stats = [
    { icon: Users, label: t("dash.admin.totalUsers"), value: adminStats.totalUsers.toLocaleString(), change: "+12.4%", up: true, tint: "bg-indigo-100 text-indigo-700" },
    { icon: BookOpen, label: t("dash.admin.activeCourses"), value: adminStats.activeCourses.toString(), change: "+3", up: true, tint: "bg-emerald-100 text-emerald-700" },
    { icon: DollarSign, label: t("dash.admin.revenue"), value: `$${adminStats.revenue.toLocaleString()}`, change: "+18.2%", up: true, tint: "bg-amber-100 text-amber-700" },
    { icon: UserPlus, label: t("dash.admin.signups"), value: adminStats.signups.toString(), change: "-2.1%", up: false, tint: "bg-violet-100 text-violet-700" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("dash.admin.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("dash.admin.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.tint}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-success" : "text-destructive"}`}>
                {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.change}
              </div>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-1">{t("dash.admin.signupsRevenue")}</h2>
          <p className="text-xs text-muted-foreground mb-4">{t("dash.admin.last6")}</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={signupChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="signups" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--chart-3)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-1">{t("dash.admin.weeklyActive")}</h2>
          <p className="text-xs text-muted-foreground mb-4">{t("dash.admin.studentsVsTeachers")}</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="students" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="teachers" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t("dash.admin.topCourses")}</h2>
        <div className="space-y-3">
          {[
            { name: "Business English B2", students: 487, completion: 78 },
            { name: "IELTS Preparation", students: 392, completion: 65 },
            { name: "Conversational A2-B1", students: 351, completion: 82 },
            { name: "Academic Writing C1", students: 218, completion: 71 },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">{t("dash.admin.studentsEnrolled", { n: c.students })}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.completion}%` }} />
                </div>
                <span className="text-sm font-semibold w-10 text-right">{c.completion}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
