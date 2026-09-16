import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { IncidentStatus, type Prisma } from "@/lib/generated/prisma/client"

export type MonitorHealthStatus = "up" | "down" | "pending" | "paused"

export type MonitorListItem = {
  id: string
  name: string
  url: string
  method: string
  interval: number
  expectedStatus: number
  timeout: number
  enabled: boolean
  createdAt: string
  health: MonitorHealthStatus
  lastCheck: {
    status: string
    statusCode: number
    responseTime: number
    checkedAt: string
  } | null
  openIncidentCount: number
}

export type MonitorCheckItem = {
  id: string
  status: string
  statusCode: number
  responseTime: number
  error: string
  checkedAt: string
}

export type MonitorIncidentItem = {
  id: string
  startedAt: string
  resolvedAt: string | null
  status: IncidentStatus
}

export type MonitorDetail = MonitorListItem & {
  headers: Record<string, string>
  body: unknown
  updatedAt: string
  checks: MonitorCheckItem[]
  incidents: MonitorIncidentItem[]
  uptimePercent: number | null
  avgResponseTime: number | null
}

function jsonToRecord(value: Prisma.JsonValue | null): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string"
    )
  )
}

export function getMonitorHealth(
  enabled: boolean,
  lastCheck: { status: string; statusCode: number | null } | null,
  expectedStatus: number
): MonitorHealthStatus {
  if (!enabled) return "paused"
  if (!lastCheck) return "pending"

  const normalized = lastCheck.status.toLowerCase()
  if (normalized === "up" || normalized === "ok" || normalized === "success") {
    return "up"
  }
  if (normalized === "down" || normalized === "fail" || normalized === "error") {
    return "down"
  }

  return lastCheck.statusCode === expectedStatus ? "up" : "down"
}

function serializeCheck(check: {
  id: string
  status: string
  statusCode: number | null
  responseTime: number
  error: string | null
  checkedAt: Date
}): MonitorCheckItem {
  return {
    id: check.id,
    status: check.status,
    statusCode: check.statusCode ?? 0,
    responseTime: check.responseTime,
    error: check.error ?? "",
    checkedAt: check.checkedAt.toISOString(),
  }
}

export async function getMonitorsForUser(userId: string): Promise<MonitorListItem[]> {
  const monitors = await prisma.monitor.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      checks: {
        orderBy: { checkedAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          incidents: {
            where: { status: IncidentStatus.OPEN },
          },
        },
      },
    },
  })

  return monitors.map((monitor) => {
    const lastCheck = monitor.checks[0] ?? null

    return {
      id: monitor.id,
      name: monitor.name,
      url: monitor.url,
      method: monitor.method,
      interval: monitor.interval,
      expectedStatus: monitor.expectedStatus,
      timeout: monitor.timeout,
      enabled: monitor.enabled,
      createdAt: monitor.createdAt.toISOString(),
      lastCheck: lastCheck
        ? {
            status: lastCheck.status,
            statusCode: lastCheck.statusCode ?? 0,
            responseTime: lastCheck.responseTime,
            checkedAt: lastCheck.checkedAt.toISOString(),
          }
        : null,
      openIncidentCount: monitor._count.incidents,
      health: getMonitorHealth(
        monitor.enabled,
        lastCheck,
        monitor.expectedStatus
      ),
    }
  })
}

export async function getMonitorDetailForUser(
  userId: string,
  id: string
): Promise<MonitorDetail> {
  const monitor = await prisma.monitor.findFirst({
    where: { userId, id },
    include: {
      checks: {
        orderBy: { checkedAt: "desc" },
        take: 50,
      },
      incidents: {
        orderBy: { startedAt: "desc" },
        take: 20,
      },
    },
  })

  if (!monitor) {
    notFound()
  }

  const lastCheck = monitor.checks[0] ?? null
  const successfulChecks = monitor.checks.filter(
    (check) => check.status === "SUCCESS"
  )
  const uptimePercent =
    monitor.checks.length === 0
      ? null
      : Math.round((successfulChecks.length / monitor.checks.length) * 1000) / 10
  const avgResponseTime =
    monitor.checks.length === 0
      ? null
      : Math.round(
          monitor.checks.reduce((sum, check) => sum + check.responseTime, 0) /
            monitor.checks.length
        )

  return {
    id: monitor.id,
    name: monitor.name,
    url: monitor.url,
    method: monitor.method,
    interval: monitor.interval,
    expectedStatus: monitor.expectedStatus,
    timeout: monitor.timeout,
    enabled: monitor.enabled,
    createdAt: monitor.createdAt.toISOString(),
    updatedAt: monitor.updatedAt.toISOString(),
    headers: jsonToRecord(monitor.headers),
    body: monitor.body,
    lastCheck: lastCheck
      ? {
          status: lastCheck.status,
            statusCode: lastCheck.statusCode ?? 0,
            responseTime: lastCheck.responseTime,
            checkedAt: lastCheck.checkedAt.toISOString(),
          }
        : null,
    openIncidentCount: monitor.incidents.filter(
      (incident) => incident.status === IncidentStatus.OPEN
    ).length,
    health: getMonitorHealth(monitor.enabled, lastCheck, monitor.expectedStatus),
    checks: monitor.checks.map(serializeCheck),
    incidents: monitor.incidents.map((incident) => ({
      id: incident.id,
      startedAt: incident.startedAt.toISOString(),
      resolvedAt: incident.resolvedAt?.toISOString() ?? null,
      status: incident.status,
    })),
    uptimePercent,
    avgResponseTime,
  }
}
