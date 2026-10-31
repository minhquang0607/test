import type { Metadata, Viewport } from "next";
import { Baloo_2, Be_Vietnam_Pro, Bricolage_Grotesque, Playfair_Display, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin", "vietnamese"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin", "vietnamese"] });
const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin", "vietnamese"], weight: ["400", "700"] });
const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Linkyy · 1 link, flex hết, bán luôn", template: "%s · Linkyy" },
  description: "Trang bio xịn cho creator Gen Z: link, shop đồ digital và nhận tip qua VietQR.",
};

export const viewport: Viewport = {
  themeColor: "#fffaf2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${bricolage.variable} ${playfair.variable} ${spaceMono.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
