import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/student/test')({
  component: DiagnosticTest,
});

const questions = [
  { q: 'She _____ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1 },
  { q: 'They _____ football when it started to rain.', options: ['play', 'played', 'were playing', 'have played'], answer: 2 },
  { q: 'I _____ never been to Paris.', options: ['have', 'had', 'has', 'am'], answer: 0 },
  { q: 'By the time she arrived, we _____ dinner.', options: ['finish', 'finished', 'had finished', 'have finished'], answer: 2 },
  { q: 'He _____ here for 10 years when he retired.', options: ['works', 'worked', 'had been working', 'is working'], answer: 2 },
  { q: 'If I _____ you, I would apologize.', options: ['am', 'was', 'were', 'be'], answer: 2 },
  { q: 'The report _____ by the manager yesterday.', options: ['write', 'wrote', 'was written', 'has written'], answer: 2 },
  { q: 'She asked me what time _____.', options: ['it is', 'is it', 'it was', 'was it'], answer: 2 },
];

const getLevel = (score: number, total: number, t: (k: string) => string) => {
  const pct = (score / total) * 100;
  if (pct >= 88) return { level: 'C1', label: t('dash.sTest.advanced'), color: 'text-purple-600', desc: t('dash.sTest.descC1') };
  if (pct >= 75) return { level: 'B2', label: t('dash.sTest.upperInter'), color: 'text-blue-600', desc: t('dash.sTest.descB2') };
  if (pct >= 62) return { level: 'B1', label: t('dash.sTest.intermediate'), color: 'text-green-600', desc: t('dash.sTest.descB1') };
  if (pct >= 50) return { level: 'A2', label: t('dash.sTest.elementary'), color: 'text-yellow-600', desc: t('dash.sTest.descA2') };
  return { level: 'A1', label: t('dash.sTest.beginner'), color: 'text-red-500', desc: t('dash.sTest.descA1') };
};

function DiagnosticTest() {
  const { t } = useI18n();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const current = questions[idx];

  const next = () => {
    const newAnswers = [...answers, selected];
    if (idx + 1 === total) {
      setAnswers(newAnswers);
      setFinished(true);
    } else {
      setAnswers(newAnswers);
      setIdx(idx + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const score = answers.filter((a, i) => a === questions[i].answer).length;
    const { level, label, color, desc } = getLevel(score, total, t);
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1">{t("dash.sTest.completed")}</h1>
          <p className="text-gray-500 mb-6">{t("dash.sTest.resultsSub")}</p>

          <div className="bg-gray-700/40 rounded-xl p-6 mb-6">
            <div className={`text-5xl font-bold ${color} mb-1`}>{level}</div>
            <div className="text-lg font-semibold text-gray-700">{label}</div>
            <div className="mt-3 text-3xl font-bold">{score}/{total} <span className="text-base font-normal text-gray-500">{t("dash.sTest.correctSuffix")} ({pct}%)</span></div>
          </div>

          <div className="mb-6">
            <Progress value={pct} className="h-3 mb-2" />
          </div>

          <p className="text-gray-600 mb-6 text-sm leading-relaxed">{desc}</p>

          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {questions.map((q, i) => (
              <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${answers[i] === q.answer ? 'bg-green-50' : 'bg-red-50'}`}>
                {answers[i] === q.answer
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                <span className={`truncate ${answers[i] === q.answer ? 'text-green-400' : 'text-red-400'}`}>Q{i+1}: {answers[i] === q.answer ? t('dash.sTest.qCorrect') : t('dash.sTest.qWrong')}</span>
              </div>
            ))}
          </div>

          <Button onClick={restart} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {t("dash.sTest.retake")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400 font-medium">{t("dash.sTest.diagnostic")}</span>
          <span className="text-sm text-gray-400">{idx + 1} / {total}</span>
        </div>
        <Progress value={((idx + 1) / total) * 100} className="h-2 mb-6" />

        <h2 className="text-xl font-semibold mb-6">{current.q}</h2>

        <div className="space-y-3 mb-8">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                selected === i
                  ? 'border-blue-500 bg-blue-900/40 text-blue-300'
                  : 'border-gray-200 hover:border-gray-300 text-gray-300'
              }`}
            >
              <span className="mr-3 text-gray-400">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>

        <Button
          onClick={next}
          disabled={selected === null}
          size="lg"
          className="w-full"
        >
          {idx + 1 === total ? t('dash.sTest.finish') : t('dash.sTest.next')} →
        </Button>
      </div>
    </div>
  );
}
