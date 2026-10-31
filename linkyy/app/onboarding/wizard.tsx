"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  claimUsername,
  publishAndFinishOnboarding,
  saveOnboardingLinks,
  saveProfile,
  saveTheme,
} from "@/app/actions/creator";
import { CopyButton } from "@/components/copy-button";
import { PhoneFrame, PublicPage } from "@/components/public-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { FieldHint, Input, Label, Textarea } from "@/components/ui/input";
import { UsernameInput, useUsernameCheck } from "@/components/username-field";
import { detectPlatform, MAX_ONBOARDING_LINKS, normalizeUrl, PLATFORM_LABELS, type Block } from "@/lib/blocks";
import { siteHost, siteUrl } from "@/lib/env";
import { THEME_PRESET_IDS, THEMES, type ThemePresetId } from "@/lib/themes";
import { cn } from "@/lib/utils";

type LinkDraft = { id: string; title: string; url: string };

export type WizardInitial = {
  step: number;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  preset: ThemePresetId;
  links: LinkDraft[];
};

const STEPS = [
  { key: "username", title: "Chọn username xịn xò", subtitle: "Đây là link bạn sẽ dán lên bio TikTok, IG." },
  { key: "profile", title: "Giới thiệu chút nha", subtitle: "Tên với bio ngắn gọn, đúng chất bạn." },
  { key: "theme", title: "Chọn vibe cho trang", subtitle: "Đổi lúc nào cũng được, chọn đại một cái trước." },
  { key: "links", title: "Thêm vài link đầu tiên", subtitle: "TikTok, IG, Shopee, Spotify… dán link là tự nhận icon." },
  { key: "publish", title: "Sẵn sàng lên sóng 🚀", subtitle: "Bấm publish là trang của bạn online liền." },
] as const;

let tempId = 0;
const emptyLink = (): LinkDraft => ({ id: `tmp${++tempId}x`, title: "", url: "" });

function padLinks(links: LinkDraft[]): LinkDraft[] {
  const out = [...links];
  while (out.length < 3) out.push(emptyLink());
  return out;
}

