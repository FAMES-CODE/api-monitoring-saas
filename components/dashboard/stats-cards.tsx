import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatCard = {
  label: string
  value: string | number
  footnote: string
  tone?: "positive" | "neutral"
}

const DEFAULT_STATS: StatCard[] = [
  {
    label: "Total monitors",
    value: 5,
    footnote: "1 new this week",
    tone: "positive",
  },
  {
    label: "Monitors up",
    value: 4,
    footnote: "80% uptime today",
    tone: "positive",
  },
  {
    label: "Open incidents",
    value: 1,
    footnote: "Acknowledged",
    tone: "neutral",
  },
  {
    label: "Avg. response time",
    value: "212ms",
    footnote: "18ms faster",
    tone: "positive",
  },
]

export function StatsCards({ stats = DEFAULT_STATS }: { stats?: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
