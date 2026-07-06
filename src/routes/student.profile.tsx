import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/student/profile")({ component: StudentProfilePage });

function StudentProfilePage() {
const { t } = useI18n();
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

if (loading) return <div className="p-6 text-center text-gray-400">{t("dash.profile.loading")}</div>;

return (
<div className="p-4 md:p-6 max-w-lg">
<h1 className="text-2xl font-bold mb-6 text-white">{t("dash.profile.title")}</h1>

{toast && (
<div className="mb-4 bg-green-900/40 border border-green-700 text-green-400 px-4 py-3 rounded-lg text-sm">
{t("dash.profile.saved")}
</div>
)}

<div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
<div>
<label className="block text-sm font-medium text-gray-300 mb-1">{t("dash.profile.fullName")}</label>
<input
className="border border-gray-600 rounded-lg px-3 py-2 w-full text-sm bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
value={fullName}
onChange={e => setFullName(e.target.value)}
placeholder={t("dash.profile.fullNamePlaceholder")}
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-300 mb-1">{t("dash.profile.email")}</label>
<input
className="border border-gray-600 rounded-lg px-3 py-2 w-full text-sm bg-gray-900 text-gray-400 cursor-not-allowed"
value={email}
disabled
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-300 mb-1">{t("dash.profile.role")}</label>
<input
className="border border-gray-600 rounded-lg px-3 py-2 w-full text-sm bg-gray-900 text-gray-400 capitalize cursor-not-allowed"
value={role}
disabled
/>
</div>
<button
onClick={handleSave}
disabled={saving}
className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
>
{saving ? t("dash.profile.saving") : t("dash.profile.saveChanges")}
</button>
</div>
</div>
);
}
