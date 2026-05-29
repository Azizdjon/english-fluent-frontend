import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Download, Award, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import type { jsPDF } from "jspdf";
import { toast } from "sonner";
import { mockStudent } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/student/certificates")({
  component: CertificatesPage,
});

const myCertificates = [
  { id: 1, title: "English Proficiency: B1 Intermediate", date: "January 12, 2025", grade: "A+", icon: Award, color: "bg-blue-500" },
  { id: 2, title: "Advanced Grammar Masterclass", date: "March 05, 2025", grade: "A", icon: Award, color: "bg-purple-500" },
];

type Cert = typeof myCertificates[0];

function drawCertificate(doc: jsPDF, cert: Cert, studentName: string) {
  const W = 297;
  const H = 210;
  const cx = W / 2;

  // --- Background ---
  doc.setFillColor(248, 250, 255);
  doc.rect(0, 0, W, H, "F");

  // --- Gradient-like accent bars ---
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, W, 4, "F");
  doc.rect(0, H - 4, W, 4, "F");

  doc.setFillColor(168, 85, 247);
  doc.rect(0, 4, 2, H - 8, "F");
  doc.rect(W - 2, 4, 2, H - 8, "F");

  // --- Outer border ---
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.8);
  doc.roundedRect(8, 8, W - 16, H - 16, 4, 4, "S");

  // --- Inner border ---
  doc.setDrawColor(196, 181, 253);
  doc.setLineWidth(0.3);
  doc.roundedRect(12, 12, W - 24, H - 24, 3, 3, "S");

  // --- Corner decorations ---
  const corners = [[14, 14], [W - 14, 14], [14, H - 14], [W - 14, H - 14]];
  doc.setFillColor(99, 102, 241);
  corners.forEach(([x, y]) => {
    doc.circle(x, y, 2, "F");
  });

  // --- Academy name badge ---
  doc.setFillColor(99, 102, 241);
  doc.roundedRect(cx - 38, 20, 76, 8, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("LINGUAPATH ACADEMY", cx, 25.5, { align: "center" });

  // --- CERTIFICATE title ---
  doc.setTextColor(30, 27, 75);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(38);
  doc.text("CERTIFICATE", cx, 60, { align: "center" });

  // --- OF ACHIEVEMENT ---
  doc.setTextColor(99, 102, 241);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setCharSpace(4);
  doc.text("OF ACHIEVEMENT", cx, 70, { align: "center" });
  doc.setCharSpace(0);

  // --- Divider line ---
  doc.setDrawColor(196, 181, 253);
  doc.setLineWidth(0.5);
  doc.line(cx - 40, 75, cx + 40, 75);

  // --- "This is to certify that" ---
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text("This is to proudly certify that", cx, 88, { align: "center" });

  // --- Student Name ---
  doc.setTextColor(79, 70, 229);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(studentName, cx, 105, { align: "center" });

  // --- Name underline ---
  const nameWidth = doc.getTextWidth(studentName);
  doc.setDrawColor(167, 139, 250);
  doc.setLineWidth(0.4);
  doc.line(cx - nameWidth / 2, 108, cx + nameWidth / 2, 108);

  // --- "has successfully completed" ---
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("has successfully completed the course", cx, 118, { align: "center" });

  // --- Course title ---
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`"${cert.title}"`, cx, 130, { align: "center" });

  // --- Footer ---
  const footerY = H - 28;

  // Date
  doc.setFillColor(240, 244, 255);
  doc.roundedRect(20, footerY - 10, 65, 16, 3, 3, "F");
  doc.setTextColor(99, 102, 241);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("DATE", 52.5, footerY - 3, { align: "center" });
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(cert.date, 52.5, footerY + 3, { align: "center" });

  // Grade seal
  doc.setFillColor(99, 102, 241);
  doc.circle(cx, footerY - 2, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(cert.grade, cx, footerY + 2.5, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(99, 102, 241);
  doc.text("GRADE", cx, footerY + 13, { align: "center" });

  // Signature
  doc.setFillColor(240, 244, 255);
  doc.roundedRect(W - 85, footerY - 10, 65, 16, 3, 3, "F");
  doc.setTextColor(99, 102, 241);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("SIGNATURE", W - 52.5, footerY - 3, { align: "center" });
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text("LinguaPath Director", W - 52.5, footerY + 3, { align: "center" });

  // --- Certificate ID ---
  doc.setTextColor(203, 213, 225);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`CERTIFICATE ID: LMS-${cert.id}8472-2025`, cx, H - 6, { align: "center" });
}

function CertificatesPage() {
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleDownload = async (cert: Cert) => {
    setDownloading(cert.id);
    toast.loading("Sertifikat PDF tayyorlanmoqda...", { id: "cert" });

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      drawCertificate(doc, cert, mockStudent.name);

      // Yangi tabda PDF ochish — brauzer to'g'ri PDF ko'rsatadi
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      window.open(pdfUrl, "_blank");

      toast.success("✅ Sertifikat yangi tabda ochildi! Ctrl+S bilan saqlang.", { id: "cert" });
    } catch (err) {
      console.error("PDF xatosi:", err);
      toast.error("Xatolik yuz berdi: " + String(err), { id: "cert" });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link to="/student" className="flex items-center text-primary mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Achievements</h1>
        <p className="text-muted-foreground mt-1">Manage and download your earned certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myCertificates.map((cert) => (
          <Card key={cert.id} className="p-0 overflow-hidden border-2 border-border hover:border-primary/30 transition-all group shadow-sm">
            <div className="p-6 flex items-start gap-5">
              <div className={`w-16 h-16 rounded-2xl ${cert.color} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                <cert.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-1">{cert.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {cert.date}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-emerald-600">
                    Grade: {cert.grade}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-hover text-white"
                    onClick={() => handleDownload(cert)}
                    disabled={downloading === cert.id}
                  >
                    {downloading === cert.id
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Tayyorlanmoqda...</>
                      : <><Download className="w-4 h-4 mr-2" /> Download PDF</>
                    }
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(window.location.href).then(() => toast.success("Certificate link copied!")).catch(() => toast.info("Link: " + window.location.href)); }}>
                    Share
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 px-6 py-3 border-t flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Certificate ID: LMS-{cert.id}8472-2025</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
