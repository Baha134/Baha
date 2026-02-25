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
      const skills = await sql`
        SELECT sk.*, sv.verified, sv.verified_by, sv.verified_at
        FROM skills sk
        LEFT JOIN skill_verifications sv ON sv.skill_id = sk.id
        WHERE sk.student_id = ${studentId}
        ORDER BY sk.category, sk.name
      `
      return NextResponse.json(skills)
    }

    // For student role, get own skills
    if (session.role === "student") {
      const skills = await sql`
        SELECT sk.*, sv.verified, sv.verified_by, sv.verified_at
        FROM skills sk
        JOIN students s ON sk.student_id = s.id
        LEFT JOIN skill_verifications sv ON sv.skill_id = sk.id
        WHERE s.user_id = ${session.userId}
        ORDER BY sk.category, sk.name
      `
      return NextResponse.json(skills)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error("Skills fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, name, category, level } = await request.json()

    const result = await sql`
      INSERT INTO skills (student_id, name, category, level)
      VALUES (${studentId}, ${name}, ${category}, ${level})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Skill create error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
