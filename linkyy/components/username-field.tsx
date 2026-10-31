"use client";

import { useEffect, useId, useState } from "react";
import { siteHost } from "@/lib/env";
import { isValidUsernameFormat, normalizeUsername, USERNAME_MAX, USERNAME_MESSAGES, type UsernameStatus } from "@/lib/username";
import { FieldHint } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type CheckState = { value: string; status: UsernameStatus | "idle" | "checking" | "error" };

/** Debounced live availability check against /api/username/check. */
export function useUsernameCheck(raw: string, delay = 350): CheckState {
  const value = normalizeUsername(raw);
  const [result, setResult] = useState<{ value: string; status: CheckState["status"] }>({ value: "", status: "idle" });

  const formatOk = value !== "" && isValidUsernameFormat(value);

  useEffect(() => {
    if (!formatOk) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?u=${encodeURIComponent(value)}`, { signal: controller.signal });
        const json = (await res.json()) as { status?: UsernameStatus };
        setResult({ value, status: res.ok && json.status ? json.status : "error" });
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResult({ value, status: "error" });
      }
    }, delay);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, formatOk, delay]);

  if (value === "") return { value, status: "idle" };
  if (!formatOk) return { value, status: "invalid" };
  if (result.value !== value) return { value, status: "checking" };
  return { value, status: result.status };
}

export function usernameHint(state: CheckState): { text: string; tone: "muted" | "error" | "success" } | null {
  switch (state.status) {
    case "idle":
      return null;
    case "checking":
      return { text: "Đang check…", tone: "muted" };
    case "error":
      return { text: "Không check được, thử lại xíu nha", tone: "error" };
    case "ok":
      return { text: USERNAME_MESSAGES.ok, tone: "success" };
    default:
      return { text: USERNAME_MESSAGES[state.status], tone: "error" };
  }
}

export function UsernameInput({
  value,
  onChange,
  state,
  size = "md",
  autoFocus,
  name = "username",
  hideHint = false,
}: {
  value: string;
  onChange: (value: string) => void;
  state: CheckState;
  size?: "md" | "lg";
  autoFocus?: boolean;
  name?: string;
  hideHint?: boolean;
}) {
  const id = useId();
  const hint = usernameHint(state);
  const invalid = hint?.tone === "error";

  return (
    <div className="w-full">
      <label htmlFor={id} className="sr-only">
        Username
      </label>
      <div
        className={cn(
          "flex w-full items-center rounded-2xl border-2 bg-white transition-colors focus-within:border-ink",
          invalid ? "border-danger" : "border-ink/15",
          size === "lg" ? "h-14 text-lg" : "h-12 text-[15px]",
        )}
      >
        <span className="shrink-0 pl-4 font-medium text-ink/45 select-none">{siteHost()}/@</span>
        <input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={USERNAME_MAX + 1}
          placeholder="ten.cua.ban"
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent pr-3 font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink/30"
        />
        <span aria-hidden className="pr-4 text-lg">
          {state.status === "ok" ? "✅" : state.status === "checking" ? "⏳" : invalid ? "❌" : ""}
        </span>
      </div>
      {!hideHint && hint ? (
        <FieldHint id={`${id}-hint`} tone={hint.tone} aria-live="polite">
          {hint.text}
        </FieldHint>
      ) : null}
    </div>
  );
}
