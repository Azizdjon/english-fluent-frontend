import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/student/lessons/$id")({
  component: LessonPlayer,
});

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  content: string | null;
  order_index: number;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
}

function getEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) return "https://www.youtube.com/embed/" + ytMatch[1] + "?rel=0&modestbranding=1";
  return url;
}

function LessonPlayer() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [siblings, setSiblings] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Fetch current lesson
        const { data: l } = await supabase
          .from("lessons")
          .select("id, title, description, video_url, content, order_index, module_id")
          .eq("id", id)
          .single();

        if (!l) {
          setLoading(false);
          return;
        }
        setLesson(l);

        // Fetch module info
        const { data: m } = await supabase
          .from("modules")
          .select("id, title, course_id")
          .eq("id", l.module_id)
          .single();
        setModule(m ?? null);

        // Fetch all lessons in same module ordered
        const { data: all } = await supabase
          .from("lessons")
          .select("id, title, description, video_url, content, order_index, module_id")
          .eq("module_id", l.module_id)
          .order("order_index", { ascending: true });
        setSiblings(all ?? []);

        // Check completion status
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prog } = await supabase
            .from("lesson_progress")
            .select("completed")
            .eq("lesson_id", id)
            .eq("student_id", user.id)
            .single();
          setCompleted(prog?.completed ?? false);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const currentIndex = siblings.findIndex((s) => s.id === id);
  const prevLesson = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < siblings.length - 1
    ? siblings[currentIndex + 1]
    : null;
  const progress = siblings.length > 0
    ? Math.round(((currentIndex + 1) / siblings.length) * 100)
    : 0;

  async function markComplete() {
    setMarking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && lesson) {
        await supabase.from("lesson_progress").upsert({
          student_id: user.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: "student_id,lesson_id" });
        setCompleted(true);
      }
    } catch {
      // ignore
    } finally {
      setMarking(false);
    }
  }

  async function goNext() {
    if (!completed) await markComplete();
    if (nextLesson) navigate({ to: "/student/lessons/$id", params: { id: nextLesson.id } });
  }

  function goPrev() {
    if (prevLesson) navigate({ to: "/student/lessons/$id", params: { id: prevLesson.id } });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-white font-semibold">Lesson not found</p>
          <Button
            onClick={() => navigate({ to: "/student" })}
            className="mt-4 bg-blue-600 hover:bg-blue-500"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(lesson.video_url);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/student" })}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
          <span className="text-slate-400 text-xs whitespace-nowrap">
            {currentIndex + 1} / {siblings.length}
          </span>
          <Progress value={progress} className="flex-1 h-2 bg-slate-700" />
          <span className="text-slate-400 text-xs">{progress}%</span>
        </div>
        {completed && (
          <Badge className="bg-green-600 text-white flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Module & title */}
        {module && (
          <p className="text-blue-400 text-sm font-medium mb-1">{module.title}</p>
        )}
        <h1 className="text-2xl font-bold text-white mb-6">{lesson.title}</h1>

        {/* Video */}
        {embedUrl ? (
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-2xl">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center mb-6">
            <div className="text-center">
              <PlayCircle className="w-16 h-16 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No video for this lesson</p>
            </div>
          </div>
        )}

        {/* Description / Content */}
        {(lesson.description || lesson.content) && (
          <div className="bg-slate-800 rounded-xl p-5 mb-6 border border-slate-700">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Lesson Notes
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {lesson.content ?? lesson.description}
            </p>
          </div>
        )}

        {/* Lesson list */}
        {siblings.length > 1 && (
          <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
              Module Lessons
            </h3>
            <div className="space-y-1">
              {siblings.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() =>
                    navigate({ to: "/student/lessons/$id", params: { id: s.id } })
                  }
                  className={
                    "w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors text-sm " +
                    (s.id === id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700")
                  }
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-slate-700 text-slate-400">
                    {i + 1}
                  </span>
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={goPrev}
            disabled={!prevLesson}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {prevLesson ? prevLesson.title.substring(0, 20) + (prevLesson.title.length > 20 ? '...' : '') : 'Previous'}
          </Button>

          {nextLesson ? (
            <Button
              onClick={goNext}
              className="bg-blue-600 hover:bg-blue-500 font-semibold flex-1 max-w-xs"
            >
              {completed ? '' : 'Complete & '}Next: {nextLesson.title.substring(0, 20)}{nextLesson.title.length > 20 ? '...' : ''}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={markComplete}
              disabled={completed || marking}
              className="bg-green-600 hover:bg-green-500 font-semibold flex-1 max-w-xs"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {completed ? 'Completed!' : marking ? 'Saving...' : 'Mark as Complete'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
