'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { contactApi } from '@/lib/api/contact';

export default function AdminIletisimPage() {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        city: '',
        weekdayHours: '',
        weekendHours: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await contactApi.getAsObject();
            setFormData({
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                weekdayHours: data.weekdayHours || '',
                weekendHours: data.weekendHours || '',
            });
        } catch (err) {
            console.error('Veri yükleme hatası:', err);
            setError('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await contactApi.updateBulk(
                Object.entries(formData).map(([key, value]) => ({ key, value }))
            );
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Kaydetme hatası:', err);
            setError('Değişiklikler kaydedilirken hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
            </div>
        );
    }

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

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
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
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-6 py-3 font-medium hover:bg-white transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </form>
        </div>
    );
}
