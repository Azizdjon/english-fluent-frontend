import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/student/profile")({ component: StudentProfilePage });

function StudentProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email || "");
      const { data } = await supabase.from("profiles").select("full_name,role").eq("id", user.id).single();
      if (data) { setFullName(data.full_name || ""); setRole(data.role || "student"); }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
    setSaving(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-4 md:p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {toast && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Profile saved successfully!
        </div>
      )}

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            className="border rounded-lg px-3 py-2 w-full text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            value={email}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            className="border rounded-lg px-3 py-2 w-full text-sm bg-gray-50 text-gray-500 capitalize cursor-not-allowed"
            value={role}
            disabled
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
