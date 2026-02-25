"use client"

import { useState } from "react"
import useSWR from "swr"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Briefcase, Loader2, Calendar, Building2 } from "lucide-react"
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

function EmployerDashboardContent() {
  const { data: session } = useSession()
  const { data: jobs, mutate, isLoading } = useSWR("/api/jobs", fetcher)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !company.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim(),
          description: description.trim(),
        }),
      })

      if (res.ok) {
        setTitle("")
        setCompany("")
        setDescription("")
        setOpen(false)
        mutate()
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Filter jobs belonging to the current employer
  const myJobs = Array.isArray(jobs)
    ? jobs.filter((j: { employer_name: string }) => j.employer_name === session?.user?.name)
    : []

  return (
    <>
      {/* Welcome */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Welcome back, {session?.user?.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your job postings and find top talent
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              Post Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Post a Job</DialogTitle>
              <DialogDescription>
                Create a new job listing to find candidates
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input
                  id="job-title"
                  placeholder="Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="job-company">Company</Label>
                <Input
                  id="job-company"
                  placeholder="TechCorp Kazakhstan"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="job-desc">Description</Label>
                <Textarea
                  id="job-desc"
                  placeholder="Describe the role and requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] rounded-xl"
                />
              </div>
              <Button type="submit" disabled={submitting} className="rounded-xl">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs list */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Your Job Postings</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : myJobs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">No job postings yet</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Post your first job to start finding talent
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {myJobs.map((job: { id: string; title: string; company: string; description: string; created_at: string }) => (
              <Card key={job.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {job.company}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {job.description && (
                    <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(job.created_at).toLocaleDateString("en-US", {
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

export default function EmployerPage() {
  const { status } = useSession()
  const router = useRouter()

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <DashboardShell>
      <EmployerDashboardContent />
    </DashboardShell>
  )
}
