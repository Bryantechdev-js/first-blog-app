import { createMiddleware } from "@arcjet/next";
// import ajGlobal from "@/lib/arcjetGlobal";
import { NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";
import ajGlobal from "./lib/arcjetGlobal";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|healthz).*)"],
};

const arcjetMW = createMiddleware(ajGlobal);

export async function middleware(request: any) {
  // 1. Run Arcjet global rate-limit 
  const arcjetResponse = await arcjetMW(request);
  let response = NextResponse.next();

  if (arcjetResponse?.headers) {
    arcjetResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }

  if (arcjetResponse && arcjetResponse.status !== 200) {
    return arcjetResponse;
  }

  // 2. Protect only private pages
  const publicRoutes = ["/login", "/register"];

  const isPublic = publicRoutes.some((r) =>
    request.nextUrl.pathname.startsWith(r)
  );

  if (!isPublic) {
    const token = request.cookies.get("token")?.value;
    const user = token ? await verifyAuth(token) : null;

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}
