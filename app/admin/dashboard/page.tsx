'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const stats = [
    { label: 'Bekleyen Siparişler', value: 12, icon: ShoppingBag, href: '/admin/siparisler', color: 'text-blue-400' },
    { label: 'Toplam Ürün', value: 48, icon: Package, href: '/admin/urunler', color: 'text-green-400' },
    { label: 'Bu Ayki Satış', value: '₺45,230', icon: TrendingUp, href: '/admin/gecmis-siparisler', color: 'text-[#D4AF37]' },
    { label: 'Toplam Müşteri', value: 156, icon: Users, href: '#', color: 'text-purple-400' },
];

const recentOrders = [
    { id: 'VL00001', customer: 'Ahmet Yılmaz', total: 2450, status: 'Hazırlanıyor', date: '30 Ocak 2026' },
    { id: 'VL00002', customer: 'Elif Demir', total: 3950, status: 'Kargoya Verildi', date: '30 Ocak 2026' },
    { id: 'VL00003', customer: 'Mehmet Kaya', total: 1850, status: 'Beklemede', date: '29 Ocak 2026' },
    { id: 'VL00004', customer: 'Zeynep Öz', total: 4500, status: 'Hazırlanıyor', date: '29 Ocak 2026' },
];

export default function AdminDashboardPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl text-white mb-2">Dashboard</h1>
                <p className="text-[#A1A1AA]">Hoş geldiniz, işte bugünkü özet.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={stat.href}
                                className="block p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <Icon size={24} className={stat.color} />
                                </div>
                                <p className="text-2xl font-serif text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-[#A1A1AA]">{stat.label}</p>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <div className="border border-white/5 bg-white/[0.02]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="font-serif text-xl text-white">Son Siparişler</h2>
                    <Link href="/admin/siparisler" className="text-sm text-[#D4AF37] hover:underline">
                        Tümünü Gör
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Sipariş No</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Müşteri</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Tutar</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Durum</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Tarih</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="p-4 text-sm text-[#D4AF37]">#{order.id}</td>
                                    <td className="p-4 text-sm text-white">{order.customer}</td>
                                    <td className="p-4 text-sm text-white">₺{order.total.toLocaleString('tr-TR')}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${order.status === 'Kargoya Verildi'
                                                ? 'bg-green-500/10 text-green-400'
                                                : order.status === 'Hazırlanıyor'
                                                    ? 'bg-blue-500/10 text-blue-400'
                                                    : 'bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-[#A1A1AA]">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
