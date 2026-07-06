import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  children?: { to: string; label: string }[];
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
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [expandedNavs, setExpandedNavs] = useState<Set<string>>(new Set());

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

  // Auto-expand a parent nav if a child route is active
  useEffect(() => {
    const path = router.location.pathname;
    setExpandedNavs(prev => {
      const next = new Set(prev);
      (navItems ?? []).forEach(item => {
        if (item.children?.some(c => path.startsWith(c.to))) next.add(item.to);
      });
      return next;
    });
  }, [router.location.pathname, navItems]);

  function toggleNav(to: string) {
    setExpandedNavs(prev => {
      const next = new Set(prev);
      if (next.has(to)) next.delete(to); else next.add(to);
      return next;
    });
  }

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
        </div>
      </div>

      {/* Role badge + language */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between gap-2">
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[role] || "bg-gray-100 text-gray-600"}`}>
          {t(`roles.${role.toLowerCase()}`)}
          {userName && <span className="ml-1 opacity-70">· {userName.split(" ")[0]}</span>}
        </span>
        <LanguageToggle variant="light" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {(navItems ?? []).map((item) => {
          const path = router.location.pathname;
          const active = path === item.to ||
            (item.to !== "/student" && item.to !== "/teacher" && item.to !== "/admin" &&
              path.startsWith(item.to));
          const hasChildren = !!item.children?.length;
          const isExpanded = expandedNavs.has(item.to);

          const baseClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative w-full ${
            active
              ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          }`;

          return (
            <div key={item.to}>
              {hasChildren ? (
                <button onClick={() => toggleNav(item.to)} className={baseClass}>
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                  )}
                  <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 opacity-60" />
                    : <ChevronRight className="w-4 h-4 opacity-60" />}
                </button>
              ) : (
                <Link to={item.to} className={baseClass}>
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                  )}
                  <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300"}`} />
                  {item.label}
                </Link>
              )}

              {hasChildren && isExpanded && (
                <div className="ml-9 mt-0.5 space-y-0.5 border-l border-gray-100 dark:border-slate-700 pl-3">
                  {item.children!.map(child => {
                    const childActive = path === child.to || path.startsWith(child.to + "/");
                    return (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          childActive
                            ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
          {t("common.logout")}
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
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
