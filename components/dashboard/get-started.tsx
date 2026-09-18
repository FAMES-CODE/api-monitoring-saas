import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MonitorStatusBadge } from "@/components/monitors/monitor-status-badge"
import { formatRelativeTime, formatResponseTime } from "@/lib/format"
import type { MonitorListItem } from "@/lib/monitors"

export function GetStarted({ monitors }: { monitors: MonitorListItem[] }) {
  const up = monitors.filter((monitor) => monitor.health === "up").length
  const down = monitors.filter((monitor) => monitor.health === "down").length

  return (
    <Card className="app-surface h-full">
      <CardHeader>
        <CardTitle className="font-bold">Your monitors</CardTitle>
        <CardDescription>
          {monitors.length === 0
            ? "No monitors yet"
            : `${monitors.length} monitor${monitors.length === 1 ? "" : "s"} · ${up} up · ${down} down`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {monitors.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Create a monitor to start collecting live checks.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last checked</TableHead>
                <TableHead className="text-right">Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitors.slice(0, 8).map((monitor) => (
                <TableRow key={monitor.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/monitors/${monitor.id}`}
                      className="hover:underline"
                    >
                      {monitor.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <MonitorStatusBadge status={monitor.health} />
                  </TableCell>
                  <TableCell>
                    {monitor.lastCheck
                      ? formatRelativeTime(monitor.lastCheck.checkedAt)
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatResponseTime(monitor.lastCheck?.responseTime)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
