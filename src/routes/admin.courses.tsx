import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

const courses = [
  { name: "Business English B2", level: "B2", students: 487, status: "Live" },
  { name: "IELTS Preparation", level: "B2-C1", students: 392, status: "Live" },
  { name: "Conversational A2-B1", level: "A2-B1", students: 351, status: "Live" },
  { name: "Academic Writing C1", level: "C1", students: 218, status: "Live" },
  { name: "Beginner Survival English", level: "A1", students: 156, status: "Draft" },
];

export const Route = createFileRoute("/admin/courses")({
  component: Courses,
});

function Courses() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">{courses.length} courses across the platform</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New course</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <Card key={c.name} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <Badge variant={c.status === "Live" ? "default" : "secondary"}>{c.status}</Badge>
            </div>
            <h3 className="font-semibold mb-1">{c.name}</h3>
            <div className="text-xs text-muted-foreground mb-4">Level {c.level} · {c.students} students</div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info(`Managing: ${c.name}`, { description: `${c.students} students enrolled · Level ${c.level}. Full course editor coming soon.` })}>Manage</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
