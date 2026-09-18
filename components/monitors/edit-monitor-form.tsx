"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  MonitorForm,
  type MonitorFormValues,
} from "@/components/monitors/monitor-form"

export function EditMonitorForm({
  monitor,
}: {
  monitor: MonitorFormValues & { id: string }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(payload: Record<string, unknown>) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/monitors/${monitor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as { id?: string; error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update monitor")
      }

      router.push(`/monitors/${monitor.id}`)
      router.refresh()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update monitor"
      )
      setIsSubmitting(false)
    }
  }

  return (
    <MonitorForm
      initialValues={monitor}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      submitLabel="Save changes"
      submittingLabel="Saving…"
    />
  )
}
