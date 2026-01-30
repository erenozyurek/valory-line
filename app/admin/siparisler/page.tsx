'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Eye, Truck, CheckCircle } from 'lucide-react';

const orders = [
    { id: 'VL00001', customer: 'Ahmet Yılmaz', email: 'ahmet@email.com', items: ['Altın Kaplama Kolye Seti'], total: 2450, status: 'Beklemede', date: '30 Ocak 2026' },
    { id: 'VL00002', customer: 'Elif Demir', email: 'elif@email.com', items: ['Mini Deri El Çantası'], total: 3950, status: 'Hazırlanıyor', date: '30 Ocak 2026' },
    { id: 'VL00003', customer: 'Mehmet Kaya', email: 'mehmet@email.com', items: ['İnci Küpe Koleksiyonu'], total: 1850, status: 'Beklemede', date: '29 Ocak 2026' },
    { id: 'VL00004', customer: 'Zeynep Öz', email: 'zeynep@email.com', items: ['Paslanmaz Çelik Saat'], total: 4500, status: 'Kargoya Verildi', date: '29 Ocak 2026' },
    { id: 'VL00005', customer: 'Can Arslan', email: 'can@email.com', items: ['Premium Deri Cüzdan', 'İtalyan Deri Kemer'], total: 4600, status: 'Hazırlanıyor', date: '28 Ocak 2026' },
];

const statusOptions = ['Beklemede', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi'];

export default function SiparislerPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [orderList, setOrderList] = useState(orders);

    const filteredOrders = orderList.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const updateStatus = (orderId: string, newStatus: string) => {
        setOrderList(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Beklemede': return 'bg-yellow-500/10 text-yellow-400';
            case 'Hazırlanıyor': return 'bg-blue-500/10 text-blue-400';
            case 'Kargoya Verildi': return 'bg-purple-500/10 text-purple-400';
            case 'Teslim Edildi': return 'bg-green-500/10 text-green-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl text-white mb-2">Siparişler</h1>
                <p className="text-[#A1A1AA]">Aktif siparişleri yönetin</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
                    <input
                        type="text"
                        placeholder="Sipariş no veya müşteri ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                </div>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                    <option value="all" className="bg-[#121212]">Tüm Durumlar</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status} className="bg-[#121212]">{status}</option>
                    ))}
                </select>
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
                                <th className="text-right p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">İşlem</th>
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
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`px-3 py-1 text-xs rounded-full border-0 cursor-pointer ${getStatusColor(order.status)}`}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status} className="bg-[#121212] text-white">{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4 text-sm text-[#A1A1AA]">{order.date}</td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-[#A1A1AA] hover:text-white transition-colors">
                                            <Eye size={16} />
                                        </button>
                                    </td>
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
