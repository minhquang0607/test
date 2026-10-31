import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PublicPage } from "@/components/public-page";
import { getPublicPage } from "@/lib/public-page";

// Cache Components + Partial Prefetching: the skeleton below is the App
// Shell for unknown usernames; each page's content is cached per username
// (see lib/public-page.ts) and invalidated by tag when the creator changes it.

export async function generateMetadata({ params }: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username } = await params;
  const page = await getPublicPage(username);
  if (!page) return { title: "Không tìm thấy trang", robots: { index: false } };

  const { profile } = page;
  const name = profile.display_name || `@${profile.username}`;
  const description = profile.bio || `Ghé trang của ${name} trên Linkyy ✨`;
  return {
    title: { absolute: `${name} (@${profile.username}) · Linkyy` },
    description,
    alternates: { canonical: `/@${profile.username}` },
    openGraph: {
      title: name,
      description,
      url: `/@${profile.username}`,
      type: "profile",
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
    robots: page.isSensitive ? { index: false, follow: false } : undefined,
  };
}

export default function CreatorPage({ params }: PageProps<"/u/[username]">) {
  return (
    <Suspense fallback={<CreatorSkeleton />}>
      <CreatorContent params={params} />
    </Suspense>
  );
}

async function CreatorContent({ params }: Pick<PageProps<"/u/[username]">, "params">) {
  const { username } = await params;
  const page = await getPublicPage(username);
  if (!page) notFound();
  return <PublicPage profile={page.profile} theme={page.theme} blocks={page.blocks} showWatermark={page.plan === "free"} />;
}

function CreatorSkeleton() {
  return (
    <div className="min-h-dvh w-full bg-[#f6f3ee]" aria-busy>
      <div className="mx-auto flex max-w-md animate-pulse flex-col items-center px-5 py-16">
        <div className="size-24 rounded-full bg-black/10" />
        <div className="mt-4 h-6 w-40 rounded-full bg-black/10" />
        <div className="mt-2 h-4 w-24 rounded-full bg-black/5" />
        <div className="mt-8 flex w-full flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 w-full rounded-2xl bg-black/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
