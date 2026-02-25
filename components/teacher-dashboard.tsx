"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TeacherStats } from "@/components/teacher-stats"
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Loader2,
  ShieldCheck,
  User,
} from "lucide-react"

interface Student {
  id: string
  full_name: string
  course: number
  group_name: string
  gpa: number
  attendance: number
  rating: number
  skills_count: number
  verified_skills_count: number
  achievements_count: number
}

interface Skill {
  id: string
  name: string
  category: string
  level: number
  verified: boolean | null
  verified_by: string | null
}

interface TeacherData {
  teacher: {
    id: string
    full_name: string
    department: string
    subject: string
  }
  students: Student[]
  stats: {
    totalStudents: number
    avgGpa: number
    avgAttendance: number
    totalVerifiedSkills: number
  }
}

export function TeacherDashboard() {
  const [data, setData] = useState<TeacherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [studentSkills, setStudentSkills] = useState<Record<string, Skill[]>>({})
  const [verifyingSkill, setVerifyingSkill] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/teacher")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (error) {
      console.error("Failed to fetch teacher data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const loadStudentSkills = async (studentId: string) => {
    if (studentSkills[studentId]) return
    try {
      const res = await fetch(`/api/skills?studentId=${studentId}`)
      if (res.ok) {
        const skills = await res.json()
        setStudentSkills((prev) => ({ ...prev, [studentId]: skills }))
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error)
    }
  }

  const toggleStudent = (studentId: string) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null)
    } else {
      setExpandedStudent(studentId)
      loadStudentSkills(studentId)
    }
  }

  const verifySkill = async (skillId: string) => {
    setVerifyingSkill(skillId)
    try {
      const res = await fetch("/api/skills/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      })
      if (res.ok) {
        // Update local state
        setStudentSkills((prev) => {
          const updated = { ...prev }
          for (const studentId in updated) {
            updated[studentId] = updated[studentId].map((sk) =>
              sk.id === skillId ? { ...sk, verified: true, verified_by: data?.teacher.full_name || "Оқытушы" } : sk
            )
          }
          return updated
        })
        // Refresh stats
        await fetchData()
      }
    } catch (error) {
      console.error("Failed to verify skill:", error)
    } finally {
      setVerifyingSkill(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Деректерді жүктеу мүмкін болмады</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <TeacherStats stats={data.stats} />

      {/* Students List */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">
            Менің студенттерім
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-0">
          {data.students.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Тағайындалған студенттер жоқ
            </p>
          ) : (
            data.students.map((student) => (
              <div
                key={student.id}
                className="overflow-hidden rounded-xl border border-border"
              >
                {/* Student row */}
                <button
                  onClick={() => toggleStudent(student.id)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {student.full_name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {student.course}-курс / {student.group_name} / GPA: {Number(student.gpa).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px]">
                      {student.verified_skills_count}/{student.skills_count} расталған
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Қатысу: {student.attendance}%
                    </Badge>
                    {expandedStudent === student.id ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded skills panel */}
                {expandedStudent === student.id && (
                  <div className="border-t border-border bg-muted/30 px-4 py-3">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Дағдылар
                    </p>
                    {!studentSkills[student.id] ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Жүктелуде...</span>
                      </div>
                    ) : studentSkills[student.id].length === 0 ? (
                      <p className="py-2 text-xs text-muted-foreground">
                        Дағдылар тіркелмеген
                      </p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {studentSkills[student.id].map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center gap-3 rounded-lg bg-background px-3 py-2"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {skill.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-[9px] font-normal"
                                >
                                  {skill.category}
                                </Badge>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <div className="h-1.5 w-24 rounded-full bg-muted">
                                  <div
                                    className="h-1.5 rounded-full bg-primary"
                                    style={{ width: `${skill.level}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {skill.level}%
                                </span>
                              </div>
                            </div>
                            {skill.verified ? (
                              <div className="flex items-center gap-1 text-chart-3">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-[10px] font-medium">
                                  {skill.verified_by}
                                </span>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1 text-[11px]"
                                onClick={() => verifySkill(skill.id)}
                                disabled={verifyingSkill === skill.id}
                              >
                                {verifyingSkill === skill.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <ShieldCheck className="h-3 w-3" />
                                )}
                                Растау
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick stats */}
                    <div className="mt-3 flex gap-3 border-t border-border pt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Жетістіктер: {student.achievements_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Расталған: {student.verified_skills_count}/{student.skills_count}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
