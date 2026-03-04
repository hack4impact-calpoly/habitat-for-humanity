import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/Admin(.*)"]);
const isDonorRoute = createRouteMatcher(["/Donor(.*)"]);
const isInStoreRoute = createRouteMatcher(["/Donor/InStore(.*)"]);
const isAuthRoute = createRouteMatcher(["/Auth(.*)"]);
const isRoleRoute = createRouteMatcher(["/setup-role(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const role = session.sessionClaims?.metadata?.role;
  const userId = session.userId;

  if (isAdminRoute(req) && role !== "Admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isDonorRoute(req) && !isInStoreRoute(req) && role !== "Donor") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isRoleRoute(req) && role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthRoute(req) && userId) {
    return NextResponse.redirect(new URL("/", req.url));
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
