import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-3xl border-2 border-ink bg-white p-5 shadow-pop sm:p-6", className)} {...props} />;
}

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-ink/15 bg-paper px-2 py-0.5 text-[11px] font-semibold tracking-wide text-ink-soft uppercase",
        className,
      )}
      {...props}
    />
  );
}
