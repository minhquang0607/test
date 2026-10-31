import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const fieldClass =
  "w-full rounded-2xl border-2 border-ink/15 bg-white px-4 text-[15px] text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:outline-none aria-invalid:border-danger disabled:opacity-60";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClass, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "min-h-24 resize-none py-3 leading-relaxed", className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-semibold text-ink", className)} {...props} />;
}

export function FieldHint({ className, tone = "muted", ...props }: ComponentProps<"p"> & { tone?: "muted" | "error" | "success" }) {
  return (
    <p
      className={cn(
        "mt-1.5 text-[13px] leading-snug",
        tone === "muted" && "text-ink-soft",
        tone === "error" && "text-danger",
        tone === "success" && "text-success",
        className,
      )}
      {...props}
    />
  );
}
