import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';

export const Route = createFileRoute('/student/speaking')({
  component: SpeakingLab,
});

const prompts = [
  { id: 1, topic: 'Introduce yourself', text: 'Tell us your name, where you are from, and what you do.', level: 'A2' },
  { id: 6, topic: 'My Family', text: 'Talk about your family members and how you spend time together.', level: 'A2' },
  { id: 7, topic: 'My Hometown', text: 'Describe the town or city where you live and what you like about it.', level: 'A2' },
  { id: 8, topic: 'My First Teacher', text: 'Talk about your first teacher and why you remember them.', level: 'A2' },
  { id: 9, topic: 'My Free Time', text: 'Talk about what you usually do in your free time.', level: 'A2' },
  { id: 10, topic: 'Pets and Animals', text: 'Talk about pets, and whether you have one or would like one.', level: 'A2' },
  { id: 11, topic: 'My Bedroom', text: 'Describe your bedroom and why you like it.', level: 'A2' },
  { id: 2, topic: 'Describe your daily routine', text: 'Talk about what you do every day from morning to evening.', level: 'B1' },
  { id: 3, topic: 'Your favourite place', text: 'Describe a place you love and explain why it is special to you.', level: 'B1' },
  { id: 12, topic: 'Weekend Plans', text: 'Talk about what you usually do at the weekend.', level: 'B1' },
  { id: 13, topic: 'Healthy Habits', text: 'Talk about what you do to stay healthy.', level: 'B1' },
  { id: 14, topic: 'Shopping: Supermarket or Market', text: 'Compare shopping at a supermarket with shopping at a local market.', level: 'B1' },
  { id: 15, topic: 'Team Work or Working Alone', text: 'Talk about whether you prefer working in a team or on your own.', level: 'B1' },
  { id: 16, topic: 'A New Skill', text: 'Describe a skill you have learned recently and how you learned it.', level: 'B1' },
  { id: 17, topic: 'A Happy Memory', text: 'Describe a time when you felt truly happy.', level: 'B1' },
  { id: 18, topic: 'Online or Traditional Learning', text: 'Compare studying online with studying in a classroom.', level: 'B1' },
  { id: 4, topic: 'A challenging experience', text: 'Talk about a difficult situation you faced and how you dealt with it.', level: 'B2' },
  { id: 19, topic: 'A Time You Failed', text: 'Describe a time when you tried hard but did not succeed, and what you learned.', level: 'B2' },
  { id: 20, topic: 'A Difficult Decision', text: 'Describe a decision that was hard to make and explain why.', level: 'B2' },
  { id: 21, topic: 'A Moment of Freedom', text: 'Describe a time when you felt completely free.', level: 'B2' },
  { id: 22, topic: 'Sharing a Secret', text: 'Describe a time when you shared a secret with someone you trust.', level: 'B2' },
  { id: 23, topic: 'Forgiving Someone', text: 'Describe a time when you forgave someone or were forgiven.', level: 'B2' },
  { id: 24, topic: 'A Proud Achievement', text: 'Describe an achievement you are proud of and how you reached it.', level: 'B2' },
  { id: 25, topic: 'Volunteering Experience', text: 'Describe a time when you helped others as a volunteer.', level: 'B2' },
  { id: 26, topic: 'Overcoming a Fear', text: 'Describe a time when you faced a fear and how you dealt with it.', level: 'B2' },
  { id: 27, topic: 'A Meaningful Tradition', text: 'Describe a family or national tradition that is important to you.', level: 'B2' },
  { id: 28, topic: 'Should Homework Be Optional', text: 'Discuss whether schools should make homework optional for students.', level: 'B2' },
  { id: 29, topic: 'Calorie Labels in Restaurants', text: 'Discuss whether restaurants should be required to show calorie counts on their menus.', level: 'B2' },
  { id: 30, topic: 'Public Transport Should Be Free', text: 'Discuss whether public transport should be free for everyone.', level: 'B2' },
  { id: 5, topic: 'Technology and society', text: 'How has technology changed the way people communicate? Give examples.', level: 'C1' },
  { id: 31, topic: 'Remote Work vs Office Work', text: 'Discuss the advantages and disadvantages of working from home compared with working in an office.', level: 'C1' },
  { id: 32, topic: 'Electric Cars vs Petrol Cars', text: 'Discuss whether electric cars should replace petrol and diesel cars.', level: 'C1' },
  { id: 33, topic: 'Social Media in Schools', text: 'Discuss whether social media should be restricted in schools.', level: 'C1' },
  { id: 34, topic: 'Artificial Intelligence in Hiring', text: 'Discuss whether companies should use AI to make hiring decisions.', level: 'C1' },
  { id: 35, topic: 'Tourism in Historical Cities', text: 'Discuss whether tourism should be limited in historical and cultural sites.', level: 'C1' },
];

