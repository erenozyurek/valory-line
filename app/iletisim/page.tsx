'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { contactApi } from '@/lib/api/contact';

export default function IletisimPage() {
    const [loading, setLoading] = useState(true);
    const [contactData, setContactData] = useState<Record<string, string>>({});

    const breadcrumbItems = [
        { name: 'İletişim', url: '/iletisim' }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await contactApi.getAsObject();
            setContactData(data);
        } catch (err) {
            console.error('Veri yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#050505] pt-24">
                <div className="container-luxury">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Header */}
                <header className="py-12 lg:py-20 border-b border-white/5">
                    <div className="container-luxury">
                        <article className="max-w-2xl">
                            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 block">
                                Bize Ulaşın
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
                                İletişim
                            </h1>
                            <p className="text-[#A1A1AA] text-lg leading-relaxed">
                                Sorularınız, önerileriniz veya özel siparişleriniz için
                                bizimle iletişime geçebilirsiniz. Müşteri memnuniyeti bizim için öncelik.
                            </p>
                        </article>
                    </div>
                </header>

                {/* Contact Content */}
                <section className="py-16 lg:py-24">
                    <div className="container-luxury">
                        <div className="flex justify-center w-full">
                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
                                <address className="contents not-italic">
                                    {/* Email */}
                                    <div className="flex flex-col items-center text-center p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                        <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full mb-6">
                                            <Mail size={20} className="text-[#D4AF37]" />
                                        </div>
                                        <h3 className="text-white font-serif text-lg mb-4 uppercase tracking-widest">E-posta</h3>
                                        <a
                                            href={`mailto:${contactData.email || ''}`}
                                            className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors text-sm"
                                        >
                                            {contactData.email || ''}
                                        </a>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col items-center text-center p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                        <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full mb-6">
                                            <Phone size={20} className="text-[#D4AF37]" />
                                        </div>
                                        <h3 className="text-white font-serif text-lg mb-4 uppercase tracking-widest">Telefon</h3>
                                        <a
                                            href={`tel:${(contactData.phone || '').replace(/\s/g, '')}`}
                                            className="text-[#A1A1AA] hover:text-[#D4AF37] transition-colors text-sm"
                                        >
                                            {contactData.phone || ''}
                                        </a>
                                    </div>

                                    {/* Address */}
                                    <div className="flex flex-col items-center text-center p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                        <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full mb-6">
                                            <MapPin size={20} className="text-[#D4AF37]" />
                                        </div>
                                        <h3 className="text-white font-serif text-lg mb-4 uppercase tracking-widest">Adres</h3>
                                        <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                            {contactData.address || ''}<br />
                                            {contactData.city || ''}
                                        </p>
                                    </div>

                                    {/* Working Hours */}
                                    <div className="flex flex-col items-center text-center p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                        <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/30 rounded-full mb-6">
                                            <Clock size={20} className="text-[#D4AF37]" />
                                        </div>
                                        <h3 className="text-white font-serif text-lg mb-4 uppercase tracking-widest">Çalışma Saatleri</h3>
                                        <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                            {contactData.weekdayHours || ''}<br />
                                            {contactData.weekendHours || ''}
                                        </p>
                                    </div>
                                </address>
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
        </>
    );
}
