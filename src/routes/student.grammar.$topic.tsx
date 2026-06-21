// Universal grammar topic page — xuddi Conditional kabi quiz UI + HistoryPanel
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/student/grammar/$topic")({
  component: GrammarTopicPage,
});

const TOPIC_CONFIG: Record<string, { label: string; lessonIds: string[] }> = {
  "simple-present-tense": { label: "Simple Present Tense", lessonIds: ["cccccccc-0100-0001-0000-000000000001"] },
  "present-continuous-tense": { label: "Present Continuous Tense", lessonIds: ["cccccccc-0101-0001-0000-000000000001"] },
  "present-tenses": { label: "Present Tenses", lessonIds: ["cccccccc-0102-0001-0000-000000000001"] },
  "simple-past-tense": { label: "Simple Past Tense", lessonIds: ["cccccccc-0103-0001-0000-000000000001"] },
  "past-continuous-tense": { label: "Past Continuous Tense", lessonIds: ["cccccccc-0104-0001-0000-000000000001"] },
  "past-continuous-tenses": { label: "Past Continuous Tenses", lessonIds: ["cccccccc-0105-0001-0000-000000000001"] },
  "past-tenses": { label: "Past Tenses", lessonIds: ["cccccccc-0106-0001-0000-000000000001"] },
  "simple-future-tense": { label: "Simple Future Tense", lessonIds: ["cccccccc-0107-0001-0000-000000000001"] },
  "future-tense": { label: "Future Tense", lessonIds: ["cccccccc-0108-0001-0000-000000000001"] },
  "future-continuous-tense": { label: "Future Continuous Tense", lessonIds: ["cccccccc-0109-0001-0000-000000000001"] },
  "future-perfect-tense": { label: "Future Perfect Tense", lessonIds: ["cccccccc-0110-0001-0000-000000000001"] },
  "future-in-past": { label: "Future in Past", lessonIds: ["cccccccc-0111-0001-0000-000000000001"] },
  "present-perfect-tense": { label: "Present Perfect Tense", lessonIds: ["cccccccc-0112-0001-0000-000000000001"] },
  "present-perfect-continuous": { label: "Present Perfect Continuous Tense", lessonIds: ["cccccccc-0113-0001-0000-000000000001"] },
  "present-perfect-continuous-2": { label: "Present Perfect Continuous 2", lessonIds: ["cccccccc-0114-0001-0000-000000000001"] },
  "past-perfect-tense": { label: "Past Perfect Tense", lessonIds: ["cccccccc-0115-0001-0000-000000000001"] },
  "past-perfect-continuous": { label: "Past Perfect Continuous Tense", lessonIds: ["cccccccc-0116-0001-0000-000000000001"] },
  "mixed-tenses": { label: "Mixed Tenses", lessonIds: ["cccccccc-0117-0001-0000-000000000001"] },
  "1st-conditional": { label: "1st Conditional", lessonIds: ["cccccccc-0118-0001-0000-000000000001"] },
  "2nd-conditional": { label: "2nd Conditional", lessonIds: ["cccccccc-0119-0001-0000-000000000001"] },
  "personal-pronouns": { label: "Personal Pronouns", lessonIds: ["cccccccc-0123-0001-0000-000000000001"] },
  "possessive-pronouns": { label: "Possessive Pronouns", lessonIds: ["cccccccc-0124-0001-0000-000000000001"] },
  "possessive-adjectives": { label: "Possessive Adjectives", lessonIds: ["cccccccc-0125-0001-0000-000000000001"] },
  "reflective-pronouns": { label: "Reflective Pronouns", lessonIds: ["cccccccc-0126-0001-0000-000000000001"] },
  "relative-pronouns": { label: "Relative Pronouns", lessonIds: ["cccccccc-0127-0001-0000-000000000001"] },
  "reciprocal-pronouns": { label: "Reciprocal Pronouns", lessonIds: ["cccccccc-0128-0001-0000-000000000001"] },
  "objective-pronouns": { label: "Objective Pronouns", lessonIds: ["cccccccc-0129-0001-0000-000000000001"] },
  "pronouns": { label: "Pronouns", lessonIds: ["cccccccc-0130-0001-0000-000000000001"] },
  "articles": { label: "Articles", lessonIds: ["cccccccc-0131-0001-0000-000000000001"] },
  "prepositions": { label: "Prepositions", lessonIds: ["cccccccc-0132-0001-0000-000000000001"] },
  "modal-verbs": { label: "Modal Verbs", lessonIds: ["cccccccc-0133-0001-0000-000000000001"] },
  "gerund": { label: "Gerund", lessonIds: ["cccccccc-0134-0001-0000-000000000001"] },
  "phrasal-verbs": { label: "Phrasal Verbs", lessonIds: ["cccccccc-0135-0001-0000-000000000001"] },
  "causatives": { label: "Causatives", lessonIds: ["cccccccc-0136-0001-0000-000000000001"] },
  "indirect-speech": { label: "Indirect Speech", lessonIds: ["cccccccc-0137-0001-0000-000000000001"] },
  "reported-speech": { label: "Reported Speech", lessonIds: ["cccccccc-0138-0001-0000-000000000001"] },
  "passive-voice": { label: "Passive Voice", lessonIds: ["cccccccc-0139-0001-0000-000000000001"] },
  "infinitive-gerund": { label: "Participle & Infinitive Gerund", lessonIds: ["cccccccc-0140-0001-0000-000000000001"] },
  "adjectives": { label: "Adjectives", lessonIds: ["cccccccc-0141-0001-0000-000000000001"] },
  "adverbs": { label: "Adverbs", lessonIds: ["cccccccc-0142-0001-0000-000000000001"] },
  "comparative-adjectives": { label: "Comparative Adjectives", lessonIds: ["cccccccc-0143-0001-0000-000000000001"] },
  "superlative-adjectives": { label: "Superlative Adjectives", lessonIds: ["cccccccc-0144-0001-0000-000000000001"] },
  "conjunctions": { label: "Conjunctions", lessonIds: ["cccccccc-0145-0001-0000-000000000001"] },
  "question-tags": { label: "Question Tags", lessonIds: ["cccccccc-0146-0001-0000-000000000001"] },
  "additions-to-remarks": { label: "Additions to Remarks", lessonIds: ["cccccccc-0147-0001-0000-000000000001"] },
  "when-clause": { label: "When Clause", lessonIds: ["cccccccc-0148-0001-0000-000000000001"] },
  "while-clause": { label: "While Clause", lessonIds: ["cccccccc-0149-0001-0000-000000000001"] },
  "when-where-while": { label: "When Where While Clauses", lessonIds: ["cccccccc-0150-0001-0000-000000000001"] },
  "antonyms": { label: "Antonyms", lessonIds: ["cccccccc-0151-0001-0000-000000000001"] },
  "antonyms-2": { label: "Antonyms (2)", lessonIds: ["cccccccc-0152-0001-0000-000000000001"] },
  "proverbs": { label: "Proverbs", lessonIds: ["cccccccc-0153-0001-0000-000000000001"] },
  "logic-list": { label: "Logic List of Words", lessonIds: ["cccccccc-0154-0001-0000-000000000001"] },
  "logic-list-2": { label: "Logic List of Words (2)", lessonIds: ["cccccccc-0155-0001-0000-000000000001"] },
  "word-logically-out": { label: "Word Logically Out of the Group", lessonIds: ["cccccccc-0156-0001-0000-000000000001"] },
  "vocabulary-test-02": { label: "Vocabulary Test 02", lessonIds: ["cccccccc-0157-0001-0000-000000000001"] },
  "vocabulary-test-03": { label: "Vocabulary Test 03", lessonIds: ["cccccccc-0158-0001-0000-000000000001"] },
  "vocabulary-test-04": { label: "Vocabulary Test 04", lessonIds: ["cccccccc-0159-0001-0000-000000000001"] },
  "vocabulary-test-05": { label: "Vocabulary Test 05", lessonIds: ["cccccccc-0160-0001-0000-000000000001"] },
  "vocabulary-test-05ew": { label: "Vocabulary Test 05 (ew)", lessonIds: ["cccccccc-0161-0001-0000-000000000001"] },
  "vocabulary-test-06": { label: "Vocabulary Test 06", lessonIds: ["cccccccc-0162-0001-0000-000000000001"] },
  "vocabulary-test-07": { label: "Vocabulary Test 07", lessonIds: ["cccccccc-0163-0001-0000-000000000001"] },
  "vocabulary-test-08": { label: "Vocabulary Test 08", lessonIds: ["cccccccc-0164-0001-0000-000000000001"] },
  "vocabulary-test-09": { label: "Vocabulary Test 09", lessonIds: ["cccccccc-0165-0001-0000-000000000001"] },
  "vocabulary-test-10": { label: "Vocabulary Test 10", lessonIds: ["cccccccc-0166-0001-0000-000000000001"] },
  "there-is-there-are": { label: "There is / There are", lessonIds: ["cccccccc-0167-0001-0000-000000000001"] },
  "to-be-there-is-there-are": { label: "To be & There is/There are", lessonIds: ["cccccccc-0168-0001-0000-000000000001"] },
};

