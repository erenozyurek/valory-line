import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Database } from '@/types/database';

// GET /api/admin/products — Fetch all products with images
export async function GET() {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('products')
            .select('*, images:product_images(*)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Products fetch error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Products API error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST /api/admin/products — Create a new product
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const body = await request.json();

        const { data, error } = await supabase
            .from('products')
            .insert(body as any)
            .select()
            .single();

        if (error) {
            console.error('Product create error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Product create API error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

// PUT /api/admin/products — Update a product
export async function PUT(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { id, ...updates } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const { data, error } = await (supabase as any)
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Product update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Product update API error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE /api/admin/products?id=xxx — Delete a product
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Product delete error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Product delete API error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
