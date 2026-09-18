"use client"

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { MonitorDetail } from "@/lib/monitors"

const chartConfig = {
  responseTime: {
    label: "Response time",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function MonitorResponseTime({ monitor }: { monitor: MonitorDetail }) {
  const data = [...monitor.checks]
    .reverse()
    .map((check) => ({
      time: check.checkedAt,
      responseTime: check.responseTime,
    }))

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Response time</CardTitle>
        <CardDescription>
          {monitor.avgResponseTime === null
            ? "Average appears after the first check."
            : `Average ${monitor.avgResponseTime}ms across recent checks.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-neutral-500">No response time data yet.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[180px] w-full">
            <AreaChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="responseTime"
                type="monotone"
                fill="var(--color-responseTime)"
                fillOpacity={0.2}
                stroke="var(--color-responseTime)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
