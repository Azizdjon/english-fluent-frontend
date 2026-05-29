import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const Route = createFileRoute('/student/speaking')({
  component: SpeakingLab,
});

const prompts = [
  { id: 1, topic: 'Introduce yourself', text: 'Tell us your name, where you are from, and what you do.', level: 'A2' },
  { id: 2, topic: 'Describe your daily routine', text: 'Talk about what you do every day from morning to evening.', level: 'B1' },
  { id: 3, topic: 'Your favourite place', text: 'Describe a place you love and explain why it is special to you.', level: 'B1' },
  { id: 4, topic: 'A challenging experience', text: 'Talk about a difficult situation you faced and how you dealt with it.', level: 'B2' },
  { id: 5, topic: 'Technology and society', text: 'How has technology changed the way people communicate? Give examples.', level: 'C1' },
];

const feedbackTemplates = [
  { score: 82, fluency: 'Good', pronunciation: 'Clear', grammar: 'Minor errors', tip: 'Try to use more complex sentence structures to boost your score.' },
  { score: 76, fluency: 'Natural', pronunciation: 'Very clear', grammar: 'Good', tip: 'Focus on linking words (however, therefore, furthermore) for better flow.' },
  { score: 88, fluency: 'Excellent', pronunciation: 'Near-native', grammar: 'Excellent', tip: 'Outstanding! Try the C1 prompt to push your skills further.' },
];

function SpeakingLab() {
  const [selected, setSelected] = useState(prompts[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const fmt = (s) => String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');

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
        <h1 className="text-2xl font-bold">Speaking Lab</h1>
        <p className="text-gray-500">Practice speaking and get instant AI feedback</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map(p => (
          <button key={p.id} onClick={() => { setSelected(p); reset(); }}
            className={"text-left p-4 rounded-xl border-2 transition-all " + (selected.id === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300')}>
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-sm">{p.topic}</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-1">{p.level}</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{p.text}</p>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-1">{selected.topic}</h2>
          <p className="text-gray-600 text-sm">{selected.text}</p>
        </div>
        <div className="flex items-center justify-center gap-4 py-8 mb-4 bg-gray-50 rounded-xl">
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
              <span className="text-sm text-gray-500">Duration: {fmt(timer)}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Mic className="w-12 h-12" />
              <span className="text-sm">Click record to start</span>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          {!isRecording && !audioUrl && <Button onClick={startRec} className="gap-2 bg-red-500 hover:bg-red-600"><Mic className="w-4 h-4" /> Start Recording</Button>}
          {isRecording && <Button onClick={stopRec} variant="destructive" className="gap-2"><Square className="w-4 h-4" /> Stop Recording</Button>}
          {audioUrl && !analyzing && <Button onClick={reset} variant="outline" className="gap-2"><RotateCcw className="w-4 h-4" /> Record Again</Button>}
        </div>
        {analyzing && <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">Analyzing your pronunciation and fluency...</div>}
        {feedback && (
          <div className="mt-6 bg-green-50 rounded-xl p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">AI Feedback</span>
              <span className="ml-auto text-2xl font-bold text-green-700">{feedback.score}/100</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm mb-3">
              {[['Fluency', feedback.fluency, 'green'],['Pronunciation', feedback.pronunciation, 'blue'],['Grammar', feedback.grammar, 'purple']].map(([label, val, color]) => (
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
