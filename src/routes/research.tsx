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
  GraduationCap,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Scientific Research — PragmaLearn" },
      {
        name: "description",
        content:
          "Peer-reviewed articles, conference papers, methodical guides and certificates by Dilnoza Yuldasheva in applied linguistics and English language teaching.",
      },
    ],
  }),
  component: ResearchPage,
});

type Loc = { en: string; uz: string };

type Article = {
  id: number;
  title: Loc;
  journal: Loc;
  year: string;
  pages?: string;
  abstract: Loc;
  tag: string;
  url?: string;
};

type Manual = {
  id: number;
  title: Loc;
  desc: Loc;
  year: string;
  pages: string;
  url: string;
};

type Certificate = {
  id: number;
  title: Loc;
  issuer: Loc;
  year: string;
  color: string;
  url: string;
};

const ARTICLES: Article[] = [
  {
    id: 1,
    title: {
      en: "The Place of Pragmatic Competence in Teaching a Foreign Language",
      uz: "Chet tilini o'qitishda pragmatik kompetensiyaning o'rni",
    },
    journal: {
      en: "Foreign Linguistics & Linguodidactics · Vol 3 (6/S)",
      uz: "Xorijiy lingvistika va lingvodidaktika · 3-jild (6/S)",
    },
    year: "2025",
    pages: "278–287",
    abstract: {
      en: "A review of pragmatics and pragmatic competence as an essential part of language competence, highlighting its pedagogical significance in foreign-language education.",
      uz: "Pragmatika va pragmatik kompetensiyani til kompetensiyasining muhim qismi sifatida ko'rib chiqib, uning chet til ta'limidagi pedagogik ahamiyatini yoritadi.",
    },
    tag: "Pragmatics",
    url: "https://inscience.uz/index.php/foreign-linguistics/article/view/7005",
  },
  {
    id: 2,
    title: {
      en: "Theoretical Foundations of Individual and Pragmatic Approaches in Teaching English",
      uz: "Ingliz tilini o'qitishda individual va pragmatik yondashuvlarning nazariy asoslari",
    },
    journal: {
      en: "Inter Education & Global Study · 3(9)",
      uz: "Inter Education & Global Study · 3(9)",
    },
    year: "2025",
    pages: "161–168",
    abstract: {
      en: "Examines the theoretical foundations of individual and pragmatic approaches oriented toward learners' personal characteristics and language as a practical tool.",
      uz: "Individual va pragmatik yondashuvlarning nazariy asoslarini, o'quvchilarning shaxsiy xususiyatlari va tilni amaliy vosita sifatida qo'llashni yoritadi.",
    },
    tag: "Methodology",
    url: "https://www.researcher.uz/ru/article/ingliz-tilini-o-qitishda-individual-va-pragmatik-yondashuvlarning-nazariy-asoslari-105364",
  },
  {
    id: 3,
    title: {
      en: "Hybrid Deep Clustering Framework for Unsupervised Pattern Recognition in Complex Datasets",
      uz: "Murakkab ma'lumotlar to'plamlarida nazoratsiz naqsh aniqlash uchun gibrid chuqur klasterlash tizimi",
    },
    journal: {
      en: "Springer · Lecture Notes in Networks and Systems, Vol 1944 (HMMOCS 2025)",
      uz: "Springer · Lecture Notes in Networks and Systems, 1944-jild (HMMOCS 2025)",
    },
    year: "2026",
    pages: "311–316",
    abstract: {
      en: "A co-authored conference paper introducing a hybrid deep-clustering framework for unsupervised pattern recognition in complex, high-dimensional datasets.",
      uz: "Murakkab, yuqori o'lchamli ma'lumotlar to'plamlarida nazoratsiz naqsh aniqlash uchun gibrid chuqur klasterlash tizimini taqdim etuvchi hammualliflik konferensiya maqolasi.",
    },
    tag: "Conference",
    url: "https://link.springer.com/chapter/10.1007/978-3-032-24402-4_32",
  },
  {
    id: 4,
    title: {
      en: "Technologies for Implementing Individual and Pragmatic Approaches in English Lessons",
      uz: "Ingliz tili darslarida individual va pragmatik yondashuvni amalga oshirish texnologiyalari",
    },
    journal: {
      en: "Scientific-methodical journal",
      uz: "Ilmiy-metodik jurnal",
    },
    year: "2025",
    abstract: {
      en: "Analyzes modern pedagogical technologies for individualized and pragmatic teaching; a pedagogical experiment shows significant gains in learners' communicative competence.",
      uz: "Individual va pragmatik ta'limning zamonaviy pedagogik texnologiyalarini tahlil qiladi; pedagogik eksperiment o'quvchilarning kommunikativ kompetensiyasi sezilarli oshganini ko'rsatadi.",
    },
    tag: "Pedagogy",
    url: "/research/pub-individual-pragmatic-tech.pdf",
  },
  {
    id: 5,
    title: {
      en: "The Issues of Teaching Uzbek Students English",
      uz: "O'zbek o'quvchilariga ingliz tilini o'qitish masalalari",
    },
    journal: {
      en: "Academic Research in Modern Science (Int'l Conference)",
      uz: "Academic Research in Modern Science (xalqaro konferensiya)",
    },
    year: "2024",
    abstract: {
      en: "Discusses methods and challenges of teaching English in Uzbekistan and the shift from teacher-centered to student-centered instruction.",
      uz: "O'zbekistonda ingliz tilini o'qitish usullari va muammolarini, o'qituvchi-markazli yondashuvdan o'quvchi-markazli ta'limga o'tishni muhokama qiladi.",
    },
    tag: "ELT",
    url: "/research/pub-issues-teaching-english.pdf",
  },
  {
    id: 6,
    title: {
      en: "The Role of Teaching Literature in Higher Education",
      uz: "Oliy ta'limda adabiyot o'qitishning o'rni",
    },
    journal: {
      en: "Models and Methods in Modern Science (Int'l Conference)",
      uz: "Models and Methods in Modern Science (xalqaro konferensiya)",
    },
    year: "2024",
    abstract: {
      en: "Explores the role of literature in higher education and its value for language and culture learning.",
      uz: "Oliy ta'limda adabiyot o'qitishning o'rni va uning til hamda madaniyatni o'rganishdagi ahamiyatini yoritadi.",
    },
    tag: "Pedagogy",
    url: "/research/pub-teaching-literature.pdf",
  },
  {
    id: 7,
    title: {
      en: "Using Modern Technologies in Teaching and Learning English",
      uz: "Ingliz tilini o'qitish va o'rganishda zamonaviy texnologiyalardan foydalanish",
    },
    journal: {
      en: "Scientific-methodical article",
      uz: "Ilmiy-metodik maqola",
    },
    year: "2024",
    abstract: {
      en: "On the appropriate use of modern technologies in English teaching and the teacher's role in keeping lessons engaging and effective.",
      uz: "Ingliz tili o'qitishda zamonaviy texnologiyalardan o'rinli foydalanish va darslarni qiziqarli hamda samarali qilishda o'qituvchining roli haqida.",
    },
    tag: "EdTech",
    url: "/research/pub-modern-technologies.pdf",
  },
  {
    id: 8,
    title: {
      en: "Modern Interactive Games in Teaching English",
      uz: "Ingliz tilini o'qitishda zamonaviy interaktiv o'yinlar",
    },
    journal: {
      en: "Scientific-methodical article",
      uz: "Ilmiy-metodik maqola",
    },
    year: "2024",
    abstract: {
      en: "On integrating modern interactive games into English lessons to raise engagement and learning outcomes.",
      uz: "Ingliz tili darslariga zamonaviy interaktiv o'yinlarni jalb qilib, faollik va natijadorlikni oshirish haqida.",
    },
    tag: "EdTech",
    url: "/research/pub-interactive-games.pdf",
  },
];

