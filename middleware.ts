import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth(function middleware(req) {
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
