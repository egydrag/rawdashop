import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isAdmin = req.auth?.user?.role === "ADMIN"

  if (req.nextUrl.pathname.startsWith("/dashboard") && !isAdmin) {
    const url = new URL("/login", req.url)
    url.searchParams.set("next", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
}