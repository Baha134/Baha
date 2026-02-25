"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronUp,
  Building2,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react"

interface ForecastScenario {
  skill: string
  currentMatches: number
  newMatches: number
  unlocks: string[]
}

interface PositionForecast {
  title: string
  currentMatches: number
  scenarios: ForecastScenario[]
  topCompanies: string[]
}

const forecasts: PositionForecast[] = [
  {
    title: "Junior Backend Developer",
    currentMatches: 15,
    topCompanies: ["Kaspi.kz", "Kolesa Group", "Chocofamily", "DAR", "Jusan"],
    scenarios: [
      {
        skill: "Docker",
        currentMatches: 15,
        newMatches: 40,
        unlocks: ["DevOps-ready roles", "Cloud engineering teams"],
      },
      {
        skill: "Kubernetes",
        currentMatches: 15,
        newMatches: 52,
        unlocks: ["SRE positions", "Platform engineering"],
      },
      {
        skill: "Go",
        currentMatches: 15,
        newMatches: 35,
        unlocks: ["High-performance backend", "Fintech positions"],
      },
    ],
  },
  {
    title: "Full-Stack Developer",
    currentMatches: 8,
    topCompanies: ["BI Group", "Beeline KZ", "ForteBank"],
    scenarios: [
      {
        skill: "React",
        currentMatches: 8,
        newMatches: 24,
        unlocks: ["Frontend-heavy roles", "Product teams"],
      },
      {
        skill: "TypeScript",
        currentMatches: 8,
        newMatches: 30,
        unlocks: ["Enterprise roles", "Startup CTO track"],
      },
    ],
  },
  {
    title: "Data Engineer",
    currentMatches: 5,
    topCompanies: ["Kaspi.kz", "Freedom Finance", "Halyk Bank"],
    scenarios: [
      {
        skill: "Apache Spark",
        currentMatches: 5,
        newMatches: 18,
        unlocks: ["Big Data roles", "Analytics engineering"],
      },
      {
        skill: "Python (Pandas)",
        currentMatches: 5,
        newMatches: 22,
        unlocks: ["ML pipeline roles", "Data analytics"],
      },
    ],
  },
]

export function CareerForecast() {
  const [expandedIdx, setExpandedIdx] = useState<number>(0)

  const primary = forecasts[expandedIdx] ?? forecasts[0]

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Career Forecast
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">
          Based on your current skill stack and Kazakhstan job market
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pb-5">
        {forecasts.map((forecast, idx) => {
          const isExpanded = expandedIdx === idx
          const bestScenario = forecast.scenarios.reduce((a, b) =>
            b.newMatches - b.currentMatches > a.newMatches - a.currentMatches
              ? b
              : a
          )

          return (
            <div
              key={forecast.title}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? "border-primary/30 bg-primary/[0.03] shadow-sm"
                  : "border-border bg-secondary/20"
              }`}
            >
              {/* Position header */}
              <button
                onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isExpanded
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-foreground">
                    {forecast.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    <span className="font-bold text-primary">
                      {forecast.currentMatches}
                    </span>{" "}
                    companies in Kazakhstan
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border/60 px-4 pt-3 pb-4">
                  {/* Main insight */}
                  <div className="mb-3.5 rounded-xl bg-card p-3.5 shadow-sm">
                    <div className="flex items-start gap-2">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <p className="text-xs leading-relaxed text-foreground">
                        With your current stack you match{" "}
                        <span className="font-bold text-primary">
                          {forecast.title}
                        </span>{" "}
                        in{" "}
                        <span className="font-bold">
                          {forecast.currentMatches} companies
                        </span>{" "}
                        in Kazakhstan. Learn{" "}
                        <span className="font-bold text-primary">
                          {bestScenario.skill}
                        </span>
                        , and it becomes{" "}
                        <span className="font-bold text-emerald-600">
                          {bestScenario.newMatches}
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  {/* Scenarios */}
                  <div className="mb-3 flex flex-col gap-2">
                    {forecast.scenarios.map((scenario) => {
                      const gain =
                        scenario.newMatches - scenario.currentMatches
                      const barWidth = Math.round(
                        (scenario.newMatches / 60) * 100
                      )
                      const currentWidth = Math.round(
                        (scenario.currentMatches / 60) * 100
                      )

                      return (
                        <div
                          key={scenario.skill}
                          className="rounded-xl border border-border bg-card p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-[12px] font-semibold text-foreground">
                                + {scenario.skill}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                              <ArrowUpRight className="h-3 w-3" />+{gain}{" "}
                              companies
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="relative mb-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-muted-foreground/20 transition-all duration-500"
                              style={{ width: `${barWidth}%` }}
                            />
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${currentWidth}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>
                              Now: {scenario.currentMatches} companies
                            </span>
                            <span className="font-medium text-foreground">
                              After: {scenario.newMatches} companies
                            </span>
                          </div>

                          {/* Unlocks */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {scenario.unlocks.map((u) => (
                              <Badge
                                key={u}
                                variant="outline"
                                className="rounded-lg border-border bg-secondary/50 text-[9px] font-medium text-muted-foreground"
                              >
                                {u}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Top companies */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Top matches:
                    </span>
                    {forecast.topCompanies.map((c) => (
                      <Badge
                        key={c}
                        variant="outline"
                        className="rounded-lg border-primary/20 bg-primary/5 text-[10px] font-medium text-primary"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
