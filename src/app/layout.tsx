import type { Metadata } from "next";

import "./globals.css";
import Header from "@/components/layout/Header";



export const metadata: Metadata = {
  title: "BBS with Next.js",
  description: "bbs with next.js14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header></Header>
        <div  className="container mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
