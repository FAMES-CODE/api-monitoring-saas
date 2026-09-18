import { prisma } from "@/lib/prisma"
import type { IncidentStatusValue } from "@/lib/incident-status"
import {
  getMonitorHealth,
  type MonitorHealthStatus,
} from "@/lib/monitors"

export type IncidentListItem = {
  id: string
  monitorId: string
  monitorName: string
  monitorUrl: string
  monitorHealth: MonitorHealthStatus
  status: IncidentStatusValue
  startedAt: string
  resolvedAt: string | null
}

export async function getIncidentsForUser(
  userId: string
): Promise<IncidentListItem[]> {
  const incidents = await prisma.incident.findMany({
    where: {
      monitor: { userId },
    },
    orderBy: { startedAt: "desc" },
    include: {
      monitor: {
        select: {
          id: true,
          name: true,
          url: true,
          enabled: true,
          expectedStatus: true,
          checks: {
            orderBy: { checkedAt: "desc" },
            take: 1,
            select: {
              status: true,
              statusCode: true,
            },
          },
        },
      },
    },
  })

  return incidents.map((incident) => {
    const lastCheck = incident.monitor.checks[0] ?? null

    return {
      id: incident.id,
      monitorId: incident.monitor.id,
      monitorName: incident.monitor.name,
      monitorUrl: incident.monitor.url,
      monitorHealth: getMonitorHealth(
        incident.monitor.enabled,
        lastCheck,
        incident.monitor.expectedStatus
      ),
      status: incident.status,
      startedAt: incident.startedAt.toISOString(),
      resolvedAt: incident.resolvedAt?.toISOString() ?? null,
    }
  })
}
