import { z } from "zod"

export const createMonitorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),

  url: z.string().url("Invalid URL"),

  method: z.enum(["GET", "POST", "PUT", "DELETE"]),

  interval: z.number().int().min(30, "Interval must be at least 30 seconds"),

  expectedStatus: z.number().int().min(100).max(599),

  timeout: z.number().int().min(1000).max(30000),

  headers: z.record(z.string(), z.string()).optional(),

  body: z.unknown().optional(),
})


export const updateMonitorSchema = createMonitorSchema.partial()