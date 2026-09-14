"use client"

import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type MonitorFilter = "all" | "enabled" | "disabled" | "down"

export function MonitorsToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: {
  search: string
  onSearchChange: (value: string) => void
  filter: MonitorFilter
  onFilterChange: (value: MonitorFilter) => void
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or URL"
          className="h-10 w-full rounded-2xl border border-transparent bg-white pr-3 pl-10 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 dark:bg-card"
        />
      </label>
      <Select
        value={filter}
        onValueChange={(value) => {
          if (value) onFilterChange(value as MonitorFilter)
        }}
      >
        <SelectTrigger className="h-10 w-full rounded-2xl bg-white shadow-sm sm:w-44 dark:bg-card">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All monitors</SelectItem>
          <SelectItem value="enabled">Enabled</SelectItem>
          <SelectItem value="disabled">Disabled</SelectItem>
          <SelectItem value="down">Down</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
