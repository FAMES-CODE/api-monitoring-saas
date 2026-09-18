import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MonitorStatusBadge } from "@/components/monitors/monitor-status-badge"
import { formatDuration, formatRelativeTime } from "@/lib/format"
import type { IncidentListItem } from "@/lib/incidents"

export function IncidentsList({
  incidents,
}: {
  incidents: IncidentListItem[]
}) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white px-6 py-16 text-center shadow-sm dark:bg-card">
        <p className="text-base font-medium">No incidents match these filters</p>
        <p className="mt-1 text-sm text-neutral-500">
          Try another search, or wait for the next failed checks.
        </p>
      </div>
    )
  }

  return (
    <div className="app-surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Monitor</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id} className="interactive-row border-border/60">
              <TableCell>
                <Link
                  href={`/monitors/${incident.monitorId}`}
                  className="font-semibold hover:text-primary hover:underline"
                >
                  {incident.monitorName}
                </Link>
                <p className="max-w-[280px] truncate text-xs text-neutral-500">
                  {incident.monitorUrl}
                </p>
              </TableCell>
              <TableCell>
                <MonitorStatusBadge status={incident.monitorHealth} />
              </TableCell>
              <TableCell>{formatRelativeTime(incident.startedAt)}</TableCell>
              <TableCell>
                {formatDuration(incident.startedAt, incident.resolvedAt)}
                {incident.status === "OPEN" ? " (ongoing)" : ""}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    incident.status === "OPEN"
                      ? "destructive"
                      : "secondary"
                  }
                  className="rounded-full"
                >
                  {incident.status === "OPEN" ? "Open" : "Resolved"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
