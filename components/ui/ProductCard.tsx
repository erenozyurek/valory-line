'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
}

export function ProductCard({
    id,
    name,
    price,
    image,
    category,
}: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        addItem({ id, name, price, image });
    };

    return (
        <motion.article
            className="group relative flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Image Container - 80% of card */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#121212] border border-white/5 transition-all duration-500 group-hover:border-[#D4AF37]/50">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Quick Add Button - appears on hover */}
                <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 bg-white/95 text-[#050505] px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-[#D4AF37] hover:text-white"
                    >
                        <ShoppingBag size={16} />
                        Sepete Ekle
                    </button>
                </div>
            </div>

            {/* Text Content - 20% of card */}
            <div className="pt-4 pb-2">
                {category && (
                    <span className="text-[#71717A] text-xs uppercase tracking-widest">
                        {category}
                    </span>
                )}
                <h3 className="mt-1 text-white font-serif text-lg tracking-wide">
                    {name}
                </h3>
                <p className="mt-1 text-[#A1A1AA] text-sm">
                    ₺{price.toLocaleString('tr-TR')}
                </p>
            </div>
        </motion.article>
    );
}
