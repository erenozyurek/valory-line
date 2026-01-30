import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
    shop: [
        { href: '/magaza?kategori=kadin', label: 'Kadın' },
        { href: '/magaza?kategori=erkek', label: 'Erkek' },
        { href: '/magaza?kategori=cift', label: 'Çift' },
        { href: '/magaza?kategori=taki', label: 'Takı' },
        { href: '/magaza?kategori=aksesuar', label: 'Aksesuar' },
    ],
    company: [
        { href: '/hakkimizda', label: 'Hakkımızda' },
        { href: '/iletisim', label: 'İletişim' },
        { href: '#', label: 'Kariyer' },
    ],
    support: [
        { href: '#', label: 'SSS' },
        { href: '#', label: 'Kargo ve Teslimat' },
        { href: '#', label: 'İade ve Değişim' },
        { href: '#', label: 'Gizlilik Politikası' },
    ],
};

export function Footer() {
    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5">
            <div className="container-luxury py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <Image
                                src="/images/logo.png"
                                alt="Valory Line"
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </Link>
                        <p className="text-[#71717A] text-sm leading-relaxed mb-6">
                            Lüks hediyelik eşya ve aksesuar koleksiyonumuzla sevdiklerinize
                            özel anlar yaşatın.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-[#71717A] hover:text-[#D4AF37] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="#" className="text-[#71717A] hover:text-[#D4AF37] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" /></svg>
                            </a>
                            <a href="#" className="text-[#71717A] hover:text-[#D4AF37] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-serif text-sm tracking-[0.2em] text-[#D4AF37] uppercase mb-6">
                            Mağaza
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#A1A1AA] transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-serif text-sm tracking-[0.2em] text-[#D4AF37] uppercase mb-6">
                            Kurumsal
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#A1A1AA] transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-serif text-sm tracking-[0.2em] text-[#D4AF37] uppercase mb-6">
                            Destek
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#A1A1AA] transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#71717A]">
                        © {new Date().getFullYear()} Valory Line. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-6">
                        <Image src="/images/logo.png" alt="Valory" width={30} height={30} className="opacity-50" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
