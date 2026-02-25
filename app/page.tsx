"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { PortalSidebar } from "@/components/portal-sidebar"
import { EmployerSidebar } from "@/components/employer-sidebar"
import { TeacherSidebar } from "@/components/teacher-sidebar"
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
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { cn } from "@/lib/utils"
import { currentStudent } from "@/data"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mode, setMode] = useState<"student" | "employer" | "teacher">("student")
  const [activePage, setActivePage] = useState("dashboard")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  // Set initial mode based on user role
  useEffect(() => {
    if (user) {
      setMode(user.role)
      if (user.role === "employer") {
        setActivePage("talent-feed")
      } else if (user.role === "teacher") {
        setActivePage("teacher-dashboard")
      } else {
        setActivePage("dashboard")
      }
    }
  }, [user])

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

  const handleSetMode = (newMode: "student" | "employer" | "teacher") => {
    setMode(newMode)
    if (newMode === "student") {
      setActivePage("dashboard")
    } else if (newMode === "employer") {
      setActivePage("talent-feed")
    } else {
      setActivePage("teacher-dashboard")
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
          : activePage === "teacher-dashboard"
            ? "Оқытушы панелі"
            : activePage.charAt(0).toUpperCase() + activePage.slice(1)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

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
          ) : mode === "employer" ? (
            <EmployerSidebar />
          ) : (
            <TeacherSidebar onLogout={logout} />
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mode={mode}
          onSetMode={handleSetMode}
          breadcrumb={pageName}
          userIin={user.iin}
          onLogout={logout}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {mode === "student" ? (
              activePage === "resume" ? (
                <ResumeGenerator />
              ) : (
                <StudentDashboard />
              )
            ) : mode === "employer" ? (
              <EmployerDashboard />
            ) : (
              <TeacherDashboard />
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
