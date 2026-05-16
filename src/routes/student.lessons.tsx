import { createFileRoute, Link } from "@tanstack/react-router";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m) => {
          const Icon = iconMap[m.icon as keyof typeof iconMap];
          return (
            <Link key={m.id} to="/student/lessons/$id" params={{ id: m.id }}>
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-primary/20">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-xl">{m.name}</h3>
                      <Badge variant="outline">{m.lessons} lessons</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Course Progress</span>
                      <span>{m.progress}%</span>
                    </div>
                    <Progress value={m.progress} className="h-2" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