export function OnboardingWizard({ initial }: { initial: WizardInitial }) {
  const router = useRouter();
  const [step, setStep] = useState(initial.step);
  const [direction, setDirection] = useState(1);
  const [pending, startTransition] = useTransition();

  const [username, setUsername] = useState(initial.username);
  const [claimed, setClaimed] = useState<string | null>(initial.step > 0 ? initial.username : null);
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [bio, setBio] = useState(initial.bio);
  const [preset, setPreset] = useState<ThemePresetId>(initial.preset);
  const [links, setLinks] = useState<LinkDraft[]>(padLinks(initial.links));
  const [publishedAs, setPublishedAs] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const usernameState = useUsernameCheck(username);

  const previewBlocks = useMemo<Block[]>(
    () =>
      links.flatMap((l) => {
        const url = normalizeUrl(l.url);
        if (!url) return [];
        return [{ id: l.id, type: "link" as const, title: l.title.trim() || PLATFORM_LABELS[detectPlatform(url)], url, enabled: true }];
      }),
    [links],
  );

  const previewHandle = usernameState.value || claimed || "ban";

  function go(to: number) {
    setDirection(to > step ? 1 : -1);
    setStep(to);
  }

  function run<T>(action: () => Promise<{ ok: true; data: T } | { ok: false; error: string }>, onOk: (data: T) => void) {
    startTransition(async () => {
      try {
        const result = await action();
        if (result.ok) onOk(result.data);
        else toast.error(result.error);
      } catch {
        toast.error("Mất kết nối, thử lại nha");
      }
    });
  }

  function next() {
    switch (STEPS[step].key) {
      case "username":
        if (usernameState.status !== "ok") return;
        return run(
          () => claimUsername(usernameState.value),
          (d) => {
            setClaimed(d.username);
            go(1);
          },
        );
      case "profile":
        return run(() => saveProfile({ display_name: displayName, bio }), () => go(2));
      case "theme":
        return run(() => saveTheme(preset), () => go(3));
      case "links":
        return run(
          () => saveOnboardingLinks(links.map(({ id, title, url }) => ({ id, title: title.trim() || autoTitle(url), url }))),
          (d) => {
            setLinks(padLinks(d.links.map((b) => ({ id: b.id, title: b.title, url: b.url }))));
            go(4);
          },
        );
      case "publish":
        return run(publishAndFinishOnboarding, (d) => setPublishedAs(d.username || claimed));
    }
  }

  const canContinue =
    !pending &&
    (STEPS[step].key !== "username" || usernameState.status === "ok") &&
    (STEPS[step].key !== "profile" || displayName.trim().length > 0);

  if (publishedAs) {
    return <Published username={publishedAs} onDashboard={() => router.push("/dashboard")} />;
  }

  const preview = (
    <PhoneFrame>
      <PublicPage
        compact
        profile={{ username: previewHandle, display_name: displayName, bio, avatar_url: initial.avatarUrl }}
        theme={THEMES[preset]}
        blocks={previewBlocks}
      />
    </PhoneFrame>
  );

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-5 py-8 lg:grid-cols-[1fr_320px] lg:py-12">
      <div className="flex min-w-0 flex-col">
        <Progress step={step} />

        <div className="relative mt-6 rounded-3xl border-2 border-ink bg-white p-5 shadow-pop sm:p-8">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{STEPS[step].title}</h1>
              <p className="mt-1 mb-6 text-[15px] text-ink-soft">{STEPS[step].subtitle}</p>

              {STEPS[step].key === "username" && (
                <div className="flex flex-col gap-3">
                  <UsernameInput value={username} onChange={setUsername} state={usernameState} size="lg" autoFocus />
                  <FieldHint>Mẹo: ngắn, dễ nhớ, giống tên TikTok của bạn là đẹp nhất.</FieldHint>
                </div>
              )}

              {STEPS[step].key === "profile" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <Label htmlFor="display_name">Tên hiển thị</Label>
                    <Input
                      id="display_name"
                      value={displayName}
                      maxLength={50}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Mai Edit Ảnh"
                      autoFocus
                    />
                    <FieldHint>{displayName.length}/50</FieldHint>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      maxLength={160}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Designer 2k5 · bán preset & template ✦ Sài Gòn"
                    />
                    <FieldHint>{bio.length}/160</FieldHint>
                  </div>
                </div>
              )}

              {STEPS[step].key === "theme" && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Theme">
                  {THEME_PRESET_IDS.map((id) => (
                    <ThemeSwatch key={id} id={id} selected={preset === id} onSelect={() => setPreset(id)} />
                  ))}
                </div>
              )}

              {STEPS[step].key === "links" && (
                <LinksEditor links={links} onChange={setLinks} />
              )}

              {STEPS[step].key === "publish" && (
                <div className="flex flex-col gap-3 rounded-2xl bg-paper p-5 text-[15px]">
                  <Row label="Link của bạn" value={`${siteHost()}/@${claimed}`} />
                  <Row label="Tên" value={displayName || "—"} />
                  <Row label="Theme" value={`${THEMES[preset].emoji} ${THEMES[preset].name}`} />
                  <Row label="Số link" value={String(previewBlocks.length)} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => go(step - 1)} disabled={pending}>
                ← Quay lại
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              {STEPS[step].key === "links" && (
                <Button variant="ghost" disabled={pending} onClick={() => go(4)}>
                  Để sau
                </Button>
              )}
              <Button
                variant={STEPS[step].key === "publish" ? "pop" : "primary"}
                size="lg"
                onClick={next}
                disabled={!canContinue}
              >
                {pending ? "Đang lưu…" : STEPS[step].key === "publish" ? "Publish liền 🚀" : "Tiếp →"}
              </Button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="mt-5 self-center text-sm font-semibold text-ink-soft underline underline-offset-4 lg:hidden"
        >
          {showPreview ? "Ẩn xem trước" : "👀 Xem trước trang"}
        </button>
        {showPreview ? <div className="mt-5 lg:hidden">{preview}</div> : null}
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-8">
          <p className="mb-3 text-center text-xs font-semibold tracking-widest text-ink/50 uppercase">Xem trước</p>
          {preview}
        </div>
      </aside>
    </div>
  );
}

function autoTitle(url: string): string {
  const normalized = normalizeUrl(url);
  return normalized ? PLATFORM_LABELS[detectPlatform(normalized)] : "";
}

function Progress({ step }: { step: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-ink-soft">
        <span>
          Bước {step + 1}/{STEPS.length}
        </span>
        <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-ink bg-white">
        <motion.div
          className="h-full bg-lime"
          initial={false}
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
      </div>
    </div>
  );
}

