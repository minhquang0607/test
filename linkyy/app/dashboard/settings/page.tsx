import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { getMyPage, requireCreator } from "@/lib/auth";
import { ProfileForm, UsernameForm, VisibilityToggle } from "./forms";

export const metadata: Metadata = { title: "Cài đặt" };

export default async function SettingsPage() {
  const [{ profile }, page] = await Promise.all([requireCreator(), getMyPage()]);
  if (!page) throw new Error("Page row missing for the signed-in user");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Cài đặt ⚙️</h1>

      <Card>
        <h2 className="mb-5 font-display text-xl font-bold">Hồ sơ</h2>
        <ProfileForm initial={{ display_name: profile.display_name, bio: profile.bio }} />
      </Card>

      <Card>
        <h2 className="mb-5 font-display text-xl font-bold">Username</h2>
        <UsernameForm current={profile.username} />
      </Card>

      <Card>
        <h2 className="mb-5 font-display text-xl font-bold">Hiển thị trang</h2>
        <VisibilityToggle published={Boolean(page.published_at)} />
      </Card>
    </div>
  );
}
