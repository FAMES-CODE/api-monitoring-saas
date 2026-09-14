import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MonitorsPageHeader } from "@/components/monitors/monitors-page-header"
import { EditMonitorForm } from "@/components/monitors/edit-monitor-form"
import { getMonitorDetailForUser } from "@/lib/monitors"

export default async function EditMonitorPage({
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
      <Link
        href={`/monitors/${monitor.id}`}
        className="mt-8 mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to {monitor.name}
      </Link>
      <MonitorsPageHeader
        title="Edit monitor"
        description="Update the endpoint, headers, body, and check schedule."
      />
      <EditMonitorForm
        monitor={{
          id: monitor.id,
          name: monitor.name,
          url: monitor.url,
          method: monitor.method,
          expectedStatus: monitor.expectedStatus,
          interval: monitor.interval,
          timeout: monitor.timeout,
          headers: monitor.headers,
          body: monitor.body,
        }}
      />
    </>
  )
}
