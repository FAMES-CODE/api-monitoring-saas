import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { MonitorsPageHeader } from "@/components/monitors/monitors-page-header"
import { IncidentsStats } from "@/components/incidents/incidents-stats"
import { IncidentsOverview } from "@/components/incidents/incidents-overview"
import { getIncidentsForUser } from "@/lib/incidents"

export default async function IncidentsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/")
  }

  const incidents = await getIncidentsForUser(session.user.id)

  return (
    <>
      <MonitorsPageHeader
        title="Incidents"
        description="Outages recorded across every monitor you watch."
      />
      <IncidentsStats incidents={incidents} />
      {incidents.length === 0 ? (
        <div className="rounded-[2rem] bg-white px-6 py-16 text-center shadow-sm dark:bg-card">
          <p className="text-lg font-medium">No incidents yet</p>
          <p className="mt-1 text-sm text-neutral-500">
            When a monitor fails consecutively, the outage will show up here.
          </p>
        </div>
      ) : (
        <IncidentsOverview incidents={incidents} />
      )}
    </>
  )
}
