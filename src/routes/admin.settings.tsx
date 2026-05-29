import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Card className="p-6 mb-4">
        <h2 className="font-semibold mb-4">Platform</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Platform name</Label>
            <Input defaultValue="LinguaPath" />
          </div>
          <div className="space-y-2">
            <Label>Support email</Label>
            <Input defaultValue="support@linguapath.com" />
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-4">
        <h2 className="font-semibold mb-4">Features</h2>
        <div className="space-y-4">
          {[
            { label: "AI speaking feedback", desc: "Enable automated pronunciation scoring" },
            { label: "Self-registration", desc: "Allow students to sign up without invitation" },
            { label: "Public course catalog", desc: "Show course list to logged-out visitors" },
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
        <Button onClick={() => toast.success("Settings saved!", { description: "Your changes have been applied." })}>Save changes</Button>
      </div>
    </div>
  );
}
