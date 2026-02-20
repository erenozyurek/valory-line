import { supabase } from '../supabase';
import type { Database } from '@/types/database';

type AdminUser = Database['public']['Tables']['admin_users']['Row'];

export const adminApi = {
    // Login admin user using pgcrypto password verification
    async login(email: string, password: string): Promise<AdminUser | null> {
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                return null;
            }

            return result.user as AdminUser;
        } catch (error) {
            console.error('Login error:', error);
            return null;
        }
    },

    // Get admin user by ID
    async getById(id: string): Promise<AdminUser | null> {
        const { data, error } = await (supabase as any)
            .from('admin_users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    },

    // Get admin user by email
    async getByEmail(email: string): Promise<AdminUser | null> {
        const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) return null;
        return data;
    },

    // Create admin user
    async create(user: {
        email: string;
        password: string;
        name: string;
        role?: 'admin' | 'super_admin' | 'editor';
    }): Promise<AdminUser> {
        const { data, error } = await (supabase as any)
            .from('admin_users')
            .insert({
                email: user.email,
                password_hash: user.password, // TODO: Hash with bcrypt
                name: user.name,
                role: user.role || 'admin',
                is_active: true
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update admin user
    async update(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
        const { data, error } = await (supabase as any)
            .from('admin_users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete admin user
    async delete(id: string): Promise<void> {
        const { error } = await (supabase as any)
            .from('admin_users')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get all admin users
    async getAll(): Promise<AdminUser[]> {
        const { data, error } = await (supabase as any)
            .from('admin_users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }
};
