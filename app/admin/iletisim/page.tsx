'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function AdminIletisimPage() {
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({
        email: 'info@valoryline.com',
        phone: '+90 (212) 123 45 67',
        address: 'Nişantaşı, Abdi İpekçi Caddesi No: 42',
        city: 'Şişli, İstanbul 34367',
        weekdayHours: 'Pazartesi - Cumartesi: 10:00 - 20:00',
        weekendHours: 'Pazar: 12:00 - 18:00',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would save to a database
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl text-white mb-2">İletişim Bilgileri</h1>
                <p className="text-[#A1A1AA]">İletişim sayfasındaki bilgileri düzenleyin</p>
            </div>

            {/* Success Message */}
            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 mb-6 bg-green-500/10 border border-green-500/30 text-green-400"
                >
                    <CheckCircle size={18} />
                    Değişiklikler kaydedildi
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
                {/* Contact Info */}
                <div className="p-6 border border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg text-white mb-6">İletişim Bilgileri</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm text-[#A1A1AA] mb-2">
                                <Mail size={16} />
                                E-posta Adresi
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm text-[#A1A1AA] mb-2">
                                <Phone size={16} />
                                Telefon Numarası
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="p-6 border border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg text-white mb-6 flex items-center gap-2">
                        <MapPin size={18} />
                        Adres Bilgileri
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Adres</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Şehir / Posta Kodu</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                    </div>
                </div>

                {/* Working Hours */}
                <div className="p-6 border border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg text-white mb-6 flex items-center gap-2">
                        <Clock size={18} />
                        Çalışma Saatleri
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Hafta İçi</label>
                            <input
                                type="text"
                                name="weekdayHours"
                                value={formData.weekdayHours}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Hafta Sonu</label>
                            <input
                                type="text"
                                name="weekendHours"
                                value={formData.weekendHours}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-6 py-3 font-medium hover:bg-white transition-colors"
                >
                    <Save size={18} />
                    Kaydet
                </button>
            </form>
        </div>
    );
}
