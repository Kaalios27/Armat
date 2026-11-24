import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import { AppProvider } from "@/components/app-provider";
import "./globals.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Armat",
  description: "Personal study system for European Spanish. Runs in your browser; your progress stays on your device.",
  robots: { index: false, follow: false },
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: { capable: true, title: "Armat", statusBarStyle: "default" },
  icons: { apple: `${base}/apple-touch-icon.png` },
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

// Applies the saved theme and language before the first paint (the database opens after).
const preferences = `try{var t=localStorage.getItem("armat:theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;var l=localStorage.getItem("armat:lang");if(l==="en"||l==="fr")document.documentElement.lang=l}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <Script id="armat-preferences" strategy="beforeInteractive">
          {preferences}
        </Script>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
