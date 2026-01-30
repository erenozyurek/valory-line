import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
    email: string;
    name: string;
}

interface AdminState {
    isLoggedIn: boolean;
    user: AdminUser | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

// Mock credentials
const ADMIN_EMAIL = 'admin@valoryline.com';
const ADMIN_PASSWORD = 'admin123';

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,

            login: (email: string, password: string) => {
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    set({
                        isLoggedIn: true,
                        user: {
                            email: ADMIN_EMAIL,
                            name: 'Admin',
                        },
                    });
                    return true;
                }
                return false;
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
