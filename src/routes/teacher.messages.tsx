import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { mockStudents } from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/messages")({
  component: Messages,
});

function Messages() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <Card className="grid grid-cols-3 h-[600px]">
        <div className="border-r overflow-y-auto">
          {mockStudents.map((s, i) => (
            <div key={s.id} className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${i === 0 ? "bg-accent/50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                  {s.name.split(" ").map(p => p[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">Thanks for the feedback!</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-2 flex items-center justify-center text-muted-foreground text-sm">
          Select a conversation to view messages
        </div>
      </Card>
    </div>
  );
}
