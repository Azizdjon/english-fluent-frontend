import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/students")({ component: StudentsPage });

function StudentsPage() {
  const { t } = useI18n();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStudents(); }, []);

  async function loadStudents() {
    const [studRes, enrollRes, subRes] = await Promise.all([
      supabase.from("profiles").select("id,full_name,email").eq("role", "student"),
      supabase.from("enrollments").select("student_id,course_id"),
      supabase.from("submissions").select("student_id"),
    ]);
    const enrollMap: Record<string, number> = {};
    (enrollRes.data || []).forEach((e: any) => { enrollMap[e.student_id] = (enrollMap[e.student_id] || 0) + 1; });
    const subMap: Record<string, number> = {};
    (subRes.data || []).forEach((s: any) => { subMap[s.student_id] = (subMap[s.student_id] || 0) + 1; });
    const built = (studRes.data || []).map((s: any) => ({
      ...s, enrollments: enrollMap[s.id] || 0, submissions: subMap[s.id] || 0,
    }));
    setStudents(built);
    setLoading(false);
  }

  const filtered = students.filter(s =>
    !search || s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6 text-gray-400">{t("dash.teacherStudents.loading")}</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-white mb-6">{t("dash.teacherStudents.title", { n: students.length })}</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("dash.teacherStudents.search")}
        className="mb-4 w-full max-w-md bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
      <div className="bg-gray-800 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left text-gray-300 text-sm px-4 py-3">{t("dash.teacherStudents.colStudent")}</th>
              <th className="text-left text-gray-300 text-sm px-4 py-3 hidden sm:table-cell">{t("dash.teacherStudents.colCourses")}</th>
              <th className="text-left text-gray-300 text-sm px-4 py-3 hidden sm:table-cell">{t("dash.teacherStudents.colSubmissions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-gray-700/30">
                <td className="px-4 py-3">
                  <div className="text-white text-sm font-medium">{s.full_name || "—"}</div>
                  <div className="text-gray-400 text-xs">{s.email}</div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-0.5 rounded-full">{t("dash.teacherStudents.courses", { n: s.enrollments })}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full">{t("dash.teacherStudents.submitted", { n: s.submissions })}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">{t("dash.teacherStudents.none")}</p>}
      </div>
    </div>
  );
}

export default StudentsPage;
