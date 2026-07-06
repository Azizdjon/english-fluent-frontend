import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FlaskConical,
  FileText,
  Award,
  ExternalLink,
  Calendar,
  BookOpen,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Scientific Research — PragmaLearn" },
      {
        name: "description",
        content:
          "Peer-reviewed articles and professional certificates in applied linguistics and English language teaching.",
      },
    ],
  }),
  component: ResearchPage,
});

// ---- DEMO DATA (bilingual). Replace with real content later. ----
type Article = {
  id: number;
  title: { en: string; uz: string };
  journal: { en: string; uz: string };
  year: string;
  abstract: { en: string; uz: string };
  tag: string;
};

type Certificate = {
  id: number;
  title: { en: string; uz: string };
  issuer: { en: string; uz: string };
  year: string;
  color: string;
};

const ARTICLES: Article[] = [
  {
    id: 1,
    title: {
      en: "Pragmatic Competence in EFL Learners: A Corpus-Based Study",
      uz: "EFL o'quvchilarida pragmatik kompetensiya: korpusga asoslangan tadqiqot",
    },
    journal: { en: "Journal of Applied Linguistics", uz: "Amaliy tilshunoslik jurnali" },
    year: "2024",
    abstract: {
      en: "An analysis of speech-act realization across 400 learner interactions, revealing systematic gaps between grammatical and pragmatic competence.",
      uz: "400 ta o'quvchi muloqotida nutq aktlarini amalga oshirishni tahlil qilib, grammatik va pragmatik kompetensiya o'rtasidagi tizimli farqlarni ochib beradi.",
    },
    tag: "Pragmatics",
  },
  {
    id: 2,
    title: {
      en: "Adaptive Learning Paths and CEFR Progression: An Empirical Model",
      uz: "Moslashuvchan o'quv yo'llari va CEFR taraqqiyoti: empirik model",
    },
    journal: { en: "Language Learning & Technology", uz: "Til o'rganish va texnologiya" },
    year: "2023",
    abstract: {
      en: "A predictive model showing how adaptive sequencing accelerates B1→C1 progression by an average of 3.2 months compared to fixed curricula.",
      uz: "Moslashuvchan ketma-ketlik B1→C1 taraqqiyotini qat'iy dasturlarga nisbatan o'rtacha 3.2 oyga tezlashtirishini ko'rsatuvchi bashoratli model.",
    },
    tag: "EdTech",
  },
  {
    id: 3,
    title: {
      en: "Automated Pronunciation Feedback: Phoneme-Level Accuracy Trials",
      uz: "Avtomatlashtirilgan talaffuz fikri: fonema darajasidagi aniqlik sinovlari",
    },
    journal: { en: "Speech Communication Review", uz: "Nutq kommunikatsiyasi sharhi" },
    year: "2023",
    abstract: {
      en: "Evaluating a browser-based speech engine against expert phoneticians, achieving 91% agreement on segmental error detection.",
      uz: "Brauzerga asoslangan nutq mexanizmini ekspert fonetiklar bilan taqqoslab, segmental xatolarni aniqlashda 91% moslikka erishildi.",
    },
    tag: "Speech",
  },
  {
    id: 4,
    title: {
      en: "Task-Based Instruction in Multilingual Classrooms",
      uz: "Ko'p tilli sinflarda vazifaga asoslangan ta'lim",
    },
    journal: { en: "TESOL Quarterly", uz: "TESOL choraklik nashri" },
    year: "2022",
    abstract: {
      en: "A classroom study across Uzbek and English contexts, demonstrating higher engagement and retention through task-based design.",
      uz: "O'zbek va ingliz kontekstlarida sinf tadqiqoti bo'lib, vazifaga asoslangan dizayn orqali yuqori faollik va eslab qolishni ko'rsatadi.",
    },
    tag: "Pedagogy",
  },
];

const CERTIFICATES: Certificate[] = [
  {
    id: 1,
    title: { en: "CELTA — Certificate in Teaching English", uz: "CELTA — Ingliz tili o'qitish sertifikati" },
    issuer: { en: "University of Cambridge", uz: "Kembrij universiteti" },
    year: "2021",
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: 2,
    title: { en: "IELTS — Band 8.5 (Academic)", uz: "IELTS — 8.5 ball (Akademik)" },
    issuer: { en: "British Council", uz: "Britaniya kengashi" },
    year: "2022",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 3,
    title: { en: "TESOL Advanced Certificate", uz: "TESOL ilg'or sertifikati" },
    issuer: { en: "Arizona State University", uz: "Arizona shtat universiteti" },
    year: "2023",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: { en: "Applied Linguistics Research Award", uz: "Amaliy tilshunoslik tadqiqot mukofoti" },
    issuer: { en: "International Linguistics Association", uz: "Xalqaro tilshunoslik uyushmasi" },
    year: "2024",
    color: "from-amber-500 to-orange-600",
  },
];

function ResearchPage() {
  const { t, lang } = useI18n();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-slate-950/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
              PL
            </div>
            <span className="font-bold text-lg tracking-tight">PragmaLearn</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle variant="dark" />
            <Link to="/">
              <Button size="sm" variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/10 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                {t("research.backHome")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(139,92,246,0.2),transparent_55%)]" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-medium mb-6">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-300" />
            {t("research.badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            {t("research.title")}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
            {t("research.subtitle")}
          </p>

          {/* Demo notice */}
          <div className="mt-8 inline-flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200/90 text-sm max-w-2xl">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{t("research.demoNotice")}</span>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-indigo-300" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("research.articlesTitle")}</h2>
          </div>
          <p className="text-white/50 mb-10">{t("research.articlesSubtitle")}</p>

          <div className="grid md:grid-cols-2 gap-5">
            {ARTICLES.map((a) => (
              <Card key={a.id} className="p-6 bg-white/[0.04] border-white/10 text-white hover:border-indigo-400/40 hover:bg-white/[0.06] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-200 text-xs font-medium">
                    <BookOpen className="w-3 h-3" />
                    {a.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-white/50">
                    <Calendar className="w-3 h-3" />
                    {a.year}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 leading-snug">{a.title[lang]}</h3>
                <div className="text-xs text-indigo-200/80 mb-3">
                  {t("research.publishedIn")}: {a.journal[lang]}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{a.abstract[lang]}</p>
                <button className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-indigo-200 transition">
                  {t("research.readMore")}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-amber-300" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("research.certsTitle")}</h2>
          </div>
          <p className="text-white/50 mb-10">{t("research.certsSubtitle")}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CERTIFICATES.map((c) => (
              <Card key={c.id} className="p-5 bg-white/[0.04] border-white/10 text-white hover:border-white/25 transition-all group">
                <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Award className="w-12 h-12 text-white/90" />
                </div>
                <h3 className="font-semibold text-sm leading-snug mb-1">{c.title[lang]}</h3>
                <div className="text-xs text-white/50 mb-3">{c.issuer[lang]} · {c.year}</div>
                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 group-hover:text-white transition">
                  {t("research.viewCertificate")}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white/60 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              PL
            </div>
            <span className="font-semibold text-white">PragmaLearn</span>
          </div>
          <p className="text-sm">{t("landing.footer.copyright")}</p>
          <Link to="/" className="text-sm hover:text-white">{t("research.backHome")}</Link>
        </div>
      </footer>
    </div>
  );
}
