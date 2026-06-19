import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Clock, BookOpen,
  Volume2, Star, Play, List, X
} from "lucide-react";

export const Route = createFileRoute("/student/lessons/$id")({
  component: LessonPlayerPage,
});

interface Lesson {
  id: string; title: string; content: string; video_url: string | null;
  order_index: number; duration_minutes: number; module_id: string;
  wordwall_url?: string | null;
  lesson_type?: "lesson" | "quiz" | "wordwall" | null;
  answers?: Record<string, string> | null;
}

interface SideLesson { id: string; title: string; order_index: number; module_title: string; }

// Built-in rich content keyed by lesson title keywords
const LESSON_CONTENT: Record<string, { vocab: [string, string][]; grammar: string; examples: string[]; tip: string }> = {
  "Hello & Goodbye": {
    vocab: [["Hello", "A warm greeting used any time of day"], ["Hi", "Informal and friendly greeting"], ["Good morning", "Used before noon"], ["Good afternoon", "Used from noon to 6pm"], ["Good evening", "Used after 6pm"], ["Goodbye", "Said when leaving"], ["See you later", "Informal farewell"], ["Take care", "A warm goodbye"]],
    grammar: "Use \"Hello\" or \"Hi\" when meeting someone. Use \"Goodbye\" or \"Bye\" when leaving. \"Good morning/afternoon/evening\" are formal greetings based on time of day.",
    examples: ["Hello! How are you?", "Hi there! Nice to meet you.", "Good morning, everyone!", "Goodbye, see you tomorrow!", "Bye! Take care!"],
    tip: "In English, it is very common to smile when you greet someone. Always make eye contact!"
  },
  "My Name Is": {
    vocab: [["My name is", "Used to introduce yourself"], ["I am / I'm", "Contraction of I am"], ["What's your name?", "Asking someone's name"], ["Nice to meet you", "Polite phrase when introduced"], ["Pleased to meet you", "Formal version"], ["How do you do?", "Very formal British greeting"]],
    grammar: "To introduce yourself: \"My name is [Name]\" or \"I'm [Name]\". To ask: \"What's your name?\" or \"What is your name?\"",
    examples: ["My name is John. What's your name?", "I'm Sarah. Nice to meet you!", "Hello, I'm Mr. Brown. Pleased to meet you.", "Hi! My name is Alex. And you?"],
    tip: "When someone says 'Nice to meet you,' always reply 'Nice to meet you too!'"
  },
  "How Are You": {
    vocab: [["How are you?", "Asking about someone's wellbeing"], ["I'm fine", "A neutral positive response"], ["I'm great", "Very positive response"], ["Not bad", "An okay response"], ["Pretty good", "Informal positive response"], ["Could be better", "Politely saying not great"], ["I'm doing well", "Formal positive response"]],
    grammar: "Question: \"How are you?\" / \"How are you doing?\" Responses: \"I'm [adjective].\" + \"And you?\" or \"How about you?\"",
    examples: ["A: How are you? B: I'm fine, thanks! And you?", "A: How are you doing? B: Pretty good, thank you!", "A: How are you today? B: Not bad, could be better."],
    tip: "In English culture, 'How are you?' is often just a greeting — people usually expect a short positive answer!"
  },
  "Numbers": {
    vocab: [["One, Two, Three", "Basic counting numbers"], ["Ten, Twenty, Thirty", "Tens"], ["Hundred, Thousand", "Large numbers"], ["First, Second, Third", "Ordinal numbers"], ["Zero / Nought", "The number 0"]],
    grammar: "Cardinal numbers (1, 2, 3) are used for counting. Ordinal numbers (1st, 2nd, 3rd) are used for order and dates.",
    examples: ["I have two cats and three dogs.", "She lives on the 5th floor.", "The price is twenty-five dollars.", "Call me at 0-800-123-456."],
    tip: "Remember: 'teen' (13-19) vs 'ty' (30, 40...). Thirteen vs Thirty — listen carefully!"
  },
  "Email Structure": {
    vocab: [["Subject line", "The topic of the email"], ["Salutation", "The greeting (Dear Mr...)"], ["Body", "The main content"], ["Closing", "How you end (Regards, Sincerely)"], ["Attachment", "A file sent with the email"], ["CC / BCC", "Carbon copy / blind carbon copy"]],
    grammar: "Formal emails: Dear Mr./Ms. [Last Name] → Body → Yours sincerely / Kind regards. Informal: Hi [Name] → Body → Best / Thanks.",
    examples: ["Dear Mr. Smith, I am writing regarding...", "Hi Sarah, Just wanted to check in...", "Please find the report attached.", "Kind regards, John"],
    tip: "Always proofread before sending! Check the subject line — it's the first thing people read."
  },
  "default": {
    vocab: [["Practice", "To do something repeatedly to improve"], ["Vocabulary", "The words you know in a language"], ["Fluency", "Speaking smoothly and naturally"], ["Grammar", "Rules of a language"], ["Pronunciation", "How words sound when spoken"]],
    grammar: "Keep practicing every day. Consistency is the key to learning English fluently!",
    examples: ["I practice English every morning.", "My vocabulary is growing every day.", "She speaks with great fluency.", "Good grammar helps you communicate clearly."],
    tip: "The best way to learn English is to use it every day — read, write, speak, and listen!"
  }
};

