"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building2,
  Loader2,
} from "lucide-react"
import { skillsData } from "@/data"

interface CompanyProfile {
  name: string
  logo: string
  position: string
  requiredSkills: string[]
  niceToHave: string[]
  description: string
}

const companies: CompanyProfile[] = [
  {
    name: "Kaspi.kz",
    logo: "K",
    position: "Junior Backend Developer",
    requiredSkills: [
      "Algorithms",
      "Databases",
      "System Design",
      "Problem Solving",
    ],
    niceToHave: ["Teamwork", "Communication", "Leadership"],
    description:
      "Fintech leader in Kazakhstan. Backend team works with high-load payment systems processing millions of transactions daily.",
  },
  {
    name: "BI Group",
    logo: "BI",
    position: "Junior Full-Stack Developer",
    requiredSkills: [
      "System Design",
      "Databases",
      "Teamwork",
      "Communication",
    ],
    niceToHave: ["Presentation", "Problem Solving", "Leadership"],
    description:
      "Largest construction and development holding in Central Asia. IT division digitizes all internal business processes.",
  },
  {
    name: "Google",
    logo: "G",
    position: "Software Engineer Intern",
    requiredSkills: [
      "Algorithms",
      "Problem Solving",
      "System Design",
      "Communication",
    ],
    niceToHave: ["Teamwork", "Leadership", "Presentation"],
    description:
      "Global tech giant. Internship involves working on large-scale distributed systems with world-class engineering mentors.",
  },
]

const studentSkills = skillsData.map((s) => s.skill)

const studentSkillScores: Record<string, number> = Object.fromEntries(
  skillsData.map((s) => [s.skill, Math.max(s.hard, s.soft)])
)

export function ResumeOptimizer() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(
    null
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  function handleOptimize(company: CompanyProfile) {
    setSelectedCompany(company)
    setIsAnalyzing(true)
    setShowResults(false)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 1500)
  }

  function handleClose() {
    setSelectedCompany(null)
    setShowResults(false)
    setIsAnalyzing(false)
  }

  const matchedRequired = selectedCompany
    ? selectedCompany.requiredSkills.filter((s) => studentSkills.includes(s))
    : []
  const missingRequired = selectedCompany
    ? selectedCompany.requiredSkills.filter((s) => !studentSkills.includes(s))
    : []
  const matchedNice = selectedCompany
    ? selectedCompany.niceToHave.filter((s) => studentSkills.includes(s))
    : []
  const matchPercent = selectedCompany
    ? Math.round(
        ((matchedRequired.length + matchedNice.length * 0.5) /
          (selectedCompany.requiredSkills.length +
            selectedCompany.niceToHave.length * 0.5)) *
          100
      )
    : 0

  return (
    <>
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Resume Optimizer
          </CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Select a company to highlight relevant skills
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5 pb-5">
          {companies.map((company) => (
            <button
              key={company.name}
              onClick={() => handleOptimize(company)}
              className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3.5 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {company.logo}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-foreground">
                  {company.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {company.position}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Analysis modal */}
      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Resume optimization for ${selectedCompany.name}`}
        >
          <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {selectedCompany.logo}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {selectedCompany.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedCompany.position}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {isAnalyzing && (
                <div className="flex flex-col items-center gap-4 py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      Analyzing your profile...
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Comparing your skills with {selectedCompany.name}{" "}
                      requirements
                    </p>
                  </div>
                </div>
              )}

              {showResults && (
                <div className="flex flex-col gap-5">
                  {/* Match score */}
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        className="-rotate-90"
                      >
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="5"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke={matchPercent >= 80 ? "#22c55e" : matchPercent >= 60 ? "#eab308" : "#ef4444"}
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 26}`}
                          strokeDashoffset={`${2 * Math.PI * 26 * (1 - matchPercent / 100)}`}
                        />
                      </svg>
                      <span className="absolute text-base font-bold text-foreground">
                        {matchPercent}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {matchPercent >= 80
                          ? "Excellent match!"
                          : matchPercent >= 60
                            ? "Good match"
                            : "Needs improvement"}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {selectedCompany.description}
                      </p>
                    </div>
                  </div>

                  {/* Required skills */}
                  <div>
                    <h3 className="mb-2.5 text-xs font-semibold text-foreground">
                      Required Skills
                    </h3>
                    <div className="flex flex-col gap-2">
                      {selectedCompany.requiredSkills.map((skill) => {
                        const matched = studentSkills.includes(skill)
                        const score = studentSkillScores[skill]
                        return (
                          <div
                            key={skill}
                            className={`flex items-center gap-3 rounded-xl border p-3 ${
                              matched
                                ? "border-emerald-200 bg-emerald-50/60"
                                : "border-amber-200 bg-amber-50/60"
                            }`}
                          >
                            {matched ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                            )}
                            <span className="flex-1 text-[13px] font-medium text-foreground">
                              {skill}
                            </span>
                            {matched && score ? (
                              <Badge
                                variant="outline"
                                className="rounded-lg border-emerald-300 bg-emerald-100 text-[10px] font-bold text-emerald-700"
                              >
                                {score}/100
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="rounded-lg border-amber-300 bg-amber-100 text-[10px] font-bold text-amber-700"
                              >
                                Missing
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Nice to have */}
                  <div>
                    <h3 className="mb-2.5 text-xs font-semibold text-foreground">
                      Nice to Have
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCompany.niceToHave.map((skill) => {
                        const matched = studentSkills.includes(skill)
                        return (
                          <Badge
                            key={skill}
                            variant="outline"
                            className={`rounded-lg text-[11px] font-medium ${
                              matched
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-border bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            {matched && (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            )}
                            {skill}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  {missingRequired.length === 0 ? (
                    <Button className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Optimized Resume
                    </Button>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                      <p className="text-xs font-medium text-amber-800">
                        Tip: Learn{" "}
                        <span className="font-bold">
                          {missingRequired.join(", ")}
                        </span>{" "}
                        to boost your match to ~100% for this position.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
