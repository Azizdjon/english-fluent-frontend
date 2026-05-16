import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { quizQuestions } from "@/lib/mock-data";

export const Route = createFileRoute("/student/test")({
  component: DiagnosticTest,
});

function DiagnosticTest() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const total = quizQuestions.length;
  const q = quizQuestions[idx];
  const progress = ((idx + (selected !== null ? 1 : 0)) / total) * 100;

  const next = () => {
    if (selected === null) return;
    const newAns = [...answers, selected];
    setAnswers(newAns);
    setSelected(null);
    if (idx + 1 >= total) setDone(true);
    else setIdx(idx + 1);
  };

  if (done) {
    const correct = answers.filter((a, i) => a === quizQuestions[i].correct).length;
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-success/15 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Test complete!</h1>
          <p className="text-muted-foreground mb-6">Here's your diagnostic result</p>
          <div className="text-6xl font-bold text-primary mb-2">{correct}/{total}</div>
          <div className="text-lg text-muted-foreground mb-6">{pct}% correct</div>
          <Badge className="mb-8">Recommended level: B2 — Upper Intermediate</Badge>
          <div>
            <Button onClick={() => { setIdx(0); setAnswers([]); setDone(false); }}>Retake test</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Badge variant="secondary">Diagnostic Test</Badge>
          <h1 className="text-2xl font-bold mt-2">Placement assessment</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          12:34 remaining
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Question {idx + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-semibold mb-6 leading-relaxed">{q.q}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selected === i
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                  selected === i ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span>{opt}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Button onClick={next} disabled={selected === null} size="lg">
            {idx + 1 === total ? "Finish" : "Next question"} →
          </Button>
        </div>
      </Card>
    </div>
  );
}
