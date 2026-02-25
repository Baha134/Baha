"use client"

import { useState } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, Calendar, GraduationCap, X } from "lucide-react"
import { skillsData } from "@/data"
import type { SkillDetail } from "@/data"

const hardColor = "#6366f1"
const softColor = "#22c55e"

export function SkillsRadar() {
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null)

  return (
    <>
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Soft / Hard Skills
          </CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Click a skill below for verification details
          </p>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer
            config={{
              hard: { label: "Hard Skills", color: hardColor },
              soft: { label: "Soft Skills", color: softColor },
            }}
            className="mx-auto aspect-square h-[220px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Radar
                  name="Hard Skills"
                  dataKey="hard"
                  stroke={hardColor}
                  fill={hardColor}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="Soft Skills"
                  dataKey="soft"
                  stroke={softColor}
                  fill={softColor}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Clickable skill list */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skillsData.map((s) => (
              <button
                key={s.skill}
                onClick={() => setSelectedSkill(s)}
                className="flex items-center gap-1 rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      s.category === "hard"
                        ? hardColor
                        : s.category === "soft"
                          ? softColor
                          : "#a78bfa",
                  }}
                />
                {s.skill}
                <span className="ml-0.5 text-[10px] text-muted-foreground">
                  ({s.verifications.length})
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill detail modal */}
      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </>
  )
}

function SkillModal({
  skill,
  onClose,
}: {
  skill: SkillDetail
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${skill.skill} skill details`}
    >
      <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-foreground">
                {skill.skill}
              </h2>
              <Badge
                variant="outline"
                className={`rounded-md text-[10px] font-semibold ${
                  skill.category === "hard"
                    ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                    : skill.category === "soft"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                      : "border-violet-300 bg-violet-50 text-violet-600"
                }`}
              >
                {skill.category === "both"
                  ? "Hard + Soft"
                  : skill.category === "hard"
                    ? "Hard Skill"
                    : "Soft Skill"}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Hard: {skill.hard}/100 | Soft: {skill.soft}/100
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Score bars */}
        <div className="flex gap-4 border-b border-border px-6 py-4">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="font-medium text-foreground">Hard Skills</span>
              <span className="font-bold" style={{ color: hardColor }}>
                {skill.hard}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${skill.hard}%`,
                  backgroundColor: hardColor,
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="font-medium text-foreground">Soft Skills</span>
              <span className="font-bold" style={{ color: softColor }}>
                {skill.soft}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${skill.soft}%`,
                  backgroundColor: softColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Verifications list */}
        <div className="px-6 py-5">
          <h3 className="mb-3.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-primary" />
            Verifications ({skill.verifications.length})
          </h3>
          <div className="flex flex-col gap-3">
            {skill.verifications.map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-foreground">
                      {v.verifier}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {v.role}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {v.date}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/80">
                      {v.context}
                    </p>
                  </div>
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
