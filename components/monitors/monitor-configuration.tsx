import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MonitorDetail } from "@/lib/monitors"

export function MonitorConfiguration({ monitor }: { monitor: MonitorDetail }) {
  const rows = [
    ["Name", monitor.name],
    ["URL", monitor.url],
    ["Method", monitor.method],
    ["Interval", `${monitor.interval}s`],
    ["Timeout", `${monitor.timeout}ms`],
    ["Enabled", monitor.enabled ? "Yes" : "No"],
  ]

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>How this monitor is currently defined.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-neutral-500">{label}</span>
            <span className="max-w-[70%] text-right break-all">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
