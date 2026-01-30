'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const navLinks = [
    { href: '/magaza', label: 'Mağaza' },
    { href: '/magaza?kategori=kadin', label: 'Kadın' },
    { href: '/magaza?kategori=erkek', label: 'Erkek' },
    { href: '/magaza?kategori=taki', label: 'Takı' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/iletisim', label: 'İletişim' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { items, openCart } = useCartStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5'
                    : 'bg-transparent'
                }`}
        >
            <nav className="container-luxury">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="relative z-10 flex items-center gap-3">
                        <Image
                            src="/images/logo.png"
                            alt="Valory Line"
                            width={50}
                            height={50}
                            className="object-contain"
                        />
                        <div className="hidden sm:block">
                            <span className="font-serif text-lg tracking-[0.15em] text-white">
                                VALORY
                            </span>
                            <span className="font-serif text-xs tracking-[0.3em] text-[#D4AF37] block -mt-1">
                                LINE
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm tracking-wide text-[#A1A1AA] transition-all duration-300 hover:text-[#D4AF37] gold-underline"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className="relative p-2 text-[#A1A1AA] transition-colors duration-300 hover:text-white"
                            aria-label="Sepet"
                        >
                            <ShoppingBag size={20} />
                            {totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-medium bg-[#D4AF37] text-[#050505] rounded-full"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-[#A1A1AA] transition-colors duration-300 hover:text-white"
                            aria-label="Menü"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[#0a0a0a] border-t border-white/5"
                    >
                        <div className="container-luxury py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-2 text-[#A1A1AA] transition-colors hover:text-[#D4AF37]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
