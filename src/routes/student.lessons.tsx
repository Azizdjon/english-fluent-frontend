import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/student/lessons")({
  component: () => <Outlet />,
});
