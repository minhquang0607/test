import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { Badge, Card } from "@/components/ui/card";
import { getMyPage, requireCreator } from "@/lib/auth";
import { siteHost, siteUrl } from "@/lib/env";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tổng quan" };

export default async function DashboardHome() {
  const [{ profile }, page] = await Promise.all([requireCreator(), getMyPage()]);
  if (!page) throw new Error("Page row missing for the signed-in user");

  const published = Boolean(page.published_at);
  const checklist = [
    { label: "Claim username", done: true },
    { label: "Publish trang bio", done: published },
    { label: "Kết nối payOS để nhận tiền", done: false, soon: true },
    { label: "Thêm sản phẩm đầu tiên", done: false, soon: true },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const firstName = (profile.display_name || profile.username).split(/\s+/).pop();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Hello {firstName} 👋</h1>
        <p className="mt-1 text-ink-soft">Hôm nay mình flex gì đây?</p>
      </div>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-ink-soft">Link của bạn</p>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase",
                published ? "bg-success/15 text-success" : "bg-ink/10 text-ink-soft",
              )}
            >
              <span className={cn("size-1.5 rounded-full", published ? "bg-success" : "bg-ink/40")} />
              {published ? "Online" : "Đang ẩn"}
            </span>
          </div>
          <p className="mt-1 truncate font-display text-2xl font-bold">
            {siteHost()}/@{profile.username}
          </p>
        </div>
        <CopyButton value={`${siteUrl()}/@${profile.username}`} label="Copy link" />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Checklist khởi động 🚀</h2>
            <span className="text-sm font-bold">
              {doneCount}/{checklist.length}
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-lime" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
          </div>
          <ul className="mt-5 flex flex-col gap-3">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-[15px]">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-lg border-2 text-xs font-bold",
                    item.done ? "border-ink bg-lime" : "border-ink/20",
                  )}
                >
                  {item.done ? "✓" : ""}
                </span>
                <span className={cn(item.done && "text-ink-soft line-through")}>{item.label}</span>
                {item.soon ? <Badge className="ml-auto">Sắp có</Badge> : null}
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-2xl bg-paper p-3 text-sm text-ink-soft">
            💡 Dán link vào bio TikTok: <b className="text-ink">Hồ sơ → Sửa hồ sơ → Trang web</b>.
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          {[
            { label: "Lượt xem", emoji: "👀" },
            { label: "Click link", emoji: "👆" },
            { label: "Doanh thu", emoji: "💸" },
          ].map((stat) => (
            <Card key={stat.label} className="p-4 sm:p-5">
              <p className="text-sm font-semibold text-ink-soft">
                {stat.emoji} {stat.label}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-ink/25">—</p>
              <p className="text-xs text-ink-soft">Sắp có số liệu</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
