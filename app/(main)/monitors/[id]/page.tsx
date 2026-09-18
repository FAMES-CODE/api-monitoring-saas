import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { MonitorDetailHeader } from "@/components/monitors/monitor-detail-header"
import { MonitorCurrentStatus } from "@/components/monitors/monitor-current-status"
import { MonitorUptime } from "@/components/monitors/monitor-uptime"
import { MonitorResponseTime } from "@/components/monitors/monitor-response-time"
import { MonitorCheckHistory } from "@/components/monitors/monitor-check-history"
import { MonitorIncidents } from "@/components/monitors/monitor-incidents"
import { MonitorConfiguration } from "@/components/monitors/monitor-configuration"
import { MonitorHeaders } from "@/components/monitors/monitor-headers"
import { MonitorRequestBody } from "@/components/monitors/monitor-request-body"
import { MonitorExpectedStatus } from "@/components/monitors/monitor-expected-status"
import { getMonitorDetailForUser } from "@/lib/monitors"

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/")
  }

  const { id } = await params
  const monitor = await getMonitorDetailForUser(session.user.id, id)

  return (
    <>
      <MonitorDetailHeader monitor={monitor} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MonitorCurrentStatus monitor={monitor} />
        <MonitorUptime monitor={monitor} />
        <MonitorExpectedStatus status={monitor.expectedStatus} />
      </div>

      <div className="mt-6">
        <MonitorResponseTime monitor={monitor} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MonitorCheckHistory checks={monitor.checks} />
        <MonitorIncidents incidents={monitor.incidents} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MonitorConfiguration monitor={monitor} />
        <MonitorHeaders headers={monitor.headers} />
        <MonitorRequestBody body={monitor.body} />
      </div>
    </>
  )
}
