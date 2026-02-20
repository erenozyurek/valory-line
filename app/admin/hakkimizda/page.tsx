'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle, Loader2 } from 'lucide-react';
import { aboutApi } from '@/lib/api/about';

export default function AdminHakkimizdaPage() {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        vision: '',
        values: '',
        experience: '',
        customers: '',
        products: '',
        cities: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await aboutApi.getAsObject();
            setFormData(data);
        } catch (err) {
            console.error('Veri yükleme hatası:', err);
            setError('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await aboutApi.updateFromForm(formData);
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
                <h1 className="font-serif text-3xl text-white mb-2">Hakkımızda Sayfası</h1>
                <p className="text-[#A1A1AA]">Hakkımızda sayfası içeriklerini düzenleyin</p>
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

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
                {/* Hero Section */}
                <div className="p-6 border border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg text-white mb-6">Hero Bölümü</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Alt Başlık</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Ana Başlık</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Açıklama</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Vision Section */}
                <div className="p-6 border border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg text-white mb-6">Vizyon Bölümü</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Vizyon Metni</label>
                            <textarea
                                name="vision"
                                value={formData.vision}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Değerler Metni</label>
                            <textarea
                                name="values"
                                value={formData.values}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="p-6 border border-white/5 bg-white/[0.02]">
                    <h2 className="text-lg text-white mb-6">İstatistikler</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Yıllık Deneyim</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Mutlu Müşteri</label>
                            <input
                                type="text"
                                name="customers"
                                value={formData.customers}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">Ürün Çeşidi</label>
                            <input
                                type="text"
                                name="products"
                                value={formData.products}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">İl Teslimat</label>
                            <input
                                type="text"
                                name="cities"
                                value={formData.cities}
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
