import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, BookOpen, Settings } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { t } = useI18n();
  return (
    <AppShell
      role="Admin"
      userName="Admin User"
      navItems={[
        { to: "/admin", label: t("nav.overview"), icon: LayoutDashboard },
        { to: "/admin/users", label: t("nav.userManagement"), icon: Users },
        { to: "/admin/courses", label: t("nav.courses"), icon: BookOpen },
        { to: "/admin/settings", label: t("nav.settings"), icon: Settings },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
