'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { productApi } from '@/lib/api/products';
import { categoryApi } from '@/lib/api/categories';
import { ShowcaseNotice } from '@/components/ShowcaseNotice';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [product, setProduct] = useState<any>(null);
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        if (slug) loadProduct();
    }, [slug]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productApi.getBySlug(slug);
            if (!data) {
                router.push('/magaza');
                return;
            }
            setProduct(data);

            // Fetch category name
            if (data.category_id) {
                try {
                    const cats = await categoryApi.getAll();
                    const cat = (cats as any[]).find((c: any) => c.id === data.category_id);
                    if (cat) setCategory(cat);
                } catch { }
            }
        } catch (err) {
            console.error('Ürün yüklenemedi:', err);
            router.push('/magaza');
        } finally {
            setLoading(false);
        }
    };

    const images = product?.images || [];
    const hasMultipleImages = images.length > 1;

    const nextImage = useCallback(() => {
        if (hasMultipleImages) {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }
    }, [hasMultipleImages, images.length]);

    const prevImage = useCallback(() => {
        if (hasMultipleImages) {
            setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
        }
    }, [hasMultipleImages, images.length]);

    // Touch/swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipe = 50;
        if (Math.abs(distance) > minSwipe) {
            if (distance > 0) nextImage();
            else prevImage();
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const handleAddToCart = () => {
        setShowNotice(true);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextImage, prevImage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    if (!product) return null;

    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
        : 0;

    return (
        <>
            <div className="min-h-screen bg-[#050505] pt-24">
                {/* Breadcrumb */}
                <div className="container-luxury py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link
                            href="/magaza"
                            className="text-[#71717A] hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                        >
                            <ArrowLeft size={14} />
                            Mağaza
                        </Link>
                        {category && (
                            <>
                                <span className="text-[#71717A]/50">/</span>
                                <Link
                                    href={`/magaza?kategori=${category.slug}`}
                                    className="text-[#71717A] hover:text-[#D4AF37] transition-colors"
                                >
                                    {category.name}
                                </Link>
                            </>
                        )}
                        <span className="text-[#71717A]/50">/</span>
                        <span className="text-white/70 truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="container-luxury py-8 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        {/* ─── Image Gallery ─── */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div
                                className="relative aspect-[3/4] bg-[#0A0A0A] border border-white/5 overflow-hidden group"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0"
                                    >
                                        {images.length > 0 ? (
                                            <Image
                                                src={images[currentImage]?.url}
                                                alt={`${product.name} - ${currentImage + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                priority
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-[#71717A]">
                                                Görsel yok
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Arrows */}
                                {hasMultipleImages && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 hover:border-[#D4AF37]/50"
                                            aria-label="Önceki görsel"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 hover:border-[#D4AF37]/50"
                                            aria-label="Sonraki görsel"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter */}
                                {hasMultipleImages && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs text-white/80 tracking-wider border border-white/10">
                                        {currentImage + 1} / {images.length}
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {hasDiscount && (
                                    <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#050505] px-3 py-1 text-xs font-semibold tracking-wider">
                                        %{discountPercent} İNDİRİM
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {hasMultipleImages && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {images.map((img: any, index: number) => (
                                        <button
                                            key={img.id || index}
                                            onClick={() => setCurrentImage(index)}
                                            className={`relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 border-2 overflow-hidden transition-all duration-300 ${currentImage === index
                                                ? 'border-[#D4AF37] opacity-100'
                                                : 'border-white/10 opacity-50 hover:opacity-80'
                                                }`}
                                        >
                                            <Image
                                                src={img.url}
                                                alt={`${product.name} - ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ─── Product Info ─── */}
                        <div className="lg:sticky lg:top-32 lg:self-start space-y-8">
                            {/* Category & Badges */}
                            <div className="flex items-center gap-3 flex-wrap">
                                {category && (
                                    <Link
                                        href={`/magaza?kategori=${category.slug}`}
                                        className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] hover:text-[#D4AF37]/80 transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                )}
                                {product.is_new && (
                                    <span className="bg-white/10 text-white text-[10px] uppercase tracking-wider px-2.5 py-1">
                                        Yeni
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-wide leading-tight">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-4">
                                <span className="text-2xl sm:text-3xl text-white font-light">
                                    ₺{product.price.toLocaleString('tr-TR')}
                                </span>
                                {hasDiscount && (
                                    <span className="text-lg text-[#71717A] line-through">
                                        ₺{product.compare_at_price.toLocaleString('tr-TR')}
                                    </span>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="w-12 h-px bg-[#D4AF37]/40" />

                            {/* Short Description */}
                            {product.short_description && (
                                <p className="text-[#A1A1AA] text-base leading-relaxed">
                                    {product.short_description}
                                </p>
                            )}

                            {/* Add to Cart */}
                            <motion.button
                                onClick={handleAddToCart}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#D4AF37] text-[#050505] px-10 py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-[#C5A028] active:bg-[#B8931F]"
                            >
                                <ShoppingBag size={18} />
                                Sepete Ekle
                            </motion.button>

                            {/* Stock Info */}
                            {product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0 && (
                                <p className="text-amber-400/80 text-sm">
                                    Son {product.stock_quantity} adet kaldı
                                </p>
                            )}

                            {/* Product Details */}
                            {product.description && (
                                <div className="pt-4 border-t border-white/5">
                                    <h2 className="text-white text-sm uppercase tracking-widest mb-4">
                                        Ürün Detayları
                                    </h2>
                                    <div className="text-[#A1A1AA] text-sm leading-[1.8] whitespace-pre-line">
                                        {product.description}
                                    </div>
                                </div>
                            )}

                            {/* SKU / Barcode */}
                            {(product.sku || product.barcode) && (
                                <div className="pt-4 border-t border-white/5 space-y-1">
                                    {product.sku && (
                                        <p className="text-[#71717A] text-xs">
                                            SKU: <span className="text-[#A1A1AA]">{product.sku}</span>
                                        </p>
                                    )}
                                    {product.barcode && (
                                        <p className="text-[#71717A] text-xs">
                                            Barkod: <span className="text-[#A1A1AA]">{product.barcode}</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ShowcaseNotice isOpen={showNotice} onClose={() => setShowNotice(false)} />
        </>
    );
}
