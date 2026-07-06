import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, ClipboardList, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher")({
  component: TeacherLayout,
});

function TeacherLayout() {
  const { t } = useI18n();
  return (
    <AppShell
      role="Teacher"
      userName="Emma Wilson"
      navItems={[
        { to: "/teacher", label: t("nav.dashboard"), icon: LayoutDashboard },
        { to: "/teacher/students", label: t("nav.students"), icon: Users },
        { to: "/teacher/homework", label: t("nav.homework"), icon: ClipboardList },
        { to: "/teacher/messages", label: t("nav.messages"), icon: MessageSquare },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
