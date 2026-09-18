"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
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
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by monitor name or URL"
            className="h-11 w-full rounded-xl border border-border/80 bg-card pr-3 pl-10 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </label>
        <Select
          value={filter}
          onValueChange={(value) => {
            if (value === "all" || value === "open" || value === "resolved") {
              setFilter(value)
            }
          }}
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-card shadow-sm sm:w-44">
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
