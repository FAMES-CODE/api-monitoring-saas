import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { MonitorsPageHeader } from "@/components/monitors/monitors-page-header"
import { MonitorsOverview } from "@/components/monitors/monitors-overview"
import { getMonitorsForUser } from "@/lib/monitors"
import { MonitorsStats } from "@/components/monitors/monitors-stats"

export default async function MonitorsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/")
  }

  const monitors = await getMonitorsForUser(session.user.id)

  return (
    <>
      <MonitorsPageHeader
        title="Monitors"
        description="Create, search, and manage the endpoints you watch."
        actionHref="/monitors/new"
        actionLabel="New monitor"
      />
      <MonitorsStats monitors={monitors} />
      {monitors.length === 0 ? (
        <div className="rounded-[2rem] bg-white px-6 py-16 text-center shadow-sm dark:bg-card">
          <p className="text-lg font-medium">No monitors yet</p>
          <p className="mt-1 text-sm text-neutral-500">
            Add an endpoint to start tracking uptime and response time.
          </p>
        </div>
      ) : (
        <MonitorsOverview monitors={monitors} />
      )}
    </>
  )
}
