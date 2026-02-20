import { supabase } from '../supabase';
import type { Database } from '@/types/database';

type ContactInfo = Database['public']['Tables']['contact_info']['Row'];
type ContactInfoUpdate = Database['public']['Tables']['contact_info']['Update'];

export const contactApi = {
    // Tüm iletişim bilgilerini getir
    async getAll(): Promise<ContactInfo[]> {
        const { data, error } = await (supabase as any)
            .from('contact_info')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Key'e göre iletişim bilgisi getir
    async getByKey(key: string): Promise<ContactInfo | null> {
        const { data, error } = await supabase
            .from('contact_info')
            .select('*')
            .eq('key', key)
            .single();

        if (error) throw error;
        return data;
    },

    // İletişim bilgilerini toplu güncelle
    async updateBulk(updates: { key: string; value: string }[]): Promise<void> {
        const promises = updates.map(({ key, value }) =>
            (supabase as any)
                .from('contact_info')
                .update({ value, updated_at: new Date().toISOString() })
                .eq('key', key)
        );

        const results = await Promise.all(promises);
        const errors = results.filter(r => r.error);

        if (errors.length > 0) {
            throw errors[0].error;
        }
    },

    // Tek bir iletişim bilgisini güncelle
    async update(key: string, updates: ContactInfoUpdate): Promise<ContactInfo> {
        const { data, error } = await (supabase as any)
            .from('contact_info')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('key', key)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // İletişim formunu object olarak getir (admin panel için)
    async getAsObject(): Promise<Record<string, string>> {
        const items = await this.getAll();
        return items.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {} as Record<string, string>);
    }
};
