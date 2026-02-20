'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit2, Trash2, X, FolderOpen, Loader2,
    GripVertical, Package, CheckCircle, AlertTriangle
} from 'lucide-react';
import { categoryApi } from '@/lib/api/categories';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});
    const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        sort_order: 0
    });

    useEffect(() => {
        loadCategories();
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryApi.getAll();
            setCategories(data);

            // Load product counts for each category
            const counts: Record<string, number> = {};
            await Promise.all(
                data.map(async (cat) => {
                    try {
                        counts[cat.id] = await categoryApi.getProductCount(cat.id);
                    } catch {
                        counts[cat.id] = 0;
                    }
                })
            );
            setProductCounts(counts);
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
            showToast('Kategoriler yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            sort_order: categories.length + 1
        });
        setEditingCategory(null);
    };

    const handleAddClick = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEditClick = (cat: Category) => {
        setEditingCategory(cat);
        setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            sort_order: cat.sort_order
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingCategory) {
                await categoryApi.update(editingCategory.id, formData);
                showToast('Kategori güncellendi', 'success');
            } else {
                await categoryApi.create({
                    ...formData,
                    is_active: true
                });
                showToast('Yeni kategori oluşturuldu', 'success');
            }

            await loadCategories();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Kategori kaydedilemedi:', error);
            showToast('Kategori kaydedilirken hata oluştu', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (id: string, name: string) => {
        setPendingDelete({ id, name });
    };

    const handleDeleteConfirm = async () => {
        if (!pendingDelete) return;
        const { id } = pendingDelete;
        setPendingDelete(null);
        setDeletingId(id);
        try {
            await categoryApi.delete(id);
            showToast('Kategori silindi', 'success');
            await loadCategories();
        } catch (error) {
            console.error('Kategori silinemedi:', error);
            showToast('Kategori silinemedi. Bu kategoriye ait ürünler olabilir.', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const handleNameChange = (value: string) => {
        const autoSlug = !editingCategory
            ? value
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ /g, '-')
                .replace(/[^a-z0-9-]/g, '')
            : formData.slug;

        setFormData({
            ...formData,
            name: value,
            slug: autoSlug
        });
    };

    // Filter categories
    const filteredCategories = categories
        .filter(cat =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => a.sort_order - b.sort_order);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    return (
        <div className="p-8">
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
                            }`}
                        >
                            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                            <span className="text-sm font-medium">{toast.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="font-serif text-3xl text-white mb-2">Kategoriler</h1>
                    <p className="text-[#A1A1AA]">
                        Sitedeki ürün kategorilerini yönetin • {categories.length} kategori
                    </p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-6 py-3 font-medium hover:bg-white transition-colors shrink-0"
                >
                    <Plus size={18} />
                    Yeni Kategori
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={18} />
                <input
                    type="text"
                    placeholder="Kategori ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border border-white/10 pl-12 pr-4 py-3 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
            </div>

            {/* Categories Grid */}
            {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCategories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`group relative border bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ${deletingId === cat.id ? 'opacity-50 pointer-events-none' : ''
                                } ${cat.is_active ? 'border-white/5 hover:border-[#D4AF37]/30' : 'border-red-500/20'}`}
                        >
                            <div className="p-5">
                                {/* Top row: icon + actions */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                                            <FolderOpen size={18} className="text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium text-lg leading-tight">{cat.name}</h3>
                                            <span className="text-[#D4AF37] text-xs font-mono">/{cat.slug}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditClick(cat)}
                                            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
                                            title="Düzenle"
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(cat.id, cat.name)}
                                            className="p-2 text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                {cat.description && (
                                    <p className="text-[#A1A1AA] text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {cat.description}
                                    </p>
                                )}

                                {/* Bottom: stats */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[#71717A] text-xs">
                                            <Package size={13} />
                                            <span>{productCounts[cat.id] || 0} ürün</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[#71717A] text-xs">
                                            <GripVertical size={13} />
                                            <span>Sıra: {cat.sort_order}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${cat.is_active
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}
                                    >
                                        {cat.is_active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </div>
                            </div>

                            {/* Loading overlay for delete */}
                            {deletingId === cat.id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/60">
                                    <Loader2 size={20} className="animate-spin text-red-400" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-white/5 bg-white/[0.02]">
                    <FolderOpen size={48} className="mx-auto text-[#71717A] mb-4" />
                    <p className="text-[#A1A1AA] mb-2">
                        {searchQuery ? 'Aramanızla eşleşen kategori bulunamadı.' : 'Henüz kategori eklenmemiş.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={handleAddClick}
                            className="text-[#D4AF37] text-sm hover:underline mt-2"
                        >
                            İlk kategoriyi oluşturun →
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', duration: 0.4 }}
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg relative"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                                        {editingCategory ? <Edit2 size={14} className="text-[#D4AF37]" /> : <Plus size={14} className="text-[#D4AF37]" />}
                                    </div>
                                    <h2 className="text-lg font-serif text-white">
                                        {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Oluştur'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-[#71717A] hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Kategori Adı *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="Örn: Kadın Takı"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">
                                        Slug (URL)
                                        <span className="text-[#71717A] ml-1">— otomatik oluşturulur</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#71717A] text-sm">/magaza?kategori=</span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="flex-1 bg-transparent border border-white/10 px-4 py-3 text-[#D4AF37] font-mono text-sm placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                            placeholder="kadin-taki"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Açıklama</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors h-24 resize-none"
                                        placeholder="Kategori hakkında kısa bir açıklama..."
                                    />
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Sıralama</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.sort_order}
                                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    />
                                </div>

                                {/* Modal Footer */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 text-sm text-[#A1A1AA] hover:text-white transition-colors"
                                        disabled={submitting}
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || !formData.name.trim()}
                                        className="flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-6 py-2.5 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 size={15} className="animate-spin" />
                                                Kaydediliyor...
                                            </>
                                        ) : editingCategory ? (
                                            'Güncelle'
                                        ) : (
                                            <>
                                                <Plus size={15} />
                                                Oluştur
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!pendingDelete}
                onClose={() => setPendingDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Kategori Silinsin mi?"
                message={`"${pendingDelete?.name || ''}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
                confirmText="Evet, Sil"
                cancelText="Vazgeç"
                variant="danger"
            />
        </div>
    );
}
