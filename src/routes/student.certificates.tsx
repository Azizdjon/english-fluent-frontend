import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Award, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/student/certificates")({
  component: StudentCertificates,
});

interface Certificate {
  id: string;
  title: string;
  grade: string | null;
  issued_at: string;
  courses?: { title: string; level: string };
}

function gradeColor(grade: string | null) {
  if (!grade) return "bg-gray-100 text-gray-600";
  if (grade === "A") return "bg-green-100 text-green-700";
  if (grade === "B") return "bg-blue-100 text-blue-700";
  if (grade === "C") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

async function downloadCertificatePDF(cert: Certificate, studentName: string) {
  // Dynamically load jsPDF
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  document.head.appendChild(script);

  await new Promise(resolve => { script.onload = resolve; });

  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 297, 210, "F");

  // Gold border
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);
  doc.setLineWidth(1);
  doc.rect(14, 14, 269, 182);

  // Logo area — top center
  doc.setFillColor(251, 191, 36);
  doc.circle(148.5, 35, 12, "F");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PL", 148.5, 39, { align: "center" });

  // Title
  doc.setTextColor(251, 191, 36);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("PRAGMALEARN", 148.5, 52, { align: "center" });

  // Certificate of Completion
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE", 148.5, 78, { align: "center" });
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("OF COMPLETION", 148.5, 90, { align: "center" });

  // Divider
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.5);
  doc.line(60, 97, 237, 97);

  // This certifies
  doc.setTextColor(180, 180, 200);
  doc.setFontSize(11);
  doc.text("This certifies that", 148.5, 108, { align: "center" });

  // Student name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(studentName, 148.5, 122, { align: "center" });

  // Has successfully completed
  doc.setTextColor(180, 180, 200);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed", 148.5, 133, { align: "center" });

  // Course title
  doc.setTextColor(251, 191, 36);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const courseTitle = cert.courses?.title || cert.title;
  doc.text(courseTitle, 148.5, 146, { align: "center" });

  // Grade
  if (cert.grade) {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Grade: " + cert.grade, 148.5, 156, { align: "center" });
  }

  // Date
  const date = new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.setTextColor(180, 180, 200);
  doc.setFontSize(10);
  doc.text("Issued: " + date, 148.5, 168, { align: "center" });

  // Bottom line
  doc.setDrawColor(251, 191, 36);
  doc.line(60, 175, 237, 175);

  doc.save(studentName.replace(/\s+/g, "_") + "_certificate.pdf");
  toast.success("PDF yuklab olindi!");
}

function StudentCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    setStudentName(profile?.full_name || user.email || "Student");

    const { data } = await supabase
      .from("certificates")
      .select("*, courses(title, level)")
      .eq("student_id", user.id)
      .order("issued_at", { ascending: false });

    setCertificates(data || []);
    setLoading(false);
  }

  // Demo sertifikat agar hech narsa yo'q bo'lsa
  const demoCerts: Certificate[] = certificates.length === 0 && !loading ? [
    { id: "demo1", title: "Business English B2", grade: "A", issued_at: new Date().toISOString(), courses: { title: "Business English B2", level: "B2" } },
    { id: "demo2", title: "Grammar Foundations", grade: "B", issued_at: new Date(Date.now() - 30*24*60*60*1000).toISOString(), courses: { title: "Grammar Foundations", level: "A2" } },
  ] : certificates;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sertifikatlarim</h1>
        <p className="text-gray-500">Tugatilgan kurslar uchun sertifikatlar</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoCerts.map(cert => (
            <Card key={cert.id} className="overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-slate-900 to-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-8 h-8 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">PRAGMALEARN</span>
                  </div>
                  {cert.grade && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${gradeColor(cert.grade)}`}>
                      Baho: {cert.grade}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">
                  {cert.courses?.title || cert.title}
                </h3>
                {cert.courses?.level && (
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400 mb-3">
                    {cert.courses.level}
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(cert.issued_at).toLocaleDateString("uz-UZ")}</span>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-semibold"
                  onClick={() => downloadCertificatePDF(cert, studentName)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF yuklab olish
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && demoCerts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Award className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Hali sertifikatlar yo'q.</p>
          <p className="text-sm">Kursni tugatgach sertifikat beriladi.</p>
        </div>
      )}
    </div>
  );
}
