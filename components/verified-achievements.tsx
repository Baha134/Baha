"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  BadgeCheck,
  Code2,
  Brain,
  Trophy,
  FileText,
  Star,
  Cpu,
  Palette,
  Shield,
} from "lucide-react"
import { achievementsData } from "@/data"
import type { AchievementBadge } from "@/data"

const iconMap = {
  code: Code2,
  brain: Brain,
  trophy: Trophy,
  file: FileText,
  star: Star,
  cpu: Cpu,
  palette: Palette,
  shield: Shield,
}

const categoryConfig: Record<
  AchievementBadge["category"],
  { label: string; bg: string; iconBg: string; border: string }
> = {
  skill: {
    label: "Skill",
    bg: "bg-chart-1/5",
    iconBg: "bg-chart-1/12",
    border: "border-chart-1/15 hover:border-chart-1/40",
  },
  academic: {
    label: "Academic",
    bg: "bg-chart-4/5",
    iconBg: "bg-chart-4/12",
    border: "border-chart-4/15 hover:border-chart-4/40",
  },
  competition: {
    label: "Competition",
    bg: "bg-chart-3/5",
    iconBg: "bg-chart-3/12",
    border: "border-chart-3/15 hover:border-chart-3/40",
  },
  certification: {
    label: "Certification",
    bg: "bg-chart-5/5",
    iconBg: "bg-chart-5/12",
    border: "border-chart-5/15 hover:border-chart-5/40",
  },
}

const categoryIconColor: Record<AchievementBadge["category"], string> = {
  skill: "text-chart-1",
  academic: "text-chart-4",
  competition: "text-chart-3",
  certification: "text-chart-5",
}

export function VerifiedAchievements() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const verifiedCount = achievementsData.filter((b) => b.verified).length

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
          <span className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Verified Achievements
          </span>
          <Badge
            variant="secondary"
            className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {verifiedCount} verified
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="grid grid-cols-2 gap-3">
          {achievementsData.map((badge) => {
            const IconComp = iconMap[badge.icon]
            const config = categoryConfig[badge.category]
            const iconColor = categoryIconColor[badge.category]

            return (
              <div
                key={badge.id}
                className="group relative"
                onMouseEnter={() => setHoveredId(badge.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Badge card */}
                <div
                  className={`relative flex flex-col items-center gap-2.5 rounded-xl border px-3 py-4 transition-all duration-200 ${config.bg} ${config.border} cursor-default hover:shadow-sm`}
                >
                  {/* Verified indicator */}
                  {badge.verified && (
                    <div className="absolute top-2 right-2">
                      <BadgeCheck className="h-3.5 w-3.5 text-chart-3" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.iconBg} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <IconComp className={`h-5 w-5 ${iconColor}`} />
                  </div>

                  {/* Title */}
                  <p className="text-center text-[12px] font-semibold leading-tight text-foreground text-balance">
                    {badge.title}
                  </p>

                  {/* Description */}
                  <p className="line-clamp-2 text-center text-[10px] leading-snug text-muted-foreground">
                    {badge.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">
                      {badge.date}
                    </span>
                    {badge.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-chart-3/10 px-1.5 py-0.5 text-[9px] font-medium text-chart-3">
                        <BadgeCheck className="h-2.5 w-2.5" />
                        Verified by University
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                        Pending verification
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover tooltip */}
                {hoveredId === badge.id && badge.verified && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150">
                    <div className="rounded-xl border border-border bg-card p-3.5 shadow-lg">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Confirmed by
                      </p>
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <span className="text-[11px] font-bold text-primary">
                            {badge.verifier.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-foreground">
                            {badge.verifier.name}
                          </p>
                          <p className="text-[10px] leading-snug text-muted-foreground">
                            {badge.verifier.title}
                          </p>
                          <p className="text-[10px] leading-snug text-muted-foreground">
                            {badge.verifier.department}
                          </p>
                        </div>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-border bg-card" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
