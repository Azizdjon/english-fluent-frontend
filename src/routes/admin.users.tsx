import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/users")({ component: AdminUsersPage });

function AdminUsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    const { data } = await supabase.from("profiles").select("*").order("role");
    setUsers(data || []);
    setLoading(false);
  }

  const filtered = users.filter(u => !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor: Record<string, string> = {
    admin: "bg-red-900/30 text-red-400",
    teacher: "bg-purple-900/30 text-purple-400",
    student: "bg-blue-900/30 text-blue-400",
  };

  if (loading) return <div className="p-6 text-gray-400">{t("dash.adminUsers.loading")}</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-white mb-6">{t("dash.adminUsers.title", { n: users.length })}</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("dash.adminUsers.search")}
        className="mb-4 w-full max-w-md bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
      <div className="bg-gray-800 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left text-gray-300 text-sm px-4 py-3">{t("dash.adminUsers.colUser")}</th>
              <th className="text-left text-gray-300 text-sm px-4 py-3">{t("dash.adminUsers.colRole")}</th>
              <th className="text-left text-gray-300 text-sm px-4 py-3 hidden md:table-cell">{t("dash.adminUsers.colId")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-700/30">
                <td className="px-4 py-3">
                  <div className="text-white text-sm font-medium">{u.full_name || "â"}</div>
                  <div className="text-gray-400 text-xs">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${roleColor[u.role] || "bg-gray-700 text-gray-300"}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <code className="text-gray-500 text-xs">{u.id?.substring(0, 8)}...</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">{t("dash.adminUsers.none")}</p>}
      </div>
    </div>
  );
}

export default AdminUsersPage;
