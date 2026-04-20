import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HLE Prayer — Thắp Nến Nguyện Cầu",
  description: "Gửi lời nguyện đến đội tuyển Hanwha Life Esports — Beyond the Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="min-h-screen font-body antialiased">{children}</body>
    </html>
  );
}