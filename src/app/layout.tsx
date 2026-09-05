import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CONSTRUCTIVIST BLOG",
    template: "%s | CONSTRUCTIVIST BLOG"
  },
  description:
    "A bold Constructivism-inspired personal blog built with Next.js, Prisma and local image uploads."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
