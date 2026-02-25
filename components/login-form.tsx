"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Sparkles, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const [iin, setIin] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Client-side validation
    if (!/^\d{12}$/.test(iin)) {
      setError("IIN must be exactly 12 digits")
      return
    }
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits")
      return
    }

    setLoading(true)

    try {
      const result = await signIn("credentials", {
        iin,
        pin,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid IIN or PIN" : result.error)
        setLoading(false)
        return
      }

      // Fetch session to get role for redirect
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()

      if (session?.user?.role) {
        const roleRedirectMap: Record<string, string> = {
          STUDENT: "/student",
          EMPLOYER: "/employer",
          TEACHER: "/teacher",
        }
        router.push(roleRedirectMap[session.user.role] || "/student")
        router.refresh()
      } else {
        router.push("/student")
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              Joltap
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Student Career Platform
            </p>
          </div>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-foreground">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your IIN and PIN to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="iin" className="text-sm font-medium text-foreground">
                  IIN (Individual Identification Number)
                </Label>
                <Input
                  id="iin"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000000000"
                  maxLength={12}
                  value={iin}
                  onChange={(e) => setIin(e.target.value.replace(/\D/g, ""))}
                  className="h-11 rounded-xl"
                  disabled={loading}
                  autoComplete="username"
                />
                <p className="text-xs text-muted-foreground">12-digit identification number</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="pin" className="text-sm font-medium text-foreground">
                  PIN Code
                </Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  placeholder="****"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="h-11 rounded-xl"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <p className="text-xs text-muted-foreground">4-digit PIN code</p>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl text-sm font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Test credentials */}
            <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
              <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Test Credentials
              </p>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Student</span>
                  <span className="font-mono text-foreground">000000000000 / 0000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Employer</span>
                  <span className="font-mono text-foreground">111111111111 / 1111</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Teacher</span>
                  <span className="font-mono text-foreground">222222222222 / 2222</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
