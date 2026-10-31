"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { claimUsername, saveProfile, setPublished } from "@/app/actions/creator";
import { Button } from "@/components/ui/button";
import { FieldHint, Input, Label, Textarea } from "@/components/ui/input";
import { UsernameInput, useUsernameCheck } from "@/components/username-field";

type Result = { ok: true } | { ok: false; error: string };

function useAction() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (action: () => Promise<Result>, success: string) =>
    start(async () => {
      try {
        const result = await action();
        if (result.ok) {
          toast.success(success);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } catch {
        toast.error("Mất kết nối, thử lại nha");
      }
    });
  return { pending, run };
}

export function ProfileForm({ initial }: { initial: { display_name: string; bio: string } }) {
  const [displayName, setDisplayName] = useState(initial.display_name);
  const [bio, setBio] = useState(initial.bio);
  const { pending, run } = useAction();
  const dirty = displayName !== initial.display_name || bio !== initial.bio;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        run(() => saveProfile({ display_name: displayName, bio }), "Lưu rồi nha ✨");
      }}
    >
      <div>
        <Label htmlFor="s-display-name">Tên hiển thị</Label>
        <Input id="s-display-name" value={displayName} maxLength={50} onChange={(e) => setDisplayName(e.target.value)} />
        <FieldHint>{displayName.length}/50</FieldHint>
      </div>
      <div>
        <Label htmlFor="s-bio">Bio</Label>
        <Textarea id="s-bio" value={bio} maxLength={160} onChange={(e) => setBio(e.target.value)} />
        <FieldHint>{bio.length}/160 · Hiện lên trang public ngay khi lưu</FieldHint>
      </div>
      <Button type="submit" className="self-start" disabled={!dirty || pending || !displayName.trim()}>
        {pending ? "Đang lưu…" : "Lưu thay đổi"}
      </Button>
    </form>
  );
}

export function UsernameForm({ current }: { current: string }) {
  const [value, setValue] = useState(current);
  const state = useUsernameCheck(value);
  const { pending, run } = useAction();
  const changed = state.value !== current;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!changed || state.status !== "ok") return;
        if (!window.confirm(`Đổi sang @${state.value}? Link cũ @${current} sẽ ngừng hoạt động và 30 ngày nữa mới đổi tiếp được.`)) return;
        run(async () => {
          const r = await claimUsername(state.value);
          return r.ok ? { ok: true } : r;
        }, "Đổi username thành công 🎉");
      }}
    >
      <UsernameInput value={value} onChange={setValue} state={changed ? state : { value: current, status: "idle" }} />
      <FieldHint>Đổi xong thì link cũ sẽ ngừng hoạt động. Mỗi lần đổi cách nhau ít nhất 30 ngày.</FieldHint>
      <Button type="submit" variant="outline" className="self-start" disabled={!changed || state.status !== "ok" || pending}>
        {pending ? "Đang đổi…" : "Đổi username"}
      </Button>
    </form>
  );
}

export function VisibilityToggle({ published }: { published: boolean }) {
  const { pending, run } = useAction();
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">{published ? "Trang đang online 🟢" : "Trang đang ẩn ⚪"}</p>
        <p className="text-sm text-ink-soft">
          {published ? "Ai có link cũng xem được." : "Người khác vào link sẽ thấy trang 404."}
        </p>
      </div>
      <Button
        variant={published ? "outline" : "pop"}
        disabled={pending}
        onClick={() => run(() => setPublished(!published), published ? "Đã ẩn trang" : "Trang online rồi 🚀")}
      >
        {pending ? "…" : published ? "Ẩn trang" : "Publish trang"}
      </Button>
    </div>
  );
}
