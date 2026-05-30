import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/student/progress")({ component: ProgressPage });

function ProgressPage() {
  const [stats, setStats] = useState({ completedLessons: 0, enrolledCourses: 0, submissions: 0, certificates: 0 });
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [weekActivity, setWeekActivity] = useState<number[]>(Array(7).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const [progRes, enrollRes, subRes, certRes] = await Promise.all([
      supabase.from("lesson_progress").select("lesson_id,completed_at").eq("student_id", user.id).eq("completed", true),
      supabase.from("enrollments").select("course_id,progress,score,lessons_done,courses(title,level,total_lessons)").eq("student_id", user.id),
      supabase.from("submissions").select("id").eq("student_id", user.id),
      supabase.from("certificates").select("id").eq("student_id", user.id),
    ]);
    setStats({
      completedLessons: (progRes.data || []).length,
      enrolledCourses: (enrollRes.data || []).length,
      submissions: (subRes.data || []).length,
      certificates: (certRes.data || []).length,
    });
    setEnrollments(enrollRes.data || []);
    const now = new Date();
    const activity = Array(7).fill(0);
    (progRes.data || []).forEach((p: any) => {
      if (!p.completed_at) return;
      const diff = Math.floor((now.getTime() - new Date(p.completed_at).getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 7) activity[6 - diff]++;
    });
    setWeekActivity(activity);
    setLoading(false);
  }

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const maxActivity = Math.max(...weekActivity, 1);

  if (loading) return <div className="p-6 text-gray-400">Loading progress...</div>;

  return (
    <div className="p-4 md:p-6 max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white">My Progress</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Lessons Done", value: stats.completedLessons, color: "text-blue-400" },
          { label: "Courses", value: stats.enrolledCourses, color: "text-purple-400" },
          { label: "Homework", value: stats.submissions, color: "text-orange-400" },
          { label: "Certificates", value: stats.certificates, color: "text-green-400" },
        ].map(s => (
          <div key={s.label} className="bg-gray-800 rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Weekly Activity (last 7 days)</h2>
        <div className="flex items-end gap-2 h-24">
          {weekActivity.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-blue-500 rounded-t transition-all" style={{ height: `${(count / maxActivity) * 80}px`, minHeight: count > 0 ? "4px" : "0" }} />
              <span className="text-xs text-gray-500">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Course Progress</h2>
        {enrollments.length === 0 && <p className="text-gray-400 text-sm">Not enrolled in any courses yet.</p>}
        <div className="space-y-4">
          {enrollments.map((e: any) => (
            <div key={e.course_id}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-200 text-sm">{(e.courses as any)?.title || "Course"}</span>
                <span className="text-gray-400 text-sm">{e.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${e.progress || 0}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{e.lessons_done || 0} lessons done</span>
                <span>Score: {e.score || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
