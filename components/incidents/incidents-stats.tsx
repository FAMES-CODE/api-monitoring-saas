import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDurationMs } from "@/lib/format"
import type { IncidentListItem } from "@/lib/incidents"

export function IncidentsStats({ incidents }: { incidents: IncidentListItem[] }) {
  const open = incidents.filter((incident) => incident.status === "OPEN").length
  const resolved = incidents.filter(
    (incident) => incident.status === "RESOLVED"
  ).length
  const resolvedDurations = incidents.filter(
    (incident) => incident.status === "RESOLVED" && incident.resolvedAt
  )
  const avgMs =
    resolvedDurations.length === 0
      ? null
      : resolvedDurations.reduce((sum, incident) => {
          return (
            sum +
            (new Date(incident.resolvedAt!).getTime() -
              new Date(incident.startedAt).getTime())
          )
        }, 0) / resolvedDurations.length
  const avgResolution = avgMs === null ? null : formatDurationMs(avgMs)

  const stats = [
    {
      label: "Open",
      value: open,
      footnote: open > 0 ? "Needs attention" : "All clear",
      tone: open > 0 ? ("neutral" as const) : ("positive" as const),
    },
    {
      label: "Resolved",
      value: resolved,
      footnote: "Closed outages",
      tone: "positive" as const,
    },
    {
      label: "Total",
      value: incidents.length,
      footnote: "All recorded incidents",
      tone: "neutral" as const,
    },
    {
      label: "Avg. resolution",
      value: avgResolution ?? "—",
      footnote:
        resolvedDurations.length === 0
          ? "No resolved incidents yet"
          : "Across resolved incidents",
      tone: "positive" as const,
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
