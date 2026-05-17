import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/mock-data";
import { BookOpen, Library, Mic, MessageSquare, BookMarked, Headphones, Clock } from "lucide-react";

const iconMap = { BookOpen, Library, Mic, MessageSquare, BookMarked, Headphones };

const videoLessons: Record<string, { title: string; duration: string; level: string; embed: string }[]> = {
  Grammar: [
    { title: "Mastering English Tenses", duration: "12 min", level: "B2", embed: "https://www.youtube.com/embed/Yt3DqLpXvRQ" },
    { title: "Advanced Grammar Patterns", duration: "15 min", level: "C1", embed: "https://www.youtube.com/embed/Yt3DqLpXvRQ" },
  ],
  Speaking: [
    { title: "Fluent Speaking Techniques", duration: "10 min", level: "B2", embed: "https://www.youtube.com/embed/IsBLzDTvHSE" },
    { title: "Pronunciation Deep Dive", duration: "14 min", level: "C1", embed: "https://www.youtube.com/embed/IsBLzDTvHSE" },
  ],
};

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

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-1">Video Lessons</h2>
        <p className="text-muted-foreground mb-6">Watch curated video lessons by category.</p>

        {Object.entries(videoLessons).map(([category, videos]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((v) => (
                <Card key={v.title} className="overflow-hidden">
                  <div className="aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={v.embed}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold">{v.title}</h4>
                      <Badge>{v.level}</Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Clock className="w-3.5 h-3.5" /> {v.duration}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
