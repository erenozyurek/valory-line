import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valory Line | Lüks Hediyelik Eşya & Aksesuar",
  description:
    "Valory Line'ın kadın ve erkek için özel tasarım takı, cüzdan, çanta ve hediyelik eşya koleksiyonunu keşfedin. Her anı özel kılan lüks hediyeler.",
  keywords: [
    "lüks hediyeler",
    "kadın hediyeleri",
    "erkek hediyeleri",
    "takı",
    "cüzdan",
    "çift hediyeleri",
    "aksesuar",
    "premium hediye",
  ],
  openGraph: {
    title: "Valory Line | Lüks Hediyelik Eşya & Aksesuar",
    description:
      "Kadın ve erkek için özel tasarım takı, cüzdan, çanta ve hediyelik eşya koleksiyonu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-[#050505] text-white`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
