import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { sql } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        iin: { label: "IIN", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.iin || !credentials?.pin) {
          throw new Error("IIN and PIN are required")
        }

        const iin = credentials.iin.trim()
        const pin = credentials.pin.trim()

        // Validate IIN format (12 digits)
        if (!/^\d{12}$/.test(iin)) {
          throw new Error("IIN must be exactly 12 digits")
        }

        // Validate PIN format (4 digits)
        if (!/^\d{4}$/.test(pin)) {
          throw new Error("PIN must be exactly 4 digits")
        }

        // Look up user in database
        const rows = await sql`
          SELECT id, iin, pin_hash, role, name
          FROM users
          WHERE iin = ${iin}
        `

        if (rows.length === 0) {
          throw new Error("Invalid IIN or PIN")
        }

        const user = rows[0]

        // Verify PIN against bcrypt hash
        const isValid = await compare(pin, user.pin_hash)
        if (!isValid) {
          throw new Error("Invalid IIN or PIN")
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          iin: user.iin,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: string }).role
        token.iin = (user as { iin: string }).iin
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { iin: string }).iin = token.iin as string;
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "joltap-secret-key-change-in-production",
}
