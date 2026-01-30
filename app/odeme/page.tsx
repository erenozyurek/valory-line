'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function OdemePage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [step, setStep] = useState(1);
    const [isOrderComplete, setIsOrderComplete] = useState(false);

    const [formData, setFormData] = useState({
        // Teslimat Bilgileri
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
        // Ödeme Bilgileri
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            // Simulate order completion
            setIsOrderComplete(true);
            clearCart();
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Order success screen
    if (isOrderComplete) {
        return (
            <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md mx-auto px-6"
                >
                    <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-green-500/10 rounded-full">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <h1 className="font-serif text-3xl text-white mb-4">
                        Siparişiniz Alındı!
                    </h1>
                    <p className="text-[#A1A1AA] mb-8">
                        Siparişiniz başarıyla oluşturuldu. Sipariş detayları e-posta adresinize gönderilecektir.
                    </p>
                    <p className="text-sm text-[#71717A] mb-8">
                        Sipariş Numarası: <span className="text-[#D4AF37]">#VL{Date.now().toString().slice(-8)}</span>
                    </p>
                    <Link
                        href="/magaza"
                        className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white"
                    >
                        Alışverişe Devam Et
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Empty cart
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <h1 className="font-serif text-3xl text-white mb-4">
                        Sepetiniz Boş
                    </h1>
                    <p className="text-[#A1A1AA] mb-8">
                        Ödeme yapabilmek için sepetinize ürün eklemeniz gerekmektedir.
                    </p>
                    <Link
                        href="/magaza"
                        className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white"
                    >
                        Mağazaya Git
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-16">
            <div className="container-luxury">
                {/* Back Link */}
                <Link
                    href="/magaza"
                    className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors mb-8"
                >
                    <ChevronLeft size={18} />
                    Alışverişe Dön
                </Link>

                {/* Header */}
                <h1 className="font-serif text-3xl md:text-4xl text-white mb-8">
                    Ödeme
                </h1>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-12">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#D4AF37]' : 'text-[#71717A]'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-[#D4AF37] text-[#050505]' : 'bg-white/10 text-[#71717A]'
                            }`}>
                            1
                        </div>
                        <span className="hidden sm:inline text-sm">Teslimat</span>
                    </div>
                    <div className={`flex-1 h-px ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#D4AF37]' : 'text-[#71717A]'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-[#D4AF37] text-[#050505]' : 'bg-white/10 text-[#71717A]'
                            }`}>
                            2
                        </div>
                        <span className="hidden sm:inline text-sm">Ödeme</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h2 className="font-serif text-xl text-white mb-6 flex items-center gap-3">
                                            <Truck size={20} className="text-[#D4AF37]" />
                                            Teslimat Bilgileri
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">Ad *</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Adınız"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">Soyad *</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Soyadınız"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">E-posta *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="ornek@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">Telefon *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="+90 5XX XXX XX XX"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm text-[#A1A1AA] mb-2">Adres *</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Sokak, Mahalle, Bina No, Daire No"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">İl *</label>
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                >
                                                    <option value="" className="bg-[#121212]">İl Seçiniz</option>
                                                    <option value="istanbul" className="bg-[#121212]">İstanbul</option>
                                                    <option value="ankara" className="bg-[#121212]">Ankara</option>
                                                    <option value="izmir" className="bg-[#121212]">İzmir</option>
                                                    <option value="antalya" className="bg-[#121212]">Antalya</option>
                                                    <option value="bursa" className="bg-[#121212]">Bursa</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">İlçe *</label>
                                                <input
                                                    type="text"
                                                    name="district"
                                                    value={formData.district}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="İlçe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">Posta Kodu</label>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="34000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#D4AF37] text-[#050505] py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white"
                                    >
                                        Ödemeye Devam Et
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h2 className="font-serif text-xl text-white mb-6 flex items-center gap-3">
                                            <CreditCard size={20} className="text-[#D4AF37]" />
                                            Ödeme Bilgileri
                                        </h2>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">Kart Numarası *</label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    required
                                                    maxLength={19}
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="1234 5678 9012 3456"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">Kart Üzerindeki İsim *</label>
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    value={formData.cardName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                    placeholder="AD SOYAD"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm text-[#A1A1AA] mb-2">Son Kullanma *</label>
                                                    <input
                                                        type="text"
                                                        name="expiryDate"
                                                        value={formData.expiryDate}
                                                        onChange={handleInputChange}
                                                        required
                                                        maxLength={5}
                                                        className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                        placeholder="AA/YY"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-[#A1A1AA] mb-2">CVV *</label>
                                                    <input
                                                        type="text"
                                                        name="cvv"
                                                        value={formData.cvv}
                                                        onChange={handleInputChange}
                                                        required
                                                        maxLength={4}
                                                        className="w-full px-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                                        placeholder="123"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Badge */}
                                    <div className="flex items-center gap-3 p-4 border border-white/5 bg-white/[0.02]">
                                        <ShieldCheck size={24} className="text-green-500 shrink-0" />
                                        <p className="text-sm text-[#A1A1AA]">
                                            Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır.
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 border border-white/10 text-white py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:border-white/30"
                                        >
                                            Geri
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-[#D4AF37] text-[#050505] py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white"
                                        >
                                            Siparişi Tamamla
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 p-6 border border-white/5 bg-white/[0.02]">
                            <h2 className="font-serif text-xl text-white mb-6">
                                Sipariş Özeti
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-[#121212] shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{item.name}</p>
                                            <p className="text-xs text-[#71717A]">Adet: {item.quantity}</p>
                                            <p className="text-sm text-[#D4AF37]">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#A1A1AA]">Ara Toplam</span>
                                    <span className="text-white">{formatPrice(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#A1A1AA]">Kargo</span>
                                    <span className="text-green-500">Ücretsiz</span>
                                </div>
                                <div className="flex justify-between text-lg font-medium pt-3 border-t border-white/5">
                                    <span className="text-white">Toplam</span>
                                    <span className="text-[#D4AF37]">{formatPrice(getTotalPrice())}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
