"use client"

import { useState, useCallback } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { skillsData, currentStudent, achievementsData } from "@/data"
import {
  Brain,
  Wrench,
  GraduationCap,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react"

// --- Compute aggregate scores from real data ---

function computeHardSkillsScore(): number {
  const hardValues = skillsData.map((s) => s.hard)
  return Math.round(hardValues.reduce((a, b) => a + b, 0) / hardValues.length)
}

function computeSoftSkillsScore(): number {
  const softValues = skillsData.map((s) => s.soft)
  return Math.round(softValues.reduce((a, b) => a + b, 0) / softValues.length)
}

function computeAcademicScore(): number {
  const gpaPercent = (currentStudent.gpa / currentStudent.maxGpa) * 100
  const creditsPercent =
    (currentStudent.credits.earned / currentStudent.credits.total) * 100
  const verifiedCount = achievementsData.filter((a) => a.verified).length
  const achievementPercent = Math.min(
    (verifiedCount / achievementsData.length) * 100,
    100
  )
  return Math.round(gpaPercent * 0.5 + creditsPercent * 0.25 + achievementPercent * 0.25)
}

const hardScore = computeHardSkillsScore()
const softScore = computeSoftSkillsScore()
const academicScore = computeAcademicScore()
const overallScore = Math.round((hardScore + softScore + academicScore) / 3)

interface DimensionData {
  dimension: string
  score: number
  fullMark: 100
}

const radarData: DimensionData[] = [
  { dimension: "Hard Skills", score: hardScore, fullMark: 100 },
  { dimension: "Soft Skills", score: softScore, fullMark: 100 },
  { dimension: "Academic", score: academicScore, fullMark: 100 },
]

const dimensionDetails: Record<
  string,
  {
    icon: React.ElementType
    color: string
    bg: string
    label: string
    breakdown: { name: string; value: string }[]
  }
> = {
  "Hard Skills": {
    icon: Wrench,
    color: "#6366f1",
    bg: "bg-indigo-50",
    label: "Technical Competency",
    breakdown: skillsData
      .sort((a, b) => b.hard - a.hard)
      .slice(0, 4)
      .map((s) => ({ name: s.skill, value: `${s.hard}/100` })),
  },
  "Soft Skills": {
    icon: Brain,
    color: "#22c55e",
    bg: "bg-emerald-50",
    label: "Interpersonal Competency",
    breakdown: skillsData
      .sort((a, b) => b.soft - a.soft)
      .slice(0, 4)
      .map((s) => ({ name: s.skill, value: `${s.soft}/100` })),
  },
  Academic: {
    icon: GraduationCap,
    color: "#f59e0b",
    bg: "bg-amber-50",
    label: "Academic Standing",
    breakdown: [
      {
        name: "GPA",
        value: `${currentStudent.gpa} / ${currentStudent.maxGpa}`,
      },
      {
        name: "Credits",
        value: `${currentStudent.credits.earned} / ${currentStudent.credits.total}`,
      },
      {
        name: "Dean's List",
        value: currentStudent.deansListStatus ? "Yes" : "No",
      },
      {
        name: "Verified Badges",
        value: `${achievementsData.filter((a) => a.verified).length} / ${achievementsData.length}`,
      },
    ],
  },
}

const chartConfig = {
  score: { label: "Score", color: "#6366f1" },
}

export function BalanceRadar() {
  const [activeDimension, setActiveDimension] = useState<string | null>(null)

  const handleChartClick = useCallback((state: Record<string, unknown>) => {
    if (
      state &&
      state.activePayload &&
      Array.isArray(state.activePayload) &&
      state.activePayload.length > 0
    ) {
      const clicked = state.activePayload[0]?.payload as DimensionData | undefined
      if (clicked) {
        setActiveDimension((prev) =>
          prev === clicked.dimension ? null : clicked.dimension
        )
      }
    }
  }, [])

  const activeDetail = activeDimension
    ? dimensionDetails[activeDimension]
    : null

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Target className="h-4.5 w-4.5 text-primary" />
              Student Balance Profile
            </CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Click any axis to explore dimension details
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-bold text-primary">
              {overallScore}
            </span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        {/* 3 dimension summary pills */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {radarData.map((d) => {
            const det = dimensionDetails[d.dimension]
            const Icon = det.icon
            const isActive = activeDimension === d.dimension
            return (
              <button
                key={d.dimension}
                onClick={() =>
                  setActiveDimension((prev) =>
                    prev === d.dimension ? null : d.dimension
                  )
                }
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                  isActive
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "border-border bg-secondary/30 hover:border-primary/20 hover:bg-secondary/50"
                }`}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${det.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: det.color }} />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {d.dimension}
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: det.color }}
                >
                  {d.score}
                </span>
              </button>
            )
          })}
        </div>

        {/* Radar Chart */}
        <ChartContainer config={chartConfig} className="mx-auto h-[280px]">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="75%"
              data={radarData}
              onClick={handleChartClick}
              style={{ cursor: "pointer" }}
            >
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
                  const det = dimensionDetails[payload.value]
                  const isActive = activeDimension === payload.value
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="transition-all"
                      style={{
                        fill: isActive ? det.color : "#64748b",
                        fontSize: isActive ? 13 : 12,
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {payload.value}
                    </text>
                  )
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value}/100`, "Score"]}
                  />
                }
              />
              <defs>
                <linearGradient
                  id="balanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6366f1"
                fill="url(#balanceGradient)"
                fillOpacity={1}
                strokeWidth={2.5}
                dot={{
                  r: 5,
                  fill: "#6366f1",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: "#6366f1",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </RadarChart>
        </ChartContainer>

        {/* Active dimension detail panel */}
        {activeDetail && activeDimension && (
          <div
            className="mt-5 rounded-xl border border-border p-4 transition-all"
            style={{
              borderColor: `${activeDetail.color}30`,
              backgroundColor: `${activeDetail.color}05`,
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${activeDetail.color}15` }}
              >
                <activeDetail.icon
                  className="h-3.5 w-3.5"
                  style={{ color: activeDetail.color }}
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {activeDimension}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {activeDetail.label}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <TrendingUp
                  className="h-3.5 w-3.5"
                  style={{ color: activeDetail.color }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: activeDetail.color }}
                >
                  {radarData.find((d) => d.dimension === activeDimension)
                    ?.score ?? 0}
                  /100
                </span>
              </div>
            </div>

            {/* Score bar */}
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${radarData.find((d) => d.dimension === activeDimension)?.score ?? 0}%`,
                  backgroundColor: activeDetail.color,
                }}
              />
            </div>

            {/* Breakdown grid */}
            <div className="grid grid-cols-2 gap-2">
              {activeDetail.breakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-card px-3 py-2"
                >
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-bold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
