"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FieldHint, Input, Label } from "@/components/ui/input";
import { sendMagicLink, signInWithGoogle, type MagicLinkState } from "./actions";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.2-4.9 9.2-7.4 0-.5-.1-.9-.1-1.3H12z" />
    </svg>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<MagicLinkState, FormData>(sendMagicLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-ink bg-lime/40 p-6 text-center">
        <span className="text-4xl">📬</span>
        <h2 className="font-display text-xl font-bold">Check mail nha!</h2>
        <p className="text-[15px] text-ink-soft">
          Link đăng nhập đã bay tới <b className="text-ink">{state.email}</b>. Không thấy thì lục thử mục Spam hoặc Quảng cáo nha.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <Button type="submit" variant="outline" size="lg" className="w-full">
          <GoogleIcon /> Tiếp tục với Google
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-ink/40 uppercase">
        <span className="h-px flex-1 bg-ink/15" /> hoặc <span className="h-px flex-1 bg-ink/15" />
      </div>

      <form action={formAction} className="flex flex-col gap-3" noValidate>
        <input type="hidden" name="next" value={next} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ban@gmail.com"
            defaultValue={state.status === "error" ? state.email : ""}
            aria-invalid={state.status === "error" || undefined}
            required
          />
          {state.status === "error" ? <FieldHint tone="error">{state.message}</FieldHint> : null}
        </div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Đang gửi…" : "Gửi link đăng nhập ✨"}
        </Button>
        <FieldHint className="text-center">Không cần mật khẩu. Bấm link trong email là vào.</FieldHint>
      </form>
    </div>
  );
}
