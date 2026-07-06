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
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
    if (!newHw.title.trim()) { toast.error(t("dash.tHomework.enterTitle")); return; }
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
    if (error) { toast.error(t("dash.tHomework.errorPrefix") + error.message); return; }
    toast.success(t("dash.tHomework.taskCreated"));
    setShowNewModal(false);
    setNewHw({ title: "", description: "", type: "writing", due_date: "" });
    fetchData();
  }

  async function saveGrade() {
    if (!gradeModal || !gradeValue) { toast.error(t("dash.tHomework.selectGrade")); return; }
    setSaving(true);
    const { error } = await supabase
      .from("submissions")
      .update({ grade: gradeValue, feedback: feedbackValue, status: "graded", graded_at: new Date().toISOString() })
      .eq("id", gradeModal.id);
    setSaving(false);
    if (error) { toast.error(t("dash.tHomework.errorPrefix") + error.message); return; }
    toast.success(t("dash.tHomework.gradeSaved"));
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
          <h1 className="text-2xl font-bold text-gray-900">{t("dash.tHomework.title")}</h1>
          <p className="text-gray-500">{t("dash.tHomework.subtitle")}</p>
        </div>
        <Button onClick={() => setShowNewModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("dash.tHomework.newTask")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{homeworks.length}</p>
              <p className="text-sm text-gray-500">{t("dash.tHomework.totalTasks")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{submitted.length}</p>
              <p className="text-sm text-gray-500">{t("dash.tHomework.submitted")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{graded.length}</p>
              <p className="text-sm text-gray-500">{t("dash.tHomework.graded")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions to grade */}
      {submitted.filter(s => s.status === "submitted").length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">{t("dash.tHomework.awaitingGrade")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {submitted.filter(s => s.status === "submitted").map(sub => {
              const hw = homeworks.find(h => h.id === sub.homework_id);
              return (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium">{sub.profiles?.full_name || t("dash.tHomework.student")}</p>
                    <p className="text-sm text-gray-500">{hw?.title || t("dash.tHomework.task")}</p>
                  </div>
                  <Button size="sm" onClick={() => openGradeModal(sub)}>
                    {t("dash.tHomework.gradeBtn")}
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
          <CardTitle>{t("dash.tHomework.allTasks")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-400 py-8">{t("dash.tHomework.loading")}</p>
          ) : homeworks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{t("dash.tHomework.noTasks")}</p>
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
                        <p>{t("dash.tHomework.submissionsCount", { n: hwSubs.length })}</p>
                        <p>{t("dash.tHomework.gradedCount", { n: hwSubs.filter(s => s.status === "graded").length })}</p>
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
            <DialogTitle>{t("dash.tHomework.newTaskTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t("dash.tHomework.titleLabel")}</label>
              <Input
                placeholder={t("dash.tHomework.titlePlaceholder")}
                value={newHw.title}
                onChange={e => setNewHw(p => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("dash.tHomework.descLabel")}</label>
              <Textarea
                placeholder={t("dash.tHomework.descPlaceholder")}
                value={newHw.description}
                onChange={e => setNewHw(p => ({ ...p, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("dash.tHomework.typeLabel")}</label>
              <Select value={newHw.type} onValueChange={v => setNewHw(p => ({ ...p, type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="writing">{t("dash.tHomework.typeWriting")}</SelectItem>
                  <SelectItem value="listening">{t("dash.tHomework.typeListening")}</SelectItem>
                  <SelectItem value="speaking">{t("dash.tHomework.typeSpeaking")}</SelectItem>
                  <SelectItem value="grammar">{t("dash.tHomework.typeGrammar")}</SelectItem>
                  <SelectItem value="reading">{t("dash.tHomework.typeReading")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("dash.tHomework.dueLabel")}</label>
              <Input
                type="datetime-local"
                value={newHw.due_date}
                onChange={e => setNewHw(p => ({ ...p, due_date: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewModal(false)}>{t("dash.tHomework.cancel")}</Button>
            <Button onClick={createHomework} disabled={saving}>
              {saving ? t("dash.tHomework.saving") : t("dash.tHomework.createBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grade Modal */}
      <Dialog open={!!gradeModal} onOpenChange={() => setGradeModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dash.tHomework.gradeModalTitle")} — {gradeModal?.profiles?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t("dash.tHomework.gradeSelectLabel")}</label>
              <Select value={gradeValue} onValueChange={setGradeValue}>
                <SelectTrigger>
                  <SelectValue placeholder={t("dash.tHomework.gradePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">{t("dash.tHomework.gradeA")}</SelectItem>
                  <SelectItem value="B">{t("dash.tHomework.gradeB")}</SelectItem>
                  <SelectItem value="C">{t("dash.tHomework.gradeC")}</SelectItem>
                  <SelectItem value="D">{t("dash.tHomework.gradeD")}</SelectItem>
                  <SelectItem value="F">{t("dash.tHomework.gradeF")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("dash.tHomework.feedbackLabel")}</label>
              <Textarea
                placeholder={t("dash.tHomework.feedbackPlaceholder")}
                value={feedbackValue}
                onChange={e => setFeedbackValue(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeModal(null)}>{t("dash.tHomework.cancel")}</Button>
            <Button onClick={saveGrade} disabled={saving}>
              {saving ? t("dash.tHomework.saving") : t("dash.tHomework.saveBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
