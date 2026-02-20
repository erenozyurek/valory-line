'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import { productApi } from '@/lib/api/products';
import { categoryApi } from '@/lib/api/categories';

interface MappedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CategoryWithProducts {
  id: string;
  name: string;
  slug: string;
  products: MappedProduct[];
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
      ]);

      // Group products by category, show max 2 per category on homepage
      const categoriesWithProducts: CategoryWithProducts[] = (categoriesData as any[])
        .map((cat: any) => {
          const catProducts = (productsData as any[])
            .filter((p: any) => p.category_id === cat.id)
            .slice(0, 2)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              image: p.images?.[0]?.url || '/products/placeholder.png',
              category: cat.name,
            }));

          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            products: catProducts,
          };
        })
        .filter(cat => cat.products.length > 0); // Only show categories with products

      setCategories(categoriesWithProducts);
    } catch (err) {
      console.error('Veri yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section with Brand Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/valoryline.jpeg"
            alt="Valory Line tasarım hediyelik eşya ve aksesuar koleksiyonu - şık takı, cüzdan, çanta"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/50" />

        <div className="container-luxury relative z-10 text-center py-32">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-8"
          >
            <Image
              src="/images/logo.png"
              alt="Valory Line logosu - özel tasarım hediyelik eşya markası"
              width={150}
              height={150}
              className="mx-auto drop-shadow-2xl"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-6">
              Özel Tasarım Hediyelik Eşya & Aksesuar
            </span>
          </motion.div>

          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-white mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
          >
            VALORY LINE - Özel Tasarımlar
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Sevdiklerinize en özel hediyeleri sunuyoruz. Kadın ve erkek için özel tasarım takı,
            kaliteli deri cüzdan, şık çanta ve seçkin aksesuar koleksiyonlarımızla her anı
            özel kılın. Ücretsiz kargo ve özel hediye paketleme hizmetiyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link href="/magaza" aria-label="Tüm ürün koleksiyonunu görüntüle">
              <Button variant="primary" size="lg">
                Koleksiyonu Keşfet
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
        </motion.div>
      </section>

      {/* Featured Categories - from database */}
      <Section id="products">
        <header className="text-center mb-16">
          <Image
            src="/images/logo.png"
            alt="Valory Line"
            width={60}
            height={60}
            className="mx-auto mb-6 opacity-60"
          />
          <span className="text-[#D4AF37] text-xs uppercase tracking-[0.3em]">
            Koleksiyonumuz
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mt-4 tracking-wide">
            Özel Tasarım Hediyeler
          </h2>
          <p className="text-[#A1A1AA] mt-4 max-w-2xl mx-auto">
            Sevdiklerinize en özel hediyeleri sunuyoruz. Altın kaplama takı,
            kaliteli deri cüzdan, şık aksesuar ve daha fazlası. Her ürün özel
            hediye kutusuyla gönderilir.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
          </div>
        ) : categories.length > 0 ? (
          categories.map((cat, catIndex) => (
            <article key={cat.id} id={cat.slug} className={catIndex < categories.length - 1 ? 'mb-20' : ''}>
              <header className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-xl md:text-2xl text-white">
                  {cat.name}
                </h3>
                <Link
                  href={`/magaza?kategori=${cat.slug}`}
                  className="text-sm text-[#A1A1AA] flex items-center gap-1 transition-colors hover:text-[#D4AF37]"
                  aria-label={`Tüm ${cat.name} ürünlerini görüntüle`}
                >
                  Tümünü Gör <ChevronRight size={16} />
                </Link>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {cat.products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-[#A1A1AA]">Henüz ürün eklenmemiş.</p>
            <Link href="/admin/urunler" className="text-[#D4AF37] mt-4 inline-block hover:underline">
              Admin panelinden ürün ekleyebilirsiniz
            </Link>
          </div>
        )}
      </Section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
        <div className="container-luxury text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/logo.png"
              alt="Valory Line"
              width={50}
              height={50}
              className="mx-auto mb-6 opacity-50"
            />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white tracking-wide">
              Özel Fırsatları Kaçırmayın
            </h2>
            <p className="text-[#A1A1AA] mt-6 max-w-lg mx-auto leading-relaxed">
              Yeni koleksiyonlar, özel indirimler ve sadece üyelere özel
              fırsatlardan ilk siz haberdar olun.
            </p>

            <form className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresinizi girin"
                className="flex-1 px-6 py-4 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <Button variant="gold" size="lg">
                Abone Ol
              </Button>
            </form>

            <p className="text-xs text-[#71717A] mt-4">
              Abone olarak Gizlilik Politikamızı kabul etmiş olursunuz
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
