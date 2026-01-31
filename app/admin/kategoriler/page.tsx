'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock data based on database.sql
interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    productCount: number;
    sortOrder: number;
}

const initialCategories: Category[] = [
    { id: '1', name: 'Kadın', slug: 'kadin', description: 'Kadınlara özel hediyeler', productCount: 42, sortOrder: 1 },
    { id: '2', name: 'Erkek', slug: 'erkek', description: 'Erkeklere özel hediyeler', productCount: 35, sortOrder: 2 },
    { id: '3', name: 'Takı', slug: 'taki', description: 'Kolye, küpe, yüzük', productCount: 120, sortOrder: 3 },
    { id: '4', name: 'Cüzdan', slug: 'cuzdan', description: 'Deri cüzdan ve kartlıklar', productCount: 18, sortOrder: 4 },
    { id: '5', name: 'Saat', slug: 'saat', description: 'Premium saat koleksiyonu', productCount: 12, sortOrder: 5 },
    { id: '6', name: 'Çift Setleri', slug: 'cift', description: 'Sevgililere özel ikili setler', productCount: 8, sortOrder: 6 },
    { id: '7', name: 'Aksesuar', slug: 'aksesuar', description: 'Kemer, atkı, eldiven', productCount: 25, sortOrder: 7 },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        sortOrder: 0
    });

    // Reset form
    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '', sortOrder: categories.length + 1 });
        setEditingCategory(null);
    };

    // Open modal for add
    const handleAddClick = () => {
        resetForm();
        setIsModalOpen(true);
    };

    // Open modal for edit
    const handleEditClick = (cat: Category) => {
        setEditingCategory(cat);
        setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            sortOrder: cat.sortOrder
        });
        setIsModalOpen(true);
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            // Update existing
            setCategories(categories.map(c =>
                c.id === editingCategory.id
                    ? { ...c, ...formData }
                    : c
            ));
        } else {
            // Create new
            const newCategory: Category = {
                id: Date.now().toString(),
                ...formData,
                productCount: 0 // New category starts with 0 products
            };
            setCategories([...categories, newCategory]);
        }

        setIsModalOpen(false);
        resetForm();
    };

    // Handle delete
    const handleDelete = (id: string) => {
        if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    // Filter categories
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl text-white mb-2">Kategoriler</h1>
                    <p className="text-[#A1A1AA]">Sitedeki ürün kategorilerini yönetin.</p>
                </div>
                <Button onClick={handleAddClick} className="flex items-center gap-2">
                    <Plus size={18} />
                    Yeni Kategori
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" size={20} />
                <input
                    type="text"
                    placeholder="Kategori ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
            </div>

            {/* Table */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-[#A1A1AA] font-normal text-sm">Sıra</th>
                                <th className="p-4 text-[#A1A1AA] font-normal text-sm">Kategori Adı</th>
                                <th className="p-4 text-[#A1A1AA] font-normal text-sm">Slug (URL)</th>
                                <th className="p-4 text-[#A1A1AA] font-normal text-sm">Açıklama</th>
                                <th className="p-4 text-[#A1A1AA] font-normal text-sm">Ürün Sayısı</th>
                                <th className="p-4 text-[#A1A1AA] font-normal text-sm text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCategories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[#71717A] text-sm font-mono">{cat.sortOrder}</td>
                                    <td className="p-4 text-white font-medium">{cat.name}</td>
                                    <td className="p-4 text-[#D4AF37] text-sm">{cat.slug}</td>
                                    <td className="p-4 text-[#A1A1AA] text-sm">{cat.description}</td>
                                    <td className="p-4 text-white text-sm">
                                        <span className="bg-white/10 px-2 py-1 rounded text-xs">
                                            {cat.productCount} ürün
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEditClick(cat)}
                                            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#71717A]">
                                        Kategori bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-4 top-4 text-[#71717A] hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-serif text-white mb-6">
                            {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-[#A1A1AA] mb-1">Kategori Adı</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                            // Auto-slug generation if creating new
                                            slug: !editingCategory ? e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') : formData.slug
                                        });
                                    }}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                                    placeholder="Örn: Kadın Giyim"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#A1A1AA] mb-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                                    placeholder="orn-kadin-giyim"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#A1A1AA] mb-1">Açıklama</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] h-24 resize-none"
                                    placeholder="Kategori açıklaması..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-1">Sıralama</label>
                                    <input
                                        type="number"
                                        value={formData.sortOrder}
                                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                                        className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-white transition-colors"
                                >
                                    İptal
                                </button>
                                <Button type="submit" className="px-6">
                                    {editingCategory ? 'Güncelle' : 'Oluştur'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
