"use client"

import { useState } from "react"
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Map,
  MessageSquareText,
  Settings,
  Sparkles,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string
  children?: { label: string }[]
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
  },
  {
    id: "roadmap",
    label: "My Roadmap",
    icon: <Map className="h-[18px] w-[18px]" />,
    children: [
      { label: "Career Path" },
      { label: "Learning Plan" },
      { label: "Milestones" },
    ],
  },
  {
    id: "portfolio",
    label: "My Portfolio",
    icon: <FolderKanban className="h-[18px] w-[18px]" />,
    children: [
      { label: "Projects" },
      { label: "Certificates" },
      { label: "Publications" },
    ],
  },
  {
    id: "recommendations",
    label: "Recommendations",
    icon: <MessageSquareText className="h-[18px] w-[18px]" />,
    badge: "3",
  },
  {
    id: "matching",
    label: "Job Matching",
    icon: <Briefcase className="h-[18px] w-[18px]" />,
    badge: "5",
    children: [
      { label: "For Me" },
      { label: "Applied" },
      { label: "Saved" },
    ],
  },
  {
    id: "resume",
    label: "Resume Generator",
    icon: <FileText className="h-[18px] w-[18px]" />,
  },
  {
    id: "ai-advisor",
    label: "AI Advisor",
    icon: <Sparkles className="h-[18px] w-[18px]" />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-[18px] w-[18px]" />,
  },
]

interface PortalSidebarProps {
  activePage?: string
  onNavigate?: (pageId: string) => void
}

export function PortalSidebar({
  activePage = "dashboard",
  onNavigate,
}: PortalSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }

  const handleClick = (item: NavItem) => {
    if (item.children) {
      toggleExpand(item.label)
    } else {
      onNavigate?.(item.id)
    }
  }

  return (
    <aside className="flex h-full w-[272px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo area */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-base font-bold tracking-tight text-sidebar-foreground">
            Joltap
          </div>
          <div className="text-[11px] font-medium text-muted-foreground">
            Career Platform
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="mx-4 mb-2 rounded-xl bg-sidebar-accent px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              Aidar Kasymov
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Computer Science, 3rd year
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleClick(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                  activePage === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-bold text-primary">
                    {item.badge}
                  </span>
                )}
                {item.children && (
                  <span className="shrink-0 text-muted-foreground">
                    {expandedItems.includes(item.label) ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </span>
                )}
              </button>
              {item.children && expandedItems.includes(item.label) && (
                <div className="ml-[30px] mt-0.5 flex flex-col gap-0.5 border-l-2 border-border pl-3">
                  {item.children.map((child) => (
                    <button
                      key={child.label}
                      className="flex w-full items-center rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <LogOut className="h-[18px] w-[18px]" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
