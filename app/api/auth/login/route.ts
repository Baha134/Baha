import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { iin, pin } = await request.json()

    // Validate IIN format
    if (!iin || !/^\d{12}$/.test(iin)) {
      return NextResponse.json(
        { error: "ИИН 12 саннан тұруы керек" },
        { status: 400 }
      )
    }

    // Validate PIN
    if (!pin || !/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN-код 4-6 саннан тұруы керек" },
        { status: 400 }
      )
    }

    // Find user by IIN
    const users = await sql`SELECT id, iin, pin_hash, role FROM users WHERE iin = ${iin}`
    if (users.length === 0) {
      return NextResponse.json(
        { error: "Пайдаланушы табылмады" },
        { status: 401 }
      )
    }

    const user = users[0]

    // Verify PIN
    const isValid = await bcrypt.compare(pin, user.pin_hash)
    if (!isValid) {
      return NextResponse.json(
        { error: "PIN-код қате" },
        { status: 401 }
      )
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
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Кіру кезінде қате пайда болды" },
      { status: 500 }
    )
  }
}
