import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/teacher/messages")({ component: MessagesPage });

function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedStudent]);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setCurrentUser(user);
    const [msgRes, studRes] = await Promise.all([
      supabase.from("messages").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order("created_at"),
      supabase.from("profiles").select("id,full_name,email").eq("role", "student"),
    ]);
    setMessages(msgRes.data || []);
    setStudents(studRes.data || []);
    if ((studRes.data || []).length > 0) setSelectedStudent(studRes.data![0].id);
    setLoading(false);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedStudent || !currentUser) return;
    const { data, error } = await supabase.from("messages").insert({
      sender_id: currentUser.id, receiver_id: selectedStudent, content: newMessage.trim(), is_read: false,
    }).select().single();
    if (!error && data) { setMessages(prev => [...prev, data]); setNewMessage(""); }
  }

  const convoMessages = messages.filter(m =>
    (m.sender_id === currentUser?.id && m.receiver_id === selectedStudent) ||
    (m.receiver_id === currentUser?.id && m.sender_id === selectedStudent)
  );
  const student = students.find(s => s.id === selectedStudent);

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>
      <div className="bg-gray-800 rounded-xl flex h-[500px] overflow-hidden">
        <div className="w-48 md:w-64 border-r border-gray-700 overflow-y-auto flex-shrink-0">
          {students.map(s => {
            const unread = messages.filter(m => m.sender_id === s.id && m.receiver_id === currentUser?.id && !m.is_read).length;
            return (
              <button key={s.id} onClick={() => setSelectedStudent(s.id)}
                className={`w-full text-left px-3 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700/50 ${selectedStudent === s.id ? "bg-gray-700" : ""}`}>
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium truncate">{s.full_name || s.email?.split("@")[0]}</p>
                  {unread > 0 && <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{unread}</span>}
                </div>
              </button>
            );
          })}
          {students.length === 0 && <p className="text-gray-400 text-sm p-4">No students</p>}
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-gray-700 flex-shrink-0">
            <p className="text-white font-medium text-sm">{student?.full_name || student?.email || "Select a student"}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {convoMessages.map(m => {
              const isMe = m.sender_id === currentUser?.id;
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${isMe ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}`}>
                    <p>{m.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                      {new Date(m.created_at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                    </p>
                  </div>
                </div>
              );
            })}
            {convoMessages.length === 0 && <p className="text-gray-400 text-center text-sm mt-8">No messages yet</p>}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-gray-700 flex gap-2 flex-shrink-0">
            <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..." className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-0" />
            <button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex-shrink-0">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
