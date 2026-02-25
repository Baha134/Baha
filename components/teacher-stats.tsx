"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, ShieldCheck, TrendingUp, Users } from "lucide-react"

interface TeacherStatsProps {
  stats: {
    totalStudents: number
    avgGpa: number
    avgAttendance: number
    totalVerifiedSkills: number
  }
}

export function TeacherStats({ stats }: TeacherStatsProps) {
  const items = [
    {
      label: "Студенттер",
      value: String(stats.totalStudents),
      subtitle: "Тағайындалған",
      icon: <Users className="h-5 w-5" />,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Орташа GPA",
      value: stats.avgGpa.toFixed(2),
      subtitle: "Барлық студенттер",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "text-chart-3 bg-chart-3/10",
    },
    {
      label: "Қатысу",
      value: `${stats.avgAttendance}%`,
      subtitle: "Орташа деңгей",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-chart-4 bg-chart-4/10",
    },
    {
      label: "Расталған дағдылар",
      value: String(stats.totalVerifiedSkills),
      subtitle: "Сіз растадыңыз",
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "text-chart-5 bg-chart-5/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((stat) => (
        <Card key={stat.label} className="rounded-2xl border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-[10px] text-muted-foreground/70">
                {stat.subtitle}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
