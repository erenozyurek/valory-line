import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hakkımızda | Valory Line',
    description: 'Valory Line hikayesini, vizyonunu ve lüks hediyelik eşya tutkusunu keşfedin.',
};

export default function HakkimizdaPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32">
                <div className="container-luxury">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-6 block">
                            Hikayemiz
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-8">
                            Her An Özel, Her Hediye Benzersiz
                        </h1>
                        <p className="text-lg text-[#A1A1AA] leading-relaxed">
                            2018 yılında kurulan Valory Line, özel anları unutulmaz kılmak için
                            yola çıktı. Kadın ve erkek için tasarladığımız her ürün, sevgi ve
                            özenle hazırlanmış bir hediyedir.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-[#0a0a0a]">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Value 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]/30 rounded-full">
                                <span className="text-2xl">💎</span>
                            </div>
                            <h3 className="font-serif text-xl text-white mb-4">Kaliteli Malzemeler</h3>
                            <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                Takılarımızda altın kaplama ve gümüş, aksesuarlarımızda
                                premium deri ve kaşmir kullanıyoruz.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]/30 rounded-full">
                                <span className="text-2xl">🎁</span>
                            </div>
                            <h3 className="font-serif text-xl text-white mb-4">Özel Paketleme</h3>
                            <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                Her ürün, hediye etmeye hazır özel kutusuyla gönderilir.
                                İlk izlenim bizim için önemlidir.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]/30 rounded-full">
                                <span className="text-2xl">❤️</span>
                            </div>
                            <h3 className="font-serif text-xl text-white mb-4">Sevgiyle Tasarım</h3>
                            <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                Tasarımlarımız, her anı özel kılmak için ilham alır.
                                Doğum günleri, yıldönümleri ve her özel an için.
                            </p>
                        </div>
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
    );
}
