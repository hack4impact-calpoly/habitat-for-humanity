import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/Admin(.*)"]);
const isDonorRoute = createRouteMatcher(["/Donor(.*)"]);
const isAuthRoute = createRouteMatcher(["/Auth(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes starting with `/Admin`
  if (
    isAdminRoute(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "Admin"
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
  if (
    isDonorRoute(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "Donor"
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
  if (isAuthRoute(req) && (await auth()).userId) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
