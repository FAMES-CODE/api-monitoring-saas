"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MonitorStatusBadge } from "@/components/monitors/monitor-status-badge"
import type { MonitorListItem } from "@/lib/monitors"

export function MonitorsList({ monitors }: { monitors: MonitorListItem[] }) {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)

  async function patchEnabled(id: string, enabled: boolean) {
    setPendingId(id)
    try {
      const response = await fetch(`/api/monitors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      })
      if (!response.ok) {
        throw new Error("Unable to update monitor")
      }
      router.refresh()
    } finally {
      setPendingId(null)
    }
  }

  async function deleteMonitor(id: string, name: string) {
    if (!window.confirm(`Delete monitor “${name}”? This cannot be undone.`)) {
      return
    }

    setPendingId(id)
    try {
      const response = await fetch(`/api/monitors/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Unable to delete monitor")
      }
      router.refresh()
    } finally {
      setPendingId(null)
    }
  }

  if (monitors.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white px-6 py-16 text-center shadow-sm dark:bg-card">
        <p className="text-base font-medium">No monitors match these filters</p>
        <p className="mt-1 text-sm text-neutral-500">
          Try another search, or create a new endpoint to watch.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">Monitor</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Last check</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {monitors.map((monitor) => (
            <TableRow key={monitor.id}>
              <TableCell className="px-4">
                <Link
                  href={`/monitors/${monitor.id}`}
                  className="font-medium hover:underline"
                >
                  {monitor.name}
                </Link>
                <p className="max-w-xs truncate text-xs text-neutral-500">
                  {monitor.url}
                </p>
              </TableCell>
              <TableCell className="font-mono text-xs">{monitor.method}</TableCell>
              <TableCell>
                <MonitorStatusBadge status={monitor.health} />
              </TableCell>
              <TableCell>{monitor.interval}s</TableCell>
              <TableCell className="text-neutral-500">
                {monitor.lastCheck
                  ? new Date(monitor.lastCheck.checkedAt).toLocaleString()
                  : "Never"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={pendingId === monitor.id}
                    className="inline-flex size-8 items-center justify-center rounded-xl hover:bg-muted"
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Open actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/monitors/${monitor.id}`)}
                    >
                      Access details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/monitors/${monitor.id}/edit`)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => patchEnabled(monitor.id, !monitor.enabled)}
                    >
                      {monitor.enabled ? "Disable" : "Enable"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => deleteMonitor(monitor.id, monitor.name)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
