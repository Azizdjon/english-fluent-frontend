import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { mockHomework } from "@/lib/mock-data";
import { Plus, FileText, MessageSquare, Mic } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/homework")({
  component: Homework,
});

type AssignmentType = "essay" | "quiz" | "speaking" | "reading" | "worksheet";

function Homework() {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState<AssignmentType>("essay");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [maxDuration, setMaxDuration] = useState("2");
  const [open, setOpen] = useState(false);

  function resetForm() {
    setType("essay");
    setTitle("");
    setPrompt("");
    setMaxDuration("2");
  }

  function handleCreate() {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (type === "speaking") {
      toast.success(`Speaking assignment created — students will record up to ${maxDuration} min audio`);
    } else {
      toast.success("Assignment created!");
    }
    resetForm();
    setOpen(false);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Homework</h1>
          <p className="text-muted-foreground mt-1">Assign tasks, set deadlines, grade submissions</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New assignment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create assignment</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as AssignmentType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essay">Essay</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="speaking">
                      <span className="flex items-center gap-2"><Mic className="w-4 h-4" /> Speaking (audio)</span>
                    </SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="worksheet">Worksheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder={type === "speaking" ? "e.g. Describe Your Hometown" : "e.g. Essay: Climate Change"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {type === "speaking" ? (
                <>
                  <div className="space-y-2">
                    <Label>Speaking prompt</Label>
                    <Textarea
                      placeholder="Write the prompt students will respond to. e.g. 'Describe a place that is important to you and explain why...'"
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Students will see this prompt and submit an audio recording from their homework page.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Max duration (min)</Label>
                      <Input type="number" min={1} max={10} value={maxDuration} onChange={(e) => setMaxDuration(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Due date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Instructions</Label>
                    <Textarea placeholder="What should students do?" rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Due date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Input defaultValue="B2 - Morning" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Assign to class</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockHomework.map((h) => (
          <Card key={h.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <Badge variant="secondary">Due {h.due}</Badge>
            </div>
            <h3 className="font-semibold mb-2">{h.title}</h3>
            <div className="text-xs text-muted-foreground mb-3">
              {h.submitted} of {h.assigned} submitted
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted mb-4">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(h.submitted / h.assigned) * 100}%` }} />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" /> Grade & feedback
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Grade: {h.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Card className="p-4 bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Student: Sarah Chen</div>
                    <p className="text-sm">
                      "In today's rapidly evolving world, choosing the right career path has become both exciting and challenging.
                      I envision myself working at the intersection of technology and education..."
                    </p>
                  </Card>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Score (0-100)</Label>
                      <Input
                        type="number"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="85"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rubric</Label>
                      <Input defaultValue="Writing - B2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Feedback</Label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Great structure! Watch out for article usage..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => { toast.success("Feedback sent to student"); setGrade(""); setFeedback(""); }}>
                    Send feedback
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div>
    </div>
  );
}
