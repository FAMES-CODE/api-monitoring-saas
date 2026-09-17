import { prisma } from "@/lib/prisma"
import {
  CheckStatus,
  IncidentStatus,
} from "@/lib/generated/prisma/client"
import { getMonitorsForUser, type MonitorListItem } from "@/lib/monitors"

export type DashboardChartPoint = {
  date: string
  avgResponseTime: number
  successCount: number
  failedCount: number
}

export type DashboardIncident = {
  id: string
  monitorId: string
  monitorName: string
  status: IncidentStatus
  startedAt: string
  resolvedAt: string | null
  lastStatusCode: number | null
}

export type DashboardStats = {
  totalMonitors: number
  monitorsUp: number
  monitorsDown: number
  openIncidents: number
  avgResponseTime: number | null
  newThisWeek: number
  uptimePercent: number | null
}

export type DashboardData = {
  stats: DashboardStats
  chart: DashboardChartPoint[]
  incidents: DashboardIncident[]
  monitors: MonitorListItem[]
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export async function getDashboardDataForUser(
  userId: string
): Promise<DashboardData> {
  const monitors = await getMonitorsForUser(userId)
  const monitorIds = monitors.map((monitor) => monitor.id)

  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 90)

  const weekAgo = new Date()
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 7)

  if (monitorIds.length === 0) {
    return {
      stats: {
        totalMonitors: 0,
        monitorsUp: 0,
        monitorsDown: 0,
        openIncidents: 0,
        avgResponseTime: null,
        newThisWeek: 0,
        uptimePercent: null,
      },
      chart: [],
      incidents: [],
      monitors: [],
    }
  }

  const [checks, incidents] = await Promise.all([
    prisma.check.findMany({
      where: {
        monitorId: { in: monitorIds },
        checkedAt: { gte: since },
      },
      orderBy: { checkedAt: "asc" },
      select: {
        monitorId: true,
        status: true,
        statusCode: true,
        responseTime: true,
        checkedAt: true,
      },
    }),
    prisma.incident.findMany({
      where: { monitorId: { in: monitorIds } },
      orderBy: { startedAt: "desc" },
      take: 8,
      include: {
        monitor: {
          select: { id: true, name: true },
        },
      },
    }),
  ])

  const byDay = new Map<
    string,
    { totalMs: number; success: number; failed: number }
  >()

  for (const check of checks) {
    const key = dayKey(check.checkedAt)
    const bucket = byDay.get(key) ?? { totalMs: 0, success: 0, failed: 0 }
    bucket.totalMs += check.responseTime
    if (check.status === CheckStatus.SUCCESS) {
      bucket.success += 1
    } else {
      bucket.failed += 1
    }
    byDay.set(key, bucket)
  }

  const chart: DashboardChartPoint[] = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, bucket]) => {
      const count = bucket.success + bucket.failed
      return {
        date,
        avgResponseTime: count === 0 ? 0 : Math.round(bucket.totalMs / count),
        successCount: bucket.success,
        failedCount: bucket.failed,
      }
    })

  const latestFailedByMonitor = new Map<string, number | null>()
  for (const check of checks) {
    if (check.status === CheckStatus.FAILED) {
      latestFailedByMonitor.set(check.monitorId, check.statusCode)
    }
  }

  const dashboardIncidents: DashboardIncident[] = incidents.map((incident) => ({
    id: incident.id,
    monitorId: incident.monitor.id,
    monitorName: incident.monitor.name,
    status: incident.status,
    startedAt: incident.startedAt.toISOString(),
    resolvedAt: incident.resolvedAt?.toISOString() ?? null,
    lastStatusCode: latestFailedByMonitor.get(incident.monitor.id) ?? null,
  }))

  const lastChecks = monitors
    .map((monitor) => monitor.lastCheck)
    .filter((check): check is NonNullable<typeof check> => check !== null)

  const avgResponseTime =
    lastChecks.length === 0
      ? null
      : Math.round(
          lastChecks.reduce((sum, check) => sum + check.responseTime, 0) /
            lastChecks.length
        )

  const uptimePercent =
    checks.length === 0
      ? null
      : Math.round(
          (checks.filter((check) => check.status === CheckStatus.SUCCESS)
            .length /
            checks.length) *
            1000
        ) / 10

  return {
    stats: {
      totalMonitors: monitors.length,
      monitorsUp: monitors.filter((monitor) => monitor.health === "up").length,
      monitorsDown: monitors.filter((monitor) => monitor.health === "down")
        .length,
      openIncidents: monitors.reduce(
        (sum, monitor) => sum + monitor.openIncidentCount,
        0
      ),
      avgResponseTime,
      newThisWeek: monitors.filter(
        (monitor) => new Date(monitor.createdAt) >= weekAgo
      ).length,
      uptimePercent,
    },
    chart,
    incidents: dashboardIncidents,
    monitors,
  }
}
