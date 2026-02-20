'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, FolderOpen, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
    totalProducts: number;
    totalCategories: number;
    activeProducts: number;
    totalOrders: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalCategories: 0,
        activeProducts: 0,
        totalOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);

            const [productsRes, categoriesRes, activeProductsRes, ordersRes] = await Promise.all([
                (supabase as any).from('products').select('id', { count: 'exact', head: true }),
                (supabase as any).from('categories').select('id', { count: 'exact', head: true }),
                (supabase as any).from('products').select('id', { count: 'exact', head: true }).eq('status', 'active'),
                (supabase as any).from('orders').select('id', { count: 'exact', head: true }),
            ]);

            setStats({
                totalProducts: productsRes.count || 0,
                totalCategories: categoriesRes.count || 0,
                activeProducts: activeProductsRes.count || 0,
                totalOrders: ordersRes.count || 0,
            });
        } catch (err) {
            console.error('İstatistikler yüklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Toplam Ürün', value: stats.totalProducts, icon: Package, href: '/admin/urunler', color: 'text-green-400' },
        { label: 'Aktif Ürün', value: stats.activeProducts, icon: TrendingUp, href: '/admin/urunler', color: 'text-[#D4AF37]' },
        { label: 'Toplam Kategori', value: stats.totalCategories, icon: FolderOpen, href: '/admin/kategoriler', color: 'text-blue-400' },
        { label: 'Toplam Sipariş', value: stats.totalOrders, icon: ShoppingBag, href: '/admin/siparisler', color: 'text-purple-400' },
    ];

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
                <h1 className="font-serif text-3xl text-white mb-2">Dashboard</h1>
                <p className="text-[#A1A1AA]">Hoş geldiniz, işte bugünkü özet.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, index) => {
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

            {/* Quick Actions */}
            <div className="border border-white/5 bg-white/[0.02] p-6">
                <h2 className="font-serif text-xl text-white mb-6">Hızlı İşlemler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/urunler"
                        className="flex items-center gap-3 p-4 border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                    >
                        <Package size={20} className="text-[#D4AF37]" />
                        <span className="text-sm text-white">Yeni Ürün Ekle</span>
                    </Link>
                    <Link
                        href="/admin/kategoriler"
                        className="flex items-center gap-3 p-4 border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                    >
                        <FolderOpen size={20} className="text-[#D4AF37]" />
                        <span className="text-sm text-white">Kategori Yönet</span>
                    </Link>
                    <Link
                        href="/admin/hakkimizda"
                        className="flex items-center gap-3 p-4 border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                    >
                        <TrendingUp size={20} className="text-[#D4AF37]" />
                        <span className="text-sm text-white">Hakkımızda Düzenle</span>
                    </Link>
                    <Link
                        href="/admin/iletisim"
                        className="flex items-center gap-3 p-4 border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                    >
                        <ShoppingBag size={20} className="text-[#D4AF37]" />
                        <span className="text-sm text-white">İletişim Düzenle</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
