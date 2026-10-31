import Link from "next/link";
import { ClaimForm } from "@/components/landing/claim-form";
import { DemoPhone } from "@/components/landing/demo-phone";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FEATURES = [
  { emoji: "🎨", title: "Trang bio đúng gu", body: "8 theme từ Y2K tới Dark Academia, chỉnh trong 2 phút, đẹp trên mọi điện thoại.", soon: false },
  { emoji: "🛍️", title: "Bán đồ digital", body: "Preset, template, ebook. Khách quét VietQR, file tự bay về email, tiền về thẳng tài khoản bạn.", soon: true },
  { emoji: "🔊", title: "Loa Ting Ting", body: "Có đơn là điện thoại đọc to “Ting ting! Đã nhận 49 nghìn đồng”. Nghe là nghiện.", soon: true },
  { emoji: "🎟️", title: "Fan Passport", body: "Fan sưu tập con dấu, lên level, nhận quà riêng. Fan quay lại, bạn bán thêm.", soon: true },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Đăng nhập
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}>
            Tạo trang free
          </Link>
        </nav>
      </header>

      <section className="bg-grain">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 pt-8 pb-20 lg:grid-cols-[1.15fr_1fr] lg:pt-16">
          <div className="flex flex-col items-start gap-6">
            <Badge className="border-ink bg-lime text-ink">✦ Made cho creator Gen Z Việt Nam</Badge>
            <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-7xl">
              1 link.
              <br />
              Flex hết.
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">Bán luôn.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 -z-0 h-4 -rotate-1 bg-pink/70 sm:h-6" />
              </span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-ink-soft">
              Trang bio xịn sò để gom hết link, bán preset, template và nhận tip qua <b className="text-ink">VietQR</b>. Không cần biết code,
              setup 2 phút.
            </p>
            <ClaimForm />
            <p className="text-sm text-ink-soft">Free mãi mãi · 0% phí giao dịch · Không quảng cáo trên trang của bạn</p>
          </div>
          <DemoPhone />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Không chỉ là link-in-bio 👀</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-3 rounded-3xl border-2 border-ink bg-white p-6 shadow-pop">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{f.emoji}</span>
                {f.soon ? <Badge>Sắp có</Badge> : <Badge className="border-success/30 bg-success/10 text-success">Có rồi</Badge>}
              </div>
              <h3 className="font-display text-xl font-bold">{f.title}</h3>
              <p className="text-[15px] leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t-2 border-ink bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-sm sm:flex-row sm:items-center">
          <span className="font-display text-lg font-bold">linkyy ✦</span>
          <span className="text-paper/60">© Linkyy · Làm ở Việt Nam với nhiều trà sữa 🧋</span>
        </div>
      </footer>
    </div>
  );
}
