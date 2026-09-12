import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createMonitorSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Read request body
    const body = await request.json()

    // Validate body
    const result = createMonitorSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten(),
        },
        { status: 400 }
      )
    }

    // Create monitor
    const monitor = await prisma.monitor.create({
      data: {
        ...result.data,
        userId: session.user.id,
      },
    })

    // Return created monitor
    return NextResponse.json(monitor, { status: 201 })
  } catch (error) {
    console.error("POST /api/monitors error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const monitors = await prisma.monitor.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(monitors)
  } catch (error) {
    console.error("GET /api/monitors error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}