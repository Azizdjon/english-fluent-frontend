import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const Route = createFileRoute('/teacher/messages')({
  component: Messages,
});

const conversations = [
  {
    id: 1, name: 'Alex Johnson', avatar: 'AJ', time: '2m ago', unread: 2,
    messages: [
      { from: 'student', text: 'Hi! I have a question about the homework.', time: '10:30' },
      { from: 'student', text: 'Can you clarify exercise 3?', time: '10:31' },
      { from: 'teacher', text: 'Of course! Exercise 3 asks you to use Present Perfect.', time: '10:35' },
    ]
  },
  {
    id: 2, name: 'Sarah Chen', avatar: 'SC', time: '1h ago', unread: 0,
    messages: [
      { from: 'teacher', text: 'Great work on your essay, Sarah!', time: '09:10' },
      { from: 'student', text: 'Thank you so much! I worked really hard on it.', time: '09:15' },
      { from: 'teacher', text: 'Your vocabulary usage was impressive.', time: '09:20' },
    ]
  },
  {
    id: 3, name: 'Marco Rossi', avatar: 'MR', time: 'Yesterday', unread: 1,
    messages: [
      { from: 'student', text: 'I missed class today, what did we cover?', time: 'Yesterday' },
      { from: 'teacher', text: 'We covered Past Continuous tense. Check the lesson notes.', time: 'Yesterday' },
    ]
  },
  {
    id: 4, name: 'Yuki Tanaka', avatar: 'YT', time: '2d ago', unread: 0,
    messages: [
      { from: 'student', text: 'Could you recommend resources for C1 preparation?', time: '2d ago' },
      { from: 'teacher', text: 'I recommend Cambridge Advanced Grammar in Use.', time: '2d ago' },
      { from: 'student', text: 'Perfect, thank you!', time: '2d ago' },
    ]
  },
];

function Messages() {
  const [active, setActive] = useState(conversations[0]);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Record<number, typeof conversations[0]['messages']>>(
    Object.fromEntries(conversations.map(c => [c.id, c.messages]))
  );

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { from: 'teacher' as const, text: input.trim(), time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) };
    setMsgs(prev => ({ ...prev, [active.id]: [...(prev[active.id] || []), newMsg] }));
    setInput('');
    toast.success('Message sent!');
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl border overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 border-r flex flex-col">
        <div className="p-4 border-b font-semibold text-lg">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => setActive(c)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 ${active.id === c.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">{c.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm truncate">{c.name}</span>
                  <span className="text-xs text-gray-400 ml-1 flex-shrink-0">{c.time}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">{(msgs[c.id]||[]).slice(-1)[0]?.text || '...'}</div>
              </div>
              {c.unread > 0 && <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">{c.unread}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">{active.avatar}</div>
          <div>
            <div className="font-semibold">{active.name}</div>
            <div className="text-xs text-gray-500">Student</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(msgs[active.id] || []).map((m, i) => (
            <div key={i} className={`flex ${m.from === 'teacher' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.from === 'teacher' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p>{m.text}</p>
                <p className={`text-xs mt-1 ${m.from === 'teacher' ? 'text-blue-200' : 'text-gray-400'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={send} size="sm"><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}
