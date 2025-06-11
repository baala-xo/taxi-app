
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


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

        <Header />


        <main>{children}</main>
      </body>
    </html>
  );
}