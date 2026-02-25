import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.role === "student") {
      // Students can only see their own profile
      const students = await sql`
        SELECT s.*, u.iin FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id = ${session.userId}
      `
      return NextResponse.json(students)
    }

    if (session.role === "teacher") {
      // Teachers see their assigned students
      const students = await sql`
        SELECT s.*, u.iin FROM students s
        JOIN users u ON s.user_id = u.id
        JOIN teacher_students ts ON ts.student_id = s.id
        JOIN teachers t ON ts.teacher_id = t.id
        WHERE t.user_id = ${session.userId}
      `
      return NextResponse.json(students)
    }

    // Employers see all students
    const students = await sql`
      SELECT s.*, u.iin FROM students s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.rating DESC
    `
    return NextResponse.json(students)
  } catch (error) {
    console.error("Students fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
