import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CreatorNotFound() {
  return (
    <div className="bg-grain flex min-h-dvh flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
      <span className="text-6xl">👻</span>
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Trang này chưa có chủ</h1>
      <p className="max-w-sm text-ink-soft">Có thể username đã đổi, trang đang ẩn, hoặc… nó đang chờ bạn claim đó.</p>
      <Link href="/" className={buttonVariants({ variant: "pop", size: "lg" })}>
        Claim username của bạn ✨
      </Link>
    </div>
  );
}
