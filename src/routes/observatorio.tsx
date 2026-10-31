import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ObservatoryShell } from "@/features/observatorio/components";

export const Route = createFileRoute("/observatorio")({ component: ObservatoryLayout });
function ObservatoryLayout() {
  return (
    <ObservatoryShell>
      <Outlet />
    </ObservatoryShell>
  );
}
