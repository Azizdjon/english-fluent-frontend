import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  CheckCircle2, Clock, Circle, FileText, Calendar, BookOpen, Headphones, Mic, PenLine, Upload, Square, Play, Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface HomeworkTask {
  prompt?: string;
  maxMinutes?: number;
  id: string;
  title: string;
  type: "essay" | "quiz" | "recording" | "reading" | "worksheet";
  description: string;
  deadline: string;
  status: "pending" | "submitted" | "graded";
  grade?: string;
  subject: string;
}

const initialTasks: HomeworkTask[] = [
  {
    id: "hw-1",
    title: "Essay: My Future Career",
    type: "essay",
    description: "Write a 300-word essay describing your ideal career path, including required skills and education.",
    deadline: "Tomorrow, 11:59 PM",
    status: "pending",
    subject: "Writing",
  },
  {
    id: "hw-2",
    title: "Listening Quiz — Unit 5",
    type: "quiz",
    description: "Complete the listening comprehension quiz based on the business meeting audio track.",
    deadline: "Friday, 11:59 PM",
    status: "pending",
    subject: "Listening",
  },
  {
    id: "hw-3",
    title: "Speaking Recording: Daily Routine",
    type: "recording",
    description: "Record a 2-minute audio describing your typical daily routine using present simple and adverbs of frequency.",
    deadline: "Next Monday, 11:59 PM",
    status: "pending",
    subject: "Speaking",
  },
  {
    id: "hw-4",
    title: "Reading Comprehension — Climate Change",
    type: "reading",
    description: "Read the assigned article and answer 10 comprehension questions. Focus on identifying main ideas.",
    deadline: "Last Wednesday",
    status: "submitted",
    subject: "Reading",
  },
  {
    id: "hw-5",
    title: "Grammar Worksheet — Conditionals",
    type: "worksheet",
    description: "Complete the mixed conditionals worksheet (Exercises A–D). Check your answers with the key.",
    deadline: "Last Friday",
    status: "graded",
    grade: "B+",
    subject: "Grammar",
  },
];

const typeIcon: Record<HomeworkTask["type"], typeof FileText> = {
  essay: PenLine,
  quiz: BookOpen,
  recording: Mic,
  reading: FileText,
  worksheet: Headphones,
};

const typeColor: Record<HomeworkTask["type"], string> = {
  essay: "bg-amber-100 text-amber-700",
  quiz: "bg-indigo-100 text-indigo-700",
  recording: "bg-rose-100 text-rose-700",
  reading: "bg-emerald-100 text-emerald-700",
  worksheet: "bg-cyan-100 text-cyan-700",
};

export const Route = createFileRoute("/student/homework")({
  component: HomeworkPage,
});

function HomeworkPage() {
  const [tasks, setTasks] = useState<HomeworkTask[]>(initialTasks);

  const pending = tasks.filter((t) => t.status === "pending");
  const submitted = tasks.filter((t) => t.status === "submitted");
  const graded = tasks.filter((t) => t.status === "graded");
  const completionRate = Math.round(
    ((submitted.length + graded.length) / tasks.length) * 100
  );

  function markSubmitted(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "submitted" as const } : t))
    );
    toast.success("Marked as submitted. Great work!");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Homework</h1>
        <p className="text-muted-foreground mt-1">
          Track your assignments, meet deadlines, and review feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <Card className="p-5">
          <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
          <div className="text-3xl font-bold">{tasks.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-muted-foreground mb-1">Pending</div>
          <div className="text-3xl font-bold text-amber-600">{pending.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-muted-foreground mb-1">Submitted</div>
          <div className="text-3xl font-bold text-indigo-600">{submitted.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-muted-foreground mb-1">Graded</div>
          <div className="text-3xl font-bold text-emerald-600">{graded.length}</div>
        </Card>
      </div>

      <Card className="p-6 mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Completion rate</span>
          <span className="text-sm font-bold">{completionRate}%</span>
        </div>
        <Progress value={completionRate} className="h-2" />
      </Card>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-semibold">Pending Assignments</h2>
          <Badge variant="secondary" className="ml-2">{pending.length}</Badge>
        </div>
        {pending.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
            <p className="font-medium">All caught up!</p>
            <p className="text-sm">You have no pending assignments.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pending.map((task) => {
              const Icon = typeIcon[task.type];
              return (
                <Card key={task.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${typeColor[task.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge variant="outline">{task.subject}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Due {task.deadline}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => markSubmitted(task.id)}>
                      <CheckCircle2 className="w-4 h-4" />
                      Submit
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {submitted.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Circle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold">Submitted</h2>
            <Badge variant="secondary" className="ml-2">{submitted.length}</Badge>
          </div>
          <div className="space-y-4">
            {submitted.map((task) => {
              const Icon = typeIcon[task.type];
              return (
                <Card key={task.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 opacity-80">
                  <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${typeColor[task.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge variant="outline">{task.subject}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Submitted on time
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Submitted</Badge>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {graded.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-semibold">Graded</h2>
            <Badge variant="secondary" className="ml-2">{graded.length}</Badge>
          </div>
          <div className="space-y-4">
            {graded.map((task) => {
              const Icon = typeIcon[task.type];
              return (
                <Card key={task.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 opacity-80">
                  <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center ${typeColor[task.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge variant="outline">{task.subject}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      Grade: {task.grade}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