const LABELS = ['A', 'B', 'C', 'D', 'E'];

type Attempt = {
  lesson_id: string;
  score: number;
  total: number;
  created_at: string;
};

function starsFor(pct: number) {
  return pct >= 90 ? 5 : pct >= 70 ? 4 : pct >= 50 ? 3 : pct >= 30 ? 2 : 1;
}

function HistoryPanel({ attempts, lessonIds }: { attempts: Attempt[]; lessonIds: string[] }) {
  const filtered = attempts.filter(a => lessonIds.includes(a.lesson_id));
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📊 Natijalar Tarixi</h2>
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">Hali test topshirilmagan</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((a, i) => {
            const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
            const stars = starsFor(pct);
            const date = new Date(a.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
            return (
              <li key={i} className="border border-gray-100 dark:border-slate-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-slate-400">📅 {date}</div>
                <div className="text-sm text-gray-700 dark:text-slate-300 mt-1">✅ {a.score} / {a.total} ({pct}%)</div>
                <div className="text-yellow-400 text-sm mt-1">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

type Question = { question: string; options: string[]; answer?: string; };
type LessonItem = { id: string; title: string; questions: Question[]; answerKey: Record<string, string>; };

function parseQuestions(content: string): Question[] {
  if (!content) return [];
  const cleaned = content.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  const parts = cleaned.split(/(?=\d+\s+Choose|(?<=\w)\s+\d+\s+Choose)/);
  const questions: Question[] = [];
  for (const part of parts) {
    const m = part.match(/^(\d+\s+.+?)\s+A\)(.+?)B\)(.+?)C\)(.+?)D\)(.+?)(?:E\)(.+?))?$/);
    if (m) {
      questions.push({
        question: m[1].replace(/^\d+\s+/, '').trim(),
        options: [m[2], m[3], m[4], m[5], m[6]].filter(Boolean).map(o => o.trim()),
      });
    }
  }
  return questions;
}

