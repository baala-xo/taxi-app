
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Outfit, Arima } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";


const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});


const fontTamil = Arima({
  subsets: ["tamil", "latin"],
  weight: ["700", "600"],
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
    
    <html lang="en" className={`${fontSans.variable} ${fontTamil.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}