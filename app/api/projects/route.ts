import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await sql`
      SELECT p.id, p.title, p.description, p.created_at, u.name as student_name
      FROM projects p
      JOIN users u ON p.student_id = u.id
      ORDER BY p.created_at DESC
    `

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can create projects" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description } = body

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO projects (title, description, student_id)
      VALUES (${title.trim()}, ${description?.trim() || null}, ${session.user.id})
      RETURNING id, title, description, created_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
