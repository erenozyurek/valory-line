import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminApi } from '@/lib/api/admin';
import type { Database } from '@/types/database';

type AdminUser = Database['public']['Tables']['admin_users']['Row'];

interface AdminState {
    isLoggedIn: boolean;
    user: AdminUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,

            login: async (email: string, password: string) => {
                try {
                    const user = await adminApi.login(email, password);

                    if (user) {
                        set({
                            isLoggedIn: true,
                            user: user,
                        });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Login error:', error);
                    return false;
                }
            },

            logout: () => {
                set({
                    isLoggedIn: false,
                    user: null,
                });
            },
        }),
        {
            name: 'admin-auth',
        }
    )
);
