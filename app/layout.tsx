import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ClearLegacyData from "@/components/ClearLegacyData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Escape Map",
  description: "방탈출 카페를 찾아보세요",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClearLegacyData />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
