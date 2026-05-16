import { createFileRoute } from "@tanstack/react-router";
import { Mic, Play, RotateCcw, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/student/speaking")({
  component: SpeakingLab,
});

function SpeakingLab() {
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const toggle = () => {
    if (recording) {
      setRecording(false);
      setHasRecording(true);
    } else {
      setRecording(true);
      setHasRecording(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-3">Speaking Lab</Badge>
        <h1 className="text-3xl font-bold">Daily speaking task</h1>
        <p className="text-muted-foreground mt-1">Read the prompt aloud and submit for AI + teacher feedback.</p>
      </div>

      <Card className="p-8 mb-6 bg-gradient-to-br from-accent/50 to-background border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Prompt</div>
            <p className="text-lg leading-relaxed">
              "Describe a memorable trip you've taken. Where did you go, who were you with,
              and what made it special? Speak for 60–90 seconds."
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-10">
        <div className="flex flex-col items-center">
          <button
            onClick={toggle}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              recording
                ? "bg-destructive text-destructive-foreground scale-110"
                : "bg-primary text-primary-foreground hover:scale-105"
            }`}
          >
            {recording && (
              <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
            )}
            <Mic className="w-12 h-12" />
          </button>

          <div className="mt-6 text-center">
            <div className="text-sm font-medium">
              {recording ? "Recording..." : hasRecording ? "Recording complete" : "Tap to start recording"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {recording ? "00:24 / 01:30" : hasRecording ? "00:47 captured" : "Up to 90 seconds"}
            </div>
          </div>

          <div className="mt-8 w-full max-w-md h-20 flex items-center justify-center gap-1">
            {Array.from({ length: 48 }).map((_, i) => {
              const h = 20 + ((i * 13) % 60);
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-full ${
                    recording ? "bg-primary wave-bar" : hasRecording ? "bg-primary/60" : "bg-muted"
                  }`}
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              );
            })}
          </div>

          {hasRecording && !recording && (
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button variant="outline">
                <Play className="w-4 h-4 mr-2" /> Play back
              </Button>
              <Button variant="outline" onClick={() => setHasRecording(false)}>
                <RotateCcw className="w-4 h-4 mr-2" /> Re-record
              </Button>
              <Button onClick={() => toast.success("Submitted to AI & teacher for feedback!")}>
                <Send className="w-4 h-4 mr-2" /> Submit to AI / Teacher
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[
          { label: "Pronunciation", score: "92%" },
          { label: "Fluency", score: "85%" },
          { label: "Grammar", score: "88%" },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-bold text-primary mt-1">{s.score}</div>
            <div className="text-xs text-muted-foreground mt-1">last attempt</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
