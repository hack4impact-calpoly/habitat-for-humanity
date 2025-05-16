import { currentUser } from "@clerk/nextjs/server";

export async function verifyAdmin() {
  const user = await currentUser();
  return user?.publicMetadata.role === "Admin";
}

export async function verifyDonor() {
  const user = await currentUser();
  return user?.publicMetadata.role === "Donor";
}
