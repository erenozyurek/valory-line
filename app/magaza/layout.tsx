import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mağaza - Lüks Hediyelik Eşya ve Aksesuar Koleksiyonu | Valory Line',
  description: 'Kadın ve erkek için özel tasarım lüks hediyeler. Altın kaplama takı, premium deri cüzdan, şık çanta ve benzersiz aksesuar koleksiyonumuzu keşfedin.',
  alternates: {
    canonical: '/magaza',
  },
  openGraph: {
    title: 'Mağaza | Valory Line',
    description: 'Kadın ve erkek için özel tasarım lüks hediyeler. Takı, cüzdan, çanta ve aksesuar koleksiyonu.',
    url: '/magaza',
  },
};

export default function MagazaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
