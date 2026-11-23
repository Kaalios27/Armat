import { TopNav } from "@/components/nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="mx-auto w-full max-w-[960px] px-4 pb-24 pt-8 sm:px-6 sm:pt-10">{children}</main>
    </>
  );
}
