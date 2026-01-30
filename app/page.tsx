'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';

// Product data - expanded categories
const products = {
  kadin: [
    {
      id: 'kadin-1',
      name: 'Altın Kaplama Kolye Seti',
      price: 2450,
      image: '/products/necklace-1.png',
      category: 'Takı',
    },
    {
      id: 'kadin-2',
      name: 'İnci Küpe Koleksiyonu',
      price: 1850,
      image: '/products/earring-1.png',
      category: 'Takı',
    },
  ],
  erkek: [
    {
      id: 'erkek-1',
      name: 'Premium Deri Cüzdan',
      price: 2950,
      image: '/products/wallet-1.png',
      category: 'Cüzdan',
    },
    {
      id: 'erkek-2',
      name: 'Paslanmaz Çelik Saat',
      price: 4500,
      image: '/products/watch-1.png',
      category: 'Saat',
    },
  ],
  cift: [
    {
      id: 'cift-1',
      name: 'O & O Pasaport Kılıfı Seti',
      price: 3200,
      image: '/products/gift-1.png',
      category: 'Çift Seti',
    },
    {
      id: 'cift-2',
      name: 'Eşleşen Bileklik Seti',
      price: 1950,
      image: '/products/bracelet-set.png',
      category: 'Çift Seti',
    },
  ],
  aksesuar: [
    {
      id: 'aksesuar-1',
      name: 'Kaşmir Atkı',
      price: 1650,
      image: '/products/scarf-1.png',
      category: 'Aksesuar',
    },
    {
      id: 'aksesuar-2',
      name: 'Deri Kemer',
      price: 1450,
      image: '/products/belt-1.png',
      category: 'Aksesuar',
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* Hero Section with Brand Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/valoryline.jpeg"
            alt="Valory Line"
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
              alt="Valory Line Logo"
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
              Lüks Hediyelik Eşya & Aksesuar
            </span>
          </motion.div>

          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-white mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
          >
            VALORY LINE
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Her anı özel kılan hediyeler. Kadın ve erkek için takı,
            cüzdan, aksesuar ve benzersiz hediye seçenekleri.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link href="/magaza">
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

      {/* Featured Categories */}
      <Section id="products">
        <div className="text-center mb-16">
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
          <p className="text-[#A1A1AA] mt-4 max-w-lg mx-auto">
            Sevdikleriniz için en özel hediyeleri keşfedin.
            Takı, aksesuar, cüzdan ve daha fazlası.
          </p>
        </div>

        {/* Kadın */}
        <div id="kadin" className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl md:text-2xl text-white">
              Kadın Hediyeleri
            </h3>
            <Link
              href="/magaza?kategori=kadin"
              className="text-sm text-[#A1A1AA] flex items-center gap-1 transition-colors hover:text-[#D4AF37]"
            >
              Tümünü Gör <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {products.kadin.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Erkek */}
        <div id="erkek" className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl md:text-2xl text-white">
              Erkek Hediyeleri
            </h3>
            <Link
              href="/magaza?kategori=erkek"
              className="text-sm text-[#A1A1AA] flex items-center gap-1 transition-colors hover:text-[#D4AF37]"
            >
              Tümünü Gör <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {products.erkek.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Çift Hediyeleri */}
        <div id="cift" className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl md:text-2xl text-white">
              Çift Hediyeleri
            </h3>
            <Link
              href="/magaza?kategori=cift"
              className="text-sm text-[#A1A1AA] flex items-center gap-1 transition-colors hover:text-[#D4AF37]"
            >
              Tümünü Gör <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {products.cift.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Aksesuarlar */}
        <div id="aksesuar">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl md:text-2xl text-white">
              Aksesuarlar
            </h3>
            <Link
              href="/magaza?kategori=aksesuar"
              className="text-sm text-[#A1A1AA] flex items-center gap-1 transition-colors hover:text-[#D4AF37]"
            >
              Tümünü Gör <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {products.aksesuar.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
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
