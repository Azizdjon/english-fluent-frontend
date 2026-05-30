import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Star } from "lucide-react";

export const Route = createFileRoute("/student/certificates")({
  component: StudentCertificates,
});

interface Certificate {
  id: string;
  course_name: string;
  grade: string;
  issued_at: string;
  student_name: string;
}

const DEMO_CERTS: Certificate[] = [
  { id: "1", course_name: "English Grammar Fundamentals", grade: "A", issued_at: "2024-03-15", student_name: "Student" },
  { id: "2", course_name: "Business English Communication", grade: "B+", issued_at: "2024-05-20", student_name: "Student" },
];

function gradeColor(g: string) {
  if (g.startsWith("A")) return "bg-green-500";
  if (g.startsWith("B")) return "bg-blue-500";
  return "bg-yellow-500";
}

async function downloadPDF(cert: Certificate, name: string) {
  // Dynamically load jsPDF only in browser
  if (typeof window === "undefined") return;
  const { jsPDF } = await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" as any);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210;

  // Background
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, H, "F");

  // Gold border
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(2);
  doc.rect(10, 10, W - 20, H - 20);
  doc.setLineWidth(0.5);
  doc.rect(13, 13, W - 26, H - 26);

  // Title
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF COMPLETION", W / 2, 50, { align: "center" });

  // Subtitle
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("This is to certify that", W / 2, 68, { align: "center" });

  // Student name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text(name, W / 2, 90, { align: "center" });

  // Course line
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed the course", W / 2, 106, { align: "center" });

  // Course name
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(cert.course_name, W / 2, 124, { align: "center" });

  // Grade
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  const date = new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.text(`Grade: ${cert.grade}   |   Date: ${date}`, W / 2, 145, { align: "center" });

  // Divider
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(60, 158, W - 60, 158);

  // Footer
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.text("PragmaLearn English Academy", W / 2, 170, { align: "center" });

  doc.save(`certificate-${cert.id}.pdf`);
}

function StudentCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setCerts(DEMO_CERTS); setLoading(false); return; }

        const { data: profile } = await supabase
          .from("profiles").select("full_name").eq("id", user.id).single();
        if (profile?.full_name) setStudentName(profile.full_name);

        const { data } = await supabase
          .from("certificates")
          .select("id, grade, issued_at, courses(name)")
          .eq("student_id", user.id)
          .order("issued_at", { ascending: false });

        if (data && data.length > 0) {
          setCerts(data.map((c: any) => ({
            id: c.id,
            course_name: c.courses?.name ?? "Course",
            grade: c.grade,
            issued_at: c.issued_at,
            student_name: profile?.full_name ?? "Student",
          })));
        } else {
          setCerts(DEMO_CERTS.map(c => ({ ...c, student_name: profile?.full_name ?? "Student" })));
        }
      } catch {
        setCerts(DEMO_CERTS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDownload(cert: Certificate) {
    setDownloading(cert.id);
    try {
      await downloadPDF(cert, studentName);
    } catch (e) {
      console.error("PDF error", e);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">My Certificates</h1>
            <p className="text-slate-400 text-sm">Your earned achievements</p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : certs.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 text-center p-12">
            <Star className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No certificates yet. Complete a course to earn one!</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {certs.map(cert => (
              <Card key={cert.id} className="bg-slate-800 border-slate-700 hover:border-yellow-500/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-white text-base leading-snug">{cert.course_name}</CardTitle>
                    <Badge className={`text-white text-sm font-bold ${gradeColor(cert.grade)}`}>{cert.grade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">
                    Issued: {new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <Button
                    onClick={() => handleDownload(cert)}
                    disabled={downloading === cert.id}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloading === cert.id ? "Generating PDF..." : "Download Certificate"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
