import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { getMyPage, getMyProfile, isOnboarded, requireUser } from "@/lib/auth";
import { parseBlocks } from "@/lib/blocks";
import { resolveTheme } from "@/lib/themes";
import { isValidUsernameFormat, normalizeUsername, suggestUsername } from "@/lib/username";
import { OnboardingWizard } from "./wizard";

export const metadata: Metadata = { title: "Tạo trang" };

export default function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  return (
    <div className="bg-grain flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 pt-6">
        <Logo href="/" />
        <form action="/auth/signout" method="post">
          <button className="text-sm font-semibold text-ink-soft hover:text-ink">Đăng xuất</button>
        </form>
      </header>
      <Suspense fallback={<WizardSkeleton />}>
        <Wizard searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Wizard({ searchParams }: Pick<PageProps<"/onboarding">, "searchParams">) {
  await requireUser("/onboarding");
  const [profile, page] = await Promise.all([getMyProfile(), getMyPage()]);
  if (!profile || !page) {
    throw new Error("Profile or page row missing for the signed-in user (did the signup trigger run?)");
  }
  if (isOnboarded(profile)) redirect("/dashboard");

  const params = await searchParams;
  const claimParam = normalizeUsername(String((Array.isArray(params.claim) ? params.claim[0] : params.claim) ?? ""));
  const claim = isValidUsernameFormat(claimParam) ? claimParam : "";
  const links = parseBlocks(page.draft_blocks).flatMap((b) => (b.type === "link" ? [{ id: b.id, title: b.title, url: b.url }] : []));

  return (
    <OnboardingWizard
      initial={{
        step: profile.username ? 1 : 0,
        username: profile.username ?? (claim || suggestUsername(profile.display_name)),
        displayName: profile.display_name,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        preset: resolveTheme(page.theme).id,
        links,
      }}
    />
  );
}

function WizardSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-5xl animate-pulse grid-cols-1 gap-10 px-5 py-8 lg:grid-cols-[1fr_320px] lg:py-12" aria-busy>
      <div>
        <div className="h-3 rounded-full bg-ink/10" />
        <div className="mt-6 h-80 rounded-3xl bg-ink/5" />
      </div>
      <div className="hidden h-[620px] rounded-[44px] bg-ink/5 lg:block" />
    </div>
  );
}
