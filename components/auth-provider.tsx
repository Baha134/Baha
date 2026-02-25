"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  userId: string
  iin: string
  role: "student" | "employer" | "teacher"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (iin: string, pin: string) => Promise<{ success: boolean; error?: string }>
  register: (iin: string, pin: string, role: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session")
        const data = await res.json()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = useCallback(async (iin: string, pin: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iin, pin }),
      })
      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error }
      }

      setUser(data.user)
      router.push("/")
      return { success: true }
    } catch {
      return { success: false, error: "Желі қатесі" }
    }
  }, [router])

  const register = useCallback(async (iin: string, pin: string, role: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iin, pin, role }),
      })
      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error }
      }

      setUser(data.user)
      router.push("/")
      return { success: true }
    } catch {
      return { success: false, error: "Желі қатесі" }
    }
  }, [router])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
