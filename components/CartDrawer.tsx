'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        getTotalPrice,
    } = useCartStore();

    const totalPrice = getTotalPrice();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0a0a] z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="font-serif text-xl tracking-wide text-white">
                                Alışveriş Sepeti
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 text-[#A1A1AA] transition-colors duration-300 hover:text-white"
                                aria-label="Sepeti kapat"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag size={48} className="text-[#71717A] mb-4" />
                                    <p className="text-[#A1A1AA] mb-2">Sepetiniz boş</p>
                                    <p className="text-sm text-[#71717A]">
                                        Başlamak için ürün ekleyin
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-6">
                                    {items.map((item) => (
                                        <motion.li
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex gap-4"
                                        >
                                            {/* Image */}
                                            <div className="relative w-20 h-24 bg-[#121212] shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col">
                                                <h3 className="text-white text-sm font-medium">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[#A1A1AA] text-sm mt-1">
                                                    ₺{item.price.toLocaleString('tr-TR')}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mt-auto">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 text-[#A1A1AA] transition-colors hover:text-white"
                                                        aria-label="Miktarı azalt"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-white text-sm min-w-[20px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 text-[#A1A1AA] transition-colors hover:text-white"
                                                        aria-label="Miktarı artır"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 text-[#71717A] transition-colors hover:text-red-400 self-start"
                                                aria-label="Ürünü kaldır"
                                            >
                                                <X size={16} />
                                            </button>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#A1A1AA]">Ara Toplam</span>
                                    <span className="text-white font-serif text-xl">
                                        ₺{totalPrice.toLocaleString('tr-TR')}
                                    </span>
                                </div>
                                <p className="text-xs text-[#71717A]">
                                    Kargo ve vergiler ödeme sırasında hesaplanacaktır
                                </p>
                                <Link href="/odeme" onClick={closeCart}>
                                    <Button variant="primary" className="w-full">
                                        Ödemeye Geç
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={closeCart}
                                >
                                    Alışverişe Devam Et
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
