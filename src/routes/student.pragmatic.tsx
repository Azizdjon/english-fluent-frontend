import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Play, CheckCircle, XCircle, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/student/pragmatic")({
  component: PragmaticDialogues,
});

type Scenario = {
  id: string;
  title: string;
  level: "B2" | "C1";
  context: string;
  lines: { speaker: "A" | "B"; text: string }[];
};

const scenarios: Scenario[] = [
  {
    id: "job-interview",
    title: "Job Interview",
    level: "B2",
    context: "A candidate interviews for a marketing role.",
    lines: [
      { speaker: "A", text: "Thanks for coming in today. Could you start by telling me about yourself?" },
      { speaker: "B", text: "Of course. I'm a marketing graduate with three years of experience in digital campaigns." },
      { speaker: "A", text: "What attracted you to this position specifically?" },
      { speaker: "B", text: "Your company's focus on sustainable brands really aligns with my values." },
      { speaker: "A", text: "Can you describe a challenging project you led?" },
      { speaker: "B", text: "I managed a rebranding campaign that increased engagement by 40 percent." },
      { speaker: "A", text: "How do you handle tight deadlines?" },
      { speaker: "B", text: "I prioritize tasks and communicate early with stakeholders if scope changes." },
      { speaker: "A", text: "Where do you see yourself in five years?" },
      { speaker: "B", text: "Leading a creative team while continuing to develop strategic skills." },
      { speaker: "A", text: "Great. Do you have any questions for us?" },
      { speaker: "B", text: "Yes, what does success look like in this role after the first year?" },
    ],
  },
  {
    id: "academic-presentation",
    title: "Academic Presentation",
    level: "C1",
    context: "A student presents research findings to a professor.",
    lines: [
      { speaker: "A", text: "Good morning. Today I'll be presenting my findings on renewable energy adoption." },
      { speaker: "B", text: "Please proceed. I'm interested in your methodology." },
      { speaker: "A", text: "I conducted a mixed-methods study across twelve European countries." },
      { speaker: "B", text: "What were the key variables you controlled for?" },
      { speaker: "A", text: "GDP per capita, policy incentives, and existing infrastructure." },
      { speaker: "B", text: "Interesting. How did you account for cultural attitudes toward sustainability?" },
      { speaker: "A", text: "I incorporated survey data from a previous longitudinal study." },
      { speaker: "B", text: "And what were the most surprising findings?" },
      { speaker: "A", text: "Policy stability mattered more than the size of subsidies." },
      { speaker: "B", text: "That's a compelling conclusion. How might this influence future research?" },
      { speaker: "A", text: "It suggests we should examine long-term governance frameworks more closely." },
      { speaker: "B", text: "Excellent work. I look forward to reading the full paper." },
    ],
  },
  {
    id: "doctor-appointment",
    title: "Doctor Appointment",
    level: "B2",
    context: "A patient describes symptoms to their doctor.",
    lines: [
      { speaker: "A", text: "Good afternoon. What brings you in today?" },
      { speaker: "B", text: "I've been having persistent headaches for the past two weeks." },
      { speaker: "A", text: "Can you describe the pain? Is it sharp or dull?" },
      { speaker: "B", text: "It's more of a dull pressure, mostly around my temples." },
      { speaker: "A", text: "How often do they occur, and at what time of day?" },
      { speaker: "B", text: "Almost daily, usually in the afternoon after work." },
      { speaker: "A", text: "Have you noticed any triggers, like screens or stress?" },
      { speaker: "B", text: "Now that you mention it, they're worse after long meetings." },
      { speaker: "A", text: "Are you sleeping well and staying hydrated?" },
      { speaker: "B", text: "Honestly, my sleep has been irregular lately." },
      { speaker: "A", text: "Let's start with some lifestyle adjustments and a basic blood test." },
      { speaker: "B", text: "That sounds reasonable. Thank you, doctor." },
    ],
  },
  {
    id: "university-admission",
    title: "University Admission",
    level: "B2",
    context: "A prospective student speaks with an admissions officer.",
    lines: [
      { speaker: "A", text: "Welcome. How can I help you with your application today?" },
      { speaker: "B", text: "I'd like to know more about the international business programme." },
      { speaker: "A", text: "It's a three-year degree with an optional year abroad." },
      { speaker: "B", text: "What are the typical entry requirements?" },
      { speaker: "A", text: "We look for strong grades and a B2 English certification." },
      { speaker: "B", text: "I have an IELTS score of 6.5. Would that qualify?" },
      { speaker: "A", text: "Yes, that meets our minimum requirement." },
      { speaker: "B", text: "Are there scholarships available for international students?" },
      { speaker: "A", text: "Several, based on academic merit and financial need." },
      { speaker: "B", text: "When is the application deadline for next September?" },
      { speaker: "A", text: "Applications close on the fifteenth of January." },
      { speaker: "B", text: "Perfect. I'll prepare my documents this month." },
    ],
  },
  {
    id: "business-meeting",
    title: "Business Meeting",
    level: "C1",
    context: "Two colleagues discuss a quarterly strategy.",
    lines: [
      { speaker: "A", text: "Let's review where we stand on the Q3 targets." },
      { speaker: "B", text: "Revenue is up twelve percent, but customer acquisition has slowed." },
      { speaker: "A", text: "Do we have a sense of what's driving that slowdown?" },
      { speaker: "B", text: "Competition has intensified, particularly in the SMB segment." },
      { speaker: "A", text: "Should we reallocate budget toward retention instead?" },
      { speaker: "B", text: "I'd recommend a balanced approach with a slight retention tilt." },
      { speaker: "A", text: "What kind of timeline are we looking at for impact?" },
      { speaker: "B", text: "Realistically, we'd see results by the end of Q4." },
      { speaker: "A", text: "Let's draft a proposal for the leadership team this Friday." },
      { speaker: "B", text: "I'll prepare the data, and you can handle the narrative?" },
      { speaker: "A", text: "Agreed. Let's regroup Thursday morning to align." },
      { speaker: "B", text: "Sounds good. I'll send a calendar invite this afternoon." },
    ],
  },
  {
    id: "classroom-discussion",
    title: "Classroom Discussion",
    level: "B2",
    context: "A teacher leads a discussion about climate change.",
    lines: [
      { speaker: "A", text: "Today we're discussing the impact of climate change on cities." },
      { speaker: "B", text: "I read that coastal cities are especially vulnerable to flooding." },
      { speaker: "A", text: "That's right. What measures can governments take?" },
      { speaker: "B", text: "Building sea walls and improving drainage systems would help." },
      { speaker: "A", text: "Good. What about individual actions citizens can take?" },
      { speaker: "B", text: "Using public transport and reducing energy consumption at home." },
      { speaker: "A", text: "Do you think these actions make a real difference?" },
      { speaker: "B", text: "Individually small, but collectively they add up significantly." },
      { speaker: "A", text: "How could schools educate younger generations better?" },
      { speaker: "B", text: "Through hands-on projects rather than just textbook learning." },
      { speaker: "A", text: "Excellent point. Let's explore that idea further next class." },
      { speaker: "B", text: "I'd love to research a few examples to share." },
    ],
  },
];