function getLessonContent(title: string) {
  for (const key of Object.keys(LESSON_CONTENT)) {
    if (key !== "default" && title.toLowerCase().includes(key.toLowerCase().split(" ")[0].toLowerCase())) {
      return LESSON_CONTENT[key];
    }
  }
  return LESSON_CONTENT["default"];
}

// Hardcoded video overrides per lesson ID
const VIDEO_OVERRIDES: Record<string, string> = {"cccccccc-0001-0001-0001-000000000001":"jXRvqhDJrNY","cccccccc-0002-0002-0002-000000000002":"jXRvqhDJrNY","cccccccc-0003-0003-0003-000000000003":"jXRvqhDJrNY","cccccccc-0004-0004-0004-000000000004":"R39eRjPnfKM","cccccccc-0005-0005-0005-000000000005":"R39eRjPnfKM","cccccccc-0006-0006-0006-000000000006":"fXew-Tfi9tg","cccccccc-0007-0007-0007-000000000007":"rDUwWGzwBl8","cccccccc-0008-0008-0008-000000000008":"rDUwWGzwBl8","cccccccc-0010-0010-0010-000000000010":"rDUwWGzwBl8","cccccccc-0011-0011-0011-000000000011":"rDUwWGzwBl8","cccccccc-0012-0012-0012-000000000012":"rDUwWGzwBl8","cccccccc-0001-0000-0000-000000000001":"10pDdoZJueE","cccccccc-0002-0000-0000-000000000002":"10pDdoZJueE","cccccccc-0003-0000-0000-000000000003":"10pDdoZJueE","cccccccc-0007-0000-0000-000000000007":"R39eRjPnfKM","cccccccc-0011-0000-0000-000000000011":"jXRvqhDJrNY","cccccccc-0012-0000-0000-000000000012":"jXRvqhDJrNY","cccccccc-0037-0000-0000-000000000037":"xWakS5Q2qTs","cccccccc-0039-0000-0000-000000000039":"hrMjAkIN0s8","cccccccc-0043-0000-0000-000000000043":"GcmjPSzbmgg","cccccccc-0047-0000-0000-000000000047":"iCPI-qYF_uA","cccccccc-0051-0000-0000-000000000051":"j77ClxVUqw8","cccccccc-0056-0000-0000-000000000056":"jXRvqhDJrNY","cccccccc-0060-0000-0000-000000000060":"cRk8Me1aXF0","cccccccc-0064-0000-0000-000000000064":"wqP-4LPSfNo","cccccccc-0069-0000-0000-000000000069":"Ftqrxnrfvwo","cccccccc-0070-0000-0000-000000000070":"Ftqrxnrfvwo"};

