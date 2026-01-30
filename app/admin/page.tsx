'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLoginPage() {
    const router = useRouter();
    const { login, isLoggedIn } = useAdminStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (isLoggedIn) {
            router.push('/admin/dashboard');
        }
    }, [isLoggedIn, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(email, password);

        if (success) {
            router.push('/admin/dashboard');
        } else {
            setError('Geçersiz e-posta veya şifre');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <Image
                        src="/images/logo.png"
                        alt="Valory Line"
                        width={80}
                        height={80}
                        className="mx-auto mb-4"
                    />
                    <p className="text-[#71717A] text-sm uppercase tracking-widest">
                        Admin Panel
                    </p>
                </div>

                {/* Login Form */}
                <div className="p-8 border border-white/10 bg-white/[0.02]">
                    <h2 className="font-serif text-xl text-white mb-6 text-center">
                        Giriş Yap
                    </h2>

                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-6 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">
                                E-posta
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    placeholder="admin@valoryline.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-[#A1A1AA] mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-transparent border border-white/10 text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#D4AF37] text-[#050505] py-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#71717A] mt-6">
                    © {new Date().getFullYear()} Valory Line. Tüm hakları saklıdır.
                </p>
            </motion.div>
        </div>
    );
}
