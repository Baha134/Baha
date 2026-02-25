"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface GpaWidgetProps {
  gpa: number
  maxGpa: number
  semester: string
  change: number
}

export function GpaWidget({ gpa, maxGpa, semester, change }: GpaWidgetProps) {
  const percentage = (gpa / maxGpa) * 100

  // Compute indigo-like color for the ring
  const ringColor = "#6366f1"
  const trackColor = "#e2e8f0"

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
          GPA
          <span className="flex items-center gap-1 text-xs font-medium text-chart-3">
            <TrendingUp className="h-3.5 w-3.5" />
            +{change}
          </span>
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">{semester}</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 pt-0 pb-5">
        <div className="relative">
          <svg
            width="136"
            height="136"
            viewBox="0 0 136 136"
            className="-rotate-90"
          >
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke={trackColor}
              strokeWidth="10"
            />
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{gpa}</span>
            <span className="text-xs text-muted-foreground">
              / {maxGpa}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between text-[11px] text-muted-foreground">
          <span>Credits: 128 / 240</span>
          <span className="font-medium text-foreground">Dean{"'"}s List</span>
        </div>
      </CardContent>
    </Card>
  )
}
