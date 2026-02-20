'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Emin misiniz?',
    message,
    confirmText = 'Evet, Devam Et',
    cancelText = 'İptal',
    variant = 'danger',
    isLoading = false,
}: ConfirmDialogProps) {
    const variantStyles = {
        danger: {
            iconBg: 'bg-red-500/10 border-red-500/20',
            iconColor: 'text-red-400',
            buttonBg: 'bg-red-500 hover:bg-red-400',
        },
        warning: {
            iconBg: 'bg-amber-500/10 border-amber-500/20',
            iconColor: 'text-amber-400',
            buttonBg: 'bg-amber-500 hover:bg-amber-400',
        },
        info: {
            iconBg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20',
            iconColor: 'text-[#D4AF37]',
            buttonBg: 'bg-[#D4AF37] hover:bg-white',
        },
    };

    const styles = variantStyles[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isLoading) onClose();
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', duration: 0.35 }}
                        className="bg-[#0a0a0a] border border-white/10 w-full max-w-sm relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="absolute top-4 right-4 p-1.5 text-[#71717A] hover:text-white transition-colors disabled:opacity-50"
                        >
                            <X size={16} />
                        </button>

                        <div className="p-6 text-center">
                            {/* Icon */}
                            <div
                                className={`w-14 h-14 mx-auto mb-5 flex items-center justify-center border ${styles.iconBg}`}
                            >
                                <AlertTriangle size={26} className={styles.iconColor} />
                            </div>

                            {/* Title */}
                            <h3 className="font-serif text-lg text-white mb-2">
                                {title}
                            </h3>

                            {/* Message */}
                            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
                                {message}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 text-sm text-[#A1A1AA] border border-white/10 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${styles.buttonBg}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            İşleniyor...
                                        </>
                                    ) : (
                                        confirmText
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
