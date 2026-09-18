import { prisma } from "@/lib/prisma"

export async function checkMonitor(monitorId: string) {
  const monitor = await prisma.monitor.findUnique({
    where: {
      id: monitorId,
    },
  })

  if (!monitor) {
    throw new Error(`Monitor ${monitorId} not found`)
  }

  if (!monitor.enabled) {
    return
  }

  const start = performance.now()

  let status: "SUCCESS" | "FAILED" = "FAILED"
  let statusCode: number | null = null
  let responseTime = 0
  let error: string | null = null

  try {
    const controller = new AbortController()

    const timeout = setTimeout(() => {
      controller.abort()
    }, monitor.timeout)

    const response = await fetch(monitor.url, {
      method: monitor.method,
      headers: monitor.headers
        ? (monitor.headers as Record<string, string>)
        : undefined,
      body:
        monitor.method !== "GET" && monitor.body
          ? JSON.stringify(monitor.body)
          : undefined,
      signal: controller.signal,
    })

    clearTimeout(timeout)

    responseTime = Math.round(performance.now() - start)
    statusCode = response.status

    if (response.status === monitor.expectedStatus) {
      status = "SUCCESS"
    } else {
      error = `Expected status ${monitor.expectedStatus}, received ${response.status}`
    }
  } catch (err) {
    responseTime = Math.round(performance.now() - start)

    if (err instanceof Error) {
      error =
        err.name === "AbortError"
          ? `Request timed out after ${monitor.timeout}ms`
          : err.message
    } else {
      error = "Unknown error"
    }
  }

  const check = await prisma.check.create({
    data: {
      monitorId: monitor.id,
      status,
      statusCode,
      responseTime,
      error,
    },
  })

  // Get the last 3 checks
  const recentChecks = await prisma.check.findMany({
    where: {
      monitorId: monitor.id,
    },
    orderBy: {
      checkedAt: "desc",
    },
    take: 3,
  })

  const hasThreeConsecutiveFailures =
    recentChecks.length === 3 &&
    recentChecks.every((check) => check.status === "FAILED")

  if (status === "FAILED") {
    await prisma.monitor.update({
      where: {
        id: monitor.id,
      },
      data: {
        status: "DOWN",
      },
    })

    if (hasThreeConsecutiveFailures) {
      const openIncident = await prisma.incident.findFirst({
        where: {
          monitorId: monitor.id,
          status: "OPEN",
        },
      })

      if (!openIncident) {
        await prisma.incident.create({
          data: {
            monitorId: monitor.id,
            status: "OPEN",
          },
        })

        console.log(`[Incident] Created for "${monitor.name}"`)
      }
    }
  }

  if (status === "SUCCESS") {
    await prisma.monitor.update({
      where: {
        id: monitor.id,
      },
      data: {
        status: "UP",
      },
    })

    const openIncident = await prisma.incident.findFirst({
      where: {
        monitorId: monitor.id,
        status: "OPEN",
      },
    })

    if (openIncident) {
      await prisma.incident.update({
        where: {
          id: openIncident.id,
        },
        data: {
          status: "RESOLVED",
          resolvedAt: new Date(),
        },
      })

      console.log(`[Incident] Resolved for "${monitor.name}"`)
    }
  }

  return check
}
