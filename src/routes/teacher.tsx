import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, ClipboardList, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/teacher")({
  component: TeacherLayout,
});

function TeacherLayout() {
  return (
    <AppShell
      role="Teacher"
      userName="Emma Wilson"
      userMeta="3 active classes"
      nav={[
        { to: "/teacher", label: "Dashboard", icon: LayoutDashboard },
        { to: "/teacher/students", label: "Students", icon: Users },
        { to: "/teacher/homework", label: "Homework", icon: ClipboardList },
        { to: "/teacher/messages", label: "Messages", icon: MessageSquare },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
