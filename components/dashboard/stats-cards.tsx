import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle2, Clock3, Siren } from "lucide-react"
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
      icon: Activity,
    },
    {
      label: "Monitors up",
      value: stats.monitorsUp,
      footnote:
        stats.uptimePercent === null
          ? "Waiting for first checks"
          : `${stats.uptimePercent}% checks successful`,
      tone: "positive" as const,
      icon: CheckCircle2,
    },
    {
      label: "Open incidents",
      value: stats.openIncidents,
      footnote:
        stats.openIncidents > 0
          ? `${stats.monitorsDown} monitor${stats.monitorsDown === 1 ? "" : "s"} down`
          : "All clear",
      tone: stats.openIncidents > 0 ? ("neutral" as const) : ("positive" as const),
      icon: Siren,
    },
    {
      label: "Avg. response time",
      value: formatResponseTime(stats.avgResponseTime),
      footnote: "From latest check of each monitor",
      tone: "positive" as const,
      icon: Clock3,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="app-surface gap-0 py-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
                {stat.label}
              </CardTitle>
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
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
        )
      })}
    </div>
  )
}