function ThemeSwatch({ id, selected, onSelect }: { id: ThemePresetId; selected: boolean; onSelect: () => void }) {
  const t = THEMES[id];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all",
        selected ? "border-ink shadow-pop" : "border-ink/15 hover:-translate-y-0.5 hover:border-ink",
      )}
    >
      <div className="flex h-24 flex-col items-center justify-center gap-1.5 px-3" style={{ background: t.background }}>
        <span className="size-6 rounded-full" style={{ background: t.accent }} />
        {[0, 1].map((i) => (
          <span
            key={i}
            className="h-2.5 w-full max-w-[90px]"
            style={{ background: t.button.background, border: t.button.border, borderRadius: t.radius, boxShadow: t.button.shadow }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-1 bg-white px-3 py-2">
        <span className="truncate text-[13px] font-bold">
          {t.emoji} {t.name}
        </span>
        {selected ? <span className="text-sm">✅</span> : null}
      </div>
    </button>
  );
}

function LinksEditor({ links, onChange }: { links: LinkDraft[]; onChange: (links: LinkDraft[]) => void }) {
  const update = (id: string, patch: Partial<LinkDraft>) => onChange(links.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  return (
    <div className="flex flex-col gap-4">
      {links.map((link, i) => {
        const normalized = link.url.trim() ? normalizeUrl(link.url) : null;
        const platform = normalized ? detectPlatform(normalized) : null;
        const urlError = link.url.trim() !== "" && !normalized;
        return (
          <div key={link.id} className="rounded-2xl border-2 border-ink/10 bg-paper/60 p-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold tracking-wide text-ink-soft uppercase">
                Link {i + 1}
                {platform ? ` · ${PLATFORM_LABELS[platform]}` : ""}
              </span>
              {links.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onChange(links.filter((l) => l.id !== link.id))}
                  className="text-xs font-semibold text-ink-soft hover:text-danger"
                  aria-label={`Xóa link ${i + 1}`}
                >
                  Xóa
                </button>
              ) : null}
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr]">
              <Input
                aria-label={`Tên link ${i + 1}`}
                placeholder={platform ? PLATFORM_LABELS[platform] : "Tên link"}
                value={link.title}
                maxLength={80}
                onChange={(e) => update(link.id, { title: e.target.value })}
              />
              <Input
                aria-label={`URL link ${i + 1}`}
                placeholder="tiktok.com/@ban"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={link.url}
                aria-invalid={urlError || undefined}
                onChange={(e) => update(link.id, { url: e.target.value })}
              />
            </div>
            {urlError ? <FieldHint tone="error">Link chưa đúng, thử dạng tiktok.com/@ban nha</FieldHint> : null}
          </div>
        );
      })}
      {links.length < MAX_ONBOARDING_LINKS ? (
        <Button variant="outline" size="sm" className="self-start" onClick={() => onChange([...links, emptyLink()])}>
          + Thêm link
        </Button>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-ink-soft">{label}</span>
      <span className="truncate font-semibold">{value}</span>
    </div>
  );
}

const CONFETTI = ["🎉", "✨", "💖", "🔥", "🧋", "⭐", "💸", "🎀"];

function Published({ username, onDashboard }: { username: string; onDashboard: () => void }) {
  const url = `${siteUrl()}/@${username}`;
  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
      {CONFETTI.flatMap((emoji, i) =>
        [0, 1].map((j) => (
          <motion.span
            key={`${i}-${j}`}
            aria-hidden
            className="pointer-events-none absolute top-1/3 left-1/2 text-2xl"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{
              x: Math.cos(((i * 2 + j) / 16) * Math.PI * 2) * (140 + j * 60),
              y: Math.sin(((i * 2 + j) / 16) * Math.PI * 2) * (110 + j * 50) + 80,
              opacity: 0,
              scale: 1.2,
              rotate: 180,
            }}
            transition={{ duration: 1.4, ease: "easeOut", delay: j * 0.1 }}
          >
            {emoji}
          </motion.span>
        )),
      )}
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
        <span className="text-6xl">🥳</span>
      </motion.div>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">Trang của bạn đã online!</h1>
      <p className="mt-2 text-ink-soft">Copy link dán lên bio TikTok, IG là xong. Slay quá trời 💅</p>
      <div className="mt-6 flex w-full items-center gap-2 rounded-2xl border-2 border-ink bg-white p-2 pl-4 shadow-pop">
        <span className="min-w-0 flex-1 truncate text-left font-semibold">
          {siteHost()}/@{username}
        </span>
        <CopyButton value={url} />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/@${username}`} target="_blank" className={buttonVariants({ variant: "outline" })}>
          Xem trang ↗
        </Link>
        <Button onClick={onDashboard}>Vào dashboard →</Button>
      </div>
    </div>
  );
}
