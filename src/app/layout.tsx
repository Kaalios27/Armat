import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { cookies } from "next/headers";
import { I18nProvider } from "@/components/i18n";
import { TimezoneSync } from "@/components/timezone-sync";
import type { Lang } from "@/lib/i18n/types";
import { getProfile } from "@/server/services/profile";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Armat",
  description: "Personal study system for European Spanish.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let lang: Lang = "en";
  let theme: "system" | "light" | "dark" = "system";
  try {
    const profile = await getProfile((await cookies()).get("tz")?.value);
    lang = profile.uiLang;
    theme = profile.theme;
  } catch {
    // Database unavailable (e.g. misconfiguration): render with defaults.
  }
  return (
    <html lang={lang} data-theme={theme === "system" ? undefined : theme} className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <TimezoneSync />
        <I18nProvider lang={lang}>{children}</I18nProvider>
      </body>
    </html>
  );
}
