"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DashboardChartPoint } from "@/lib/dashboard"

const chartConfig = {
  avgResponseTime: {
    label: "Avg. response (ms)",
    color: "var(--chart-1)",
  },
  failedCount: {
    label: "Failed checks",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({
  data,
}: {
  data: DashboardChartPoint[]
}) {
  const [timeRange, setTimeRange] = React.useState("30d")

  const filteredData = data.filter((item) => {
    const date = new Date(`${item.date}T00:00:00.000Z`)
    const daysToSubtract =
      timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : 30
    const startDate = new Date()
    startDate.setUTCDate(startDate.getUTCDate() - daysToSubtract)
    return date >= startDate
  })

  const rangeLabel =
    timeRange === "7d"
      ? "last 7 days"
      : timeRange === "90d"
        ? "last 3 months"
        : "last 30 days"

  return (
    <Card className="rounded-3xl border-none pt-0 shadow-sm">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Response time</CardTitle>
          <CardDescription>
            Average latency and failed checks across your monitors, {rangeLabel}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => {
            if (value) setTimeRange(value)
          }}
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-neutral-500">
            No checks yet for this period. Add a monitor and wait for the worker
            to run.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-avgResponseTime)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-avgResponseTime)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-failedCount)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-failedCount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(`${value}T00:00:00.000Z`)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(
                        `${value}T00:00:00.000Z`
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="failedCount"
                type="natural"
                fill="url(#fillFailed)"
                stroke="var(--color-failedCount)"
                stackId="a"
              />
              <Area
                dataKey="avgResponseTime"
                type="natural"
                fill="url(#fillLatency)"
                stroke="var(--color-avgResponseTime)"
                stackId="b"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
