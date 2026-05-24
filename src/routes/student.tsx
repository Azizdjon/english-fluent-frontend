import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Mic, ClipboardCheck, Puzzle, BookOpen, MessageSquare, ClipboardList } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { mockStudent } from "@/lib/mock-data";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <AppShell
      role="Student"
      userName={mockStudent.name}
      userMeta={`Level ${mockStudent.level} • ${mockStudent.streak}-day streak`}
      nav={[
        { to: "/student", label: "Dashboard", icon: LayoutDashboard },
        { to: "/student/speaking", label: "Speaking Lab", icon: Mic },
        { to: "/student/test", label: "Diagnostic Test", icon: ClipboardCheck },
        { to: "/student/exercises", label: "Exercises", icon: Puzzle },
        { to: "/student/lessons", label: "Lessons", icon: BookOpen },
        { to: "/student/pragmatic", label: "Pragmatic", icon: MessageSquare },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
