"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, FolderKanban, MessageSquareText, Award } from "lucide-react"

const stats = [
  {
    label: "Job Matches",
    value: "12",
    change: "+3 this week",
    icon: <Briefcase className="h-5 w-5" />,
    color: "text-primary bg-primary/10",
  },
  {
    label: "Projects",
    value: "7",
    change: "2 in progress",
    icon: <FolderKanban className="h-5 w-5" />,
    color: "text-chart-3 bg-chart-3/10",
  },
  {
    label: "Recommendations",
    value: "3",
    change: "All verified",
    icon: <MessageSquareText className="h-5 w-5" />,
    color: "text-chart-4 bg-chart-4/10",
  },
  {
    label: "Achievements",
    value: "5",
    change: "4 verified",
    icon: <Award className="h-5 w-5" />,
    color: "text-chart-5 bg-chart-5/10",
  },
]

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
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
                {stat.change}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
