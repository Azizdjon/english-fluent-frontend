import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronDown, ChevronRight, CheckCircle, Circle } from "lucide-react";

export const Route = createFileRoute("/student/lessons")({
  component: LessonsPage,
});

interface Lesson { id: string; title: string; order_index: number; duration_minutes: number; video_url: string | null; }
interface Module { id: string; title: string; order_index: number; lessons: Lesson[]; }
interface Course { id: string; title: string; level: string; modules: Module[]; }

function SkeletonLine() { return <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />; }

function LessonsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const [coursesRes, modulesRes, lessonsRes, progressRes] = await Promise.all([
      supabase.from("courses").select("id,title,level").eq("is_active", true).order("created_at"),
      supabase.from("modules").select("id,course_id,title,order_index").order("order_index"),
      supabase.from("lessons").select("id,module_id,title,order_index,duration_minutes,video_url").order("order_index"),
      supabase.from("lesson_progress").select("lesson_id").eq("student_id", user.id).eq("completed", true),
    ]);
    const completedSet = new Set((progressRes.data || []).map((p: any) => p.lesson_id));
    setCompletedIds(completedSet);
    const lessonsByModule: Record<string, Lesson[]> = {};
    (lessonsRes.data || []).forEach((l: any) => {
      if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
      lessonsByModule[l.module_id].push(l);
    });
    const modulesByCourse: Record<string, Module[]> = {};
    (modulesRes.data || []).forEach((m: any) => {
      if (!modulesByCourse[m.course_id]) modulesByCourse[m.course_id] = [];
      modulesByCourse[m.course_id].push({ ...m, lessons: lessonsByModule[m.id] || [] });
    });
    const built: Course[] = (coursesRes.data || []).map((c: any) => ({ ...c, modules: modulesByCourse[c.id] || [] }));
    setCourses(built);
    if (built[0]?.modules[0]) setExpandedModules(new Set([built[0].modules[0].id]));
    setLoading(false);
  }

  function toggleModule(id: string) {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  if (loading) return (
    <div className="p-4 md:p-6 space-y-6">
      {[1, 2].map(i => (
        <div key={i} className="bg-white rounded-xl p-4 space-y-3 border border-gray-100">
          <SkeletonLine /><SkeletonLine /><SkeletonLine />
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Lessons</h1>
      {courses.length === 0 && <p className="text-gray-500">No courses available yet.</p>}
      {courses.map(course => (
        <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div>
              <h2 className="text-gray-900 font-semibold text-lg">{course.title}</h2>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">{course.level}</span>
            </div>
            <span className="text-gray-500 text-sm hidden sm:inline">{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
          </div>
          <div className="divide-y divide-gray-100">
            {course.modules.map(mod => {
              const isExpanded = expandedModules.has(mod.id);
              const completed = mod.lessons.filter(l => completedIds.has(l.id)).length;
              return (
                <div key={mod.id}>
                  <button onClick={() => toggleModule(mod.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                      <span className="text-gray-800 font-medium text-sm md:text-base">{mod.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">{completed}/{mod.lessons.length}</span>
                  </button>
                  {isExpanded && (
                    <div className="bg-gray-50/50">
                      {mod.lessons.map(lesson => (
                        <Link key={lesson.id} to="/student/lessons/$id" params={{ id: lesson.id }}
                          className="flex items-center gap-3 px-6 py-3 hover:bg-blue-50/50 transition-colors border-b border-gray-100 last:border-0">
                          {completedIds.has(lesson.id)
                            ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          }
                          <p className="flex-1 text-gray-700 text-sm truncate">{lesson.title}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0">{lesson.duration_minutes}m</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LessonsPage;
