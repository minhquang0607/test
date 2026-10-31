import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-1.5 font-display text-xl font-extrabold tracking-tight", className)}>
      <span className="grid size-8 place-items-center rounded-xl border-2 border-ink bg-lime text-base shadow-[2px_2px_0_var(--color-ink)]">
        ✦
      </span>
      linkyy
    </Link>
  );
}
