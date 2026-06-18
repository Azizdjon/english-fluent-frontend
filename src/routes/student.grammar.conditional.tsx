import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, RotateCcw, FileQuestion, ChevronRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/student/grammar/conditional")({
  component: ConditionalPage,
});

const QUIZZES = [
  { id: "cccccccc-0120-0001-0000-000000000001", title: "3rd Conditional", expected: 45 },
  { id: "cccccccc-0121-0001-0000-000000000001", title: "Mixed Conditionals (Part 1)", expected: 14 },
  { id: "cccccccc-0122-0001-0000-000000000001", title: "Mixed Conditionals (Part 2)", expected: 14 },
];

interface QuizQuestion {
  num: number;
  text: string;
  options: { letter: string; text: string }[];
}

function parseQuiz(content: string): QuizQuestion[] {
  if (!content) return [];
  const text = content.replace(/\s+/g, " ").trim();
  const questionRegex = /(\d+)\s*[-.\):]?\s*([\s\S]*?)(?=\s\d+\s*[-.\):]?\s|\s*$)/g;
  const questions: QuizQuestion[] = [];
  let m: RegExpExecArray | null;
  while ((m = questionRegex.exec(text)) !== null) {
    const num = parseInt(m[1], 10);
    const body = m[2].trim();
    if (!body) continue;
    const firstOptIdx = body.search(/\b[A-E]\)/);
    let qText = body;
    const opts: { letter: string; text: string }[] = [];
    if (firstOptIdx >= 0) {
      qText = body.slice(0, firstOptIdx).trim().replace(/[\s:.-]+$/, "");
      const optPart = body.slice(firstOptIdx);
      const optRegex = /([A-E])\)\s*([\s\S]*?)(?=\s+[A-E]\)|$)/g;
      let om: RegExpExecArray | null;
      while ((om = optRegex.exec(optPart)) !== null) {
        const t = om[2].trim();
        if (t) opts.push({ letter: om[1], text: t });
      }
    }
    questions.push({ num, text: qText, options: opts });
  }
  return questions;
}

interface LessonRow {
  id: string;
  title: string;
  content: string | null;
  answers: Record<string, string> | null;
}

function ConditionalPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Record<string, LessonRow>>({});
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("lessons")
        .select("id,title,content,answers")
        .in("id", QUIZZES.map(q => q.id));
      const map: Record<string, LessonRow> = {};
      (data || []).forEach((l: any) => { map[l.id] = l; });
      setLessons(map);
      setLoadingList(false);
    })();
  }, []);

  if (selectedId && lessons[selectedId]) {
    return (
      <QuizRunner
        lesson={lessons[selectedId]}
        onExit={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conditional</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Quizni boshlash uchun darsni tanlang.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-700">
        {QUIZZES.map((q, idx) => {
          const lesson = lessons[q.id];
          const title = lesson?.title || q.title;
          const ready = !!lesson;
          return (
            <button
              key={q.id}
              disabled={!ready}
              onClick={() => setSelectedId(q.id)}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left first:rounded-t-xl last:rounded-b-xl"
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
                  {loadingList ? "Yuklanmoqda…" : `Quiz · ${q.expected} savol`}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizRunner({ lesson, onExit }: { lesson: LessonRow; onExit: () => void }) {
  const questions = parseQuiz(lesson.content || "");
  const total = questions.length;
  const answers_key = lesson.answers || {};

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [finished, setFinished] = useState(false);

  if (total === 0) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Button variant="outline" onClick={onExit} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Orqaga
        </Button>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center">
          <p className="text-gray-600 dark:text-slate-300">Savollar topilmadi.</p>
        </div>
      </div>
    );
  }

  const current = questions[idx];

  const next = () => {
    const updated = [...userAnswers, selected];
    if (idx + 1 === total) {
      setUserAnswers(updated);
      setFinished(true);
    } else {
      setUserAnswers(updated);
      setIdx(idx + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setUserAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const score = userAnswers.filter((a, i) => {
      const correct = answers_key[String(questions[i].num)];
      return correct && a && a.toUpperCase() === correct.toUpperCase();
    }).length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Test Completed!</h1>
          <p className="text-gray-500 dark:text-slate-400 mb-6">{lesson.title}</p>

          <div className="bg-gray-100 dark:bg-slate-700/40 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-1">{pct}%</div>
            <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
              {score}/{total}{" "}
              <span className="text-base font-normal text-gray-500 dark:text-slate-400">correct</span>
            </div>
          </div>

          <div className="mb-6">
            <Progress value={pct} className="h-3 mb-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6 text-sm max-h-64 overflow-auto">
            {questions.map((q, i) => {
              const correct = answers_key[String(q.num)];
              const isCorrect = correct && userAnswers[i] && userAnswers[i]!.toUpperCase() === correct.toUpperCase();
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className={`truncate ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                    Q{q.num}: {isCorrect ? "Correct" : "Wrong"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={restart} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" /> Retake Test
            </Button>
            <Button onClick={onExit} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to list
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Button variant="ghost" onClick={onExit} className="mb-4 gap-2">
        <ArrowLeft className="w-4 h-4" /> Exit
      </Button>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">{lesson.title}</span>
          <span className="text-sm text-gray-500 dark:text-slate-400">{idx + 1} / {total}</span>
        </div>
        <Progress value={((idx + 1) / total) * 100} className="h-2 mb-6" />

        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">{current.text}</h2>

        <div className="space-y-3 mb-8">
          {current.options.map((opt) => (
            <button
              key={opt.letter}
              onClick={() => setSelected(opt.letter)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                selected === opt.letter
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-700 dark:text-slate-300"
              }`}
            >
              <span className="mr-3 text-gray-400 dark:text-slate-500">{opt.letter}.</span>
              {opt.text}
            </button>
          ))}
        </div>

        <Button
          onClick={next}
          disabled={selected === null}
          size="lg"
          className="w-full"
        >
          {idx + 1 === total ? "Finish & See Results" : "Next Question"} →
        </Button>
      </div>
    </div>
  );
}

export default ConditionalPage;
