/* eslint-disable @next/next/no-img-element -- avatar host is not known ahead of time */
import Link from "next/link";
import { Suspense } from "react";
import { MobileNav, SidebarNav } from "@/components/dashboard/nav";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { requireCreator } from "@/lib/auth";

// The chrome (logo, nav) is static and prerenders into the shell; anything
// that reads the session streams in behind its own <Suspense>.

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex min-h-dvh flex-1">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-8 border-r-2 border-ink bg-white px-4 py-6 lg:flex">
        <Logo href="/dashboard" className="px-2" />
        <SidebarNav />
        <div className="mt-auto">
          <Suspense fallback={<div className="h-15 animate-pulse rounded-2xl bg-paper" />}>
            <UserChip />
          </Suspense>
        </div>
        <form action="/auth/signout" method="post">
          <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-ink-soft hover:bg-ink/5 hover:text-ink">
            Đăng xuất
          </button>
        </form>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-ink bg-paper/90 px-5 py-3 backdrop-blur lg:px-10">
          <Logo href="/dashboard" className="lg:hidden" />
          <span className="hidden text-sm font-semibold text-ink-soft lg:block">Dashboard</span>
          <Suspense fallback={<span className="h-9 w-28 animate-pulse rounded-xl bg-ink/5" />}>
            <ViewPageLink />
          </Suspense>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 pb-28 lg:px-10 lg:pb-12">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}

async function UserChip() {
  const { user, profile } = await requireCreator();
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-paper p-3">
      {profile.avatar_url ? (
        <img src={profile.avatar_url} alt="" referrerPolicy="no-referrer" className="size-9 rounded-full border-2 border-ink object-cover" />
      ) : (
        <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-lilac text-sm font-bold">
          {(profile.display_name || profile.username).slice(0, 1).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{profile.display_name || `@${profile.username}`}</p>
        <p className="truncate text-xs text-ink-soft">{user.email}</p>
      </div>
    </div>
  );
}

async function ViewPageLink() {
  const { profile } = await requireCreator();
  return (
    <Link href={`/@${profile.username}`} target="_blank" className={buttonVariants({ variant: "outline", size: "sm" })}>
      Xem trang ↗
    </Link>
  );
}
