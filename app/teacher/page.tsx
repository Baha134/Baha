"use client"

import useSWR from "swr"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Users, FolderKanban, Briefcase, Loader2, Calendar } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const roleBadgeMap: Record<string, { label: string; className: string }> = {
  STUDENT: { label: "Student", className: "bg-chart-3/15 text-chart-3 border-chart-3/30" },
  EMPLOYER: { label: "Employer", className: "bg-chart-4/15 text-chart-4 border-chart-4/30" },
  TEACHER: { label: "Teacher", className: "bg-chart-1/15 text-chart-1 border-chart-1/30" },
}

function TeacherDashboardContent() {
  const { data: session } = useSession()
  const { data: users, isLoading: loadingUsers } = useSWR("/api/users", fetcher)
  const { data: projects, isLoading: loadingProjects } = useSWR("/api/projects", fetcher)
  const { data: jobs, isLoading: loadingJobs } = useSWR("/api/jobs", fetcher)

  const userList = Array.isArray(users) ? users : []
  const projectList = Array.isArray(projects) ? projects : []
  const jobList = Array.isArray(jobs) ? jobs : []

  return (
    <>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of all platform users, projects, and job postings
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{userList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{projectList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{jobList.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed content */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : userList.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No users found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {userList.map((user: { id: string; name: string; iin: string; role: string; created_at: string }) => (
                <Card key={user.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{`IIN: ${user.iin}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs font-semibold ${roleBadgeMap[user.role]?.className || ""}`}>
                        {roleBadgeMap[user.role]?.label || user.role}
                      </Badge>
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects">
          {loadingProjects ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : projectList.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderKanban className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No projects yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projectList.map((project: { id: string; title: string; description: string; student_name: string; created_at: string }) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{project.title}</CardTitle>
                    <CardDescription>by {project.student_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.description && (
                      <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
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
        </TabsContent>

        <TabsContent value="jobs">
          {loadingJobs ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : jobList.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No jobs yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {jobList.map((job: { id: string; title: string; company: string; description: string; employer_name: string; created_at: string }) => (
                <Card key={job.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <CardDescription>{job.company} - posted by {job.employer_name}</CardDescription>
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
        </TabsContent>
      </Tabs>
    </>
  )
}

export default function TeacherPage() {
  const { status } = useSession()
  const router = useRouter()

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <DashboardShell>
      <TeacherDashboardContent />
    </DashboardShell>
  )
}
