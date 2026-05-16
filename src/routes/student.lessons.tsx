import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/mock-data";
import { BookOpen, Library, Mic, MessageSquare, BookMarked, Headphones } from "lucide-react";

const iconMap = { BookOpen, Library, Mic, MessageSquare, BookMarked, Headphones };

export const Route = createFileRoute("/student/lessons")({
  component: Lessons,
});

function Lessons() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">All Lessons</Badge>
        <h1 className="text-3xl font-bold">Your learning path</h1>
        <p className="text-muted-foreground mt-1">Explore every module in your B2 track.</p>
      </div>

      <div className="space-y-4">
        {modules.map((m) => {
          const Icon = iconMap[m.icon as keyof typeof iconMap];
          return (
            <Card key={m.id} className="p-6">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shrink-0`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{m.name}</h3>
                    <span className="text-sm text-muted-foreground">{m.progress}% · {m.lessons} lessons</span>
                  </div>
                  <Progress value={m.progress} className="h-2" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