function getYouTubeEmbed(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (m) return "https://www.youtube.com/embed/" + m[1] + "?rel=0&modestbranding=1";
  if (url.includes("youtube.com/embed/")) return url;
  return null;
}

function isWordwall(url: string | null): boolean {
  return !!url && url.includes("wordwall.net");
}

interface QuizQuestion { num: number; text: string; options: { letter: string; text: string }[]; }

function parseQuiz(content: string): QuizQuestion[] {
  if (!content) return [];
  const text = content.replace(/\s+/g, " ").trim();
  // Split on question numbers: digit followed by space and capital letter
  const parts = text.split(/(?=\b\d+\s+[A-Z])/);
  const questions: QuizQuestion[] = [];
  for (const part of parts) {
    const trimmed = part.trim();
    const numMatch = trimmed.match(/^(\d+)\s+/);
    if (!numMatch) continue;
    const num = parseInt(numMatch[1], 10);
    const withoutNum = trimmed.slice(numMatch[0].length);
    const optStart = withoutNum.search(/\bA\)/);
    if (optStart === -1) continue;
    const qText = withoutNum.slice(0, optStart).trim().replace(/[\s:.-]+$/, "");
    const optionsPart = withoutNum.slice(optStart);
    const optRegex = /([A-E])\)\s*([\s\S]*?)(?=\s+[A-E]\)|$)/g;
    const opts: { letter: string; text: string }[] = [];
    let om: RegExpExecArray | null;
    while ((om = optRegex.exec(optionsPart)) !== null) {
      const t = om[2].trim();
      if (t) opts.push({ letter: om[1], text: t });
    }
    if (opts.length < 2) continue;
    questions.push({ num, text: qText, options: opts });
  }
  return questions;
}


