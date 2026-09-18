"use client"

import { useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IncidentsList } from "@/components/incidents/incidents-list"
import type { IncidentListItem } from "@/lib/incidents"

export type IncidentFilter = "all" | "open" | "resolved"

export function IncidentsOverview({
  incidents,
}: {
  incidents: IncidentListItem[]
}) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<IncidentFilter>("all")

  const visibleIncidents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return incidents.filter((incident) => {
      const matchesSearch =
        query.length === 0 ||
        incident.monitorName.toLowerCase().includes(query) ||
        incident.monitorUrl.toLowerCase().includes(query)

      const matchesFilter =
        filter === "all" ||
        (filter === "open" && incident.status === "OPEN") ||
        (filter === "resolved" && incident.status === "RESOLVED")

      return matchesSearch && matchesFilter
    })
  }, [filter, incidents, search])

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by monitor name or URL"
          className="h-10 w-full flex-1 rounded-2xl border border-transparent bg-white px-3 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 dark:bg-card"
        />
        <Select
          value={filter}
          onValueChange={(value) => {
            if (value === "all" || value === "open" || value === "resolved") {
              setFilter(value)
            }
          }}
        >
          <SelectTrigger className="h-10 w-full rounded-2xl bg-white shadow-sm sm:w-44 dark:bg-card">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All incidents</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <IncidentsList incidents={visibleIncidents} />
    </>
  )
}
