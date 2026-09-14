import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { updateMonitorSchema } from "@/lib/validations"
import type { Prisma } from "@/lib/generated/prisma/client"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const monitor = await prisma.monitor.findFirst({
      where: {
        userId: session.user.id,
        id,
      },
      include: {
        checks: {
          orderBy: { checkedAt: "desc" },
          take: 50,
        },
        incidents: {
          orderBy: { startedAt: "desc" },
          take: 20,
        },
      },
    })

    if (!monitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 })
    }

    return NextResponse.json(monitor)
  } catch (error) {
    console.error("GET /api/monitors/[id] error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check that the monitor belongs to the current user
    const existingMonitor = await prisma.monitor.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingMonitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 })
    }

    const body = await request.json()

    const result = updateMonitorSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { body: requestBody, ...fields } = result.data

    const monitor = await prisma.monitor.update({
      where: {
        id: existingMonitor.id,
      },
      data: {
        ...fields,
        body:
          requestBody === undefined
            ? undefined
            : (requestBody as Prisma.InputJsonValue),
      },
    })

    return NextResponse.json(monitor)
  } catch (error) {
    console.error("PATCH /api/monitors/[id] error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const monitor = await prisma.monitor.delete({
      where: {
        userId: session.user.id,
        id,
      },
    })

    return NextResponse.json(monitor)
  } catch (error) {
    console.error("DELETE /api/monitors/[id] error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
