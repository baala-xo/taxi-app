// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. IMPORT THE HEADER COMPONENT
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taxi Booking App",
  description: "Built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. PLACE THE HEADER COMPONENT AT THE TOP OF THE BODY */}
        <Header />

        {/* It's good practice to wrap page content in a <main> tag */}
        <main>{children}</main>
      </body>
    </html>
  );
}