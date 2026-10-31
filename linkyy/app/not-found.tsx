import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-grain flex flex-1 flex-col items-center justify-center gap-4 px-5 py-24 text-center">
      <p className="font-display text-8xl font-extrabold tracking-tighter">404</p>
      <h1 className="font-display text-2xl font-bold">Lạc trôi rồi bạn ơi 🫠</h1>
      <p className="max-w-sm text-ink-soft">Trang bạn tìm không tồn tại hoặc đã bay màu.</p>
      <Link href="/" className={buttonVariants({ variant: "primary" })}>
        Về nhà thôi
      </Link>
    </div>
  );
}
