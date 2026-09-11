import type { NextAuthConfig } from "next-auth"

export default {
  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },

    jwt({ token, user }) {
      if (user) {
        if (user.id) token.id = user.id

        if (user.role === "ADMIN" || user.role === "CUSTOMER") {
          token.role = user.role
        }
      }

      return token
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? ""
        session.user.role =
          token.role === "ADMIN" || token.role === "CUSTOMER"
            ? token.role
            : "CUSTOMER"
      }

      return session
    },
  },

  providers: [],
} satisfies NextAuthConfig
