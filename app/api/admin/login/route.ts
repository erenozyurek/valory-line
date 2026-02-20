import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

interface VerifyResult {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar_url: string | null;
    is_active: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
}

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-posta ve şifre gereklidir' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Use pgcrypto's crypt() function via the verify_admin_password RPC
        // This compares crypt(input_password, stored_hash) === stored_hash entirely on the DB side
        const { data, error } = await (supabase.rpc as any)('verify_admin_password', {
            p_email: email,
            p_password: password,
        });

        if (error) {
            console.error('Login RPC error:', error);
            return NextResponse.json(
                { error: 'Giriş yapılırken bir hata oluştu' },
                { status: 500 }
            );
        }

        const results = data as VerifyResult[] | null;

        if (!results || results.length === 0) {
            return NextResponse.json(
                { error: 'Geçersiz e-posta veya şifre' },
                { status: 401 }
            );
        }

        const user = results[0];

        // Update last login timestamp
        await (supabase.from('admin_users') as any)
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', user.id);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                password_hash: '', // Never expose this
                name: user.name,
                role: user.role,
                avatar_url: user.avatar_url,
                is_active: user.is_active,
                last_login_at: user.last_login_at,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
