'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';

// Expanded product data with actual images
const allProducts = [
    // Kadın - Takı
    {
        id: 'kadin-taki-1',
        name: 'Altın Kaplama Kolye Seti',
        price: 2450,
        image: '/products/necklace-1.png',
        category: 'Takı',
        type: 'kadin',
    },
    {
        id: 'kadin-taki-2',
        name: 'İnci Küpe Koleksiyonu',
        price: 1850,
        image: '/products/earring-1.png',
        category: 'Takı',
        type: 'kadin',
    },
    {
        id: 'kadin-taki-3',
        name: 'Gümüş Bileklik',
        price: 1250,
        image: '/products/bracelet-1.png',
        category: 'Takı',
        type: 'kadin',
    },
    {
        id: 'kadin-canta-1',
        name: 'Mini Deri El Çantası',
        price: 3950,
        image: '/products/bag-1.png',
        category: 'Çanta',
        type: 'kadin',
    },
    // Erkek
    {
        id: 'erkek-cuzdan-1',
        name: 'Premium Deri Cüzdan',
        price: 2950,
        image: '/products/wallet-1.png',
        category: 'Cüzdan',
        type: 'erkek',
    },
    {
        id: 'erkek-saat-1',
        name: 'Paslanmaz Çelik Saat',
        price: 4500,
        image: '/products/watch-1.png',
        category: 'Saat',
        type: 'erkek',
    },
    {
        id: 'erkek-kemer-1',
        name: 'İtalyan Deri Kemer',
        price: 1650,
        image: '/products/belt-1.png',
        category: 'Aksesuar',
        type: 'erkek',
    },
    {
        id: 'erkek-kartlik-1',
        name: 'Minimalist Kartlık',
        price: 1450,
        image: '/products/cardholder-1.png',
        category: 'Cüzdan',
        type: 'erkek',
    },
    // Çift Hediyeleri
    {
        id: 'cift-1',
        name: 'O & O Pasaport Kılıfı Seti',
        price: 3200,
        image: '/products/gift-1.png',
        category: 'Çift Seti',
        type: 'cift',
    },
    {
        id: 'cift-2',
        name: 'Eşleşen Bileklik Seti',
        price: 1950,
        image: '/products/bracelet-set.png',
        category: 'Çift Seti',
        type: 'cift',
    },
    {
        id: 'cift-3',
        name: 'Çift Anahtarlık Seti',
        price: 950,
        image: '/products/gift-1.png',
        category: 'Çift Seti',
        type: 'cift',
    },
    {
        id: 'cift-4',
        name: 'Yıldönümü Özel Kutusu',
        price: 5500,
        image: '/products/bracelet-set.png',
        category: 'Çift Seti',
        type: 'cift',
    },
    // Takı
    {
        id: 'taki-1',
        name: 'Zümrüt Taşlı Yüzük',
        price: 3850,
        image: '/products/necklace-1.png',
        category: 'Yüzük',
        type: 'taki',
    },
    {
        id: 'taki-2',
        name: 'Elmas Kesim Kolye',
        price: 4250,
        image: '/products/necklace-1.png',
        category: 'Kolye',
        type: 'taki',
    },
    {
        id: 'taki-3',
        name: 'Vintage Broş Seti',
        price: 1650,
        image: '/products/earring-1.png',
        category: 'Broş',
        type: 'taki',
    },
    {
        id: 'taki-4',
        name: 'Zincir Bileklik',
        price: 1950,
        image: '/products/bracelet-1.png',
        category: 'Bileklik',
        type: 'taki',
    },
    // Aksesuar
    {
        id: 'aksesuar-1',
        name: 'Kaşmir Atkı',
        price: 1650,
        image: '/products/scarf-1.png',
        category: 'Atkı',
        type: 'aksesuar',
    },
    {
        id: 'aksesuar-2',
        name: 'İpek Fular',
        price: 1250,
        image: '/products/scarf-1.png',
        category: 'Fular',
        type: 'aksesuar',
    },
    {
        id: 'aksesuar-3',
        name: 'Deri Eldiven',
        price: 1450,
        image: '/products/wallet-1.png',
        category: 'Eldiven',
        type: 'aksesuar',
    },
    {
        id: 'aksesuar-4',
        name: 'Güneş Gözlüğü',
        price: 2250,
        image: '/products/watch-1.png',
        category: 'Gözlük',
        type: 'aksesuar',
    },
];

const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'kadin', label: 'Kadın' },
    { id: 'erkek', label: 'Erkek' },
    { id: 'cift', label: 'Çift' },
    { id: 'taki', label: 'Takı' },
    { id: 'aksesuar', label: 'Aksesuar' },
];

const sortOptions = [
    { id: 'default', label: 'Varsayılan' },
    { id: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
    { id: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
    { id: 'name-asc', label: 'A-Z' },
];

function MagazaContent() {
    const searchParams = useSearchParams();
    const kategoriParam = searchParams.get('kategori');

    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);

    // Sync with URL parameter
    useEffect(() => {
        if (kategoriParam && categories.some(c => c.id === kategoriParam)) {
            setActiveCategory(kategoriParam);
        } else {
            setActiveCategory('all');
        }
    }, [kategoriParam]);

    // Filter products
    let filteredProducts = activeCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.type === activeCategory);

    // Sort products
    if (sortBy === 'price-asc') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }

    // Get category title
    const getCategoryTitle = () => {
        if (activeCategory === 'all') return 'Tüm Ürünler';
        const cat = categories.find(c => c.id === activeCategory);
        return cat ? `${cat.label} Ürünleri` : 'Mağaza';
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-24">
            {/* Header */}
            <section className="py-12 lg:py-20 border-b border-white/5">
                <div className="container-luxury">
                    <div className="max-w-2xl">
                        <span className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 block">
                            Koleksiyon
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-6">
                            {getCategoryTitle()}
                        </h1>
                        <p className="text-[#A1A1AA] text-lg leading-relaxed">
                            Kadın ve erkek için özel tasarım takı, cüzdan, çanta ve
                            hediyelik eşya koleksiyonumuzu keşfedin.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters & Products */}
            <section className="py-12 lg:py-16">
                <div className="container-luxury">
                    {/* Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
                        {/* Category Tabs - Desktop */}
                        <div className="hidden md:flex items-center gap-2 flex-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-5 py-2.5 text-sm uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.id
                                        ? 'bg-[#D4AF37] text-[#050505]'
                                        : 'bg-transparent text-[#A1A1AA] border border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 border border-white/10 text-[#A1A1AA]"
                        >
                            <SlidersHorizontal size={18} />
                            Filtrele
                        </button>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-[#71717A]">Sırala:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border border-white/10 text-white text-sm px-4 py-2 focus:outline-none focus:border-[#D4AF37]"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id} className="bg-[#121212]">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Mobile Category Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mb-8"
                        >
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setShowFilters(false);
                                        }}
                                        className={`px-4 py-2 text-sm uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.id
                                            ? 'bg-[#D4AF37] text-[#050505]'
                                            : 'bg-transparent text-[#A1A1AA] border border-white/10'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Results Count */}
                    <p className="text-sm text-[#71717A] mb-8">
                        {filteredProducts.length} ürün gösteriliyor
                    </p>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard {...product} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-[#A1A1AA]">Bu kategoride ürün bulunamadı.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function MagazaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
                <div className="text-[#D4AF37]">Yükleniyor...</div>
            </div>
        }>
            <MagazaContent />
        </Suspense>
    );
}
