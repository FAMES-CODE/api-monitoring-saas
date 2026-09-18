"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
import type { ChartTimeRange, DashboardChartSeries } from "@/lib/dashboard"

const RANGE_LABELS: Record<ChartTimeRange, string> = {
  "24h": "last 24 hours",
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 3 months",
}

const LINE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function formatTick(iso: string, range: ChartTimeRange) {
  const date = new Date(iso)
  if (range === "24h" || range === "7d") {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
    })
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function ChartAreaInteractive({
  data,
}: {
  data: DashboardChartSeries
}) {
  const [timeRange, setTimeRange] = React.useState<ChartTimeRange>("24h")
  const points = data.ranges[timeRange] ?? []
  const hasValues = points.some((point) =>
    data.series.some((series) => typeof point[series.key] === "number")
  )

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {}
    for (const [index, series] of data.series.entries()) {
      config[series.key] = {
        label: series.name,
        color: LINE_COLORS[index % LINE_COLORS.length],
      }
    }
    return config
  }, [data.series])

  return (
    <Card className="app-surface pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-border/70 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="font-bold">Average response time</CardTitle>
          <CardDescription>
            One line per monitor, {RANGE_LABELS[timeRange]}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => {
            if (
              value === "24h" ||
              value === "7d" ||
              value === "30d" ||
              value === "90d"
            ) {
              setTimeRange(value)
            }
          }}
        >
          <SelectTrigger
            className="w-[160px] rounded-xl border-border/80 bg-muted/50 sm:ml-auto"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Last 24 hours" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="24h" className="rounded-lg">
              Last 24 hours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!hasValues ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-neutral-500">
            No checks yet for this period. Add a monitor and wait for the worker
            to run.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <LineChart data={points}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => formatTick(String(value), timeRange)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(value) => `${value}ms`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      formatTick(String(value), timeRange)
                    }
                    indicator="dot"
                  />
                }
              />
              {data.series.map((series) => (
                <Line
                  key={series.id}
                  dataKey={series.key}
                  name={series.name}
                  type="monotone"
                  stroke={`var(--color-${series.key})`}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
