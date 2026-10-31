"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-24 text-center">
      <span className="text-6xl">🫨</span>
      <h1 className="font-display text-2xl font-bold">Toang nhẹ rồi…</h1>
      <p className="max-w-sm text-ink-soft">Có lỗi bất ngờ xảy ra. Tụi mình đã ghi nhận, bạn thử lại giúp nha.</p>
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}
