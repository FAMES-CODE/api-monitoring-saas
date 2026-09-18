"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MonitorForm } from "@/components/monitors/monitor-form"

export function CreateMonitorForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(payload: Record<string, unknown>) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as { id?: string; error?: string }

      if (!response.ok || !data.id) {
        throw new Error(data.error ?? "Unable to create monitor")
      }

      router.push(`/monitors/${data.id}`)
      router.refresh()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create monitor"
      )
      setIsSubmitting(false)
    }
  }

  return (
    <MonitorForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
    />
  )
}
