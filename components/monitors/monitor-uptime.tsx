import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MonitorDetail } from "@/lib/monitors"

export function MonitorUptime({ monitor }: { monitor: MonitorDetail }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Uptime</CardTitle>
        <CardDescription>Share of successful checks in recent history.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">
          {monitor.uptimePercent === null ? "—" : `${monitor.uptimePercent}%`}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Based on {monitor.checks.length} stored check
          {monitor.checks.length === 1 ? "" : "s"}
        </p>
      </CardContent>
    </Card>
  )
}
