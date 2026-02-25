import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      role: "STUDENT" | "EMPLOYER" | "TEACHER"
      iin: string
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    name: string
    role: "STUDENT" | "EMPLOYER" | "TEACHER"
    iin: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "STUDENT" | "EMPLOYER" | "TEACHER"
    iin: string
  }
}
