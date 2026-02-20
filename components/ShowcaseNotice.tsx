'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Store } from 'lucide-react';

const SHOPIER_URL = 'https://www.shopier.com/VALORYLINE?utm_source=ig&utm_medium=social&utm_content=link_in_bio';

interface ShowcaseNoticeProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ShowcaseNotice({ isOpen, onClose }: ShowcaseNoticeProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4"
                    >
                        <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 p-8 sm:p-10">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 text-[#71717A] hover:text-white transition-colors"
                                aria-label="Kapat"
                            >
                                <X size={18} />
                            </button>

                            {/* Icon */}
                            <div className="flex items-center justify-center w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/20 mx-auto mb-6">
                                <Store size={28} className="text-[#D4AF37]" />
                            </div>

                            {/* Title */}
                            <h2 className="font-serif text-xl sm:text-2xl text-white text-center tracking-wide mb-4">
                                Vitrin Modu
                            </h2>

                            {/* Message */}
                            <p className="text-[#A1A1AA] text-sm text-center leading-relaxed mb-3">
                                Websitemiz şu an için yalnızca vitrin olarak kullanılmaktadır.
                                Satışlar çok yakında aktif olacaktır.
                            </p>
                            <p className="text-[#A1A1AA] text-sm text-center leading-relaxed mb-8">
                                Şu an için{' '}
                                <span className="text-[#D4AF37] font-medium">Shopier</span>{' '}
                                üzerinden alışveriş yapabilirsiniz.
                            </p>

                            {/* Shopier Button */}
                            <a
                                href={SHOPIER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-[#D4AF37] text-[#050505] py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-[#C5A028] mb-3"
                            >
                                <ExternalLink size={16} />
                                Shopier Mağazamız
                            </a>

                            {/* Dismiss */}
                            <button
                                onClick={onClose}
                                className="w-full text-center text-sm text-[#71717A] hover:text-white transition-colors py-2"
                            >
                                Anladım, devam et
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Welcome modal - shown once on site entry
export function WelcomeShowcaseNotice() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem('showcase-notice-dismissed');
        if (!dismissed) {
            const timer = setTimeout(() => setIsOpen(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('showcase-notice-dismissed', 'true');
    };

    return <ShowcaseNotice isOpen={isOpen} onClose={handleClose} />;
}
