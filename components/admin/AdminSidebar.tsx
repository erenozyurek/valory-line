'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    History,
    Package,
    FileText,
    Phone,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingBag },
    { href: '/admin/gecmis-siparisler', label: 'Geçmiş Siparişler', icon: History },
    { href: '/admin/urunler', label: 'Ürünler', icon: Package },
    { href: '/admin/hakkimizda', label: 'Hakkımızda', icon: FileText },
    { href: '/admin/iletisim', label: 'İletişim', icon: Phone },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAdminStore();

    const handleLogout = () => {
        logout();
        router.push('/admin');
    };

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors text-sm mb-4">
                    <ChevronLeft size={16} />
                    Siteye Dön
                </Link>
                <div className="flex items-center gap-3">
                    <Image
                        src="/images/logo.png"
                        alt="Valory Line"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                    <div>
                        <p className="font-serif text-sm tracking-[0.15em] text-white">VALORY</p>
                        <p className="text-xs text-[#D4AF37] tracking-widest">ADMIN</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${isActive
                                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                            : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <div className="px-4 py-2 mb-2">
                    <p className="text-xs text-[#71717A]">Giriş yapan</p>
                    <p className="text-sm text-white truncate">{user?.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut size={18} />
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
