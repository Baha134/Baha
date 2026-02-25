"use client"

import { useState, useEffect } from "react"
import { PortalSidebar } from "@/components/portal-sidebar"
import { EmployerSidebar } from "@/components/employer-sidebar"
import { PortalHeader } from "@/components/portal-header"
import { GpaWidget } from "@/components/gpa-widget"
import { SkillsRadar } from "@/components/skills-radar"
import { VerifiedAchievements } from "@/components/verified-achievements"
import { RecommendationsFeed } from "@/components/recommendations-feed"
import { QuickStats } from "@/components/quick-stats"
import { ResumeOptimizer } from "@/components/resume-optimizer"
import { CareerForecast } from "@/components/career-forecast"
import { TalentFeed } from "@/components/talent-feed"
import { EmployerStats } from "@/components/employer-stats"
import { ActivityTimeline } from "@/components/activity-timeline"
import { BalanceRadar } from "@/components/balance-radar"
import { ResumeGenerator } from "@/components/resume-generator"
import { cn } from "@/lib/utils"
import { currentStudent } from "@/data"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mode, setMode] = useState<"student" | "employer">("student")
  const [activePage, setActivePage] = useState("dashboard")

  // Apply dark class to <html> when employer mode is active
  useEffect(() => {
    const html = document.documentElement
    if (mode === "employer") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
    return () => {
      html.classList.remove("dark")
    }
  }, [mode])

  // Reset to talent feed when switching to employer, dashboard for student
  const handleModeToggle = () => {
    if (mode === "student") {
      setMode("employer")
      setActivePage("talent-feed")
    } else {
      setMode("student")
      setActivePage("dashboard")
    }
  }

  // Breadcrumb label
  const pageName =
    activePage === "dashboard"
      ? "Digital Portfolio"
      : activePage === "resume"
        ? "Resume Generator"
        : activePage === "talent-feed"
          ? "Talent Feed"
          : activePage.charAt(0).toUpperCase() + activePage.slice(1)

  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={cn(
          "shrink-0 transition-all duration-300",
          sidebarOpen ? "w-[272px]" : "w-0"
        )}
      >
        <div
          className={cn(
            "h-full transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {mode === "student" ? (
            <PortalSidebar
              activePage={activePage}
              onNavigate={setActivePage}
            />
          ) : (
            <EmployerSidebar />
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mode={mode}
          onToggleMode={handleModeToggle}
          breadcrumb={pageName}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {mode === "student" ? (
              activePage === "resume" ? (
                <ResumeGenerator />
              ) : (
                <StudentDashboard />
              )
            ) : (
              <EmployerDashboard />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function StudentDashboard() {
  return (
    <>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Welcome back, {currentStudent.firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your digital portfolio overview and career progress
        </p>
      </div>

      {/* Quick stats row */}
      <div className="mb-8">
        <QuickStats />
      </div>

      {/* Hero: Balance Radar (center stage) */}
      <div className="mb-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <GpaWidget
            gpa={currentStudent.gpa}
            maxGpa={currentStudent.maxGpa}
            semester={currentStudent.semester}
            change={currentStudent.gpaChange}
          />
        </div>
        <div className="lg:col-span-3">
          <BalanceRadar />
        </div>
        <div className="lg:col-span-1">
          <SkillsRadar />
        </div>
      </div>

      {/* Achievements full-width */}
      <div className="mb-8">
        <VerifiedAchievements />
      </div>

      {/* AI Features row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ResumeOptimizer />
        <CareerForecast />
      </div>

      {/* Activity + Recommendations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimeline />
        <RecommendationsFeed />
      </div>
    </>
  )
}

function EmployerDashboard() {
  return (
    <>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Talent Discovery
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find top students from Kazakh universities matched to your open
          positions
        </p>
      </div>

      {/* Employer stats */}
      <div className="mb-8">
        <EmployerStats />
      </div>

      {/* Talent feed */}
      <TalentFeed />
    </>
  )
}
