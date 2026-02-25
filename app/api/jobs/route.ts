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

    const jobs = await sql`
      SELECT j.id, j.title, j.company, j.description, j.created_at, u.name as employer_name
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      ORDER BY j.created_at DESC
    `

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Only employers can create jobs" }, { status: 403 })
    }

    const body = await request.json()
    const { title, company, description } = body

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (!company || typeof company !== "string" || company.trim().length === 0) {
      return NextResponse.json({ error: "Company is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO jobs (title, company, description, employer_id)
      VALUES (${title.trim()}, ${company.trim()}, ${description?.trim() || null}, ${session.user.id})
      RETURNING id, title, company, description, created_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
