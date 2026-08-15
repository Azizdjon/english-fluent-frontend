import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { Sparkles, Play, X } from "lucide-react";

export const Route = createFileRoute("/student/exercises")({
  component: Exercises,
});

type Activity = { title: string; topicKey: string; embed: string; emoji: string };

const ACTIVITIES: Activity[] = [
  { title: "Present Perfect", topicKey: "tGrammar", emoji: "\u{1F550}", embed: "https://wordwall.net/embed/202f6bf0c95149eca77bafbe2e433a3d?themeId=46&templateId=5&fontStackId=0" },
  { title: "There is / There are", topicKey: "tGrammar", emoji: "\u{1F3E0}", embed: "https://wordwall.net/embed/6029f2edb30847f890c8919bc5de0bcf?themeId=56&templateId=5&fontStackId=12" },
  { title: "Have / Has", topicKey: "tGrammar", emoji: "\u{270F}\u{FE0F}", embed: "https://wordwall.net/embed/de63c5ec6a3b454fb117ca2c54aeaf3d?themeId=65&templateId=5&fontStackId=0" },
  { title: "Word Order", topicKey: "tSentence", emoji: "\u{1F524}", embed: "https://wordwall.net/embed/6c3424871a894a99823172fb70cfd52a?themeId=43&templateId=72&fontStackId=12" },
  { title: "Word Search", topicKey: "tVocab", emoji: "\u{1F50D}", embed: "https://wordwall.net/embed/829b3df9f91d4d3b806230b6bd89b811?themeId=2&templateId=10&fontStackId=0" },
  { title: "Clothes", topicKey: "tVocab", emoji: "\u{1F455}", embed: "https://wordwall.net/embed/2fb07aa0d45f4c67a672738403ee0069?themeId=23&templateId=3&fontStackId=0" },
  { title: "Sports & Games", topicKey: "tVocab", emoji: "\u{26BD}", embed: "https://wordwall.net/embed/abc60d723cc74c47956361f263a78ad7?themeId=66&templateId=30&fontStackId=0" },
  { title: "Pronunciation Test", topicKey: "tPron", emoji: "\u{1F50A}", embed: "https://wordwall.net/embed/e1a028f00b9d4df38c85ffc2629bfd0b?themeId=50&templateId=5&fontStackId=0" },
  { title: "Report Writing", topicKey: "tWriting", emoji: "\u{1F4DD}", embed: "https://wordwall.net/embed/3b7632c2276c45418821f28019a0e207?themeId=1&templateId=8&fontStackId=0" },
  { title: "English Quiz", topicKey: "tGeneral", emoji: "\u{1F3AF}", embed: "https://wordwall.net/embed/4207ba896e014773a112bd86b642d6eb?themeId=1&templateId=5&fontStackId=0" },
  { title: "Ice Breakers – 40 Questions", topicKey: "tSpeaking", emoji: "\u{1F9CA}", embed: "https://wordwall.net/embed/3b7de7d0cea94a20bb5a6274f4484d16?themeId=41&templateId=70&fontStackId=0" },
  { title: "Revision: Random Questions", topicKey: "tSpeaking", emoji: "\u{1F504}", embed: "https://wordwall.net/embed/d08f7378570243809225c785075a2963?themeId=2&templateId=70&fontStackId=0" },
  { title: "Speaking B1+ – 100 Questions", topicKey: "tSpeaking", emoji: "\u{1F5E3}\u{FE0F}", embed: "https://wordwall.net/embed/73e99b71ec8a4653a04076e8166b0d31?themeId=42&templateId=70&fontStackId=0" },
  { title: "Mixed Tenses – Speaking", topicKey: "tSpeaking", emoji: "\u{23F3}", embed: "https://wordwall.net/embed/f5290aea00914446921dc18a17a3c491?themeId=51&templateId=70&fontStackId=0" },
  { title: "Healthy Lifestyle – Conversation", topicKey: "tSpeaking", emoji: "\u{1F34E}", embed: "https://wordwall.net/embed/f32b61f8430e437995859a33a25f371f?themeId=42&templateId=70&fontStackId=0" },
  { title: "Flyers Speaking – Answering Questions", topicKey: "tSpeaking", emoji: "\u{1F4CB}", embed: "https://wordwall.net/embed/87b460acc22342c1b12ab709d4be2075?themeId=2&templateId=70&fontStackId=0" },
  { title: "Birthday: Speaking Questions", topicKey: "tSpeaking", emoji: "\u{1F382}", embed: "https://wordwall.net/embed/0654cd58e3134f6f9ae50dc835e3cceb?themeId=27&templateId=70&fontStackId=0" },
  { title: "Hobbies B1+/B2", topicKey: "tSpeaking", emoji: "\u{1F3A8}", embed: "https://wordwall.net/embed/571d9164df4d4d109f6ec0065d0bfe5b?themeId=1&templateId=70&fontStackId=0" },
  { title: "Speaking B2+", topicKey: "tSpeaking", emoji: "\u{1F4AC}", embed: "https://wordwall.net/embed/4304d70a31424017ba6944ff0af8b88c?themeId=1&templateId=70&fontStackId=0" },
  { title: "RM B2+ Vocabulary Speaking", topicKey: "tSpeaking", emoji: "\u{1F4D6}", embed: "https://wordwall.net/embed/8c9fec69adb34b5099605963afc044c0?themeId=1&templateId=70&fontStackId=0" },
  { title: "EGE Speaking 2/3", topicKey: "tSpeaking", emoji: "\u{1F393}", embed: "https://wordwall.net/embed/79da7a3f9d1540be8360bdf04596fd1b?themeId=1&templateId=70&fontStackId=0" },
  { title: "Gateway B2 Unit 2 Speaking", topicKey: "tSpeaking", emoji: "\u{1F4BC}", embed: "https://wordwall.net/embed/ae789ca672814da4924de9ce5e92c01b?themeId=1&templateId=70&fontStackId=0" },
  { title: "Speaking Cards B2", topicKey: "tSpeaking", emoji: "\u{1F0CF}", embed: "https://wordwall.net/embed/f704cb8323f943bf847a6008dcee422d?themeId=1&templateId=70&fontStackId=0" },
  { title: "Shopping Speaking", topicKey: "tSpeaking", emoji: "\u{1F6D2}", embed: "https://wordwall.net/embed/d34a4d33c2ce437d9ede5df4f05e6f8d?themeId=1&templateId=70&fontStackId=0" },
  { title: "Complete FCE Unit 5 Speaking", topicKey: "tSpeaking", emoji: "\u{1F4DA}", embed: "https://wordwall.net/embed/40efedd45927467c8b029caf1806688a?themeId=1&templateId=70&fontStackId=0" },
  { title: "Christmas Speaking", topicKey: "tSpeaking", emoji: "\u{1F384}", embed: "https://wordwall.net/embed/a072c4686f4d4d32b1cbf90fea25f001?themeId=1&templateId=70&fontStackId=0" },
];

function Exercises() {
  const { t } = useI18n();
  const [active, setActive] = useState<Activity | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge variant="secondary">{t("dash.sWordwall.badge")}</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("dash.sWordwall.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("dash.sWordwall.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVITIES.map((a) => (
          <button
            key={a.embed}
            type="button"
            onClick={() => setActive(a)}
            className="group text-left"
          >
            <Card className="p-5 h-full flex flex-col gap-3 border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">{a.emoji}</div>
                <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h2 className="font-semibold leading-tight">{a.title}</h2>
                <Badge variant="outline" className="text-xs mt-2">{t(`dash.sWordwall.${a.topicKey}`)}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-auto">{t("dash.sWordwall.opensInSite")}</div>
            </Card>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-background rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">{active.emoji}</span>
                <h3 className="font-semibold">{active.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-muted/30">
              <iframe
                key={active.embed}
                title={active.title}
                src={active.embed}
                className="w-full"
                style={{ height: "min(70vh, 520px)", border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
