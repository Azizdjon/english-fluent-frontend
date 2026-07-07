import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { Sparkles, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/student/exercises")({
  component: Exercises,
});

type Activity = { title: string; topicKey: string; url: string; emoji: string };

const ACTIVITIES: Activity[] = [
  { title: "Present Perfect", topicKey: "tGrammar", url: "https://wordwall.net/resource/103482545/present-perfect", emoji: "\u{1F550}" },
  { title: "There is / There are", topicKey: "tGrammar", url: "https://wordwall.net/resource/92038304/there-is-there-are-quiz", emoji: "\u{1F3E0}" },
  { title: "Have / Has", topicKey: "tGrammar", url: "https://wordwall.net/resource/89291697/havehas", emoji: "\u{270F}\u{FE0F}" },
  { title: "Word Order", topicKey: "tSentence", url: "https://wordwall.net/resource/103531859/put-the-words-in-the-correct-order", emoji: "\u{1F524}" },
  { title: "Word Search", topicKey: "tVocab", url: "https://wordwall.net/resource/89201291/word-search", emoji: "\u{1F50D}" },
  { title: "Clothes", topicKey: "tVocab", url: "https://wordwall.net/resource/104678886/clothes", emoji: "\u{1F455}" },
  { title: "Sports & Games", topicKey: "tVocab", url: "https://wordwall.net/resource/104119321/sport-games", emoji: "\u{26BD}" },
  { title: "Pronunciation Test", topicKey: "tPron", url: "https://wordwall.net/resource/88766639/pronunciation-test", emoji: "\u{1F50A}" },
  { title: "Report Writing", topicKey: "tWriting", url: "https://wordwall.net/resource/89928745/report-writing", emoji: "\u{1F4DD}" },
  { title: "English Quiz", topicKey: "tGeneral", url: "https://wordwall.net/resource/98843630/english-quiz", emoji: "\u{1F3AF}" },
];

function Exercises() {
  const { t } = useI18n();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge variant="secondary">{t("dash.sWordwall.badge")}</Badge>
        </div>
        <h1 className="text-3xl font-bold">{t("dash.sWordwall.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("dash.sWordwall.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVITIES.map((a) => (
          <a
            key={a.url}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="p-5 h-full flex flex-col gap-3 border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">{a.emoji}</div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h2 className="font-semibold leading-tight">{a.title}</h2>
                <Badge variant="outline" className="text-xs mt-2">{t(`dash.sWordwall.${a.topicKey}`)}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-auto">{t("dash.sWordwall.opensNewTab")}</div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
