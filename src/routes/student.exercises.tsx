import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/student/exercises")({
  component: Exercises,
});

const dragWords = ["barely", "rarely", "usually", "always"];
const CORRECT_WORD = "rarely";
const fillSentence = ["I", "___", "go", "to", "the", "gym", "on", "Sundays."];

function Exercises() {
  const [dropped, setDropped] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [isOver, setIsOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const word = e.dataTransfer.getData("text/plain");
    if (!word) return;
    setDropped(word);
    if (word === CORRECT_WORD) {
      setStatus("correct");
      toast.success("Correct! 'Rarely' means almost never.");
    } else {
      setStatus("wrong");
      toast.error(`"${word}" is not right. Try again!`);
    }
  };

  const reset = () => {
    setDropped(null);
    setStatus("idle");
  };
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
          <span
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            onDrop={handleDrop}
            className={`inline-block min-w-24 px-4 py-1 mx-1 rounded-md border-2 border-dashed text-base transition-colors ${
              status === "correct"
                ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold"
                : status === "wrong"
                ? "border-destructive bg-destructive/10 text-destructive font-semibold"
                : isOver
                ? "border-primary bg-primary/10 text-foreground"
                : "border-primary/50 bg-background text-muted-foreground"
            }`}
          >
            {dropped ?? "drop here"}
          </span>{" "}
          go to the gym on Sundays — maybe once a year.
        </div>

        <div className="flex flex-wrap gap-3">
          {dragWords.map((w) => (
            <div
              key={w}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", w)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border bg-card cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-sm transition-all select-none"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{w}</span>
            </div>
          ))}
        </div>

        {dropped && (
          <div className="mt-4 flex items-center gap-3">
            {status === "correct" ? (
              <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                <Check className="w-4 h-4" /> Well done!
              </span>
            ) : (
              <span className="text-sm text-destructive font-medium">Not quite — try another word.</span>
            )}
            <Button size="sm" variant="outline" onClick={reset}>Reset</Button>
          </div>
        )}
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
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Wordwall Games</span>
        </div>
        <h2 className="text-xl font-semibold mb-1">Interactive Wordwall Activity</h2>
        <p className="text-sm text-muted-foreground mb-6">Play this interactive game to test your vocabulary and spelling skills.</p>

        <div
          className="rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-primary/60 hover:from-primary/10 hover:to-purple-500/10 transition-all group"
          style={{ height: '320px' }}
          onClick={() => window.open('https://wordwall.net/ru/resource/113437751/untitled1', '_blank')}
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <span className="text-5xl">🔤</span>
          </div>
          <div className="text-center px-6">
            <h3 className="text-2xl font-bold mb-2">Anagram Challenge</h3>
            <p className="text-muted-foreground text-sm max-w-sm">Harflarni to'g'ri tartibga soling va so'zlarni toping!</p>
          </div>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-base font-semibold shadow-lg group-hover:shadow-xl transition-all"
            onClick={(e) => { e.stopPropagation(); window.open('https://wordwall.net/ru/resource/113437751/untitled1', '_blank'); }}
          >
            ▶ O'yinni Boshlash
          </Button>
        </div>

        <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground justify-center">
          <span>🎮 Wordwall tomonidan yaratilgan</span>
          <span>•</span>
          <span>📱 Barcha qurilmalarda ishlaydi</span>
        </div>
      </Card>

      {/* Wordwall Activity 2 */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">🎯 WORDWALL GAMES</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Wordwall Activity 2</h3>
          <p className="text-sm text-gray-500 mb-4">Practice your English skills with this interactive game.</p>
          <div className="w-full overflow-hidden rounded-lg">
            <iframe
              style={{maxWidth: "100%"}}
              src="https://wordwall.net/ru/embed/fc6372a6b01143448ad52de3c7597cc0?themeId=53&templateId=36&fontStackId=0"
              width="500"
              height="380"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      </Card>

    </div>
  );
}
