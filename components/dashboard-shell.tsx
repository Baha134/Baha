"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

const roleBadgeVariants: Record<string, { label: string; className: string }> = {
  STUDENT: {
    label: "Student",
    className: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  },
  EMPLOYER: {
    label: "Employer",
    className: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  },
  TEACHER: {
    label: "Teacher",
    className: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  },
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const roleInfo = roleBadgeVariants[session.user.role] || roleBadgeVariants.STUDENT

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Joltap
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-sm font-medium text-foreground">
              {session.user.name}
            </span>
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${roleInfo.className}`}
            >
              {roleInfo.label}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
