import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const productId = formData.get('productId') as string;

        if (!file || !productId) {
            return NextResponse.json(
                { error: 'File and productId are required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        const fileExt = file.name.split('.').pop();
        const fileName = `photos/products/${productId}/${Date.now()}.${fileExt}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage
            .from('Photos')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            return NextResponse.json(
                { error: uploadError.message },
                { status: 500 }
            );
        }

        const { data } = supabase.storage
            .from('Photos')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: data.publicUrl });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
