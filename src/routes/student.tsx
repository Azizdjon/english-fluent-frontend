import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Mic, ClipboardCheck, Puzzle, BookOpen, MessageSquare, ClipboardList, User, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <AppShell
      role="Student"
      navItems={[
        { to: "/student", label: "Dashboard", icon: LayoutDashboard },
        { to: "/student/lessons", label: "Lessons", icon: BookOpen },
        { to: "/student/progress", label: "Progress", icon: TrendingUp },
        { to: "/student/homework", label: "Homework", icon: ClipboardList },
        { to: "/student/speaking", label: "Speaking Lab", icon: Mic },
        { to: "/student/exercises", label: "Exercises", icon: Puzzle },
        { to: "/student/test", label: "Diagnostic Test", icon: ClipboardCheck },
        { to: "/student/pragmatic", label: "Pragmatic", icon: MessageSquare },
        { to: "/student/profile", label: "Profile", icon: User },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
