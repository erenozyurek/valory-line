import { supabase } from '../supabase';
import type { Database } from '@/types/database';

type AboutContent = Database['public']['Tables']['about_content']['Row'];
type AboutContentUpdate = Database['public']['Tables']['about_content']['Update'];

export const aboutApi = {
    // Tüm hakkımızda içeriğini getir
    async getAll(): Promise<AboutContent[]> {
        const { data, error } = await (supabase as any)
            .from('about_content')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Section key'e göre içerik getir
    async getByKey(sectionKey: string): Promise<AboutContent | null> {
        const { data, error } = await (supabase as any)
            .from('about_content')
            .select('*')
            .eq('section_key', sectionKey)
            .single();

        if (error) throw error;
        return data;
    },

    // İçerik güncelle
    async update(sectionKey: string, updates: AboutContentUpdate): Promise<AboutContent> {
        const { data, error } = await (supabase as any)
            .from('about_content')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('section_key', sectionKey)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Tüm içeriği object olarak getir (admin panel için)
    async getAsObject(): Promise<{
        title: string;
        subtitle: string;
        description: string;
        vision: string;
        values: string;
        experience: string;
        customers: string;
        products: string;
        cities: string;
    }> {
        const items = await this.getAll();

        const hero = items.find(i => i.section_key === 'hero');
        const vision = items.find(i => i.section_key === 'vision');
        const values = items.find(i => i.section_key === 'values');
        const stats = items.find(i => i.section_key === 'stats');

        const statsData = stats?.stats_data as any || {};

        return {
            title: hero?.title || '',
            subtitle: hero?.subtitle || '',
            description: hero?.content || '',
            vision: vision?.content || '',
            values: values?.content || '',
            experience: statsData.experience || '7',
            customers: statsData.customers || '10000',
            products: statsData.products || '500',
            cities: statsData.cities || '81',
        };
    },

    // Admin panelinden gelen form verisini kaydet
    async updateFromForm(formData: {
        title: string;
        subtitle: string;
        description: string;
        vision: string;
        values: string;
        experience: string;
        customers: string;
        products: string;
        cities: string;
    }): Promise<void> {
        const updates = [
            // Hero section
            (supabase as any)
                .from('about_content')
                .update({
                    title: formData.title,
                    subtitle: formData.subtitle,
                    content: formData.description,
                    updated_at: new Date().toISOString()
                })
                .eq('section_key', 'hero'),

            // Vision section
            (supabase as any)
                .from('about_content')
                .update({
                    content: formData.vision,
                    updated_at: new Date().toISOString()
                })
                .eq('section_key', 'vision'),

            // Values section
            (supabase as any)
                .from('about_content')
                .update({
                    content: formData.values,
                    updated_at: new Date().toISOString()
                })
                .eq('section_key', 'values'),

            // Stats section
            (supabase as any)
                .from('about_content')
                .update({
                    stats_data: {
                        experience: formData.experience,
                        customers: formData.customers,
                        products: formData.products,
                        cities: formData.cities
                    },
                    updated_at: new Date().toISOString()
                })
                .eq('section_key', 'stats')
        ];

        const results = await Promise.all(updates);
        const errors = results.filter(r => r.error);

        if (errors.length > 0) {
            throw errors[0].error;
        }
    }
};
