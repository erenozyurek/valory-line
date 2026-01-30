'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center
    font-medium tracking-wide
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505]
  `;

    const variants = {
        primary: `
      bg-white text-[#050505]
      hover:bg-[#A1A1AA] hover:text-[#050505]
      focus:ring-white
    `,
        secondary: `
      bg-transparent text-white
      border border-white/20
      hover:border-[#D4AF37] hover:text-[#D4AF37]
      focus:ring-[#D4AF37]
    `,
        ghost: `
      bg-transparent text-[#A1A1AA]
      hover:text-white
      focus:ring-white/20
    `,
        gold: `
      bg-transparent text-white
      border border-[#D4AF37]
      hover:bg-[#D4AF37]/10
      focus:ring-[#D4AF37]
    `,
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
