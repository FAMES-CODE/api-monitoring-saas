import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { MonitorHealthStatus } from "@/lib/monitors"

const STATUS_STYLES: Record<MonitorHealthStatus, string> = {
  up: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400",
  down: "bg-rose-50 text-rose-700 hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400",
  pending:
    "bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-500/15 dark:text-amber-400",
  paused:
    "bg-neutral-100 text-neutral-600 hover:bg-neutral-100 dark:bg-muted dark:text-muted-foreground",
}

const STATUS_LABELS: Record<MonitorHealthStatus, string> = {
  up: "Up",
  down: "Down",
  pending: "Pending",
  paused: "Paused",
}

export function MonitorStatusBadge({
  status,
}: {
  status: MonitorHealthStatus
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full border-none capitalize", STATUS_STYLES[status])}
    >
      {STATUS_LABELS[status]}
    </Badge>
  )
}
