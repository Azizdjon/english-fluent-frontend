import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
});

function Settings() {
  const { t } = useI18n();
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("dash.settings.title")}</h1>

      <Card className="p-6 mb-4">
        <h2 className="font-semibold mb-4">{t("dash.settings.platform")}</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("dash.settings.platformName")}</Label>
            <Input defaultValue="LinguaPath" />
          </div>
          <div className="space-y-2">
            <Label>{t("dash.settings.supportEmail")}</Label>
            <Input defaultValue="support@linguapath.com" />
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-4">
        <h2 className="font-semibold mb-4">{t("dash.settings.features")}</h2>
        <div className="space-y-4">
          {[
            { label: t("dash.settings.aiSpeaking"), desc: t("dash.settings.aiSpeakingDesc") },
            { label: t("dash.settings.selfReg"), desc: t("dash.settings.selfRegDesc") },
            { label: t("dash.settings.publicCatalog"), desc: t("dash.settings.publicCatalogDesc") },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success(t("dash.settings.saved"), { description: t("dash.settings.savedDesc") })}>{t("dash.settings.saveChanges")}</Button>
      </div>
    </div>
  );
}
