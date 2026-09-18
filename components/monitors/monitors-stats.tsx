import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { MonitorListItem } from "@/lib/monitors"

export function MonitorsStats({ monitors }: { monitors: MonitorListItem[] }) {
  const total = monitors.length
  const up = monitors.filter((monitor) => monitor.health === "up").length
  const down = monitors.filter((monitor) => monitor.health === "down").length
  const disabled = monitors.filter((monitor) => !monitor.enabled).length
  const pending = monitors.filter((monitor) => monitor.health === "pending").length

  const stats = [
    {
      label: "Monitors",
      value: total,
      footnote: pending > 0 ? `${pending} pending first check` : "All endpoints",
      tone: "neutral" as const,
    },
    {
      label: "Up",
      value: up,
      footnote: total === 0 ? "No data yet" : `${percent(up, total)} of total`,
      tone: "positive" as const,
    },
    {
      label: "Down",
      value: down,
      footnote: down > 0 ? "Needs attention" : "No outages",
      tone: down > 0 ? ("neutral" as const) : ("positive" as const),
    },
    {
      label: "Disabled",
      value: disabled,
      footnote: disabled > 0 ? "Checks paused" : "All enabled",
      tone: "neutral" as const,
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="app-surface gap-0 py-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold tracking-tight">
              {stat.value}
            </span>
          </CardContent>
          <CardFooter>
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full border-none",
                stat.tone === "positive"
                  ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                  : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
              )}
            >
              {stat.footnote}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function percent(part: number, total: number) {
  return `${Math.round((part / total) * 100)}%`
}
