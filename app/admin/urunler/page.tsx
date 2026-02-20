'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, ArrowLeft, Upload, X, Star, Sparkles, Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { productApi } from '@/lib/api/products';
import { categoryApi } from '@/lib/api/categories';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProductWithImages extends Product {
    images: ProductImage[];
}

// ─── Initial form state matching ALL database fields ───
const initialFormData = {
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    compare_at_price: '',
    cost_price: '',
    sku: '',
    barcode: '',
    stock_quantity: '0',
    low_stock_threshold: '5',
    weight: '',
    meta_title: '',
    meta_description: '',
    status: 'active' as 'draft' | 'active' | 'archived',
    is_featured: false,
    is_new: false,
    category_id: '',
};

export default function UrunlerPage() {
    // ─── State ───
    const [products, setProducts] = useState<ProductWithImages[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // View: 'list' | 'form'
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);

    const [formData, setFormData] = useState({ ...initialFormData });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    // ─── Load data ───
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesData] = await Promise.all([
                fetch('/api/admin/products').then(r => r.json()),
                categoryApi.getAll()
            ]);
            setProducts(productsRes);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Veriler yüklenemedi:', error);
            showToast('Veriler yüklenirken bir hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ─── Open form view ───
    const openForm = (product?: ProductWithImages) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                description: product.description || '',
                short_description: product.short_description || '',
                price: product.price.toString(),
                compare_at_price: product.compare_at_price?.toString() || '',
                cost_price: product.cost_price?.toString() || '',
                sku: product.sku || '',
                barcode: product.barcode || '',
                stock_quantity: product.stock_quantity.toString(),
                low_stock_threshold: product.low_stock_threshold.toString(),
                weight: product.weight?.toString() || '',
                meta_title: product.meta_title || '',
                meta_description: product.meta_description || '',
                status: product.status as 'draft' | 'active' | 'archived',
                is_featured: product.is_featured,
                is_new: product.is_new,
                category_id: product.category_id || '',
            });
            setExistingImages(product.images);
            setPreviewUrls([]);
        } else {
            setEditingProduct(null);
            setFormData({
                ...initialFormData,
                category_id: categories[0]?.id || '',
            });
            setExistingImages([]);
            setPreviewUrls([]);
        }
        setSelectedFiles([]);
        setView('form');
    };

    const goBackToList = () => {
        setView('list');
        setEditingProduct(null);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setExistingImages([]);
    };

    // ─── Auto-slug generation ───
    const generateSlug = (name: string) => {
        const turkishMap: Record<string, string> = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
        };
        return name
            .split('')
            .map(c => turkishMap[c] || c)
            .join('')
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    // ─── Image handling ───
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrls(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeNewPreview = (index: number) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (imageId: string) => {
        try {
            const res = await fetch(`/api/admin/product-images?id=${imageId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        } catch (error) {
            console.error('Görsel silinemedi:', error);
            showToast('Görsel silinirken bir hata oluştu.', 'error');
        }
    };

    // ─── Submit ───
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const productPayload = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || null,
                short_description: formData.short_description || null,
                price: parseFloat(formData.price),
                compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
                cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
                sku: formData.sku || null,
                barcode: formData.barcode || null,
                stock_quantity: parseInt(formData.stock_quantity),
                low_stock_threshold: parseInt(formData.low_stock_threshold),
                weight: formData.weight ? parseFloat(formData.weight) : null,
                meta_title: formData.meta_title || null,
                meta_description: formData.meta_description || null,
                status: formData.status,
                is_featured: formData.is_featured,
                is_new: formData.is_new,
                category_id: formData.category_id || null,
            };

            let productId: string;

            if (editingProduct) {
                const res = await fetch('/api/admin/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingProduct.id, ...productPayload })
                });
                if (!res.ok) throw new Error('Update failed');
                const updated = await res.json();
                productId = updated.id;
            } else {
                const res = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productPayload)
                });
                if (!res.ok) throw new Error('Create failed');
                const created = await res.json();
                productId = created.id;
            }

            // Upload new images
            if (selectedFiles.length > 0) {
                setUploadingImages(true);
                const uploadPromises = selectedFiles.map(file =>
                    productApi.uploadImage(file, productId)
                );
                const uploadedUrls = await Promise.all(uploadPromises);

                const imgRes = await fetch('/api/admin/product-images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId,
                        images: uploadedUrls.map((url, index) => ({
                            url,
                            alt_text: formData.name,
                            is_primary: index === 0 && existingImages.length === 0
                        }))
                    })
                });
                if (!imgRes.ok) throw new Error('Image save failed');
            }

            await loadData();
            goBackToList();
        } catch (error) {
            console.error('Ürün kaydedilemedi:', error);
            showToast('Ürün kaydedilirken bir hata oluştu.', 'error');
        } finally {
            setSubmitting(false);
            setUploadingImages(false);
        }
    };

    // ─── Delete ───
    const handleDeleteClick = (id: string) => {
        setPendingDeleteId(id);
    };

    const handleDeleteConfirm = async () => {
        if (!pendingDeleteId) return;
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            await loadData();
            showToast('Ürün başarıyla silindi.', 'success');
        } catch (error) {
            console.error('Ürün silinemedi:', error);
            showToast('Ürün silinirken bir hata oluştu.', 'error');
        }
    };

    // ═══════════════════════════════════════════
    //  RENDER
    // ═══════════════════════════════════════════
    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
                </div>
            ) : view === 'form' ? (
                <div className="p-8 max-w-5xl mx-auto">
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={goBackToList}
                            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-serif text-3xl text-white">
                                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                            </h1>
                            <p className="text-[#A1A1AA] text-sm mt-1">
                                {editingProduct ? 'Ürün bilgilerini güncelleyin' : 'Tüm alanları doldurarak yeni ürün oluşturun'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* ── Section: Temel Bilgiler ── */}
                        <div className="border border-white/5 bg-white/[0.02] rounded-xl p-6">
                            <h2 className="font-serif text-lg text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center text-[#D4AF37] text-sm">1</span>
                                Temel Bilgiler
                            </h2>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm text-[#A1A1AA] mb-2">Ürün Adı *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                name: e.target.value,
                                                slug: !editingProduct ? generateSlug(e.target.value) : prev.slug
                                            }))}
                                            required
                                            placeholder="Örn: Gold Kaplama Kolye"
                                            className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#A1A1AA] mb-2">Slug (URL) *</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            required
                                            placeholder="gold-kaplama-kolye"
                                            className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Kısa Açıklama</label>
                                    <input
                                        type="text"
                                        value={formData.short_description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                                        maxLength={500}
                                        placeholder="Ürünün kısa tanımı (maks 500 karakter)"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Detaylı Açıklama</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Ürün hakkında detaylı bilgi..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm text-[#A1A1AA] mb-2">Kategori</label>
                                        <select
                                            value={formData.category_id}
                                            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        >
                                            <option value="">Kategori Seçin</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id} className="bg-[#121212]">{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#A1A1AA] mb-2">Durum</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                            className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        >
                                            <option value="draft" className="bg-[#121212]">Taslak</option>
                                            <option value="active" className="bg-[#121212]">Aktif</option>
                                            <option value="archived" className="bg-[#121212]">Arşiv</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="flex items-center gap-8 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_featured}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-[#D4AF37] transition-colors" />
                                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
                                        </div>
                                        <span className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors flex items-center gap-1.5">
                                            <Star size={14} /> Öne Çıkan
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_new}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_new: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-[#D4AF37] transition-colors" />
                                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
                                        </div>
                                        <span className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors flex items-center gap-1.5">
                                            <Sparkles size={14} /> Yeni Ürün
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Fiyatlandırma ── */}
                        <div className="border border-white/5 bg-white/[0.02] rounded-xl p-6">
                            <h2 className="font-serif text-lg text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center text-[#D4AF37] text-sm">2</span>
                                Fiyatlandırma
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Satış Fiyatı (₺) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        required
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Karşılaştırma Fiyatı (₺)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.compare_at_price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, compare_at_price: e.target.value }))}
                                        placeholder="İndirimli göstermek için eski fiyat"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Maliyet Fiyatı (₺)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.cost_price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, cost_price: e.target.value }))}
                                        placeholder="Alış fiyatı"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Stok & Envanter ── */}
                        <div className="border border-white/5 bg-white/[0.02] rounded-xl p-6">
                            <h2 className="font-serif text-lg text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center text-[#D4AF37] text-sm">3</span>
                                Stok & Envanter
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">SKU</label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                        placeholder="Stok kodu"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Barkod</label>
                                    <input
                                        type="text"
                                        value={formData.barcode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                                        placeholder="Barkod numarası"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Ağırlık (g)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.weight}
                                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                        placeholder="Gram cinsinden"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Stok Miktarı *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.stock_quantity}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Düşük Stok Uyarı Eşiği</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.low_stock_threshold}
                                        onChange={(e) => setFormData(prev => ({ ...prev, low_stock_threshold: e.target.value }))}
                                        placeholder="5"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Section: SEO ── */}
                        <div className="border border-white/5 bg-white/[0.02] rounded-xl p-6">
                            <h2 className="font-serif text-lg text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center text-[#D4AF37] text-sm">4</span>
                                SEO Ayarları
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Meta Başlık</label>
                                    <input
                                        type="text"
                                        value={formData.meta_title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                                        maxLength={255}
                                        placeholder="Arama motorlarında görünecek başlık"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                    <p className="text-xs text-[#52525B] mt-1">{formData.meta_title.length}/255</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Meta Açıklama</label>
                                    <textarea
                                        value={formData.meta_description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                                        placeholder="Arama motorlarında görünecek açıklama"
                                        rows={3}
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Görseller ── */}
                        <div className="border border-white/5 bg-white/[0.02] rounded-xl p-6">
                            <h2 className="font-serif text-lg text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center text-[#D4AF37] text-sm">5</span>
                                Ürün Görselleri
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {/* Existing images (from database) */}
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                                        <Image
                                            src={img.url}
                                            alt={img.alt_text || 'Ürün görseli'}
                                            fill
                                            className="object-cover"
                                        />
                                        {img.is_primary && (
                                            <span className="absolute top-2 left-2 bg-[#D4AF37] text-[#050505] text-[10px] font-bold px-2 py-0.5 rounded">
                                                KAPAK
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(img.id)}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}

                                {/* New image previews */}
                                {previewUrls.map((url, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden group border border-[#D4AF37]/30">
                                        <Image
                                            src={url}
                                            alt={`Yeni görsel ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <span className="absolute top-2 left-2 bg-green-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                            YENİ
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeNewPreview(index)}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload area */}
                                <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all gap-2 group">
                                    <Upload size={24} className="text-[#71717A] group-hover:text-[#D4AF37] transition-colors" />
                                    <span className="text-xs text-[#71717A] group-hover:text-white transition-colors text-center px-2">Görsel Ekle</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-[#52525B] mt-3">
                                İlk görsel kapak fotoğrafı olarak kullanılır. PNG, JPG, WebP kabul edilir.
                            </p>
                        </div>

                        {/* ── Actions ── */}
                        <div className="flex items-center justify-between pt-4 pb-12">
                            <button
                                type="button"
                                onClick={goBackToList}
                                className="px-6 py-3 text-sm text-[#A1A1AA] hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
                                disabled={submitting}
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || uploadingImages}
                                className="flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-8 py-3 rounded-lg text-sm font-bold hover:bg-white transition-all transform active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        {uploadingImages ? 'Görseller yükleniyor...' : 'Kaydediliyor...'}
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        {editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Oluştur'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-serif text-3xl text-white mb-2">Ürünler</h1>
                            <p className="text-[#A1A1AA]">{products.length} ürün</p>
                        </div>
                        <button
                            onClick={() => openForm()}
                            className="flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-5 py-2.5 text-sm font-medium hover:bg-white transition-colors rounded-lg"
                        >
                            <Plus size={16} />
                            Yeni Ürün Ekle
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
                        <input
                            type="text"
                            placeholder="Ürün ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md pl-12 pr-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-lg"
                        />
                    </div>

                    {/* Products Table */}
                    <div className="border border-white/5 bg-white/[0.02] overflow-hidden rounded-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Görsel</th>
                                        <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Ürün Adı</th>
                                        <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Kategori</th>
                                        <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Fiyat</th>
                                        <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Stok</th>
                                        <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Durum</th>
                                        <th className="text-right p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => {
                                        const category = categories.find(c => c.id === product.category_id);
                                        const primaryImage = product.images.find(img => img.is_primary) || product.images[0];

                                        return (
                                            <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4">
                                                    <div className="relative w-12 h-12 rounded bg-white/5 overflow-hidden">
                                                        {primaryImage ? (
                                                            <Image
                                                                src={primaryImage.url}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[#71717A]">
                                                                <Upload size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm text-white font-medium">{product.name}</div>
                                                    {product.sku && <div className="text-xs text-[#52525B] mt-0.5">SKU: {product.sku}</div>}
                                                </td>
                                                <td className="p-4 text-sm text-[#A1A1AA]">{category?.name || '-'}</td>
                                                <td className="p-4">
                                                    <div className="text-sm text-[#D4AF37]">₺{product.price.toLocaleString('tr-TR')}</div>
                                                    {product.compare_at_price && (
                                                        <div className="text-xs text-[#52525B] line-through">₺{product.compare_at_price.toLocaleString('tr-TR')}</div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-sm px-2 py-1 rounded ${product.stock_quantity < (product.low_stock_threshold || 5) ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                                        {product.stock_quantity} adet
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-xs rounded ${product.status === 'active' ? 'bg-green-500/10 text-green-400' :
                                                        product.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            'bg-gray-500/10 text-gray-400'
                                                        }`}>
                                                        {product.status === 'active' ? 'Aktif' : product.status === 'draft' ? 'Taslak' : 'Arşiv'}
                                                    </span>
                                                    {product.is_featured && (
                                                        <Star size={12} className="inline-block ml-2 text-[#D4AF37]" />
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openForm(product)}
                                                            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                            title="Düzenle"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(product.id)}
                                                            className="p-2 text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title="Sil"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-[#71717A]">
                                                Ürün bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-6 left-1/2 z-[60]"
                    >
                        <div className={`flex items-center gap-3 px-6 py-3 shadow-2xl border ${toast.type === 'success'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}>
                            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                            <span className="text-sm font-medium">{toast.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!pendingDeleteId}
                onClose={() => setPendingDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Ürün Silinsin mi?"
                message="Bu ürünü silmek istediğinize emin misiniz? Tüm ürün görselleri ve bilgileri kalıcı olarak silinecektir."
                confirmText="Evet, Sil"
                cancelText="Vazgeç"
                variant="danger"
            />
        </>
    );
}
