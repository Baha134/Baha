"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [iin, setIin] = useState("")
  const [pin, setPin] = useState("")
  const [role, setRole] = useState<"student" | "employer" | "teacher">("student")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPin, setShowPin] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const result = isRegister
      ? await register(iin, pin, role)
      : await login(iin, pin)

    if (!result.success) {
      setError(result.error || "Қате пайда болды")
    }
    setIsSubmitting(false)
  }

  const handleIinChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12)
    setIin(digits)
  }

  const handlePinChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6)
    setPin(digits)
  }

  const roles = [
    { value: "student" as const, label: "Студент", description: "Оқу порталы" },
    { value: "employer" as const, label: "Жұмыс беруші", description: "HR панелі" },
    { value: "teacher" as const, label: "Оқытушы", description: "Оқытушы панелі" },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Студент портал
          </h1>
          <p className="text-sm text-muted-foreground">
            Білім беру басқару жүйесі
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">
              {isRegister ? "Тіркелу" : "Кіру"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "ИИН және PIN-код арқылы тіркеліңіз"
                : "ИИН және PIN-код арқылы кіріңіз"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="iin">ИИН (жеке сәйкестендіру нөмірі)</Label>
                <Input
                  id="iin"
                  type="text"
                  inputMode="numeric"
                  placeholder="123456789012"
                  value={iin}
                  onChange={(e) => handleIinChange(e.target.value)}
                  maxLength={12}
                  required
                  autoComplete="username"
                />
                <p className="text-xs text-muted-foreground">
                  12 санды ИИН нөмірі
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="pin">PIN-код</Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    placeholder="****"
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value)}
                    maxLength={6}
                    required
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPin ? "PIN-кодты жасыру" : "PIN-кодты көрсету"}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  4-6 санды PIN-код
                </p>
              </div>

              {isRegister && (
                <div className="flex flex-col gap-2">
                  <Label>Рөлді таңдаңыз</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center transition-colors ${
                          role === r.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <span className="text-sm font-medium">{r.label}</span>
                        <span className="text-[10px] leading-tight">{r.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isRegister ? "Тіркелу" : "Кіру"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {isRegister ? "Аккаунтыңыз бар ма?" : "Аккаунтыңыз жоқ па?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister)
                    setError("")
                  }}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {isRegister ? "Кіру" : "Тіркелу"}
                </button>
              </div>

              {!isRegister && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Демо аккаунттар (PIN: 1234)
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span>Студент: 030201000001</span>
                    <span>Жұмыс беруші: 850101000002</span>
                    <span>Оқытушы: 800515000003</span>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
