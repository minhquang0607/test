import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { safeNext } from "@/lib/safe-next";
import { isValidUsernameFormat, normalizeUsername } from "@/lib/username";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Đăng nhập" };

const ERRORS: Record<string, string> = {
  auth: "Link đăng nhập hết hạn hoặc đã dùng rồi. Gửi lại link mới nha.",
  oauth: "Đăng nhập Google không thành công, thử lại nha.",
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="bg-grain flex flex-1 flex-col items-center justify-center px-5 py-12">
      <Logo className="mb-8" />
      <Card className="w-full max-w-md">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Vô thôi 👋</h1>
        <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-2xl bg-ink/5" />}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </Card>
      <p className="mt-6 max-w-sm text-center text-xs text-ink-soft">
        Tiếp tục nghĩa là bạn đồng ý với Điều khoản và Chính sách bảo mật của Linkyy.
      </p>
    </div>
  );
}

async function LoginContent({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const claim = normalizeUsername(one(params.claim) ?? "");
  const validClaim = isValidUsernameFormat(claim) ? claim : null;
  const next = validClaim ? `/onboarding?claim=${encodeURIComponent(validClaim)}` : safeNext(one(params.next));
  const error = ERRORS[one(params.error) ?? ""];

  return (
    <>
      <p className="mt-1.5 mb-6 text-[15px] text-ink-soft">
        {validClaim ? (
          <>
            Đăng nhập để giữ <b className="rounded-md bg-lime px-1.5 text-ink">@{validClaim}</b> trước khi ai đó nhanh tay hơn.
          </>
        ) : (
          "Đăng nhập hoặc tạo tài khoản mới, cùng một nút luôn."
        )}
      </p>
      {error ? (
        <p role="alert" className="mb-5 rounded-2xl border-2 border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <LoginForm next={next} />
    </>
  );
}
