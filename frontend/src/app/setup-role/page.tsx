"use client";
import { useAuth, useSession } from "@clerk/nextjs";
import { updateMetadata } from "api/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoleSetupPage() {
  const { userId } = useAuth();
  const { session } = useSession();
  const router = useRouter();
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    const updateRole = async () => {
      if (!userId || hasUpdated) return;

      await updateMetadata(userId);

      // Force session refresh to get the new metadata
      await session?.reload();

      setHasUpdated(true); // prevent re-triggering
      router.push("/Donor");
    };

    updateRole();
  }, [userId, session, hasUpdated, router]);

  return null;
}
