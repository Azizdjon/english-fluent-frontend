import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileQuestion, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/student/grammar/conditional")({
  component: ConditionalPage,
});

const QUIZ_IDS = [
  { id: "cccccccc-0120-0001-0000-000000000001", fallback: "3rd Conditional" },
  { id: "cccccccc-0121-0001-0000-000000000001", fallback: "Mixed Conditionals (Part 1)" },
  { id: "cccccccc-0122-0001-0000-000000000001", fallback: "Mixed Conditionals (Part 2)" },
];

interface LessonRow {
  id: string;
  title: string;
  duration_minutes: number | null;
  lesson_type: string | null;
}

function ConditionalPage() {
  const [lessons, setLessons] = useState<Record<string, LessonRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("lessons")
        .select("id,title,duration_minutes,lesson_type")
        .in("id", QUIZ_IDS.map(q => q.id));
      const map: Record<string, LessonRow> = {};
      (data || []).forEach((l: any) => { map[l.id] = l; });
      setLessons(map);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conditional</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Conditional grammatikasi bo'yicha quizlar.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-700">
        {QUIZ_IDS.map((q, idx) => {
          const lesson = lessons[q.id];
          const title = lesson?.title || q.fallback;
          return (
            <Link
              key={q.id}
              to="/student/lessons/$id"
              params={{ id: q.id }}
              className="flex items-center gap-4 px-4 py-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <p className="text-gray-900 dark:text-white font-medium truncate">{title}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {loading ? "Yuklanmoqda…" : `Quiz · ${lesson?.duration_minutes ?? 10} min`}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500 flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ConditionalPage;
