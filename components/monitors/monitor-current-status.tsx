import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MonitorStatusBadge } from "@/components/monitors/monitor-status-badge"
import type { MonitorDetail } from "@/lib/monitors"

export function MonitorCurrentStatus({ monitor }: { monitor: MonitorDetail }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Current status</CardTitle>
        <CardDescription>Latest observed health for this endpoint.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <MonitorStatusBadge status={monitor.health} />
        <p className="text-sm text-neutral-500">
          {monitor.lastCheck
            ? `Last check ${new Date(monitor.lastCheck.checkedAt).toLocaleString()} · HTTP ${monitor.lastCheck.statusCode} · ${monitor.lastCheck.responseTime}ms`
            : "No checks have run yet."}
        </p>
        {monitor.openIncidentCount > 0 ? (
          <p className="text-sm text-rose-600">
            {monitor.openIncidentCount} open incident
            {monitor.openIncidentCount > 1 ? "s" : ""}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
