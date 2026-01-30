import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'İletişim | Valory Line',
    description: 'Valory Line ile iletişime geçin. Sorularınız, önerileriniz veya özel siparişleriniz için bize ulaşın.',
};

export default function IletisimPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24">
            {/* Header */}
            <section className="py-12 lg:py-20 border-b border-white/5">
                <div className="container-luxury">
                    <div className="max-w-2xl">
                        <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 block">
                            Bize Ulaşın
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
                            İletişim
                        </h1>
                        <p className="text-[#A1A1AA] text-lg leading-relaxed">
                            Sorularınız, önerileriniz veya özel siparişleriniz için
                            bizimle iletişime geçebilirsiniz.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 lg:py-24">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div>
                            <h2 className="font-serif text-2xl text-white mb-8">
                                İletişim Bilgileri
                            </h2>

                            <div className="space-y-8">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full shrink-0">
                                        <Mail size={20} className="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">E-posta</h3>
                                        <a
                                            href="mailto:info@valoryline.com"
                                            className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                                        >
                                            info@valoryline.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full shrink-0">
                                        <Phone size={20} className="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Telefon</h3>
                                        <a
                                            href="tel:+902121234567"
                                            className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                                        >
                                            +90 (212) 123 45 67
                                        </a>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full shrink-0">
                                        <MapPin size={20} className="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Adres</h3>
                                        <p className="text-[#A1A1AA]">
                                            Nişantaşı, Abdi İpekçi Caddesi No: 42<br />
                                            Şişli, İstanbul 34367
                                        </p>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full shrink-0">
                                        <Clock size={20} className="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium mb-1">Çalışma Saatleri</h3>
                                        <p className="text-[#A1A1AA]">
                                            Pazartesi - Cumartesi: 10:00 - 20:00<br />
                                            Pazar: 12:00 - 18:00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <h2 className="font-serif text-2xl text-white mb-8">
                                Mesaj Gönderin
                            </h2>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm text-[#A1A1AA] mb-2">
                                            Ad
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            placeholder="Adınız"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm text-[#A1A1AA] mb-2">
                                            Soyad
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            placeholder="Soyadınız"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm text-[#A1A1AA] mb-2">
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="ornek@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm text-[#A1A1AA] mb-2">
                                        Konu
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    >
                                        <option value="" className="bg-[#121212]">Konu Seçiniz</option>
                                        <option value="order" className="bg-[#121212]">Sipariş Sorgulama</option>
                                        <option value="product" className="bg-[#121212]">Ürün Bilgisi</option>
                                        <option value="custom" className="bg-[#121212]">Özel Sipariş</option>
                                        <option value="return" className="bg-[#121212]">İade & Değişim</option>
                                        <option value="other" className="bg-[#121212]">Diğer</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm text-[#A1A1AA] mb-2">
                                        Mesaj
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                        placeholder="Mesajınızı yazın..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#D4AF37] text-[#050505] py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white"
                                >
                                    Gönder
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="border-t border-white/5">
                <div className="h-[400px] bg-[#0a0a0a] flex items-center justify-center">
                    <div className="text-center">
                        <MapPin size={48} className="text-[#71717A] mx-auto mb-4" />
                        <p className="text-[#71717A] text-sm uppercase tracking-widest">
                            Harita Görünümü
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
