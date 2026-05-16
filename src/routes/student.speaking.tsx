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
  const [transcription, setTranscription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{label: string, score: string}[] | null>(null);

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Brauzeringiz ovoz tanishni qo'llab-quvvatlamaydi.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscription(prev => prev + event.results[i][0].transcript + " ");
        } else {
          interim += event.results[i][0].transcript;
        }
      }
    };

    recognition.onend = () => {
      if (recording) recognition.start(); // Keep listening if we are still "recording"
    };

    (window as any).recognition = recognition;
    recognition.start();
  };

  const toggle = () => {
    if (recording) {
      setRecording(false);
      setHasRecording(true);
      if ((window as any).recognition) {
        (window as any).recognition.stop();
      }
    } else {
      setRecording(true);
      setHasRecording(false);
      setTranscription("");
      setFeedback(null);
      startSpeechRecognition();
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI Analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setFeedback([
        { label: "Pronunciation", score: "89%" },
        { label: "Fluency", score: "94%" },
        { label: "Grammar", score: "91%" },
      ]);
      toast.success("AI tahlili tayyor!");
    }, 2000);
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
              {recording ? "Listening to your voice..." : hasRecording ? "Transcription available" : "Up to 90 seconds"}
            </div>
          </div>

          {transcription && (
            <div className="mt-6 p-4 rounded-lg bg-muted/30 w-full max-w-lg italic text-center">
              "{transcription}"
            </div>
          )}

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
              <Button variant="outline" onClick={() => { setTranscription(""); setHasRecording(false); setFeedback(null); }}>
                <RotateCcw className="w-4 h-4 mr-2" /> Re-record
              </Button>
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : <> <Send className="w-4 h-4 mr-2" /> Analyze with AI </>}
              </Button>
              <Button variant="secondary" onClick={() => toast.success("Submitted to teacher!")}>
                Submit to Teacher
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {(feedback || [
          { label: "Pronunciation", score: "—" },
          { label: "Fluency", score: "—" },
          { label: "Grammar", score: "—" },
        ]).map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-bold text-primary mt-1">{s.score}</div>
            <div className="text-xs text-muted-foreground mt-1">AI Score</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
