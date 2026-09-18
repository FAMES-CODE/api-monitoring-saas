import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getIncidentsForUser } from "@/lib/incidents"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const incidents = await getIncidentsForUser(session.user.id)
    return NextResponse.json(incidents)
  } catch (error) {
    console.error("GET /api/incidents error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
