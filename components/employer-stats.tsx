"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, Eye, Send, Users } from "lucide-react"

const stats = [
  {
    label: "Total Talent",
    value: "2,340",
    subtitle: "IT faculty",
    icon: <Users className="h-5 w-5" />,
    color: "text-primary bg-primary/10",
  },
  {
    label: "Viewed Profiles",
    value: "48",
    subtitle: "This month",
    icon: <Eye className="h-5 w-5" />,
    color: "text-chart-3 bg-chart-3/10",
  },
  {
    label: "Saved Candidates",
    value: "14",
    subtitle: "+3 this week",
    icon: <Bookmark className="h-5 w-5" />,
    color: "text-chart-4 bg-chart-4/10",
  },
  {
    label: "Invitations Sent",
    value: "9",
    subtitle: "5 accepted",
    icon: <Send className="h-5 w-5" />,
    color: "text-chart-5 bg-chart-5/10",
  },
]

export function EmployerStats() {
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
                {stat.subtitle}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
