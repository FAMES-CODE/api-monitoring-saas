import { auth } from "@/auth"
import { ChartAreaInteractive } from "@/components/dashboard/chart"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MonitorHealth } from "@/components/dashboard/monitor-health"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { GetStarted } from "@/components/dashboard/get-started"

export default async function DashboardPage() {
 
  const session = await auth()

  return (
    <>
      <p className="my-8 text-2xl font-semibold">
        Good morning, {session?.user?.name || session?.user?.email}
      </p>

      <div className="mb-6">
        <StatsCards />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ChartAreaInteractive />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MonitorHealth />
            <QuickActions />
          </div>
        </div>

        <div className="lg:col-span-1">
          <GetStarted />
        </div>
      </div>
    </>
  )
}
