import { prisma } from "@/lib/prisma"
import { checkMonitor } from "./check-monitor"

const SCHEDULER_INTERVAL = 5000

let isRunning = false

export async function runScheduler() {
  if (isRunning) {
    return
  }

  isRunning = true

  try {
    const monitors = await prisma.monitor.findMany({
      where: {
        enabled: true,
      },
      include: {
        checks: {
          orderBy: {
            checkedAt: "desc",
          },
          take: 1,
        },
      },
    })

    const now = Date.now()

    for (const monitor of monitors) {
      const lastCheck = monitor.checks[0]

      const shouldCheck =
        !lastCheck || now - lastCheck.checkedAt.getTime() >= monitor.interval

      if (!shouldCheck) {
        continue
      }

      console.log(`[Scheduler] Checking "${monitor.name}" (${monitor.id})`)

      try {
        const check = await checkMonitor(monitor.id)
        
        if (!check) {
          continue
        }

        console.log(
          `[Scheduler] ${monitor.name}: ${check.status} - ${check.responseTime}ms`
        )
      } catch (error) {
        console.error(`[Scheduler] Failed to check "${monitor.name}":`, error)
      }
    }
  } catch (error) {
    console.error("[Scheduler] Error:", error)
  } finally {
    isRunning = false
  }
}

export function startScheduler() {
  console.log(`[Scheduler] Started - polling every ${SCHEDULER_INTERVAL}ms`)

  runScheduler()

  setInterval(() => {
    runScheduler()
  }, SCHEDULER_INTERVAL)
}
