import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/student/grammar/conditional")({
  component: ConditionalPage,
});

const LESSON_IDS = [
  { id: 'cccccccc-0120-0001-0000-000000000001', title: '3rd Conditional' },
  { id: 'cccccccc-0121-0001-0000-000000000001', title: 'Mixed Conditionals 1' },
  { id: 'cccccccc-0122-0001-0000-000000000001', title: 'Mixed Conditionals 2' },
];

function parseQuestions(content: string) {
  if (!content) return [];
  const cleaned = content.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  const parts = cleaned.split(/(?=\d+\s+Choose|(?<=\w)\s+\d+\s+Choose)/);
  const questions: { question: string; options: string[] }[] = [];
  for (const part of parts) {
    const optMatch = part.match(/^(\d+\s+.+?)\s+A\)(.+?)B\)(.+?)C\)(.+?)D\)(.+?)(?:E\)(.+?))?$/);
    if (optMatch) {
      questions.push({
        question: optMatch[1].replace(/^\d+\s+/, '').trim(),
        options: [optMatch[2], optMatch[3], optMatch[4], optMatch[5], optMatch[6]].filter(Boolean).map(o => o.trim()),
      });
    }
  }
  return questions;
}

function ConditionalPage() {
  const [selected, setSelected] = useState<null | typeof LESSON_IDS[0]>(null);
  const [questions, setQuestions] = useState<{ question: string; options: string[] }[]>([]);
  const [answerKey, setAnswerKey] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const startLesson = async (lesson: typeof LESSON_IDS[0]) => {
    setLoading(true);
    const { data } = await supabase.from('lessons').select('content, answers').eq('id', lesson.id).single();
    const parsed = parseQuestions(data?.content || '');
    setQuestions(parsed);
    setAnswerKey((data?.answers as Record<string, string>) || {});
    setSelected(lesson);
    setCurrent(0);
    setAnswers([]);
    setFinished(false);
    setLoading(false);
  };

  const selectOption = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else setFinished(true);
  };

  const LABELS = ['A', 'B', 'C', 'D', 'E'];

  if (!selected) {
    return (
      <div className="p-4 md:p-6 max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conditional</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Conditional grammatikasi bo'yicha quizlar.</p>
        </div>

        <div className="grid gap-4 max-w-md">
          {LESSON_IDS.map((l, i) => (
            <button key={l.id} onClick={() => startLesson(l)}
              className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all text-left shadow-sm">
              <span className="text-2xl font-bold text-gray-400 dark:text-slate-500">{i + 1}</span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{l.title}</div>
                <div className="text-sm text-gray-500 dark:text-slate-400">Quiz · 5 min</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><p className="text-gray-500 dark:text-slate-400">Yuklanmoqda...</p></div>;

  if (finished) {
    const hasKey = Object.keys(answerKey).length > 0;
    let correctCount = 0;
    if (hasKey) {
      questions.forEach((_, i) => {
        const userLetter = answers[i] !== undefined ? LABELS[answers[i]] : null;
        const correct = answerKey[String(i + 1)];
        if (userLetter && correct && userLetter.toUpperCase() === String(correct).toUpperCase()) correctCount++;
      });
    }
    const pct = hasKey ? Math.round((correctCount / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 5 : pct >= 75 ? 4 : pct >= 60 ? 3 : pct >= 40 ? 2 : 1;

    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-gray-200 dark:border-slate-700">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Bajarildi!</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-4">{selected.title} testini tugatdingiz.</p>
          {hasKey ? (
            <>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Natija: {correctCount} / {questions.length} ({pct}%)
              </p>
              <p className="text-2xl mb-6">{'⭐'.repeat(stars)}</p>
            </>
          ) : (
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {answers.filter(a => a !== undefined).length} ta savoldan o'tdingiz
            </p>
          )}
          <Button onClick={() => setSelected(null)} className="w-full">Boshqa testni tanlash</Button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return <div className="flex items-center justify-center min-h-[50vh]"><p className="text-gray-500 dark:text-slate-400">Savollar topilmadi.</p></div>;
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2 text-sm text-gray-500 dark:text-slate-400 font-medium">
          <span>{selected.title}</span>
          <span>{current + 1} / {questions.length}</span>
        </div>
        <Progress value={progress} className="mb-6 h-2" />
        <p className="text-lg font-medium mb-6 text-gray-900 dark:text-white">{q.question}</p>
        <div className="grid gap-3 mb-6">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => selectOption(i)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all font-medium ${answers[current] === i ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-700 dark:text-slate-300'}`}>
              <span className="font-bold w-6 text-gray-400 dark:text-slate-500">{LABELS[i]}.</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
        <Button onClick={next} disabled={answers[current] === undefined} className="w-full">
          {current < questions.length - 1 ? 'Next Question →' : 'Finish →'}
        </Button>
      </div>
    </div>
  );
}

export default ConditionalPage;
