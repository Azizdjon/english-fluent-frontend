import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, BookOpen, Settings } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShell
      role="Admin"
      userName="Admin User"
      navItems={[
        { to: "/admin", label: "Overview", icon: LayoutDashboard },
        { to: "/admin/users", label: "User Management", icon: Users },
        { to: "/admin/courses", label: "Courses", icon: BookOpen },
        { to: "/admin/settings", label: "Settings", icon: Settings },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