const MANUALS: Manual[] = [
  {
    id: 1,
    title: {
      en: "Improving Language-Teaching Effectiveness with Wordwall — A Methodical Manual for All Grades",
      uz: "Wordwall dasturidan foydalanib til o'rgatish samaradorligini oshirish — barcha sinflar uchun metodik qo'llanma",
    },
    desc: {
      en: "A comprehensive teaching manual on using the Wordwall program across all school grades.",
      uz: "Barcha maktab sinflarida Wordwall dasturidan foydalanish bo'yicha keng qamrovli metodik qo'llanma.",
    },
    year: "2026",
    pages: "43",
    url: "/research/guide-wordwall-manual.pdf",
  },
  {
    id: 2,
    title: {
      en: "Using Wordwall Program Games in English Lessons",
      uz: "Ingliz tili darslarida Wordwall dasturi o'yinlaridan foydalanish",
    },
    desc: {
      en: "A methodical recommendation on applying Wordwall interactive games in the classroom.",
      uz: "Sinfda Wordwall interaktiv o'yinlarini qo'llash bo'yicha metodik tavsiya.",
    },
    year: "2025",
    pages: "12",
    url: "/research/guide-wordwall-recommendation.pdf",
  },
];

const CERTIFICATES: Certificate[] = [
  {
    id: 1,
    title: {
      en: "Future English Teacher Development Programme",
      uz: "Future English Teacher Development dasturi",
    },
    issuer: {
      en: "British Council · Online Teacher Community",
      uz: "British Council · Online Teacher Community",
    },
    year: "2023",
    color: "from-indigo-500 to-blue-600",
    url: "/research/cert-british-council.pdf",
  },
  {
    id: 2,
    title: {
      en: "Certificate of Originality (89.84%)",
      uz: "Originallik sertifikati (89.84%)",
    },
    issuer: {
      en: "Perspective Team Anti-Plagiarism",
      uz: "Perspective Team antiplagiat",
    },
    year: "2026",
    color: "from-emerald-500 to-teal-600",
    url: "/research/cert-originality.pdf",
  },
  {
    id: 3,
    title: {
      en: "Publication Certificate",
      uz: "Nashr sertifikati",
    },
    issuer: {
      en: "Foreign Linguistics & Linguodidactics",
      uz: "Xorijiy lingvistika va lingvodidaktika",
    },
    year: "2025",
    color: "from-violet-500 to-purple-600",
    url: "/research/cert-publication.pdf",
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

          {/* Author card */}
          <div className="mt-8 inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 max-w-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{t("research.authorName")}</div>
              <div className="text-xs text-white/60">{t("research.authorRole")}</div>
            </div>
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
              <Card key={a.id} className="p-6 bg-white/[0.04] border-white/10 text-white hover:border-indigo-400/40 hover:bg-white/[0.06] transition-all flex flex-col">
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
                  {a.pages ? ` · ${t("research.pagesLabel")} ${a.pages}` : ""}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">{a.abstract[lang]}</p>
                {a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 hover:text-indigo-200 transition self-start"
                  >
                    {t("research.viewSource")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* METHODICAL GUIDES */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-6 h-6 text-teal-300" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("research.manualsTitle")}</h2>
          </div>
          <p className="text-white/50 mb-10">{t("research.manualsSubtitle")}</p>

          <div className="grid md:grid-cols-2 gap-5">
            {MANUALS.map((m) => (
              <Card key={m.id} className="p-6 bg-white/[0.04] border-white/10 text-white hover:border-teal-400/40 transition-all flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-200 text-xs font-medium">
                    <BookOpen className="w-3 h-3" />
                    {t("research.manualTag")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-white/50">
                    <Calendar className="w-3 h-3" />
                    {m.year}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 leading-snug">{m.title[lang]}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-3 flex-1">{m.desc[lang]}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/45">{m.pages} {t("research.pagesLabel")}</span>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-300 hover:text-teal-200 transition"
                  >
                    {t("research.viewSource")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-amber-300" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("research.certsTitle")}</h2>
          </div>
          <p className="text-white/50 mb-10">{t("research.certsSubtitle")}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CERTIFICATES.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="p-5 bg-white/[0.04] border-white/10 text-white hover:border-white/25 transition-all h-full">
                  <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Award className="w-12 h-12 text-white/90" />
                  </div>
                  <h3 className="font-semibold text-sm leading-snug mb-1">{c.title[lang]}</h3>
                  <div className="text-xs text-white/50 mb-3">{c.issuer[lang]} · {c.year}</div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 group-hover:text-white transition">
                    {t("research.viewCertificate")}
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </Card>
              </a>
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
