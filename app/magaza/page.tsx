'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { productApi } from '@/lib/api/products';
import { categoryApi } from '@/lib/api/categories';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    category: string;
    categorySlug: string;
}

interface Category {
    id: string;
    slug: string;
    label: string;
}

const sortOptions = [
    { id: 'default', label: 'Varsayılan' },
    { id: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
    { id: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
    { id: 'name-asc', label: 'A-Z' },
];

function MagazaContent() {
    const searchParams = useSearchParams();
    const kategoriParam = searchParams.get('kategori');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (kategoriParam && categories.some(c => c.slug === kategoriParam)) {
            setActiveCategory(kategoriParam);
        } else {
            setActiveCategory('all');
        }
    }, [kategoriParam, categories]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                productApi.getAll(),
                categoryApi.getAll(),
            ]);

            // Map products to the format ProductCard expects
            const mappedProducts: Product[] = (productsData as any[]).map((p: any) => {
                const category = categoriesData.find((c: any) => c.id === p.category_id);
                return {
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price,
                    image: p.images?.[0]?.url || '/products/placeholder.png',
                    category: category?.name || '',
                    categorySlug: category?.slug || '',
                };
            });

            const mappedCategories: Category[] = [
                { id: 'all', slug: 'all', label: 'Tümü' },
                ...(categoriesData as any[]).map((c: any) => ({
                    id: c.id,
                    slug: c.slug,
                    label: c.name,
                })),
            ];

            setProducts(mappedProducts);
            setCategories(mappedCategories);
        } catch (err) {
            console.error('Veri yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter products
    let filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.categorySlug === activeCategory);

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
        const cat = categories.find(c => c.slug === activeCategory);
        return cat ? `${cat.label} Ürünleri` : 'Mağaza';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
            </div>
        );
    }

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
                                    onClick={() => setActiveCategory(cat.slug)}
                                    className={`px-5 py-2.5 text-sm uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.slug
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
                                            setActiveCategory(cat.slug);
                                            setShowFilters(false);
                                        }}
                                        className={`px-4 py-2 text-sm uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.slug
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
