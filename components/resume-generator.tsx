"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BadgeCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Eye,
  FileText,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Palette,
  Phone,
  Printer,
  Share2,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  currentStudent,
  skillsData,
  achievementsData,
  recommendationsData,
} from "@/data"

const templates = [
  { id: "modern", label: "Modern", accent: "#4f46e5" },
  { id: "minimal", label: "Minimal", accent: "#0f172a" },
  { id: "creative", label: "Creative", accent: "#7c3aed" },
] as const

type TemplateId = (typeof templates)[number]["id"]

export function ResumeGenerator() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("modern")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAiOptimizing, setIsAiOptimizing] = useState(false)
  const [aiOptimized, setAiOptimized] = useState(false)

  const topSkills = skillsData
    .map((s) => ({ name: s.skill, score: Math.max(s.hard, s.soft) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  const verifiedBadges = achievementsData.filter((a) => a.verified)

  const handleAiOptimize = () => {
    setIsAiOptimizing(true)
    setTimeout(() => {
      setIsAiOptimizing(false)
      setAiOptimized(true)
    }, 2000)
  }

  const template = templates.find((t) => t.id === activeTemplate)!

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Resume Generator
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Build a professional resume from your verified Joltap profile
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 rounded-xl text-xs font-semibold"
            onClick={handleAiOptimize}
            disabled={isAiOptimizing}
          >
            {isAiOptimizing ? (
              <>
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Wand2 className="h-3.5 w-3.5" />
                {aiOptimized ? "Re-optimize with AI" : "AI Optimize"}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 rounded-xl text-xs font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          <Button
            size="sm"
            className="h-9 gap-2 rounded-xl text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left panel: Settings */}
        <div className="flex flex-col gap-4">
          {/* Template selector */}
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <p className="mb-3 text-xs font-semibold text-foreground">
                Template
              </p>
              <div className="flex flex-col gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                      activeTemplate === t.id
                        ? "border-primary/40 bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/20 hover:bg-secondary"
                    )}
                  >
                    <div
                      className="h-8 w-8 shrink-0 rounded-lg"
                      style={{ backgroundColor: t.accent }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {t.id === "modern"
                          ? "Clean, professional look"
                          : t.id === "minimal"
                            ? "Simple and elegant"
                            : "Bold and expressive"}
                      </p>
                    </div>
                    {activeTemplate === t.id && (
                      <BadgeCheck className="ml-auto h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sections toggle */}
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <p className="mb-3 text-xs font-semibold text-foreground">
                Sections
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: GraduationCap, label: "Education", on: true },
                  { icon: Star, label: "Skills & Radar", on: true },
                  { icon: BadgeCheck, label: "Achievements", on: true },
                  { icon: Briefcase, label: "Experience", on: true },
                  { icon: FileText, label: "Recommendations", on: true },
                  { icon: Layers, label: "Projects", on: false },
                ].map((s) => (
                  <label
                    key={s.label}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-secondary"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={s.on}
                      className="h-3.5 w-3.5 rounded accent-primary"
                    />
                    <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI status */}
          {aiOptimized && (
            <Card className="rounded-2xl border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-primary">
                      AI Optimized
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                      Keywords aligned with trending Backend/Data positions in
                      Kazakhstan. Action verbs and metrics added.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right panel: PDF Preview */}
        <div className="flex flex-col gap-3">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                Preview
              </span>
              <Badge
                variant="secondary"
                className="rounded-lg px-2 text-[10px]"
              >
                {template.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 text-xs text-muted-foreground">
                Page {currentPage} of 2
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                disabled={currentPage === 2}
                onClick={() => setCurrentPage(2)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* PDF Document */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div
              className="mx-auto aspect-[210/297] w-full max-w-[680px] bg-white p-8 sm:p-10"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {currentPage === 1 ? (
                <ResumePageOne
                  template={activeTemplate}
                  accent={template.accent}
                  topSkills={topSkills}
                  aiOptimized={aiOptimized}
                />
              ) : (
                <ResumePageTwo
                  accent={template.accent}
                  verifiedBadges={verifiedBadges}
                />
              )}
            </div>
          </div>

          {/* Share bar */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-xl text-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share Link
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-xl text-xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Manually
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-xl text-xs"
            >
              <Palette className="h-3.5 w-3.5" />
              Custom Colors
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- Page 1: Header + Education + Skills ---- */
function ResumePageOne({
  template,
  accent,
  topSkills,
  aiOptimized,
}: {
  template: TemplateId
  accent: string
  topSkills: { name: string; score: number }[]
  aiOptimized: boolean
}) {
  return (
    <div className="flex h-full flex-col text-slate-800">
      {/* Header band */}
      <div
        className="mb-5 rounded-xl px-6 py-5"
        style={{
          backgroundColor: accent,
          borderRadius: template === "minimal" ? "0" : undefined,
        }}
      >
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: "#ffffff" }}
        >
          {currentStudent.firstName} {currentStudent.lastName}
        </h1>
        <p
          className="mt-0.5 text-xs font-medium"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {currentStudent.specialty} &middot;{" "}
          {currentStudent.universityShort}, Year {currentStudent.year}
        </p>
        <div
          className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <span className="flex items-center gap-1">
            <Mail className="h-2.5 w-2.5" /> {currentStudent.email}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5" /> {currentStudent.location}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-2.5 w-2.5" /> +7 (7xx) xxx-xx-xx
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h2
          className="mb-1.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          Profile Summary
        </h2>
        <p className="text-[11px] leading-relaxed text-slate-600">
          {aiOptimized
            ? `Results-driven ${currentStudent.specialty} student (GPA ${currentStudent.gpa}/${currentStudent.maxGpa}) with verified expertise in backend development, data engineering, and ML research. Published author (IEEE) and hackathon winner (Astana Hub 1st place). Seeking opportunities to leverage strong algorithmic skills and team leadership in a fast-paced tech environment.`
            : currentStudent.bio}
        </p>
      </div>

      {/* Education */}
      <div className="mb-4">
        <h2
          className="mb-1.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          Education
        </h2>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-800">
              {currentStudent.university}
            </p>
            <p className="text-[10px] text-slate-500">
              {currentStudent.specialty} &middot;{" "}
              {currentStudent.faculty}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-slate-700">
              {currentStudent.enrollmentYear} - Present
            </p>
            <p className="text-[10px] text-slate-500">
              GPA: {currentStudent.gpa}/{currentStudent.maxGpa}
            </p>
          </div>
        </div>
        {currentStudent.deansListStatus && (
          <p className="mt-1 text-[10px] text-slate-500">
            Dean{"'"}s List &middot; {currentStudent.credits.earned}/
            {currentStudent.credits.total} credits earned
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h2
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          Verified Skills
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {topSkills.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="flex-1 text-[10px] font-medium text-slate-700">
                {s.name}
              </span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${s.score}%`,
                    backgroundColor: accent,
                  }}
                />
              </div>
              <span className="w-6 text-right text-[9px] text-slate-400">
                {s.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations preview */}
      <div>
        <h2
          className="mb-1.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          Faculty Recommendations
        </h2>
        {recommendationsData.slice(0, 2).map((r) => (
          <div key={r.id} className="mb-2 last:mb-0">
            <p className="text-[10px] font-semibold text-slate-700">
              {r.professorName}
              <span className="font-normal text-slate-400">
                {" "}
                &mdash; {r.department}
              </span>
            </p>
            <p className="mt-0.5 text-[10px] italic leading-relaxed text-slate-500">
              {`"${r.text.slice(0, 140)}..."`}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-[8px] text-slate-300">
          Generated by Joltap Career Platform
        </span>
        <span className="text-[8px] text-slate-300">
          joltap.kz/profile/{currentStudent.id}
        </span>
      </div>
    </div>
  )
}

/* ---- Page 2: Achievements + Full Recommendations ---- */
function ResumePageTwo({
  accent,
  verifiedBadges,
}: {
  accent: string
  verifiedBadges: typeof achievementsData
}) {
  return (
    <div className="flex h-full flex-col text-slate-800">
      {/* Achievements */}
      <div className="mb-5">
        <h2
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          Verified Achievements & Certifications
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {verifiedBadges.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-2 rounded-lg border border-slate-100 p-2"
            >
              <div
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded"
                style={{ backgroundColor: `${accent}15` }}
              >
                <BadgeCheck
                  className="h-3 w-3"
                  style={{ color: accent }}
                />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-700">
                  {a.title}
                </p>
                <p className="text-[9px] text-slate-400">
                  {a.date} &middot; {a.verifier.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Recommendations */}
      <div className="mb-5">
        <h2
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          Full Recommendations
        </h2>
        {recommendationsData.map((r) => (
          <div
            key={r.id}
            className="mb-3 rounded-lg border border-slate-100 p-3 last:mb-0"
          >
            <div className="mb-1 flex items-center gap-1.5">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold"
                style={{
                  backgroundColor: `${accent}20`,
                  color: accent,
                }}
              >
                {r.initials}
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-700">
                  {r.professorName}
                </span>
                <span className="text-[9px] text-slate-400">
                  {" "}
                  &middot; {r.department}
                </span>
              </div>
              <BadgeCheck
                className="ml-auto h-3 w-3"
                style={{ color: accent }}
              />
            </div>
            <p className="text-[10px] leading-relaxed text-slate-600">
              {r.text}
            </p>
            <p className="mt-1 text-[9px] text-slate-400">
              {r.course} &middot; {r.date}
            </p>
          </div>
        ))}
      </div>

      {/* Projects placeholder */}
      <div className="mb-4">
        <h2
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          Projects
        </h2>
        <div className="rounded-lg border border-slate-100 p-3">
          <p className="text-[10px] font-semibold text-slate-700">
            NLP for Kazakh Language
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Research project on natural language processing for Kazakh text
            analysis. Published at IEEE conference. Built with Python,
            TensorFlow, and custom tokenization pipeline.
          </p>
        </div>
        <div className="mt-2 rounded-lg border border-slate-100 p-3">
          <p className="text-[10px] font-semibold text-slate-700">
            EdTech Platform (Hackathon Astana Hub)
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            1st place in EdTech track. Full-stack student collaboration
            platform with real-time features. Built with Next.js,
            PostgreSQL, and WebSockets.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="text-[8px] text-slate-300">
          Generated by Joltap Career Platform
        </span>
        <span className="text-[8px] text-slate-300">
          Page 2 of 2 &middot; joltap.kz/profile/{currentStudent.id}
        </span>
      </div>
    </div>
  )
}
