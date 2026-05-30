import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Play } from "lucide-react";

interface Lesson {
  id: string; title: string; content: string; video_url: string;
  order_index: number; duration_minutes: number; module_id: string;
}
interface Module {
  id: string; title: string; order_index: number; lessons: Lesson[];
}

export const Route = createFileRoute("/student/lessons/$id")({ component: LessonPlayerPage });

function getYouTubeEmbed(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1` : null;
}
const isWordwall = (url: string) => url?.includes("wordwall.net");

function LessonPlayerPage() {
  const { id } = Route.useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      const { data: l } = await supabase.from("lessons").select("*").eq("id", id).single();
      if (!l) { setLoading(false); return; }
      setLesson(l);
      const { data: mods } = await supabase
        .from("modules")
        .select("id,title,order_index,lessons(id,title,order_index,duration_minutes,video_url,module_id,content)")
        .order("order_index");
      if (mods) {
        const sorted = mods.map((m: any) => ({
          ...m, lessons: (m.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index)
        })).sort((a: any, b: any) => a.order_index - b.order_index);
        setModules(sorted);
        setAllLessons(sorted.flatMap((m: any) => m.lessons));
      }
      if (user) {
        const { data: p } = await supabase.from("lesson_progress").select("completed").eq("student_id", user.id).eq("lesson_id", id).single();
        if (p?.completed) setCompleted(true);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function markComplete() {
    if (!userId || completed) return;
    await supabase.from("lesson_progress").upsert({ student_id: userId, lesson_id: id, completed: true, completed_at: new Date().toISOString() }, { onConflict: "student_id,lesson_id" });
    setCompleted(true);
  }

  const idx = allLessons.findIndex(l => l.id === id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (!lesson) return <div className="p-8 text-center text-gray-400">Dars topilmadi</div>;

  const ytEmbed = getYouTubeEmbed(lesson.video_url || "");
  const isWW = isWordwall(lesson.video_url || "");

  return (
    <div className="flex h-full">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3.5 flex items-center gap-3">
          <Link to="/student/lessons" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-900 text-[15px] truncate">{lesson.title}</h1>
            {lesson.duration_minutes > 0 && <p className="text-xs text-gray-400">{lesson.duration_minutes} daqiqa</p>}
          </div>
          {completed && <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium bg-green-50 px-3 py-1.5 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Tugallandi</span>}
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <BookOpen className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {/* YouTube */}
          {ytEmbed && (
            <div className="video-wrapper shadow-sm">
              <iframe src={ytEmbed} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}

          {/* Wordwall */}
          {isWW && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-700 text-sm font-medium">
                <BookOpen className="w-4 h-4" /> Interaktiv mashq
              </div>
              <div style={{ position: "relative", width: "100%", paddingBottom: "0", minHeight: "460px" }} className="rounded-xl border-2 border-purple-100 overflow-hidden bg-white">
                <iframe src={lesson.video_url} title={lesson.title} style={{ width: "100%", height: "460px", border: "none" }} allow="fullscreen" />
              </div>
            </div>
          )}

          {/* Text content */}
          {lesson.content && (
            <div className="card">
              <div className="card-body prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{lesson.content}</div>
            </div>
          )}

          {/* No media */}
          {!ytEmbed && !isWW && !lesson.content && (
            <div className="card">
              <div className="empty-state"><Play className="empty-state-icon" /><p className="empty-state-title">Kontent yuklanmoqda...</p></div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2 pb-6">
            {prev ? (
              <Link to="/student/lessons/$id" params={{ id: prev.id }} className="btn-secondary flex-1 sm:flex-none justify-center">
                <ChevronLeft className="w-4 h-4" /> Oldingi
              </Link>
            ) : <div />}

            <button onClick={markComplete} disabled={completed} className={completed ? "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 cursor-default" : "btn-primary px-5"}>
              <CheckCircle className="w-4 h-4" />
              {completed ? "Tugallandi ✓" : "Tugalladim"}
            </button>

            {next ? (
              <Link to="/student/lessons/$id" params={{ id: next.id }} className="btn-primary flex-1 sm:flex-none justify-center">
                Keyingi <ChevronRight className="w-4 h-4" />
              </Link>
            ) : <div className="px-5 py-2 bg-green-50 text-green-700 rounded-lg text-sm text-center">🎉 Kurs tugadi!</div>}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-gray-100 z-50 lg:relative lg:flex flex-col transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Darslar ro'yxati</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded text-gray-400 hover:text-gray-600"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {modules.map(mod => (
            <div key={mod.id}>
              <div className="px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide sticky top-0">{mod.title}</div>
              {mod.lessons.map(l => (
                <Link key={l.id} to="/student/lessons/$id" params={{ id: l.id }}
                  className={`flex items-center gap-3 px-4 py-3 text-xs border-b border-gray-50 transition-colors ${l.id === id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-medium ${l.id === id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {isWordwall(l.video_url || "") ? "W" : <Play className="w-2.5 h-2.5" />}
                  </div>
                  <span className="truncate">{l.title}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
