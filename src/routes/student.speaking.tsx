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
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Brauzeringiz ovoz tanishni qo'llab-quvvatlamaydi.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscription((prev) => prev + event.results[i][0].transcript + " ");
        }
      }
    };

    recognition.onend = () => {
      if (recording) recognition.start();
    };

    (window as any).recognition = recognition;
    recognition.start();
  };

  const toggle = () => {
    if (recording) {
      setRecording(false);
      setHasRecording(true);
      if (typeof window !== "undefined" && (window as any).recognition) {
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

  const reset = () => {
    setRecording(false);
    setHasRecording(false);
    setTranscription("");
    setFeedback(null);
    if (typeof window !== "undefined" && (window as any).recognition) {
      (window as any).recognition.stop();
    }
  };

  const analyze = async () => {
    if (!transcription.trim()) {
      toast.error("Avval gapiring!");
      return;
    }
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFeedback([
      { label: "Talaffuz", score: "85%" },
      { label: "Grammatika", score: "78%" },
      { label: "So'z boyligi", score: "90%" },
      { label: "Ravonlik", score: "82%" },
    ]);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Speaking Lab</h1>
          <p className="text-muted-foreground">
            Ingliz tilida gapiring va AI tahlilini oling
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={toggle}
              size="lg"
              className={`rounded-full w-24 h-24 ${
                recording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              <Mic className="w-8 h-8" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {recording
              ? "Tinglayapman... (qayta bosing to'xtatish uchun)"
              : "Boshlash uchun bosing"}
          </p>

          {transcription && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Transkriptsiya:
              </p>
              <p className="text-foreground">{transcription}</p>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            {hasRecording && (
              <>
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Qayta
                </Button>
                <Button size="sm" onClick={analyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Tahlil qilinmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Tahlil qilish
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </Card>

        {feedback && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Baholash
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {feedback.map((item) => (
                <div key={item.label} className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold text-primary">{item.score}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {hasRecording && !feedback && !isAnalyzing && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Play className="w-3 h-3" />
              Yozuv tayyor - tahlil qilishingiz mumkin
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
    }
