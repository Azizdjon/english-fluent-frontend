import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Sparkles } from "lucide-react";

export const Route = createFileRoute("/student/exercises")({
  component: Exercises,
});

const dragWords = ["barely", "rarely", "usually", "always"];
const fillSentence = ["I", "___", "go", "to", "the", "gym", "on", "Sundays."];

function Exercises() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Badge variant="secondary" className="mb-2">Interactive Exercises</Badge>
        <h1 className="text-3xl font-bold">Practice what you've learned</h1>
        <p className="text-muted-foreground mt-1">Drag, drop, and fill in the blanks.</p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Drag & drop</span>
        </div>
        <h2 className="text-xl font-semibold mb-1">Match the adverb of frequency</h2>
        <p className="text-sm text-muted-foreground mb-6">Drag the correct word into the sentence.</p>

        <div className="p-6 rounded-lg bg-muted/40 mb-6 text-lg leading-loose">
          I{" "}
          <span className="inline-block min-w-24 px-4 py-1 mx-1 rounded-md border-2 border-dashed border-primary/50 bg-background text-muted-foreground text-base">
            drop here
          </span>{" "}
          go to the gym on Sundays — maybe once a year.
        </div>

        <div className="flex flex-wrap gap-3">
          {dragWords.map((w) => (
            <div
              key={w}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border bg-card cursor-grab hover:border-primary hover:shadow-sm transition-all"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{w}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Fill in the blank</span>
        </div>
        <h2 className="text-xl font-semibold mb-1">Complete the sentence</h2>
        <p className="text-sm text-muted-foreground mb-6">Type the missing word.</p>

        <div className="p-6 rounded-lg bg-muted/40 text-lg leading-loose flex flex-wrap items-center gap-2">
          {fillSentence.map((w, i) =>
            w === "___" ? (
              <input
                key={i}
                className="inline-block w-32 px-3 py-1.5 rounded-md border-2 border-primary/50 bg-background focus:outline-none focus:border-primary text-base"
                placeholder="..."
              />
            ) : (
              <span key={i}>{w}</span>
            )
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button>Check answer</Button>
        </div>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Match pairs</span>
        </div>
        <h2 className="text-xl font-semibold mb-6">Connect the idioms to their meanings</h2>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            {["Break the ice", "Hit the books", "Piece of cake", "Under the weather"].map((p) => (
              <div key={p} className="p-3 rounded-lg border-2 border-border bg-card font-medium cursor-pointer hover:border-primary">
                {p}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {["Feeling unwell", "Study hard", "Start a conversation", "Very easy"].map((p) => (
              <div key={p} className="p-3 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground cursor-pointer hover:border-primary">
                {p}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
