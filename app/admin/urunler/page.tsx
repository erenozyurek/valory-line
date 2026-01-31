'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    type: string;
    stock: number;
    images: string[];
}

// Mock categories - in a real app, fetch from database or CategoriesPage store
const categories = [
    { id: '1', name: 'Kadın', slug: 'kadin' },
    { id: '2', name: 'Erkek', slug: 'erkek' },
    { id: '3', name: 'Çift', slug: 'cift' },
    { id: '4', name: 'Takı', slug: 'taki' },
    { id: '5', name: 'Aksesuar', slug: 'aksesuar' },
    { id: '6', name: 'Cüzdan', slug: 'cuzdan' },
    { id: '7', name: 'Saat', slug: 'saat' },
];

const initialProducts: Product[] = [
    { id: 'kadin-taki-1', name: 'Altın Kaplama Kolye Seti', price: 2450, category: 'Takı', type: 'kadin', stock: 15, images: ['/products/necklace-1.png'] },
    { id: 'kadin-taki-2', name: 'İnci Küpe Koleksiyonu', price: 1850, category: 'Takı', type: 'kadin', stock: 23, images: ['/products/earring-1.png'] },
    { id: 'erkek-cuzdan-1', name: 'Premium Deri Cüzdan', price: 2950, category: 'Cüzdan', type: 'erkek', stock: 32, images: ['/products/wallet-1.png'] },
];

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
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

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
            setSelectedImages(product.images || []);
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', category: categories[0].name, type: categories[0].slug, stock: '' });
            setSelectedImages([]);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', price: '', category: '', type: 'kadin', stock: '' });
        setSelectedImages([]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setSelectedImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
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
            images: selectedImages.length > 0 ? selectedImages : ['/images/logo.png'], // Placeholder if no image
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
            <div className="border border-white/5 bg-white/[0.02] overflow-hidden rounded-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="text-left p-4 text-xs text-[#71717A] uppercase tracking-widest font-normal">Görsel</th>
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
                                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="relative w-12 h-12 rounded bg-white/5 overflow-hidden">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-white font-medium">{product.name}</td>
                                    <td className="p-4 text-sm text-[#A1A1AA]">{product.category}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs bg-white/5 text-[#A1A1AA] rounded capitalize border border-white/5">
                                            {product.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-[#D4AF37]">₺{product.price.toLocaleString('tr-TR')}</td>
                                    <td className="p-4">
                                        <span className={`text-sm px-2 py-1 rounded ${product.stock < 10 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                            {product.stock} adet
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openModal(product)}
                                                className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="p-2 text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
                            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
                            className="fixed top-1/2 left-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 z-50 p-8 rounded-xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                                <h2 className="font-serif text-2xl text-white">
                                    {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                                </h2>
                                <button onClick={closeModal} className="text-[#A1A1AA] hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column: Details */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-[#A1A1AA] mb-2">Ürün Adı</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                required
                                                className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
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
                                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#A1A1AA] mb-2">Stok</label>
                                                <input
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                                    required
                                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-[#A1A1AA] mb-2">Kategori</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => {
                                                    const selectedCat = categories.find(c => c.name === e.target.value);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        category: e.target.value,
                                                        type: selectedCat?.slug || prev.type
                                                    }));
                                                }}
                                                className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name} className="bg-[#121212]">{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-[#A1A1AA] mb-2">Tip / Slug</label>
                                            <input
                                                type="text"
                                                value={formData.type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                                className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-lg text-[#71717A] cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column: Images */}
                                    <div className="space-y-4">
                                        <label className="block text-sm text-[#A1A1AA] mb-2">Ürün Görselleri</label>

                                        <div className="grid grid-cols-3 gap-3">
                                            {selectedImages.map((img, index) => (
                                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                                                    <Image
                                                        src={img}
                                                        alt={`Preview ${index}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            ))}

                                            <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all gap-2 group">
                                                <Upload size={24} className="text-[#71717A] group-hover:text-[#D4AF37]" />
                                                <span className="text-xs text-[#71717A] group-hover:text-white">Görsel Ekle</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-[#71717A]">
                                            İlk görsel kapak fotoğrafı olarak kullanılacaktır. PNG, JPG kabul edilir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2.5 text-sm text-[#A1A1AA] hover:text-white transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#D4AF37] text-[#050505] px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-white transition-all transform active:scale-95"
                                    >
                                        {editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Oluştur'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
