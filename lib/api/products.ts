import { supabase } from '../supabase';
import type { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];

export const productApi = {
    // Get all products with images
    async getAll(): Promise<(Product & { images: ProductImage[] })[]> {
        const { data, error } = await (supabase as any)
            .from('products')
            .select('*, images:product_images(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data as any) || [];
    },

    // Get product by ID with images
    async getById(id: string): Promise<(Product & { images: ProductImage[] }) | null> {
        const { data, error } = await (supabase as any)
            .from('products')
            .select('*, images:product_images(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return (data as any) || null;
    },

    // Get product by slug
    async getBySlug(slug: string): Promise<(Product & { images: ProductImage[] }) | null> {
        const { data, error } = await (supabase as any)
            .from('products')
            .select('*, images:product_images(*)')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return (data as any) || null;
    },

    // Create new product
    async create(product: ProductInsert): Promise<Product> {
        const { data, error } = await (supabase as any)
            .from('products')
            .insert(product)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update product
    async update(id: string, updates: ProductUpdate): Promise<Product> {
        const { data, error } = await (supabase as any)
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete product
    async delete(id: string): Promise<void> {
        const { error } = await (supabase as any)
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Add images to product
    async addImages(productId: string, images: { url: string; alt_text?: string; is_primary?: boolean }[]): Promise<ProductImage[]> {
        const imagesWithProductId = images.map((img, index) => ({
            product_id: productId,
            url: img.url,
            alt_text: img.alt_text || '',
            sort_order: index,
            is_primary: img.is_primary || index === 0
        }));

        const { data, error } = await (supabase as any)
            .from('product_images')
            .insert(imagesWithProductId)
            .select();

        if (error) throw error;
        return data || [];
    },

    // Delete product image
    async deleteImage(imageId: string): Promise<void> {
        const { error } = await (supabase as any)
            .from('product_images')
            .delete()
            .eq('id', imageId);

        if (error) throw error;
    },

    // Upload image via server-side API route (bypasses storage RLS)
    async uploadImage(file: File, productId: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', productId);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const { url } = await response.json();
        return url;
    },

    // Get products by category
    async getByCategory(categoryId: string): Promise<(Product & { images: ProductImage[] })[]> {
        const { data, error } = await (supabase as any)
            .from('products')
            .select('*, images:product_images(*)')
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data as any) || [];
    },

    // Get active products
    async getActive(): Promise<(Product & { images: ProductImage[] })[]> {
        const { data, error } = await (supabase as any)
            .from('products')
            .select('*, images:product_images(*)')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data as any) || [];
    }
};
