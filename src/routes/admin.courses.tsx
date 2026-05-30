import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Course {
  id: string;
  title: string;
  level: string;
  is_active: boolean;
  total_lessons: number;
}

export const Route = createFileRoute("/admin/courses")({ component: AdminCoursesPage });

function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLevel, setNewLevel] = useState("beginner");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("courses").select("id,title,level,is_active,total_lessons").order("title");
    setCourses(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("courses").update({ is_active: !current }).eq("id", id);
    setCourses(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c));
  }

  async function createCourse() {
    if (!newTitle.trim()) return;
    setSaving(true);
    await supabase.from("courses").insert({ title: newTitle.trim(), level: newLevel, is_active: true, total_lessons: 0 });
    setNewTitle(""); setNewLevel("beginner"); setShowModal(false); setSaving(false);
    load();
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-1.5 text-sm flex-1 sm:flex-none sm:w-56"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
            + New Course
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Level</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Lessons</th>
                <th className="px-4 py-3 text-center">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell capitalize text-gray-600">{c.level}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{c.total_lessons}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(c.id, c.is_active)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.is_active ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${c.is_active ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No courses found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">New Course</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Title</label>
                <input
                  className="border rounded px-3 py-2 w-full text-sm"
                  placeholder="Course title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Level</label>
                <select
                  className="border rounded px-3 py-2 w-full text-sm"
                  value={newLevel}
                  onChange={e => setNewLevel(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border rounded hover:bg-gray-50">Cancel</button>
              <button onClick={createCourse} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
