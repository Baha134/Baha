"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BadgeCheck,
  Trophy,
  MessageSquareText,
  FileText,
  Shield,
  Star,
  Clock,
} from "lucide-react"
import { activityLogData } from "@/data"

const iconMap: Record<string, React.ElementType> = {
  check: BadgeCheck,
  trophy: Trophy,
  message: MessageSquareText,
  file: FileText,
  shield: Shield,
  star: Star,
}

const iconColorMap: Record<string, string> = {
  check: "bg-primary/10 text-primary",
  trophy: "bg-chart-4/10 text-chart-4",
  message: "bg-chart-3/10 text-chart-3",
  file: "bg-chart-1/10 text-chart-1",
  shield: "bg-chart-5/10 text-chart-5",
  star: "bg-chart-4/10 text-chart-4",
}

export function ActivityTimeline() {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="relative flex flex-col gap-0">
          {/* Vertical line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border" />

          {activityLogData.map((entry, idx) => {
            const IconComp = iconMap[entry.icon] ?? BadgeCheck
            const colorClass = iconColorMap[entry.icon] ?? "bg-primary/10 text-primary"

            return (
              <div
                key={entry.id}
                className="group relative flex gap-4 py-3 transition-colors hover:bg-secondary/30 rounded-xl px-2 -mx-2"
              >
                {/* Icon node */}
                <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                  <IconComp className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[13px] font-semibold leading-snug text-foreground">
                    {entry.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    {entry.date}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
