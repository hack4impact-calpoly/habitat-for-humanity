import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return redirect("/Auth/Login");

  const role = sessionClaims?.metadata.role || "setup-role";

  if (role === 'InStore') {
    return redirect("/Donor/InStore/Donate");
  }
  
  redirect(`/${role}`);
}
