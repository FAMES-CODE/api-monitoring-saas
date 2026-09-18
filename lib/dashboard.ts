import { prisma } from "@/lib/prisma"
import {
  CheckStatus,
  IncidentStatus,
} from "@/lib/generated/prisma/client"
import { getMonitorsForUser, type MonitorListItem } from "@/lib/monitors"

export type ChartTimeRange = "24h" | "7d" | "30d" | "90d"

export type DashboardChartPoint = {
  date: string
  [monitorId: string]: string | number | null
}

export type DashboardChartSeriesMeta = {
  id: string
  key: string
  name: string
}

export type DashboardChartSeries = {
  series: DashboardChartSeriesMeta[]
  ranges: Record<ChartTimeRange, DashboardChartPoint[]>
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
  chart: DashboardChartSeries
  incidents: DashboardIncident[]
  monitors: MonitorListItem[]
}

const EMPTY_CHART: DashboardChartSeries = {
  series: [],
  ranges: {
    "24h": [],
    "7d": [],
    "30d": [],
    "90d": [],
  },
}

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

function startOfHourUTC(date: Date): Date {
  const next = new Date(date)
  next.setUTCMinutes(0, 0, 0)
  return next
}

function startOfDayUTC(date: Date): Date {
  const next = new Date(date)
  next.setUTCHours(0, 0, 0, 0)
  return next
}

function buildMonitorSeries(
  checks: Array<{
    monitorId: string
    responseTime: number
    checkedAt: Date
  }>,
  monitorIds: string[],
  rangeStart: Date,
  rangeEnd: Date,
  stepMs: number,
  align: (date: Date) => Date
): DashboardChartPoint[] {
  const alignedStart = align(rangeStart)
  const buckets = new Map<string, Map<string, { total: number; count: number }>>()

  for (
    let timestamp = alignedStart.getTime();
    timestamp <= rangeEnd.getTime();
    timestamp += stepMs
  ) {
    buckets.set(new Date(timestamp).toISOString(), new Map())
  }

  for (const check of checks) {
    if (check.checkedAt < alignedStart || check.checkedAt > rangeEnd) continue

    const key = align(check.checkedAt).toISOString()
    const bucket = buckets.get(key)
    if (!bucket) continue

    const monitorStats = bucket.get(check.monitorId) ?? { total: 0, count: 0 }
    monitorStats.total += check.responseTime
    monitorStats.count += 1
    bucket.set(check.monitorId, monitorStats)
  }

  return [...buckets.entries()].map(([date, byMonitor]) => {
    const point: DashboardChartPoint = { date }

    for (const monitorId of monitorIds) {
      const stats = byMonitor.get(monitorId)
      const seriesKey = `m_${monitorId.replaceAll("-", "")}`
      point[seriesKey] =
        stats && stats.count > 0 ? Math.round(stats.total / stats.count) : null
    }

    return point
  })
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
      chart: EMPTY_CHART,
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

  const now = new Date()
  const chart: DashboardChartSeries = {
    series: monitors.map((monitor) => ({
      id: monitor.id,
      key: `m_${monitor.id.replaceAll("-", "")}`,
      name: monitor.name,
    })),
    ranges: {
      "24h": buildMonitorSeries(
        checks,
        monitorIds,
        new Date(now.getTime() - 24 * HOUR_MS),
        now,
        HOUR_MS,
        startOfHourUTC
      ),
      "7d": buildMonitorSeries(
        checks,
        monitorIds,
        new Date(now.getTime() - 7 * DAY_MS),
        now,
        HOUR_MS,
        startOfHourUTC
      ),
      "30d": buildMonitorSeries(
        checks,
        monitorIds,
        new Date(now.getTime() - 30 * DAY_MS),
        now,
        DAY_MS,
        startOfDayUTC
      ),
      "90d": buildMonitorSeries(
        checks,
        monitorIds,
        new Date(now.getTime() - 90 * DAY_MS),
        now,
        DAY_MS,
        startOfDayUTC
      ),
    },
  }

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
