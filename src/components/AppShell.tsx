import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface Props {
  role: "Student" | "Teacher" | "Admin";
  navItems: NavItem[];
  children: React.ReactNode;
  userName?: string;
}

export function AppShell({ role, navItems, children, userName }: Props) {
  const router = useRouterState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const roleColors: Record<string, string> = {
    Student: "bg-blue-100 text-blue-700",
    Teacher: "bg-purple-100 text-purple-700",
    Admin: "bg-red-100 text-red-700",
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [router.location.pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="font-semibold text-gray-900 text-[15px]">PragmaLearn</span>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3 border-b border-gray-100">
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[role] || "bg-gray-100 text-gray-600"}`}>
          {role}
          {userName && <span className="ml-1 opacity-70">· {userName.split(" ")[0]}</span>}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = router.location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
              )}
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Chiqish
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 md:hidden transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 text-sm">PragmaLearn</span>
          <div className="w-8" />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
