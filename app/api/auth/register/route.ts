import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { iin, pin, role } = await request.json()

    // Validate IIN format (12 digits)
    if (!iin || !/^\d{12}$/.test(iin)) {
      return NextResponse.json(
        { error: "ИИН 12 саннан тұруы керек" },
        { status: 400 }
      )
    }

    // Validate PIN (4-6 digits)
    if (!pin || !/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN-код 4-6 саннан тұруы керек" },
        { status: 400 }
      )
    }

    // Validate role
    if (!["student", "employer", "teacher"].includes(role)) {
      return NextResponse.json(
        { error: "Рөлді таңдаңыз" },
        { status: 400 }
      )
    }

    // Check if IIN already exists
    const existing = await sql`SELECT id FROM users WHERE iin = ${iin}`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Бұл ИИН-мен тіркелген пайдаланушы бар" },
        { status: 409 }
      )
    }

    // Hash the PIN
    const pinHash = await bcrypt.hash(pin, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (iin, pin_hash, role)
      VALUES (${iin}, ${pinHash}, ${role})
      RETURNING id, iin, role
    `

    const user = result[0]

    // If student role, create a student profile
    if (role === "student") {
      await sql`
        INSERT INTO students (user_id, full_name, course, group_name, gpa, attendance, rating)
        VALUES (${user.id}, ${"Жаңа студент"}, 1, ${"Топ-1"}, 0.0, 0, 0)
      `
    }

    // If teacher role, create a teacher profile
    if (role === "teacher") {
      await sql`
        INSERT INTO teachers (user_id, full_name, department, subject)
        VALUES (${user.id}, ${"Жаңа оқытушы"}, ${"Жалпы"}, ${"Жалпы пән"})
      `
    }

    // Create session
    await createSession({
      userId: user.id,
      iin: user.iin,
      role: user.role,
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, iin: user.iin, role: user.role },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Тіркелу кезінде қате пайда болды" },
      { status: 500 }
    )
  }
}
