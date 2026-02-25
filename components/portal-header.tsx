"use client"

import {
  Bell,
  Building2,
  FileDown,
  GraduationCap,
  Globe,
  Menu,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileQrCode } from "@/components/profile-qr-code"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PortalHeaderProps {
  onToggleSidebar: () => void
  mode: "student" | "employer"
  onToggleMode: () => void
  breadcrumb?: string
}

export function PortalHeader({
  onToggleSidebar,
  mode,
  onToggleMode,
  breadcrumb,
}: PortalHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <nav className="hidden items-center gap-1.5 text-sm md:flex">
          <span className="text-muted-foreground">
            {mode === "student" ? "Student" : "Employer"}
          </span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-semibold text-foreground">
            {breadcrumb || (mode === "student" ? "Digital Portfolio" : "Talent Feed")}
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Mode toggle */}
        <div className="hidden items-center rounded-xl bg-secondary p-0.5 sm:flex">
          <button
            onClick={() => mode !== "student" && onToggleMode()}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              mode === "student"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Student
          </button>
          <button
            onClick={() => mode !== "employer" && onToggleMode()}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              mode === "employer"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="h-3.5 w-3.5" />
            Employer
          </button>
        </div>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              mode === "student" ? "Search..." : "Search candidates..."
            }
            className="h-9 w-52 rounded-xl bg-secondary pl-9 text-sm lg:w-64"
          />
        </div>

        {/* QR Code + Export Resume (student only) */}
        {mode === "student" && (
          <>
            <ProfileQrCode />
            <Button className="hidden h-9 gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md sm:flex">
              <FileDown className="h-4 w-4" />
              Export Resume (PDF)
            </Button>
          </>
        )}

        {/* Post Vacancy button (employer only) */}
        {mode === "employer" && (
          <Button className="hidden h-9 gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md sm:flex">
            Post Vacancy
          </Button>
        )}

        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Kazakh</DropdownMenuItem>
            <DropdownMenuItem>Russian</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary p-0 text-[10px] font-bold text-primary-foreground">
            {mode === "student" ? "2" : "7"}
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
