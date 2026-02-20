import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WelcomeShowcaseNotice } from "@/components/ShowcaseNotice";
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
  metadataBase: new URL('https://www.valoryline.com'),
  title: {
    default: "Valory Line | Özel Tasarım Hediyelik Eşya & Aksesuar - Şık Takı, Cüzdan, Çanta",
    template: "%s | Valory Line"
  },
  description:
    "Valory Line'da kadın ve erkek için özel tasarım takı, cüzdan, çanta ve hediyelik eşya koleksiyonunu keşfedin. Her anı özel kılan şık ürünler. Ücretsiz kargo ve özenli paketleme.",
  keywords: [
    "özel tasarım hediyeler",
    "hediyelik eşya",
    "kadın hediyeleri",
    "erkek hediyeleri",
    "altın kaplama takı",
    "gümüş takı",
    "deri cüzdan",
    "çift hediyeleri",
    "aksesuar",
    "premium hediye",
    "doğum günü hediyesi",
    "yıldönümü hediyesi",
    "özel tasarım takı",
    "lüks aksesuar istanbul"
  ],
  authors: [{ name: "Valory Line" }],
  creator: "Valory Line",
  publisher: "Valory Line",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.valoryline.com",
    siteName: "Valory Line",
    title: "Valory Line | Lüks Hediyelik Eşya & Aksesuar Mağazası",
    description:
      "Kadın ve erkek için özel tasarım takı, cüzdan, çanta ve hediyelik eşya koleksiyonu. Her anı özel kılan premium hediyeler.",
    images: [
      {
        url: "/images/valoryline.jpeg",
        width: 1200,
        height: 630,
        alt: "Valory Line - Lüks Hediyelik Eşya ve Aksesuar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valory Line | Özel Tasarım Hediyelik Eşya & Aksesuar",
    description:
      "Kadın ve erkek için özel tasarım takı, cüzdan, çanta. Her anı özel kılan şık hediyeler.",
    images: ["/images/valoryline.jpeg"],
    creator: "@valoryline",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://www.valoryline.com" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-[#050505] text-white`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <WelcomeShowcaseNotice />
      </body>
    </html>
  );
}
