import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Sparkles, Check, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/student/exercises")({
  component: Exercises,
});

const WORDS = ["barely", "rarely", "usually", "always"];
const CORRECT = "rarely";

function Exercises() {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dropped, setDropped] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [fillChecked, setFillChecked] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging) return;
    setDropped(dragging);
    if (dragging === CORRECT) {
      setResult("correct");
      toast.success("Correct! \"Rarely\" — maybe once a year.", { duration: 3000 });
    } else {
      setResult("wrong");
      toast.error(`"${dragging}" is not correct here. Try again!`, { duration: 3000 });
    }
    setDragging(null);
  };

  const reset = () => { setDropped(null); setResult(null); setDragging(null); };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">Interactive Exercises</Badge>
        <h1 className="text-3xl font-bold">Practice what you've learned</h1>
        <p className="text-muted-foreground mt-1">Drag, drop, and fill in the blanks.</p>
      </div>

      {/* DRAG & DROP */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs">DRAG & DROP</Badge>
        </div>
        <h2 className="font-semibold mb-1">Match the adverb of frequency</h2>
        <p className="text-sm text-muted-foreground mb-4">Drag the correct word into the sentence.</p>

        <div className="p-4 rounded-xl bg-muted/40 border mb-4 text-center text-lg font-medium flex items-center justify-center gap-2 flex-wrap">
          <span>I</span>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className={`min-w-[120px] h-10 rounded-lg border-2 border-dashed flex items-center justify-center text-sm font-semibold transition-all ${ result === "correct" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : result === "wrong" ? "border-destructive bg-red-50 text-destructive" : "border-primary/40 bg-background text-muted-foreground" }`}
          >
            {dropped ? dropped : "drop here"}
          </div>
          <span>go to the gym on Sundays — maybe once a year.</span>
        </div>

        <div className="flex gap-3 flex-wrap mb-4">
          {WORDS.filter(w => w !== dropped).map(word => (
            <div
              key={word}
              draggable
              onDragStart={() => setDragging(word)}
              onDragEnd={() => setDragging(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 bg-background cursor-grab active:cursor-grabbing select-none transition-all ${ dragging === word ? "border-primary shadow-lg scale-105" : "border-border hover:border-primary/60" }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              {word}
            </div>
          ))}
        </div>

        {result && (
          <div className="flex items-center gap-3">
            {result === "correct" ? (
              <div className="flex items-center gap-2 text-emerald-600 font-semibold"><Check className="w-5 h-5" /> Correct!</div>
            ) : (
              <div className="flex items-center gap-2 text-destructive font-semibold">Wrong — try another word</div>
            )}
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
          </div>
        )}
      </Card>

      {/* FILL IN THE BLANK */}
      <Card className="p-6 mb-6">
        <Badge variant="outline" className="text-xs mb-1">FILL IN THE BLANK</Badge>
        <h2 className="font-semibold mb-4">Complete the sentence</h2>
        <div className="flex items-center gap-2 flex-wrap text-base mb-4">
          <span>I</span>
          <input
            type="text"
            value={fillAnswer}
            onChange={e => { setFillAnswer(e.target.value); setFillChecked(false); }}
            placeholder="verb..."
            className="border-b-2 border-primary bg-transparent outline-none px-2 py-1 w-20 text-center"
          />
          <span>to the gym on Sundays.</span>
        </div>
        <div className="flex gap-2 items-center">
          <Button size="sm" onClick={() => { setFillChecked(true); if(fillAnswer.toLowerCase().trim() === "go") toast.success("Correct! The answer is \"go\""); else toast.error(`"${fillAnswer}" is incorrect. Hint: present simple verb`); }}>Check answer</Button>
          {fillChecked && fillAnswer.toLowerCase().trim() === "go" && <span className="text-emerald-600 font-semibold flex items-center gap-1"><Check className="w-4 h-4" /> go</span>}
        </div>
      </Card>

      {/* WORDWALL */}
      <Card className="p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge variant="outline" className="text-xs">WORDWALL GAMES</Badge>
        </div>
        <h2 className="font-semibold mb-1">Interactive Wordwall Activity</h2>
        <p className="text-sm text-muted-foreground mb-4">Play this interactive game to test your vocabulary and spelling skills.</p>
        <a href="https://wordwall.net/resource/2077865" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">🔤</div>
          <div>
            <div className="font-semibold">Anagram Challenge</div>
            <div className="text-xs text-muted-foreground">Opens in new tab · Wordwall</div>
          </div>
        </a>
      </Card>
    </div>
  );
}