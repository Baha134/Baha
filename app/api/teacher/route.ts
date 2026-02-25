import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get teacher profile
    const teachers = await sql`
      SELECT t.*, u.iin FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.user_id = ${session.userId}
    `

    if (teachers.length === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    const teacher = teachers[0]

    // Get assigned students with their skills and achievements counts
    const students = await sql`
      SELECT 
        s.*,
        u.iin,
        (SELECT COUNT(*) FROM skills sk WHERE sk.student_id = s.id) as skills_count,
        (SELECT COUNT(*) FROM skill_verifications sv 
         JOIN skills sk2 ON sv.skill_id = sk2.id 
         WHERE sk2.student_id = s.id AND sv.verified = true) as verified_skills_count,
        (SELECT COUNT(*) FROM achievements a WHERE a.student_id = s.id) as achievements_count
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN teacher_students ts ON ts.student_id = s.id
      WHERE ts.teacher_id = ${teacher.id}
      ORDER BY s.full_name
    `

    // Get stats
    const totalStudents = students.length
    const avgGpa = students.length > 0 
      ? students.reduce((sum: number, s: Record<string, number>) => sum + Number(s.gpa), 0) / students.length 
      : 0
    const avgAttendance = students.length > 0 
      ? students.reduce((sum: number, s: Record<string, number>) => sum + Number(s.attendance), 0) / students.length 
      : 0
    const totalVerified = students.reduce(
      (sum: number, s: Record<string, number>) => sum + Number(s.verified_skills_count), 0
    )

    return NextResponse.json({
      teacher,
      students,
      stats: {
        totalStudents,
        avgGpa: Number(avgGpa.toFixed(2)),
        avgAttendance: Math.round(avgAttendance),
        totalVerifiedSkills: totalVerified,
      },
    })
  } catch (error) {
    console.error("Teacher fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
