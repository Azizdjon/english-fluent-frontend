import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LogOut, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface Props {
  role: "Student" | "Teacher" | "Admin";
  userName: string;
  userMeta?: string;
  nav: NavItem[];
  children: React.ReactNode;
}

export function AppShell({ role, userName, userMeta, nav, children }: Props) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const initials = userName.split(" ").map((p) => p[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">
              PL
            </div>
            <div>
              <div className="font-bold text-base">PragmaLearn</div>
              <div className="text-xs text-sidebar-foreground/60">{role} Portal</div>
            </div>
          </Link>
        </div>

        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center font-semibold text-sidebar-primary-foreground">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{userName}</div>
              {userMeta && <div className="text-xs text-sidebar-foreground/60">{userMeta}</div>}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => navigate({ to: "/" })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
