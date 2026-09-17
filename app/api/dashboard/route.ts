import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getDashboardDataForUser } from "@/lib/dashboard"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await getDashboardDataForUser(session.user.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/dashboard error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
