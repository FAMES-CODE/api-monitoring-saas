import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatResponseTime } from "@/lib/format"
import type { DashboardStats } from "@/lib/dashboard"

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "Total monitors",
      value: stats.totalMonitors,
      footnote:
        stats.newThisWeek > 0
          ? `${stats.newThisWeek} new this week`
          : "No new monitors this week",
      tone: "positive" as const,
    },
    {
      label: "Monitors up",
      value: stats.monitorsUp,
      footnote:
        stats.uptimePercent === null
          ? "Waiting for first checks"
          : `${stats.uptimePercent}% checks successful`,
      tone: "positive" as const,
    },
    {
      label: "Open incidents",
      value: stats.openIncidents,
      footnote:
        stats.openIncidents > 0
          ? `${stats.monitorsDown} monitor${stats.monitorsDown === 1 ? "" : "s"} down`
          : "All clear",
      tone: stats.openIncidents > 0 ? ("neutral" as const) : ("positive" as const),
    },
    {
      label: "Avg. response time",
      value: formatResponseTime(stats.avgResponseTime),
      footnote: "From latest check of each monitor",
      tone: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <Card key={stat.label} className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-semibold text-neutral-900 dark:text-foreground">
              {stat.value}
            </span>
          </CardContent>
          <CardFooter>
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full border-none",
                stat.tone === "positive"
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-100"
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
