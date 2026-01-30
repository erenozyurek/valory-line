'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isLoggedIn } = useAdminStore();

    const isLoginPage = pathname === '/admin';

    // Redirect to login if not authenticated (must be before any conditional returns)
    useEffect(() => {
        if (!isLoggedIn && !isLoginPage) {
            router.push('/admin');
        }
    }, [isLoggedIn, isLoginPage, router]);

    // Don't apply layout to login page
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Show nothing while redirecting
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-[#A1A1AA]">Yönlendiriliyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            <AdminSidebar />
            <main className="ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
