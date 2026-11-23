"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Keeps the browser's time zone in a cookie so the server computes local study days. */
export function TimezoneSync() {
  const router = useRouter();
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!tz) return;
      const current = document.cookie.split("; ").find((c) => c.startsWith("tz="))?.slice(3);
      if (current && decodeURIComponent(current) === tz) return;
      document.cookie = `tz=${encodeURIComponent(tz)};path=/;max-age=31536000;samesite=lax`;
      router.refresh();
    } catch {
      // Cookies unavailable: the server falls back to its default time zone.
    }
  }, [router]);
  return null;
}
