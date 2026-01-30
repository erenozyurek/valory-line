'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download } from 'lucide-react';

const pastOrders = [
    { id: 'VL00100', customer: 'Ali Veli', email: 'ali@email.com', items: ['Kaşmir Atkı'], total: 1650, status: 'Teslim Edildi', date: '25 Ocak 2026' },
    { id: 'VL00099', customer: 'Ayşe Fatma', email: 'ayse@email.com', items: ['Zümrüt Taşlı Yüzük'], total: 3850, status: 'Teslim Edildi', date: '24 Ocak 2026' },
    { id: 'VL00098', customer: 'Hasan Hüseyin', email: 'hasan@email.com', items: ['O & O Pasaport Kılıfı Seti'], total: 3200, status: 'Teslim Edildi', date: '23 Ocak 2026' },
    { id: 'VL00097', customer: 'Fatma Sultan', email: 'fatma@email.com', items: ['Güneş Gözlüğü', 'İpek Fular'], total: 3500, status: 'Teslim Edildi', date: '22 Ocak 2026' },
    { id: 'VL00096', customer: 'Osman Gazi', email: 'osman@email.com', items: ['Elmas Kesim Kolye'], total: 4250, status: 'Teslim Edildi', date: '21 Ocak 2026' },
    { id: 'VL00095', customer: 'Selim Han', email: 'selim@email.com', items: ['Deri Eldiven'], total: 1450, status: 'İptal Edildi', date: '20 Ocak 2026' },
];

export default function GecmisSiparislerPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = pastOrders.filter(order =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-3xl text-white mb-2">Geçmiş Siparişler</h1>
                    <p className="text-[#A1A1AA]">Tamamlanmış ve iptal edilmiş siparişler</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/30 transition-colors">
                    <Download size={16} />
                    Rapor İndir
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <input
                    type="text"
                    placeholder="Sipariş no veya müşteri ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md pl-12 pr-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
            </div>

            {/* Orders Table */}
            <div className="border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Sipariş No</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Müşteri</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Ürünler</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Tutar</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Durum</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <motion.tr
                                    key={order.id}
                                    className="border-b border-white/5 hover:bg-white/[0.02]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <td className="p-4 text-sm text-[#D4AF37]">#{order.id}</td>
                                    <td className="p-4">
                                        <p className="text-sm text-white">{order.customer}</p>
                                        <p className="text-xs text-[#71717A]">{order.email}</p>
                                    </td>
                                    <td className="p-4 text-sm text-[#A1A1AA]">{order.items.join(', ')}</td>
                                    <td className="p-4 text-sm text-white">₺{order.total.toLocaleString('tr-TR')}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${order.status === 'Teslim Edildi'
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-[#A1A1AA]">{order.date}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="p-8 text-center text-[#71717A]">
                        Sipariş bulunamadı
                    </div>
                )}
            </div>
        </div>
    );
}
