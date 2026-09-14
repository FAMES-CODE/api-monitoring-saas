"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MonitorStatusBadge } from "@/components/monitors/monitor-status-badge"
import type { MonitorDetail } from "@/lib/monitors"

export function MonitorDetailHeader({ monitor }: { monitor: MonitorDetail }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function toggleEnabled() {
    setPending(true)
    try {
      const response = await fetch(`/api/monitors/${monitor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !monitor.enabled }),
      })
      if (!response.ok) throw new Error("Unable to update monitor")
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  async function deleteMonitor() {
    if (!window.confirm(`Delete monitor “${monitor.name}”? This cannot be undone.`)) {
      return
    }

    setPending(true)
    try {
      const response = await fetch(`/api/monitors/${monitor.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Unable to delete monitor")
      router.push("/monitors")
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mt-8 mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          href="/monitors"
          className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All monitors
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{monitor.name}</h1>
          <MonitorStatusBadge status={monitor.health} />
        </div>
        <p className="mt-1 font-mono text-sm text-neutral-500">{monitor.url}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={toggleEnabled}
          disabled={pending}
        >
          {monitor.enabled ? "Disable" : "Enable"}
        </Button>
        <Button variant="destructive" onClick={deleteMonitor} disabled={pending}>
          Delete
        </Button>
      </div>
    </div>
  )
}