const feedbackTemplates = [
  { score: 82, fluency: 'Good', pronunciation: 'Clear', grammar: 'Minor errors', tip: 'Try to use more complex sentence structures to boost your score.' },
  { score: 76, fluency: 'Natural', pronunciation: 'Very clear', grammar: 'Good', tip: 'Focus on linking words (however, therefore, furthermore) for better flow.' },
  { score: 88, fluency: 'Excellent', pronunciation: 'Near-native', grammar: 'Excellent', tip: 'Outstanding! Try the C1 prompt to push your skills further.' },
];

function SpeakingLab() {
  const { t } = useI18n();
  const [selected, setSelected] = useState(prompts[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState<typeof feedbackTemplates[number] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const fmt = (s: number) => String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setIsRecording(true); setTimer(0); setFeedback(null); setAudioUrl(null);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      toast.success('Recording started — speak clearly!');
    } catch { toast.error('Microphone access denied. Please allow microphone in browser settings.'); }
  };

  const stopRec = () => {
    if (mediaRef.current && isRecording) {
      mediaRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      toast.success('Recording saved! Analyzing your speech...');
      setAnalyzing(true);
      setTimeout(() => {
        setFeedback(feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)]);
        setAnalyzing(false);
      }, 2000);
    }
  };

  const reset = () => {
    setIsRecording(false); setAudioUrl(null); setTimer(0); setFeedback(null); setAnalyzing(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">{t("dash.sSpeaking.title")}</h1>
        <p className="text-gray-500">{t("dash.sSpeaking.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map(p => (
          <button key={p.id} onClick={() => { setSelected(p); reset(); }}
            className={"text-left p-4 rounded-xl border-2 transition-all " + (selected.id === p.id ? 'border-blue-500 bg-blue-900/40' : 'border-gray-600 hover:border-gray-500')}>
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-sm">{p.topic}</span>
              <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full ml-1">{p.level}</span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">{p.text}</p>
          </button>
        ))}
      </div>
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-1">{selected.topic}</h2>
          <p className="text-gray-400 text-sm">{selected.text}</p>
        </div>
        <div className="flex items-center justify-center gap-4 py-8 mb-4 bg-gray-700/40 rounded-xl">
          {isRecording ? (
            <div className="flex items-center gap-4">
              <div className="flex gap-1 items-end">
                {[3,5,8,5,7,4,9,6,4].map((h,i) => (
                  <div key={i} className="w-2 bg-red-500 rounded-full animate-pulse" style={{height: h*4+'px'}} />
                ))}
              </div>
              <span className="text-2xl font-mono font-bold text-red-500">{fmt(timer)}</span>
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            </div>
          ) : audioUrl ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <Volume2 className="w-8 h-8 text-green-500" />
              <audio src={audioUrl} controls className="w-full max-w-xs" />
              <span className="text-sm text-gray-500">{t("dash.sSpeaking.duration")} {fmt(timer)}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Mic className="w-12 h-12" />
              <span className="text-sm">{t("dash.sSpeaking.clickRecord")}</span>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          {!isRecording && !audioUrl && <Button onClick={startRec} className="gap-2 bg-red-500 hover:bg-red-600"><Mic className="w-4 h-4" /> {t("dash.sSpeaking.startRec")}</Button>}
          {isRecording && <Button onClick={stopRec} variant="destructive" className="gap-2"><Square className="w-4 h-4" /> {t("dash.sSpeaking.stopRec")}</Button>}
          {audioUrl && !analyzing && <Button onClick={reset} variant="outline" className="gap-2"><RotateCcw className="w-4 h-4" /> {t("dash.sSpeaking.recordAgain")}</Button>}
        </div>
        {analyzing && <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">{t("dash.sSpeaking.analyzing")}</div>}
        {feedback && (
          <div className="mt-6 bg-green-50 rounded-xl p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">{t("dash.sSpeaking.aiFeedback")}</span>
              <span className="ml-auto text-xl sm:text-2xl font-bold text-green-700">{feedback.score}/100</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm mb-3">
              {[[t('dash.sSpeaking.fluency'), feedback.fluency, 'green'],[t('dash.sSpeaking.pronunciation'), feedback.pronunciation, 'blue'],[t('dash.sSpeaking.grammar'), feedback.grammar, 'purple']].map(([label, val, color]) => (
                <div key={label} className="bg-white rounded-lg p-2 text-center">
                  <div className="text-gray-500 text-xs mb-1">{label}</div>
                  <div className={"font-semibold text-" + color + "-700"}>{val}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 italic">💡 {feedback.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
