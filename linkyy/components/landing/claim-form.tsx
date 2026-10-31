"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UsernameInput, useUsernameCheck } from "@/components/username-field";

export function ClaimForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const state = useUsernameCheck(value);

  return (
    <form
      className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-start"
      onSubmit={(e) => {
        e.preventDefault();
        if (state.status !== "ok") return;
        router.push(`/login?claim=${encodeURIComponent(state.value)}`);
      }}
    >
      <div className="flex-1">
        <UsernameInput value={value} onChange={setValue} state={state} size="lg" />
      </div>
      <Button type="submit" variant="pop" size="lg" disabled={state.status !== "ok"} className="shrink-0">
        Claim liền ✨
      </Button>
    </form>
  );
}
