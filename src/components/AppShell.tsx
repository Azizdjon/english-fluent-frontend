import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X, Sun, Moon, type LucideIcon } from "lucide-react";
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

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // default: dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return [dark, setDark] as const;
}

export function AppShell({ role, navItems, children, userName }: Props) {
  const router = useRouterState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useDarkMode();

  const roleColors: Record<string, string> = {
    Student: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    Teacher: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    Admin: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  useEffect(() => { setOpen(false); }, [router.location.pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-[15px]">PragmaLearn</span>
          </div>
          <button
            onClick={() => setDark(d => !d)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-700">
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[role] || "bg-gray-100 text-gray-600"}`}>
          {role}
          {userName && <span className="ml-1 opacity-70">· {userName.split(" ")[0]}</span>}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {(navItems ?? []).map((item) => {
          const active = router.location.pathname === item.to ||
            (item.to !== "/student" && item.to !== "/teacher" && item.to !== "/admin" &&
              router.location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                active
                  ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
              )}
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-sm text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Chiqish
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-700 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-700 z-50 md:hidden transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
          <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">PragmaLearn</span>
          <button onClick={() => setDark(d => !d)} className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
