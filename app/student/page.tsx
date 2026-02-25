"use client"

import { useState } from "react"
import useSWR from "swr"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, FolderKanban, Loader2, Calendar } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function StudentDashboardContent() {
  const { data: session } = useSession()
  const { data: projects, mutate, isLoading } = useSWR("/api/projects", fetcher)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      })

      if (res.ok) {
        setTitle("")
        setDescription("")
        setOpen(false)
        mutate()
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Filter projects that belong to the current user
  const myProjects = Array.isArray(projects)
    ? projects.filter((p: { student_name: string }) => p.student_name === session?.user?.name)
    : []

  return (
    <>
      {/* Welcome */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Welcome back, {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your projects and track your portfolio progress
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Add a new project to your portfolio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-title">Title</Label>
                <Input
                  id="project-title"
                  placeholder="My Awesome Project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-desc">Description</Label>
                <Textarea
                  id="project-desc"
                  placeholder="Describe your project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] rounded-xl"
                />
              </div>
              <Button type="submit" disabled={submitting} className="rounded-xl">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects list */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Your Projects</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : myProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderKanban className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">No projects yet</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Create your first project to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {myProjects.map((project: { id: string; title: string; description: string; created_at: string }) => (
              <Card key={project.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function StudentPage() {
  const { status } = useSession()
  const router = useRouter()

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <DashboardShell>
      <StudentDashboardContent />
    </DashboardShell>
  )
}