export default function LessonPlayerPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [sideList, setSideList] = useState<SideLesson[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [id]);

  async function loadLesson() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate({ to: "/login" }); return; }

    const { data: l } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (!l) { setLoading(false); return; }
    setLesson(l);

    const { data: prog } = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("student_id", user.id)
      .eq("lesson_id", id)
      .eq("completed", true)
      .single();
    setCompleted(!!prog);

    const { data: modLessons } = await supabase
      .from("lessons")
      .select("id,title,order_index,module_id")
      .eq("module_id", l.module_id)
      .order("order_index");

    const { data: mod } = await supabase.from("modules").select("title").eq("id", l.module_id).single();
    setSideList((modLessons || []).map((ml: any) => ({ ...ml, module_title: mod?.title || "" })));
    setLoading(false);
  }

  async function markComplete() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || completed) return;
    setMarking(true);
    await supabase.from("lesson_progress").upsert({
      student_id: user.id, lesson_id: id, completed: true, completed_at: new Date().toISOString()
    });
    setCompleted(true);
    setMarking(false);
  }

  async function submitQuiz(questions: QuizQuestion[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !lesson) return;
    setSubmittingQuiz(true);
    const answerKey = lesson.answers || {};
    let score = 0;
    const total = questions.length;
    for (const q of questions) {
      const correct = answerKey[String(q.num)];
      if (correct && quizAnswers[q.num] && quizAnswers[q.num].toUpperCase() === String(correct).toUpperCase()) {
        score++;
      }
    }
    setQuizScore({ score, total });
    setQuizSubmitted(true);
    await supabase.from("test_attempts").insert({
      student_id: user.id,
      lesson_id: id,
      answers: quizAnswers,
      score,
      total,
    });
    if (Object.keys(answerKey).length === 0 || score === total) {
      await supabase.from("lesson_progress").upsert({
        student_id: user.id, lesson_id: id, completed: true, completed_at: new Date().toISOString()
      });
      setCompleted(true);
    }
    setSubmittingQuiz(false);
  }

  const currentIdx = sideList.findIndex(l => l.id === id);
  const prevLesson = currentIdx > 0 ? sideList[currentIdx - 1] : null;
  const nextLesson = currentIdx < sideList.length - 1 ? sideList[currentIdx + 1] : null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading lesson...</p>
      </div>
    </div>
  );

  if (!lesson) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center space-y-4">
        <BookOpen className="w-16 h-16 text-slate-600 mx-auto" />
        <p className="text-slate-400 text-lg">Lesson not found</p>
        <button onClick={() => navigate({ to: "/student/lessons" })}
          className="text-blue-400 hover:text-blue-300 underline text-sm">Back to lessons</button>
      </div>
    </div>
  );

  const rc = getLessonContent(lesson.title);
  const _ov=VIDEO_OVERRIDES[lesson.id]; const embedUrl=_ov?"https://www.youtube.com/embed/"+_ov+"?rel=0&modestbranding=1":getYouTubeEmbed(lesson.video_url);
  const wordwallUrl = isWordwall(lesson.video_url) ? lesson.video_url : null;
  const lessonType = lesson.lesson_type || "lesson";
  const quizQuestions = lessonType === "quiz" ? parseQuiz(lesson.content || "") : [];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* Top nav bar */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate({ to: "/student/lessons" })}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="w-px h-5 bg-slate-700" />
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-semibold text-sm md:text-base truncate">{lesson.title}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500 text-xs">{lesson.duration_minutes} min</span>
            {completed && (
              <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
          </div>
        </div>
        <button onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800">
          <List className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            {lessonType === "wordwall" && lesson.video_url && (
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
                <iframe
                  src={lesson.video_url}
                  style={{ width: "100%", height: 500, border: 0 }}
                  allowFullScreen
                  title={lesson.title}
                />
              </div>
            )}

            {lessonType === "quiz" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/20 rounded-2xl p-5">
                  <h2 className="text-white font-bold text-lg mb-1">{lesson.title}</h2>
                  <p className="text-slate-300 text-sm">
                    Answer all {quizQuestions.length} questions, then submit to see your score.
                  </p>
                </div>

                {quizQuestions.map((q) => {
                  const selected = quizAnswers[q.num];
                  const correct = lesson.answers?.[String(q.num)];
                  return (
                    <div key={q.num} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                      <p className="text-white font-medium mb-4">
                        <span className="text-purple-400 font-bold mr-2">{q.num}.</span>{q.text}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = selected === opt.letter;
                          let cls = "border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800";
                          if (quizSubmitted && correct) {
                            if (opt.letter === correct) cls = "border-green-500 bg-green-500/15 text-green-300";
                            else if (isSelected) cls = "border-red-500 bg-red-500/15 text-red-300";
                            else cls = "border-slate-800 text-slate-500";
                          } else if (isSelected) {
                            cls = "border-blue-500 bg-blue-500/15 text-blue-200";
                          }
                          return (
                            <button
                              key={opt.letter}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers((p) => ({ ...p, [q.num]: opt.letter }))}
                              className={"text-left px-4 py-2.5 rounded-xl border transition text-sm flex gap-2 items-start " + cls}
                            >
                              <span className="font-bold">{opt.letter})</span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {!quizSubmitted ? (
                  <button
                    onClick={() => submitQuiz(quizQuestions)}
                    disabled={submittingQuiz || Object.keys(quizAnswers).length !== quizQuestions.length}
                    className="w-full px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-purple-600/25"
                  >
                    {submittingQuiz ? "Submitting..." : "Submit Quiz"}
                  </button>
                ) : (
                  <div className="rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/10 border border-green-500/30 p-6 text-center">
                    <p className="text-green-300 text-sm uppercase tracking-wider font-semibold">Your Score</p>
                    <p className="text-white text-4xl font-bold mt-2">
                      {quizScore?.score} / {quizScore?.total}
                    </p>
                    {quizScore && quizScore.total > 0 && (
                      <p className="text-slate-300 text-sm mt-2">
                        {Math.round((quizScore.score / quizScore.total) * 100)}% correct
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {lessonType === "lesson" && (
              <>
                {embedUrl && (
                  <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
                    <div className="relative" style={{paddingTop: "56.25%"}}>
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        title={lesson.title}
                      />
                    </div>
                  </div>
                )}

                {wordwallUrl && !embedUrl && (
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl p-8 text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mx-auto">
                      <BookOpen className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-2">Interaktiv mashq</h3>
                      <p className="text-slate-400 text-sm">Wordwall mashqi yangi oynada ochiladi — cookie muammosi yo'q</p>
                    </div>
                    <a
                      href={wordwallUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/25 text-base"
                    >
                      <Play className="w-5 h-5" />
                      Mashqni boshlash
                    </a>
                  </div>
                )}

                <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg mb-1">{lesson.title}</h2>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {lesson.content || "In this lesson you will learn essential English expressions used in everyday communication."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <h3 className="text-white font-semibold">Key Vocabulary</h3>
                    <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{rc.vocab.length} words</span>
                  </div>
                  <div className="divide-y divide-slate-800">
                    {rc.vocab.map(([word, def], i) => (
                      <div key={i} className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-800/50 transition-colors">
                        <span className="text-blue-300 font-semibold text-sm min-w-[140px] flex-shrink-0">{word}</span>
                        <span className="text-slate-400 text-sm">{def}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-white font-semibold">Grammar Note</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/60 rounded-xl p-4 border-l-4 border-yellow-500/50">
                    {rc.grammar}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-400" />
                    <h3 className="text-white font-semibold">Example Sentences</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {rc.examples.map((ex, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-600/20 text-green-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-slate-200 text-sm italic">&ldquo;{ex}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <div>
                    <p className="text-amber-300 font-semibold text-sm mb-1">Pro Tip</p>
                    <p className="text-amber-100/80 text-sm leading-relaxed">{rc.tip}</p>
                  </div>
                </div>
              </>
            )}


            {/* Navigation + Complete */}
            <div className="grid grid-cols-3 gap-3 pb-8">
              <button
                onClick={() => prevLesson && navigate({ to: "/student/lessons/$id", params: { id: prevLesson.id } })}
                disabled={!prevLesson}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={markComplete}
                disabled={completed || marking}
                className={"flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition " +
                  (completed
                    ? "bg-green-600/20 text-green-400 border border-green-600/30 cursor-default"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25")}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completed ? "Completed!" : marking ? "Saving..." : "Mark Complete"}
              </button>

              <button
                onClick={() => nextLesson && navigate({ to: "/student/lessons/$id", params: { id: nextLesson.id } })}
                disabled={!nextLesson}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — desktop always visible, mobile overlay */}
        <>
          {showSidebar && (
            <div className="fixed inset-0 z-40 md:hidden bg-black/60" onClick={() => setShowSidebar(false)} />
          )}
          <aside className={"md:w-72 md:flex-shrink-0 md:border-l md:border-slate-800 md:overflow-y-auto md:bg-slate-900 md:static " +
            "fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 border-l border-slate-800 overflow-y-auto transition-transform duration-300 " +
            (showSidebar ? "translate-x-0" : "translate-x-full md:translate-x-0")}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <span className="text-white font-semibold text-sm">Lesson List</span>
              <button onClick={() => setShowSidebar(false)} className="md:hidden text-slate-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            {sideList.length === 0
              ? <p className="text-slate-500 text-xs text-center py-8">No lessons found</p>
              : (
                <div className="py-2">
                  {sideList[0].module_title && (
                    <div className="px-4 py-2">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{sideList[0].module_title}</span>
                    </div>
                  )}
                  {sideList.map((sl, i) => (
                    <button key={sl.id}
                      onClick={() => { navigate({ to: "/student/lessons/$id", params: { id: sl.id } }); setShowSidebar(false); }}
                      className={"w-full flex items-center gap-3 px-4 py-2.5 text-left transition " +
                        (sl.id === id ? "bg-blue-600/20 text-blue-300" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200")}>
                      <span className={"w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 " +
                        (sl.id === id ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400")}>
                        {i + 1}
                      </span>
                      <span className="text-sm truncate">{sl.title}</span>
                    </button>
                  ))}
                </div>
              )}
          </aside>
        </>
      </div>
    </div>
  );
}
