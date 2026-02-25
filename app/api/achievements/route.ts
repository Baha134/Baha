import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    if (studentId) {
      const achievements = await sql`
        SELECT * FROM achievements WHERE student_id = ${studentId} ORDER BY date DESC
      `
      return NextResponse.json(achievements)
    }

    if (session.role === "student") {
      const achievements = await sql`
        SELECT a.* FROM achievements a
        JOIN students s ON a.student_id = s.id
        WHERE s.user_id = ${session.userId}
        ORDER BY a.date DESC
      `
      return NextResponse.json(achievements)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error("Achievements fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, title, description, date, type } = await request.json()

    const result = await sql`
      INSERT INTO achievements (student_id, title, description, date, type)
      VALUES (${studentId}, ${title}, ${description}, ${date}, ${type})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Achievement create error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
