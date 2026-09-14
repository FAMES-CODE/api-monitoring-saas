"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const

const inputClassName =
  "h-10 w-full rounded-2xl border border-transparent bg-muted/60 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"

type HeaderRow = { id: string; key: string; value: string }

type MonitorFormState = {
  name: string
  url: string
  method: (typeof METHODS)[number]
  expectedStatus: string
  interval: string
  timeout: string
  body: string
  headers: HeaderRow[]
}

const INITIAL_STATE: MonitorFormState = {
  name: "",
  url: "",
  method: "GET",
  expectedStatus: "200",
  interval: "60",
  timeout: "5000",
  body: "",
  headers: [{ id: "header-1", key: "", value: "" }],
}

export function MonitorForm({
  onSubmit,
  isSubmitting,
  error,
}: {
  onSubmit: (payload: Record<string, unknown>) => Promise<void>
  isSubmitting: boolean
  error: string | null
}) {
  const [form, setForm] = useState<MonitorFormState>(INITIAL_STATE)

  function update<K extends keyof MonitorFormState>(
    key: K,
    value: MonitorFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateHeader(id: string, field: "key" | "value", value: string) {
    update(
      "headers",
      form.headers.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const headers = Object.fromEntries(
      form.headers
        .filter((header) => header.key.trim().length > 0)
        .map((header) => [header.key.trim(), header.value])
    )

    let body: unknown
    if (form.body.trim()) {
      try {
        body = JSON.parse(form.body)
      } catch {
        body = form.body
      }
    }

    await onSubmit({
      name: form.name.trim(),
      url: form.url.trim(),
      method: form.method,
      expectedStatus: Number(form.expectedStatus),
      interval: Number(form.interval),
      timeout: Number(form.timeout),
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {error ? (
        <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Endpoint</CardTitle>
          <CardDescription>Name, URL and HTTP method to check.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <input
              required
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              className={inputClassName}
              placeholder="Production API"
            />
          </Field>
          <Field label="URL" className="sm:col-span-2">
            <input
              required
              type="url"
              value={form.url}
              onChange={(event) => update("url", event.target.value)}
              className={inputClassName}
              placeholder="https://api.example.com/health"
            />
          </Field>
          <Field label="Method">
            <Select
              value={form.method}
              onValueChange={(value) => {
                if (value) {
                  update("method", value as MonitorFormState["method"])
                }
              }}
            >
              <SelectTrigger className="h-10 w-full rounded-2xl bg-muted/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Expected status">
            <input
              required
              type="number"
              min={100}
              max={599}
              value={form.expectedStatus}
              onChange={(event) => update("expectedStatus", event.target.value)}
              className={inputClassName}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>How often to check, and for how long to wait.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Interval (seconds)">
            <input
              required
              type="number"
              min={30}
              value={form.interval}
              onChange={(event) => update("interval", event.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label="Timeout (milliseconds)">
            <input
              required
              type="number"
              min={1000}
              max={30000}
              value={form.timeout}
              onChange={(event) => update("timeout", event.target.value)}
              className={inputClassName}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Headers</CardTitle>
              <CardDescription>Optional request headers sent with each check.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                update("headers", [
                  ...form.headers,
                  { id: `header-${Date.now()}`, key: "", value: "" },
                ])
              }
            >
              <Plus data-icon="inline-start" />
              Add header
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.headers.map((header) => (
            <div key={header.id} className="flex gap-2">
              <input
                value={header.key}
                onChange={(event) =>
                  updateHeader(header.id, "key", event.target.value)
                }
                placeholder="Authorization"
                className={inputClassName}
              />
              <input
                value={header.value}
                onChange={(event) =>
                  updateHeader(header.id, "value", event.target.value)
                }
                placeholder="Bearer token"
                className={inputClassName}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  update(
                    "headers",
                    form.headers.filter((item) => item.id !== header.id)
                  )
                }
              >
                <Trash2 />
                <span className="sr-only">Remove header</span>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Request body</CardTitle>
          <CardDescription>
            Optional JSON payload for POST and PUT checks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={form.body}
            onChange={(event) => update("body", event.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-transparent bg-muted/60 p-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            placeholder='{ "ok": true }'
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create monitor"}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`grid gap-1.5 text-sm font-medium ${className ?? ""}`}>
      {label}
      {children}
    </label>
  )
}
