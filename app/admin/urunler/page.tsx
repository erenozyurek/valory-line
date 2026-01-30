'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    type: string;
    stock: number;
}

const initialProducts: Product[] = [
    { id: 'kadin-taki-1', name: 'Altın Kaplama Kolye Seti', price: 2450, category: 'Takı', type: 'kadin', stock: 15 },
    { id: 'kadin-taki-2', name: 'İnci Küpe Koleksiyonu', price: 1850, category: 'Takı', type: 'kadin', stock: 23 },
    { id: 'kadin-canta-1', name: 'Mini Deri El Çantası', price: 3950, category: 'Çanta', type: 'kadin', stock: 8 },
    { id: 'erkek-cuzdan-1', name: 'Premium Deri Cüzdan', price: 2950, category: 'Cüzdan', type: 'erkek', stock: 32 },
    { id: 'erkek-saat-1', name: 'Paslanmaz Çelik Saat', price: 4500, category: 'Saat', type: 'erkek', stock: 12 },
    { id: 'taki-1', name: 'Zümrüt Taşlı Yüzük', price: 3850, category: 'Yüzük', type: 'taki', stock: 5 },
    { id: 'aksesuar-1', name: 'Kaşmir Atkı', price: 1650, category: 'Atkı', type: 'aksesuar', stock: 28 },
];

const categories = ['kadin', 'erkek', 'cift', 'taki', 'aksesuar'];

export default function UrunlerPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        type: 'kadin',
        stock: '',
    });

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                category: product.category,
                type: product.type,
                stock: product.stock.toString(),
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', category: '', type: 'kadin', stock: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', price: '', category: '', type: 'kadin', stock: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct: Product = {
            id: editingProduct?.id || `product-${Date.now()}`,
            name: formData.name,
            price: parseInt(formData.price),
            category: formData.category,
            type: formData.type,
            stock: parseInt(formData.stock),
        };

        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
        } else {
            setProducts(prev => [...prev, newProduct]);
        }

        closeModal();
    };

    const deleteProduct = (id: string) => {
        if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-3xl text-white mb-2">Ürünler</h1>
                    <p className="text-[#A1A1AA]">{products.length} ürün</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-[#D4AF37] text-[#050505] px-4 py-2 text-sm font-medium hover:bg-white transition-colors"
                >
                    <Plus size={16} />
                    Yeni Ürün
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
                    className="w-full max-w-md pl-12 pr-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
            </div>

            {/* Products Table */}
            <div className="border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Ürün Adı</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Kategori</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Tip</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Fiyat</th>
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Stok</th>
                                <th className="text-right p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="p-4 text-sm text-white">{product.name}</td>
                                    <td className="p-4 text-sm text-[#A1A1AA]">{product.category}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs bg-white/5 text-[#A1A1AA] rounded capitalize">
                                            {product.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-[#D4AF37]">₺{product.price.toLocaleString('tr-TR')}</td>
                                    <td className="p-4">
                                        <span className={`text-sm ${product.stock < 10 ? 'text-red-400' : 'text-white'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => openModal(product)}
                                            className="p-2 text-[#A1A1AA] hover:text-white transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="p-2 text-[#A1A1AA] hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-50"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] border border-white/10 z-50 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-serif text-xl text-white">
                                    {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                                </h2>
                                <button onClick={closeModal} className="text-[#A1A1AA] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Ürün Adı</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-[#A1A1AA] mb-2">Fiyat (₺)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#A1A1AA] mb-2">Stok</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Kategori</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        required
                                        placeholder="ör: Takı, Çanta, Saat"
                                        className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A1A1AA] mb-2">Tip</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full px-4 py-3 bg-transparent border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-[#121212] capitalize">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#D4AF37] text-[#050505] py-3 font-medium hover:bg-white transition-colors"
                                >
                                    {editingProduct ? 'Güncelle' : 'Ekle'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
