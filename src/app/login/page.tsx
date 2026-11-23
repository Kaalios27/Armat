import { authMode } from "@/server/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return (
    <main className="mx-auto flex min-h-dvh max-w-[360px] flex-col justify-center px-4">
      <LoginForm next={safeNext} misconfigured={authMode() === "misconfigured"} />
    </main>
  );
}