function GrammarTopicPage() {
  const { topic } = Route.useParams();
  const navigate = useNavigate();
  const config = TOPIC_CONFIG[topic];

  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setUserId(data.session?.user?.id ?? null); });
  }, []);

  useEffect(() => {
    if (!config) return;
    const fetchLessons = async () => {
      setLoading(true);
      const { data } = await supabase.from('lessons').select('id, title, content, answers').in('id', config.lessonIds);
      if (data) {
        setLessons(data.map((l: any) => {
          let questions: Question[] = [];
          try {
            const parsed = typeof l.content === 'string' ? JSON.parse(l.content) : l.content;
            questions = Array.isArray(parsed) ? parsed : (parsed?.questions ?? []);
          } catch {
                      questions = parseQuestions(l.content || '');
          }
          if (!questions || questions.length === 0) {
            questions = typeof l.content === 'string' ? parseQuestions(l.content) : [];
          }
          const answerKey = (l.answers as Record<string, string>) || {};
          return { id: l.id, title: l.title, questions, answerKey };
        }));
      }
      setLoading(false);
    };
    fetchLessons();
  }, [topic, config]);

  useEffect(() => {
    if (!config || !userId) return;
    supabase.from('test_attempts').select('lesson_id, score, total, created_at').eq('user_id', userId).in('lesson_id', config.lessonIds).order('created_at', { ascending: false }).then(({ data }) => setAttempts((data as Attempt[]) ?? []));
  }, [topic, userId, finished, config]);

  const startLesson = (lesson: LessonItem) => { setActiveLesson(lesson); setCurrentQ(0); setSelected(null); setAnswers([]); setFinished(false); };

  const handleNext = useCallback(async () => {
    if (!activeLesson || selected === null) return;
    const q = activeLesson.questions[currentQ];
    const selectedIdx = q.options.indexOf(selected);
    const selectedLetter = selectedIdx >= 0 ? LABELS[selectedIdx] : null;
    const keyLetter = activeLesson.answerKey[String(currentQ + 1)];
    let correct = false;
    if (q.answer) correct = selected === q.answer;
    else if (keyLetter && selectedLetter) correct = keyLetter.toUpperCase() === selectedLetter.toUpperCase();
    const newAnswers = [...answers, correct];
    if (currentQ + 1 >= activeLesson.questions.length) {
      setAnswers(newAnswers); setFinished(true);
      const score = newAnswers.filter(Boolean).length;
      if (userId) await supabase.from('test_attempts').insert({ user_id: userId, lesson_id: activeLesson.id, score, total: activeLesson.questions.length, created_at: new Date().toISOString() });
    } else {
      setAnswers(newAnswers); setCurrentQ(prev => prev + 1); setSelected(null);
    }
  }, [activeLesson, selected, currentQ, answers, userId]);

  if (!config) return (
    <div className="p-8 text-center">
      <h2 className="text-xl text-red-500">Topic topilmadi: {topic}</h2>
      <Button onClick={() => navigate({ to: '/student' })} className="mt-4">Orqaga</Button>
    </div>
  );

  if (activeLesson) {
    if (finished) {
      const score = answers.filter(Boolean).length;
      const total = activeLesson.questions.length;
      const pct = total ? Math.round((score / total) * 100) : 0;
      const stars = starsFor(pct);
      return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
          <div className="bg-gray-900 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
            <p className="text-4xl font-extrabold text-green-400 mb-1">{pct}%</p>
            <p className="text-gray-400 mb-3">{score} / {total} to'g'ri</p>
            <div className="text-3xl text-yellow-400 mb-6">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => startLesson(activeLesson)}>🔄 Qayta</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setActiveLesson(null)}>📋 Ro'yxat</Button>
            </div>
          </div>
        </div>
      );
    }
    const q = activeLesson.questions[currentQ];
    const progress = activeLesson.questions.length ? (currentQ / activeLesson.questions.length) * 100 : 0;
    if (!q) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500">Bu darsda savollar yo'q</p>
          <Button onClick={() => setActiveLesson(null)} className="mt-4">Orqaga</Button>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setActiveLesson(null)} className="text-gray-400">✕</Button>
          <span className="font-semibold text-sm">{activeLesson.title}</span>
          <span className="ml-auto text-sm text-gray-400">{currentQ + 1} / {activeLesson.questions.length}</span>
        </div>
        <div className="px-4 py-2"><Progress value={progress} className="h-1 bg-gray-800" /></div>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <p className="text-lg font-medium mb-6 leading-relaxed">{q.question}</p>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setSelected(opt)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected === opt ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 hover:border-gray-500 bg-gray-900'}`}>
                  <span className="font-bold text-blue-400 mr-3">{LABELS[i]}</span>{opt}
                </button>
              ))}
            </div>
            <Button onClick={handleNext} disabled={selected === null} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {currentQ + 1 >= activeLesson.questions.length ? 'Tugatish' : 'Keyingi'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{config.label}</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-6">{config.label} bo'yicha quizlar</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid gap-4">
          {loading ? <p className="text-gray-500">Yuklanmoqda...</p> : lessons.length === 0 ? <p className="text-gray-500">Dars topilmadi</p> : (
            lessons.map((l, i) => (
              <button key={l.id} onClick={() => startLesson(l)} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-800 transition-all text-left shadow-sm">
                <span className="text-2xl font-bold text-gray-400 dark:text-slate-500">{i + 1}</span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{l.title}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Quiz · {l.questions.length > 0 ? l.questions.length + ' ta savol' : '5 min'}</div>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="lg:col-span-1"><HistoryPanel attempts={attempts} lessonIds={config.lessonIds} /></div>
      </div>
    </div>
  );
}
