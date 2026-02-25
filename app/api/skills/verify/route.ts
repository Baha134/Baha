import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== "teacher") {
      return NextResponse.json({ error: "Тек оқытушылар расти алады" }, { status: 403 })
    }

    const { skillId } = await request.json()

    // Get teacher name
    const teachers = await sql`
      SELECT full_name FROM teachers WHERE user_id = ${session.userId}
    `
    const teacherName = teachers[0]?.full_name || "Оқытушы"

    // Upsert verification
    await sql`
      INSERT INTO skill_verifications (skill_id, teacher_user_id, verified, verified_by)
      VALUES (${skillId}, ${session.userId}, true, ${teacherName})
      ON CONFLICT (skill_id) 
      DO UPDATE SET verified = true, verified_by = ${teacherName}, verified_at = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Skill verify error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
