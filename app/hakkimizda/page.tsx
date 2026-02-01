import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BreadcrumbSchema, FAQSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
    title: 'Hakkımızda - Valory Line Hikayesi ve Vizyonumuz',
    description: 'Valory Line hikayesini, vizyonunu ve lüks hediyelik eşya tutkusunu keşfedin. 2018 yılından beri özel anları unutulmaz kılan premium hediyeler sunuyoruz.',
    alternates: {
        canonical: '/hakkimizda',
    },
    openGraph: {
        title: 'Hakkımızda | Valory Line',
        description: 'Valory Line hikayesi, vizyonu ve lüks hediyelik eşya tutkusu. 2018 yılından beri özel anları unutulmaz kılıyoruz.',
        url: '/hakkimizda',
    },
};

export default function HakkimizdaPage() {
    const breadcrumbItems = [
        { name: 'Hakkımızda', url: '/hakkimizda' }
    ];

    const faqItems = [
        {
            question: "Valory Line ne zaman kuruldu?",
            answer: "Valory Line 2018 yılında kuruldu ve o günden beri özel anları unutulmaz kılmak için lüks hediyelik eşya ve aksesuar sunmaktadır."
        },
        {
            question: "Hangi ürünleri sunuyorsunuz?",
            answer: "Kadın ve erkek için özel tasarım takılar, premium deri cüzdanlar, şık çantalar, saatler ve aksesuarlar sunuyoruz. Tüm ürünlerimiz kaliteli malzemelerden üretilir."
        },
        {
            question: "Hediye paketleme hizmeti sunuyor musunuz?",
            answer: "Evet, her ürün hediye etmeye hazır özel kutusuyla gönderilir. İlk izlenim bizim için önemlidir ve premium paketleme hizmetimiz ücretsizdir."
        }
    ];

    return (
        <>
            <BreadcrumbSchema items={breadcrumbItems} />
            <FAQSchema items={faqItems} />
            
            <div className="min-h-screen bg-[#050505] pt-24">
                <div className="container-luxury">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Section */}
                <section className="relative py-20 lg:py-32">
                    <div className="container-luxury">
                        <article className="max-w-3xl mx-auto text-center">
                            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-6 block">
                                Hikayemiz
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-8">
                                Her An Özel, Her Hediye Benzersiz
                            </h1>
                            <p className="text-lg text-[#A1A1AA] leading-relaxed">
                                2018 yılında kurulan Valory Line, özel anları unutulmaz kılmak için
                                yola çıktı. Kadın ve erkek için tasarladığımız her ürün, sevgi ve
                                özenle hazırlanmış bir hediyedir. Altın kaplama takılardan premium deri 
                                cüzdanlara, şık çantalardan benzersiz aksesuarlara kadar geniş ürün 
                                yelpazemizle her zevke hitap ediyoruz.
                            </p>
                        </article>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-[#0a0a0a]">
                    <div className="container-luxury">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Value 1 */}
                            <article className="text-center">
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]/30 rounded-full">
                                    <span className="text-2xl" aria-hidden="true">💎</span>
                                </div>
                                <h3 className="font-serif text-xl text-white mb-4">Kaliteli Malzemeler</h3>
                                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                    Takılarımızda altın kaplama ve gümüş, aksesuarlarımızda
                                    premium deri ve kaşmir kullanıyoruz. Her ürün uzun ömürlü ve dayanaklıdır.
                                </p>
                            </article>

                            {/* Value 2 */}
                            <article className="text-center">
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]/30 rounded-full">
                                    <span className="text-2xl" aria-hidden="true">🎁</span>
                                </div>
                                <h3 className="font-serif text-xl text-white mb-4">Özel Paketleme</h3>
                                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                    Her ürün, hediye etmeye hazır özel kutusuyla gönderilir.
                                    İlk izlenim bizim için önemlidir. Ücretsiz premium paketleme.
                                </p>
                            </article>

                            {/* Value 3 */}
                            <article className="text-center">
                                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]/30 rounded-full">
                                    <span className="text-2xl" aria-hidden="true">❤️</span>
                                </div>
                                <h3 className="font-serif text-xl text-white mb-4">Sevgiyle Tasarım</h3>
                                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                    Tasarımlarımız, her anı özel kılmak için ilham alır.
                                    Doğum günleri, yıldönümleri ve her özel an için mükemmel.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

            {/* Story Section */}
            <section className="py-20 lg:py-32">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-[#121212] border border-white/5">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[#71717A] text-sm uppercase tracking-widest">
                                    Koleksiyon Görüntüsü
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] mb-4 block">
                                Vizyonumuz
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6 tracking-wide">
                                Hediye Vermenin Sanatı
                            </h2>
                            <div className="space-y-4 text-[#A1A1AA] leading-relaxed">
                                <p>
                                    Valory Line olarak inanıyoruz ki hediye vermek bir sanattır.
                                    Doğru hediye, karşınızdaki kişiye ne kadar değer verdiğinizi
                                    gösterir.
                                </p>
                                <p>
                                    Koleksiyonumuz, kadın ve erkek için özenle seçilmiş takılar,
                                    cüzdanlar, çantalar, saatler ve aksesuarlardan oluşur. Her
                                    ürün, hem kalitesi hem de estetiğiyle dikkat çeker.
                                </p>
                                <p>
                                    Doğum günleri, yıldönümleri, Sevgililer Günü veya sadece
                                    sevdiğinize sürpriz yapmak istediğiniz bir gün - Valory Line
                                    her özel an için yanınızda.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#0a0a0a] border-t border-b border-white/5">
                <div className="container-luxury">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="font-serif text-4xl md:text-5xl text-[#D4AF37] mb-2">7+</p>
                            <p className="text-sm text-[#A1A1AA] uppercase tracking-widest">Yıllık Deneyim</p>
                        </div>
                        <div>
                            <p className="font-serif text-4xl md:text-5xl text-[#D4AF37] mb-2">10K+</p>
                            <p className="text-sm text-[#A1A1AA] uppercase tracking-widest">Mutlu Müşteri</p>
                        </div>
                        <div>
                            <p className="font-serif text-4xl md:text-5xl text-[#D4AF37] mb-2">500+</p>
                            <p className="text-sm text-[#A1A1AA] uppercase tracking-widest">Ürün Çeşidi</p>
                        </div>
                        <div>
                            <p className="font-serif text-4xl md:text-5xl text-[#D4AF37] mb-2">81</p>
                            <p className="text-sm text-[#A1A1AA] uppercase tracking-widest">İl Teslimat</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32">
                <div className="container-luxury text-center">
                    <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
                        Özel Hediyenizi Bulun
                    </h2>
                    <p className="text-[#A1A1AA] max-w-lg mx-auto mb-10">
                        Kadın ve erkek için özel tasarım hediyelik eşya koleksiyonumuzu
                        keşfedin.
                    </p>
                    <a
                        href="/magaza"
                        className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white"
                    >
                        Mağazaya Git
                    </a>
                </div>
            </section>
            </div>
        </>
    );
}
