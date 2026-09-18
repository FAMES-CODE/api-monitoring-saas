import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MonitorsPageHeader } from "@/components/monitors/monitors-page-header"
import { CreateMonitorForm } from "@/components/monitors/create-monitor-form"

export default function NewMonitorPage() {
  return (
    <>
      <Link
        href="/monitors"
        className="mt-8 mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All monitors
      </Link>
      <MonitorsPageHeader
        title="New monitor"
        description="Configure the endpoint, headers, body, and check schedule."
      />
      <CreateMonitorForm />
    </>
  )
}
