import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap select-none transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none";
const variants: Record<Variant, string> = {
  primary: "bg-button text-button-text hover:opacity-90 active:opacity-80",
  secondary: "border border-line-strong text-ink hover:bg-subtle active:bg-subtle",
  ghost: "text-ink-2 hover:text-ink hover:bg-subtle",
  subtle: "bg-subtle text-ink hover:bg-line",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[14px]",
  md: "h-11 px-4 text-[15px]",
  lg: "h-12 px-5 text-[16px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string): string {
  return cn(base, variants[variant], sizes[size], extra);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = "primary", size = "md", className, type, ...rest }, ref) {
  return <button ref={ref} type={type ?? "button"} className={buttonClass(variant, size, className)} {...rest} />;
});

export function ButtonLink({ href, variant = "primary", size = "md", className, children }: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { large?: boolean }>(function TextInput({ className, large, ...rest }, ref) {
  return (
    <input
      ref={ref}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className={cn(
        "w-full rounded-lg border border-line-strong bg-surface px-4 outline-none transition-colors placeholder:text-ink-3 focus:border-accent",
        large ? "h-14 text-[20px]" : "h-11 text-[16px]",
        className,
      )}
      {...rest}
    />
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea({ className, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className={cn(
        "w-full resize-y rounded-lg border border-line-strong bg-surface px-4 py-3 text-[17px] leading-relaxed outline-none transition-colors placeholder:text-ink-3 focus:border-accent",
        className,
      )}
      {...rest}
    />
  );
});

export function Section({ title, aside, children, className }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("border-t border-line pt-5", className)}>
      {(title || aside) && (
        <div className="mb-4 flex items-baseline justify-between gap-4">
          {title && <h2 className="text-[15px] font-medium text-ink-2">{title}</h2>}
          {aside && <div className="text-[14px] text-ink-3">{aside}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h1 className="text-[26px] font-semibold tracking-[-0.015em]">{children}</h1>
      {aside && <div className="text-[14px] text-ink-3">{aside}</div>}
    </div>
  );
}

export function Bar({ value, className, tone = "ink" }: { value: number; className?: string; tone?: "ink" | "accent" | "positive" | "negative" }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const color = { ink: "bg-ink", accent: "bg-accent", positive: "bg-positive", negative: "bg-negative" }[tone];
  return (
    <div className={cn("h-[3px] w-full overflow-hidden rounded-full bg-line", className)}>
      <div className={cn("h-full rounded-full transition-[width] duration-300", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="tabular text-[22px] font-medium tracking-[-0.01em]">{value}</div>
      <div className="text-[13px] text-ink-3">{label}</div>
      {sub && <div className="text-[13px] text-ink-3">{sub}</div>}
    </div>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "positive" | "negative" | "caution" }) {
  const t = {
    neutral: "text-ink-2 border-line-strong",
    accent: "text-accent border-accent/40",
    positive: "text-positive border-positive/40",
    negative: "text-negative border-negative/40",
    caution: "text-caution border-caution/40",
  }[tone];
  return <span className={cn("inline-flex h-6 items-center rounded-md border px-2 text-[12px] font-medium", t)}>{children}</span>;
}

export function Note({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "caution" }) {
  return <p className={cn("text-[14px] leading-relaxed", tone === "caution" ? "text-caution" : "text-ink-2")}>{children}</p>;
}
