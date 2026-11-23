export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh" style={{ paddingTop: "env(safe-area-inset-top)" }}>{children}</div>;
}
