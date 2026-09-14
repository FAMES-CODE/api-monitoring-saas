"use client"

import { useMemo, useState } from "react"
import { MonitorsList } from "@/components/monitors/monitors-list"
import {
  MonitorsToolbar,
  type MonitorFilter,
} from "@/components/monitors/monitors-toolbar"
import type { MonitorListItem } from "@/lib/monitors"

export function MonitorsOverview({ monitors }: { monitors: MonitorListItem[] }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<MonitorFilter>("all")

  const visibleMonitors = useMemo(() => {
    const query = search.trim().toLowerCase()

    return monitors.filter((monitor) => {
      const matchesSearch =
        query.length === 0 ||
        monitor.name.toLowerCase().includes(query) ||
        monitor.url.toLowerCase().includes(query)

      const matchesFilter =
        filter === "all" ||
        (filter === "enabled" && monitor.enabled) ||
        (filter === "disabled" && !monitor.enabled) ||
        (filter === "down" && monitor.health === "down")

      return matchesSearch && matchesFilter
    })
  }, [filter, monitors, search])

  return (
    <>
      <MonitorsToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />
      <MonitorsList monitors={visibleMonitors} />
    </>
  )
}
