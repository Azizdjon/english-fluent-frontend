import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, FileText, CheckCircle, BookOpen } from "lucide-react";
import { grammarTopics } from "@/lib/mock-data";

export const Route = createFileRoute("/student/lessons/$id")({
  component: LessonPlayer,
});

function GrammarPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/student/lessons" className="flex items-center text-primary mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Lessons
      </Link>
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">Grammar Module</Badge>
        <h1 className="text-3xl font-bold">English Grammar: Tenses</h1>
        <p className="text-muted-foreground mt-1">Master all 9 essential English tenses with interactive exercises.</p>
      </div>
      <div className="space-y-10">
        {grammarTopics.map((topic, index) => (
          <Card key={topic.id} className="p-6 border-2 border-border hover:border-primary/30 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                {index + 1}
              </div>
              <div>
                <h2 className="text-xl font-bold">{topic.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">{topic.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Practice Exercises</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.wordwallIds.map((wwId, i) => (
                  <a
                    key={wwId}
                    href={`https://wordwall.net/resource/${wwId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Exercise {i + 1}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Opens in new tab</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LessonPlayer() {
  const { id } = Route.useParams();

  if (id === "grammar") {
    return <GrammarPage />;
  }

  // Module-specific pages redirect to their dedicated routes
  if (id === "speaking") {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Link to="/student/lessons" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Lessons
        </Link>
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
            <Play className="w-10 h-10 text-violet-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Speaking Lab</h1>
          <p className="text-muted-foreground mb-6">Practice pronunciation and fluency with real-time AI feedback.</p>
          <Link to="/student/speaking">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Open Speaking Lab →</button>
          </Link>
        </div>
      </div>
    );
  }

  if (id === "pragmatic") {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Link to="/student/lessons" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Lessons
        </Link>
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
            <Play className="w-10 h-10 text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Pragmatic Dialogues</h1>
          <p className="text-muted-foreground mb-6">Rehearse real B2/C1 scenarios — interviews, presentations, doctor visits.</p>
          <Link to="/student/pragmatic">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">Open Dialogues →</button>
          </Link>
        </div>
      </div>
    );
  }

  const moduleInfo: Record<string, { color: string; desc: string }> = {
    vocabulary: { color: "from-blue-500 to-cyan-500", desc: "Build your word bank with 32 curated vocabulary lessons." },
    reading: { color: "from-emerald-500 to-teal-500", desc: "Sharpen comprehension with 28 reading exercises across all levels." },
    listening: { color: "from-amber-500 to-orange-500", desc: "Train your ear with 22 audio lessons from native speakers." },
  };
  const info = moduleInfo[id] || { color: "from-gray-400 to-gray-600", desc: "Lessons coming soon." };

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
              src="https://www.youtube.com/embed/${moduleVideos[id] || moduleVideos.default}"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <h1 className="text-3xl font-bold mb-2">Mastering {id.charAt(0).toUpperCase() + id.slice(1)}</h1>
          <p className="text-muted-foreground mb-2">{info.desc}</p>
          <div className="flex items-center gap-3 mb-6">
            <Badge>B2 Intermediate</Badge>
            <span className="text-sm text-muted-foreground">Video Lesson ÃÂÃÂÃÂÃÂ· 15 mins</span>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lesson Resources</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Grammar_Cheat_Sheet.pdf</div>
                    <div className="text-xs text-muted-foreground">PDF ÃÂÃÂÃÂÃÂ· 1.2 MB</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Vocabulary_List.pdf</div>
                    <div className="text-xs text-muted-foreground">PDF ÃÂÃÂÃÂÃÂ· 850 KB</div>
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
                <div key={i} className={`flex items-start gap-3 p-2 rounded-lg ${step.active ? "bg-primary/10 border border-primary/20" : ""}`}>
                  {step.done ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 ${step.active ? "border-primary" : "border-muted-foreground"}`} />
                  )}
                  <div className={`text-sm ${step.active ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6">Next Lesson ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}