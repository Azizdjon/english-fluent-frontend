import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudents } from "@/lib/mock-data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/teacher/students")({
  component: Students,
});

function Students() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">All {mockStudents.length} students across your classes</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Recent Score</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStudents.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
                      {s.name.split(" ").map(p => p[0]).join("")}
                    </div>
                    <div className="font-medium">{s.name}</div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{s.level}</Badge></TableCell>
                <TableCell>
                  <span className={`font-semibold ${s.score >= 85 ? "text-success" : s.score >= 70 ? "text-foreground" : "text-warning"}`}>
                    {s.score}%
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{s.lessons}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{s.lastActive}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
