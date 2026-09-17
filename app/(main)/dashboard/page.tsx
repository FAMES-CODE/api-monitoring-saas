import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ChartAreaInteractive } from "@/components/dashboard/chart"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MonitorHealth } from "@/components/dashboard/monitor-health"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { GetStarted } from "@/components/dashboard/get-started"
import { getDashboardDataForUser } from "@/lib/dashboard"
import { greetingForHour } from "@/lib/format"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/")
  }

  const dashboard = await getDashboardDataForUser(session.user.id)
  const greeting = greetingForHour(new Date().getHours())
  const displayName = session.user.name || session.user.email || "there"

  return (
    <>
      <p className="my-8 text-2xl font-semibold">
        {greeting}, {displayName}
      </p>

      <div className="mb-6">
        <StatsCards stats={dashboard.stats} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ChartAreaInteractive data={dashboard.chart} />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MonitorHealth incidents={dashboard.incidents} />
            <QuickActions />
          </div>
        </div>

        <div className="lg:col-span-1">
          <GetStarted monitors={dashboard.monitors} />
        </div>
      </div>
    </>
  )
}
