import { redirect } from "next/navigation";
import { ClientOnly } from "./client";
import { auth } from "@clerk/nextjs/server";
export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default async function Page() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return redirect("/Auth/Login");

  const role = sessionClaims?.metadata.role || "Auth/Login";
  redirect(`/${role}`);
}
