'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    animate?: boolean;
    delay?: number;
}

export function Section({
    children,
    className = '',
    id,
    animate = true,
    delay = 0,
}: SectionProps) {
    const content = (
        <section
            id={id}
            className={`py-16 md:py-24 lg:py-32 ${className}`}
        >
            <div className="container-luxury">
                {children}
            </div>
        </section>
    );

    if (!animate) {
        return content;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {content}
        </motion.div>
    );
}