function similarity(a: string, b: string): number {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  const wa = new Set(na.split(/\s+/).filter(Boolean));
  const wb = new Set(nb.split(/\s+/).filter(Boolean));
  let common = 0;
  wa.forEach((w) => { if (wb.has(w)) common++; });
  return common / Math.max(wa.size, wb.size, 1);
}

type PracticeAnswer = {
  userAnswer: string;
  correct: string;
  isCorrect: boolean | null;
};

type PracticeState = {
  scenarioId: string;
  step: number;
  answers: PracticeAnswer[];
  finished: boolean;
};

function PracticeMode({
  scenario,
  onExit,
}: {
  scenario: Scenario;
  onExit: () => void;
}) {
  const bLines = scenario.lines.filter((l) => l.speaker === "B");

  const [state, setState] = useState<PracticeState>({
    scenarioId: scenario.id,
    step: 0,
    answers: bLines.map((l) => ({ userAnswer: "", correct: l.text, isCorrect: null })),
    finished: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [checked, setChecked] = useState(false);

  const checkAnswer = () => {
    if (checked) return;
    const score = similarity(inputValue, state.answers[state.step].correct);
    const isCorrect = score >= 0.55;
    const newAnswers = [...state.answers];
    newAnswers[state.step] = { ...newAnswers[state.step], userAnswer: inputValue, isCorrect };
    setState({ ...state, answers: newAnswers });
    setChecked(true);
  };

  const nextStep = () => {
    if (state.step + 1 >= bLines.length) {
      setState({ ...state, finished: true });
    } else {
      setState({ ...state, step: state.step + 1 });
      setInputValue("");
      setChecked(false);
    }
  };

  if (state.finished) {
    const correct = state.answers.filter((a) => a.isCorrect).length;
    const total = state.answers.length;
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div
            className={`text-6xl font-bold mb-2 ${
              pct >= 70 ? "text-green-400" : pct >= 40 ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {pct}%
          </div>
          <div className="text-xl font-semibold mb-1">
            {correct}/{total} to'g'ri
          </div>
          <p className="text-muted-foreground">
            {scenario.title} — {scenario.level}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {state.answers.map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                a.isCorrect
                  ? "border-green-600 bg-green-900/20"
                  : "border-red-600 bg-red-900/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {a.isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="text-sm text-gray-300">
                  {a.userAnswer || <em className="text-gray-500">bo'sh qoldirildi</em>}
                </span>
              </div>
              {!a.isCorrect && (
                <p className="text-sm text-green-400 mt-1 pl-6">
                  ✓ {a.correct}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setState({
                scenarioId: scenario.id,
                step: 0,
                answers: bLines.map((l) => ({ userAnswer: "", correct: l.text, isCorrect: null })),
                finished: false,
              });
              setInputValue("");
              setChecked(false);
            }}
          >
            Qayta urinish
          </Button>
          <Button className="flex-1" onClick={onExit}>
            Boshqa dialog
          </Button>
        </div>
      </div>
    );
  }

  let bCount = 0;
  const displayLines: {
    speaker: "A" | "B";
    text: string;
    type: "show" | "done" | "current";
    index?: number;
  }[] = [];

  for (const line of scenario.lines) {
    if (line.speaker === "A") {
      displayLines.push({ ...line, type: "show" });
    } else {
      if (bCount < state.step) {
        displayLines.push({ ...line, type: "done", index: bCount });
      } else if (bCount === state.step) {
        displayLines.push({ ...line, type: "current" });
        break;
      }
      bCount++;
    }
  }

  const currentAnswer = state.answers[state.step];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={scenario.level === "C1" ? "default" : "secondary"}>
              {scenario.level}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {state.step + 1} / {bLines.length}
            </span>
          </div>
          <h2 className="text-2xl font-bold">{scenario.title}</h2>
          <p className="text-muted-foreground text-sm">{scenario.context}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>
          ✕ Chiqish
        </Button>
      </div>

      <div className="space-y-3 mb-6 p-4 rounded-lg bg-muted/30 border border-border">
        {displayLines.map((line, i) => {
          const isB = line.speaker === "B";

          if (line.type === "show") {
            return (
              <div key={i} className={`flex gap-2 text-sm ${isB ? "flex-row-reverse" : ""}`}>
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isB
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {line.speaker}
                </span>
                <span className="flex-1 leading-relaxed">{line.text}</span>
              </div>
            );
          }

          if (line.type === "done" && line.index !== undefined) {
            const ans = state.answers[line.index];
            return (
              <div key={i} className="flex gap-2 text-sm flex-row-reverse">
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-secondary text-secondary-foreground">
                  B
                </span>
                <span
                  className={`flex-1 leading-relaxed text-right ${
                    ans.isCorrect ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {ans.userAnswer || <em className="opacity-50">bo'sh</em>}
                </span>
              </div>
            );
          }

          if (line.type === "current") {
            return (
              <div key={i} className="flex gap-2 text-sm flex-row-reverse">
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-secondary text-secondary-foreground">
                  B
                </span>
                <div className="flex-1">
                  {checked ? (
                    <div
                      className={`p-3 rounded-lg border ${
                        currentAnswer.isCorrect
                          ? "border-green-600 bg-green-900/20"
                          : "border-red-600 bg-red-900/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {currentAnswer.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span className="text-sm">{currentAnswer.userAnswer}</span>
                      </div>
                      {!currentAnswer.isCorrect && (
                        <p className="text-xs text-green-400 mt-1 pl-6">
                          ✓ {currentAnswer.correct}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-primary/50 rounded-lg p-3 bg-primary/5">
                      <p className="text-xs text-muted-foreground mb-2">
                        Sizning javobingiz (B):
                      </p>
                      <textarea
                        className="w-full bg-transparent outline-none resize-none text-sm placeholder-gray-500"
                        rows={2}
                        placeholder="Bu yerga javobingizni yozing..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (inputValue.trim()) checkAnswer();
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="flex gap-3">
        {!checked ? (
          <Button
            className="w-full"
            onClick={checkAnswer}
            disabled={!inputValue.trim()}
          >
            Tekshirish
          </Button>
        ) : (
          <Button className="w-full" onClick={nextStep}>
            {state.step + 1 >= bLines.length ? "Natijani ko'rish" : "Keyingisi"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

function PragmaticDialogues() {
  const [active, setActive] = useState<string | null>(null);
  const [practiceScenario, setPracticeScenario] = useState<Scenario | null>(null);

  if (practiceScenario) {
    return (
      <PracticeMode
        scenario={practiceScenario}
        onExit={() => setPracticeScenario(null)}
      />
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">
          Pragmatic Dialogues
        </Badge>
        <h1 className="text-3xl font-bold">Real-world conversation practice</h1>
        <p className="text-muted-foreground mt-1">
          Practice authentic dialogues from everyday and professional contexts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarios.map((s) => {
          const isActive = active === s.id;
          return (
            <Card key={s.id} className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{s.title}</h3>
                    <p className="text-xs text-muted-foreground">{s.context}</p>
                  </div>
                </div>
                <Badge variant={s.level === "C1" ? "default" : "secondary"}>
                  {s.level}
                </Badge>
              </div>

              {isActive && (
                <div className="space-y-2 my-4 p-4 rounded-lg bg-muted/40 border border-border max-h-72 overflow-y-auto">
                  {s.lines.map((line, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 text-sm ${
                        line.speaker === "A" ? "" : "flex-row-reverse text-right"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          line.speaker === "A"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {line.speaker}
                      </span>
                      <span className="flex-1 leading-relaxed">{line.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActive(isActive ? null : s.id)}
                >
                  {isActive ? "Hide dialogue" : "View dialogue"}
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setPracticeScenario(s)}
                >
                  <Play className="w-4 h-4 mr-1" /> Practice
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
