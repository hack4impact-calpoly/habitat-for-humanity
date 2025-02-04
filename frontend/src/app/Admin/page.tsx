"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ActiveDonations");
  }, []);

  return <p>Redirecting...</p>;
}
