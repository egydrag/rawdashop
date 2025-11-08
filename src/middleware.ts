import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/dashboard")) {
    const cookieHeader = request.headers.get("cookie") || "";
    const adminCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("admin="))
      ?.split("=")[1];

    if (adminCookie !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
