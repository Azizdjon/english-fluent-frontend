import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, FileText, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/student/lessons/$id")({
  component: LessonPlayer,
});

function LessonPlayer() {
  const { id } = Route.useParams();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link to="/student/lessons" className="flex items-center text-primary mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Lessons
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-6 relative group border-4 border-primary/20">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>

          <h1 className="text-3xl font-bold mb-2">Mastering {id.charAt(0).toUpperCase() + id.slice(1)}</h1>
          <div className="flex items-center gap-3 mb-6">
            <Badge>B2 Intermediate</Badge>
            <span className="text-sm text-muted-foreground">Video Lesson · 15 mins</span>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lesson Resources</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Grammar_Cheat_Sheet.pdf</div>
                    <div className="text-xs text-muted-foreground">PDF · 1.2 MB</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Vocabulary_List.pdf</div>
                    <div className="text-xs text-muted-foreground">PDF · 850 KB</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full lg:w-80">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Lesson Progress</h2>
            <div className="space-y-4">
              {[
                { title: "Introduction", done: true },
                { title: "Core Concepts", done: true },
                { title: "Video Tutorial", done: false, active: true },
                { title: "Practice Quiz", done: false },
                { title: "Summary", done: false },
              ].map((step, i) => (
                <div key={i} className={`flex items-start gap-3 p-2 rounded-lg ${step.active ? 'bg-primary/10 border border-primary/20' : ''}`}>
                  {step.done ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 ${step.active ? 'border-primary' : 'border-muted-foreground'}`} />
                  )}
                  <div className={`text-sm ${step.active ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6">Next Lesson →</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
