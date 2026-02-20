import { supabase } from '../supabase';
import type { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export const categoryApi = {
    // Tüm kategorileri getir
    async getAll(): Promise<Category[]> {
        const { data, error } = await (supabase as any)
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // ID'ye göre kategori getir
    async getById(id: string): Promise<Category | null> {
        const { data, error } = await (supabase as any)
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Slug'a göre kategori getir
    async getBySlug(slug: string): Promise<Category | null> {
        const { data, error } = await (supabase as any)
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data;
    },

    // Yeni kategori oluştur
    async create(category: CategoryInsert): Promise<Category> {
        const { data, error } = await (supabase as any)
            .from('categories')
            .insert(category)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Kategori güncelle
    async update(id: string, updates: CategoryUpdate): Promise<Category> {
        const { data, error } = await (supabase as any)
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Kategori sil
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Kategori sırasını güncelle
    async updateSortOrder(updates: { id: string; sort_order: number }[]): Promise<void> {
        const promises = updates.map(({ id, sort_order }) =>
            (supabase as any)
                .from('categories')
                .update({ sort_order })
                .eq('id', id)
        );

        const results = await Promise.all(promises);
        const errors = results.filter(r => r.error);

        if (errors.length > 0) {
            throw errors[0].error;
        }
    },

    // Kategoriye ait ürün sayısını getir
    async getProductCount(categoryId: string): Promise<number> {
        const { count, error } = await (supabase as any)
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', categoryId);

        if (error) throw error;
        return count || 0;
    }
};
