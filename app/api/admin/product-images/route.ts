import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// POST /api/admin/product-images — Add images to a product
export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { productId, images } = await request.json();

        if (!productId || !images || !Array.isArray(images)) {
            return NextResponse.json(
                { error: 'productId and images array are required' },
                { status: 400 }
            );
        }

        const imagesWithProductId = images.map((img: { url: string; alt_text?: string; is_primary?: boolean }, index: number) => ({
            product_id: productId,
            url: img.url,
            alt_text: img.alt_text || '',
            sort_order: index,
            is_primary: img.is_primary || false
        }));

        const { data, error } = await supabase
            .from('product_images')
            .insert(imagesWithProductId as any)
            .select();

        if (error) {
            console.error('Add images error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Add images API error:', error);
        return NextResponse.json({ error: 'Failed to add images' }, { status: 500 });
    }
}

// DELETE /api/admin/product-images?id=xxx — Delete an image
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('product_images')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete image error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete image API error:', error);
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
}
