import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/format"
import type { DashboardIncident } from "@/lib/dashboard"

export function MonitorHealth({
  incidents,
}: {
  incidents: DashboardIncident[]
}) {
  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader>
        <CardTitle>Recent incidents</CardTitle>
        <CardDescription>Latest incidents across all monitors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {incidents.length === 0 ? (
          <p className="text-sm text-neutral-500">No incidents recorded yet.</p>
        ) : (
          incidents.map((incident) => (
            <Link
              key={incident.id}
              href={`/monitors/${incident.monitorId}`}
              className="block space-y-2 rounded-2xl transition-colors hover:bg-neutral-50 dark:hover:bg-muted/40"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{incident.monitorName}</span>
                <span className="shrink-0 text-neutral-500">
                  {formatRelativeTime(incident.startedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={
                    incident.status === "OPEN"
                      ? "rounded-full border-none bg-rose-50 text-rose-700"
                      : "rounded-full border-none bg-emerald-50 text-emerald-700"
                  }
                >
                  {incident.status === "OPEN" ? "Open" : "Resolved"}
                </Badge>
                {incident.lastStatusCode !== null ? (
                  <p className="text-sm text-neutral-500">
                    Last status {incident.lastStatusCode}
                  </p>
                ) : null}
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
