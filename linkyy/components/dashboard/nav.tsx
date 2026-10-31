"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", emoji: "🏠" },
  { href: "/dashboard/editor", label: "Trang của tui", emoji: "🎨", soon: true },
  { href: "/dashboard/products", label: "Sản phẩm", emoji: "🛍️", soon: true },
  { href: "/dashboard/orders", label: "Đơn hàng", emoji: "🧾", soon: true },
  { href: "/dashboard/analytics", label: "Analytics", emoji: "📈", soon: true },
  { href: "/dashboard/settings", label: "Cài đặt", emoji: "⚙️" },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {NAV_ITEMS.map((item) =>
        "soon" in item ? (
          <span
            key={item.href}
            aria-disabled
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-ink/35"
          >
            <span className="grayscale">{item.emoji}</span>
            {item.label}
            <span className="ml-auto rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">Sắp có</span>
          </span>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-[15px] font-semibold transition-colors",
              pathname === item.href ? "border-ink bg-lime shadow-[2px_2px_0_var(--color-ink)]" : "border-transparent hover:bg-ink/5",
            )}
          >
            <span>{item.emoji}</span>
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => !("soon" in i));
  return (
    <nav
      aria-label="Dashboard"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t-2 border-ink bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold",
            pathname === item.href ? "text-ink" : "text-ink/45",
          )}
        >
          <span className="text-lg">{item.emoji}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
