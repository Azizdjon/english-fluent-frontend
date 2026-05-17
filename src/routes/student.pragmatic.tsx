import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Play } from "lucide-react";
import { toast } from "sonner";

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

function PragmaticDialogues() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">Pragmatic Dialogues</Badge>
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
                <Badge variant={s.level === "C1" ? "default" : "secondary"}>{s.level}</Badge>
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
                  onClick={() => toast.success(`Starting practice: ${s.title}`)}
                >
                  <Play className="w-4 h-4" /> Practice
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
