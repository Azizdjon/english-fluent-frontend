import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Mic, ClipboardCheck, Puzzle, BookOpen, MessageSquare, ClipboardList, User, TrendingUp } from "lucide-react";
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
        { to: "/student/progress", label: "Progress", icon: TrendingUp },
        { to: "/student", label: "Dashboard", icon: LayoutDashboard },
        { to: "/student/speaking", label: "Speaking Lab", icon: Mic },
        { to: "/student/test", label: "Diagnostic Test", icon: ClipboardCheck },
        { to: "/student/exercises", label: "Exercises", icon: Puzzle },
        { to: "/student/lessons", label: "Lessons", icon: BookOpen },
        { to: "/student/pragmatic", label: "Pragmatic", icon: MessageSquare },
        { to: "/student/homework", label: "Homework", icon: ClipboardList },
        { to: "/student/profile", label: "Profile", icon: User },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
