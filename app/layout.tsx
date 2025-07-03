// app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Outfit, Arima } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

// 2. Configure the default font for the UI
const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

// 3. Configure the special Tamil font for the brand name
const fontTamil = Arima({
  subsets: ["tamil", "latin"],
  weight: ["700", "600"], // Use bold weights for a logo
  variable: "--font-catamaran",
});

export const metadata: Metadata = {
  title: "Ula - Your Next Ride",
  description: "A full-stack taxi booking platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 4. Apply both font variables to the html tag
    <html lang="en" className={`${fontSans.variable} ${fontTamil.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}