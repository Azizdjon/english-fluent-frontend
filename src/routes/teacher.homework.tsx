import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckCircle, Clock, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/homework")({
  component: TeacherHomework,
});

interface Homework {
  id: string;
  title: string;
  description: string;
  type: string;
  due_date: string;
  created_at: string;
}

interface Submission {
  id: string;
  homework_id: string;
  student_id: string;
  status: string;
  grade: string | null;
  feedback: string | null;
  submitted_at: string | null;
  profiles?: { full_name: string; email: string };
}

function TeacherHomework() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [gradeModal, setGradeModal] = useState<Submission | null>(null);
  const [gradeValue, setGradeValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");
  const [saving, setSaving] = useState(false);

  const [newHw, setNewHw] = useState({
    title: "",
    description: "",
    type: "writing",
    due_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: hw } = await supabase
      .from("homework")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    setHomeworks(hw || []);

    const { data: subs } = await supabase
      .from("submissions")
      .select("*, profiles(full_name, email)")
      .in("homework_id", (hw || []).map((h: Homework) => h.id));

    setSubmissions(subs || []);
    setLoading(false);
  }

  async function createHomework() {
    if (!newHw.title.trim()) { toast.error("Sarlavha kiriting"); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("homework").insert({
      teacher_id: user?.id,
      title: newHw.title,
      description: newHw.description,
      type: newHw.type,
      due_date: newHw.due_date || null,
    });
    setSaving(false);
    if (error) { toast.error("Xato: " + error.message); return; }
    toast.success("Vazifa yaratildi!");
    setShowNewModal(false);
    setNewHw({ title: "", description: "", type: "writing", due_date: "" });
    fetchData();
  }

  async function saveGrade() {
    if (!gradeModal || !gradeValue) { toast.error("Baho tanlang"); return; }
    setSaving(true);
    const { error } = await supabase
      .from("submissions")
      .update({ grade: gradeValue, feedback: feedbackValue, status: "graded", graded_at: new Date().toISOString() })
      .eq("id", gradeModal.id);
    setSaving(false);
    if (error) { toast.error("Xato: " + error.message); return; }
    toast.success("Baho saqlandi!");
    setGradeModal(null);
    setGradeValue("");
    setFeedbackValue("");
    fetchData();
  }

  function openGradeModal(sub: Submission) {
    setGradeModal(sub);
    setGradeValue(sub.grade || "");
    setFeedbackValue(sub.feedback || "");
  }

  const submitted = submissions.filter(s => s.status === "submitted" || s.status === "graded");
  const graded = submissions.filter(s => s.status === "graded");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vazifalar</h1>
          <p className="text-gray-500">O'quvchilar vazifalarini boshqaring</p>
        </div>
        <Button onClick={() => setShowNewModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yangi vazifa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{homeworks.length}</p>
              <p className="text-sm text-gray-500">Jami vazifalar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{submitted.length}</p>
              <p className="text-sm text-gray-500">Topshirilgan</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{graded.length}</p>
              <p className="text-sm text-gray-500">Baholangan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions to grade */}
      {submitted.filter(s => s.status === "submitted").length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Baholash kutilmoqda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {submitted.filter(s => s.status === "submitted").map(sub => {
              const hw = homeworks.find(h => h.id === sub.homework_id);
              return (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium">{sub.profiles?.full_name || "O'quvchi"}</p>
                    <p className="text-sm text-gray-500">{hw?.title || "Vazifa"}</p>
                  </div>
                  <Button size="sm" onClick={() => openGradeModal(sub)}>
                    Baholash
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Homework list */}
      <Card>
        <CardHeader>
          <CardTitle>Barcha vazifalar</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-400 py-8">Yuklanmoqda...</p>
          ) : homeworks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Hali vazifalar yo'q. Birinchi vazifani yarating!</p>
          ) : (
            <div className="space-y-3">
              {homeworks.map(hw => {
                const hwSubs = submissions.filter(s => s.homework_id === hw.id);
                return (
                  <div key={hw.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{hw.title}</h3>
                        {hw.description && <p className="text-sm text-gray-500 mt-1">{hw.description}</p>}
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{hw.type}</Badge>
                          {hw.due_date && (
                            <Badge variant="outline" className="text-orange-600">
                              {new Date(hw.due_date).toLocaleDateString("uz-UZ")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{hwSubs.length} topshiriq</p>
                        <p>{hwSubs.filter(s => s.status === "graded").length} baholangan</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Homework Modal */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi vazifa yaratish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Sarlavha *</label>
              <Input
                placeholder="Vazifa sarlavhasi"
                value={newHw.title}
                onChange={e => setNewHw(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tavsif</label>
              <Textarea
                placeholder="Vazifa haqida qo'shimcha ma'lumot"
                value={newHw.description}
                onChange={e => setNewHw(p => ({ ...p, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Turi</label>
              <Select value={newHw.type} onValueChange={v => setNewHw(p => ({ ...p, type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="writing">Yozish (Writing)</SelectItem>
                  <SelectItem value="listening">Tinglash (Listening)</SelectItem>
                  <SelectItem value="speaking">Gapirish (Speaking)</SelectItem>
                  <SelectItem value="grammar">Grammatika</SelectItem>
                  <SelectItem value="reading">O'qish (Reading)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Topshirish muddati</label>
              <Input
                type="datetime-local"
                value={newHw.due_date}
                onChange={e => setNewHw(p => ({ ...p, due_date: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Bekor</Button>
            <Button onClick={createHomework} disabled={saving}>
              {saving ? "Saqlanmoqda..." : "Yaratish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grade Modal */}
      <Dialog open={!!gradeModal} onOpenChange={() => setGradeModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Baholash — {gradeModal?.profiles?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Baho *</label>
              <Select value={gradeValue} onValueChange={setGradeValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Baho tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A — Ajoyib (90-100)</SelectItem>
                  <SelectItem value="B">B — Yaxshi (75-89)</SelectItem>
                  <SelectItem value="C">C — Qoniqarli (60-74)</SelectItem>
                  <SelectItem value="D">D — Zaif (45-59)</SelectItem>
                  <SelectItem value="F">F — Qoniqarsiz (&lt;45)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Fikr-mulohaza (Feedback)</label>
              <Textarea
                placeholder="O'quvchiga izoh yozing..."
                value={feedbackValue}
                onChange={e => setFeedbackValue(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeModal(null)}>Bekor</Button>
            <Button onClick={saveGrade} disabled={saving}>
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
