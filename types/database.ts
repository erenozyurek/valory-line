export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            admin_users: {
                Row: {
                    id: string
                    email: string
                    password_hash: string
                    name: string
                    role: 'admin' | 'super_admin' | 'editor'
                    avatar_url: string | null
                    is_active: boolean
                    last_login_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    password_hash: string
                    name: string
                    role?: 'admin' | 'super_admin' | 'editor'
                    avatar_url?: string | null
                    is_active?: boolean
                    last_login_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    password_hash?: string
                    name?: string
                    role?: 'admin' | 'super_admin' | 'editor'
                    avatar_url?: string | null
                    is_active?: boolean
                    last_login_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    image_url: string | null
                    parent_id: string | null
                    sort_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    image_url?: string | null
                    parent_id?: string | null
                    sort_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    image_url?: string | null
                    parent_id?: string | null
                    sort_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    short_description: string | null
                    price: number
                    compare_at_price: number | null
                    cost_price: number | null
                    sku: string | null
                    barcode: string | null
                    stock_quantity: number
                    low_stock_threshold: number
                    weight: number | null
                    meta_title: string | null
                    meta_description: string | null
                    status: 'draft' | 'active' | 'archived'
                    is_featured: boolean
                    is_new: boolean
                    category_id: string | null
                    created_at: string
                    updated_at: string
                    published_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    short_description?: string | null
                    price: number
                    compare_at_price?: number | null
                    cost_price?: number | null
                    sku?: string | null
                    barcode?: string | null
                    stock_quantity?: number
                    low_stock_threshold?: number
                    weight?: number | null
                    meta_title?: string | null
                    meta_description?: string | null
                    status?: 'draft' | 'active' | 'archived'
                    is_featured?: boolean
                    is_new?: boolean
                    category_id?: string | null
                    created_at?: string
                    updated_at?: string
                    published_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    short_description?: string | null
                    price?: number
                    compare_at_price?: number | null
                    cost_price?: number | null
                    sku?: string | null
                    barcode?: string | null
                    stock_quantity?: number
                    low_stock_threshold?: number
                    weight?: number | null
                    meta_title?: string | null
                    meta_description?: string | null
                    status?: 'draft' | 'active' | 'archived'
                    is_featured?: boolean
                    is_new?: boolean
                    category_id?: string | null
                    created_at?: string
                    updated_at?: string
                    published_at?: string | null
                }
            }
            product_images: {
                Row: {
                    id: string
                    product_id: string
                    url: string
                    alt_text: string | null
                    sort_order: number
                    is_primary: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    url: string
                    alt_text?: string | null
                    sort_order?: number
                    is_primary?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    url?: string
                    alt_text?: string | null
                    sort_order?: number
                    is_primary?: boolean
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    customer_id: string | null
                    guest_email: string | null
                    guest_phone: string | null
                    guest_name: string | null
                    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
                    payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
                    subtotal: number
                    shipping_cost: number
                    tax_amount: number
                    discount_amount: number
                    total: number
                    currency: string
                    shipping_address: Json
                    billing_address: Json | null
                    shipping_method: string | null
                    tracking_number: string | null
                    tracking_url: string | null
                    payment_method: string | null
                    payment_reference: string | null
                    customer_note: string | null
                    admin_note: string | null
                    created_at: string
                    updated_at: string
                    shipped_at: string | null
                    delivered_at: string | null
                    cancelled_at: string | null
                }
                Insert: {
                    id?: string
                    order_number: string
                    customer_id?: string | null
                    guest_email?: string | null
                    guest_phone?: string | null
                    guest_name?: string | null
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
                    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
                    subtotal: number
                    shipping_cost?: number
                    tax_amount?: number
                    discount_amount?: number
                    total: number
                    currency?: string
                    shipping_address: Json
                    billing_address?: Json | null
                    shipping_method?: string | null
                    tracking_number?: string | null
                    tracking_url?: string | null
                    payment_method?: string | null
                    payment_reference?: string | null
                    customer_note?: string | null
                    admin_note?: string | null
                    created_at?: string
                    updated_at?: string
                    shipped_at?: string | null
                    delivered_at?: string | null
                    cancelled_at?: string | null
                }
                Update: {
                    id?: string
                    order_number?: string
                    customer_id?: string | null
                    guest_email?: string | null
                    guest_phone?: string | null
                    guest_name?: string | null
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
                    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
                    subtotal?: number
                    shipping_cost?: number
                    tax_amount?: number
                    discount_amount?: number
                    total?: number
                    currency?: string
                    shipping_address?: Json
                    billing_address?: Json | null
                    shipping_method?: string | null
                    tracking_number?: string | null
                    tracking_url?: string | null
                    payment_method?: string | null
                    payment_reference?: string | null
                    customer_note?: string | null
                    admin_note?: string | null
                    created_at?: string
                    updated_at?: string
                    shipped_at?: string | null
                    delivered_at?: string | null
                    cancelled_at?: string | null
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string | null
                    variant_id: string | null
                    product_name: string
                    variant_name: string | null
                    sku: string | null
                    quantity: number
                    unit_price: number
                    total_price: number
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id?: string | null
                    variant_id?: string | null
                    product_name: string
                    variant_name?: string | null
                    sku?: string | null
                    quantity: number
                    unit_price: number
                    total_price: number
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string | null
                    variant_id?: string | null
                    product_name?: string
                    variant_name?: string | null
                    sku?: string | null
                    quantity?: number
                    unit_price?: number
                    total_price?: number
                    image_url?: string | null
                    created_at?: string
                }
            }
            contact_info: {
                Row: {
                    id: string
                    key: string
                    label: string
                    value: string
                    icon: string | null
                    sort_order: number
                    is_active: boolean
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    label: string
                    value: string
                    icon?: string | null
                    sort_order?: number
                    is_active?: boolean
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    label?: string
                    value?: string
                    icon?: string | null
                    sort_order?: number
                    is_active?: boolean
                    updated_at?: string
                }
            }
            about_content: {
                Row: {
                    id: string
                    section_key: string
                    title: string | null
                    subtitle: string | null
                    content: string | null
                    image_url: string | null
                    stats_data: Json | null
                    sort_order: number
                    is_active: boolean
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    section_key: string
                    title?: string | null
                    subtitle?: string | null
                    content?: string | null
                    image_url?: string | null
                    stats_data?: Json | null
                    sort_order?: number
                    is_active?: boolean
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    section_key?: string
                    title?: string | null
                    subtitle?: string | null
                    content?: string | null
                    image_url?: string | null
                    stats_data?: Json | null
                    sort_order?: number
                    is_active?: boolean
                    updated_at?: string
                    updated_by?: string | null
                }
            }
            media: {
                Row: {
                    id: string
                    filename: string
                    original_filename: string
                    mime_type: string
                    file_size: number
                    url: string
                    thumbnail_url: string | null
                    alt_text: string | null
                    caption: string | null
                    folder: string
                    uploaded_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    filename: string
                    original_filename: string
                    mime_type: string
                    file_size: number
                    url: string
                    thumbnail_url?: string | null
                    alt_text?: string | null
                    caption?: string | null
                    folder?: string
                    uploaded_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    filename?: string
                    original_filename?: string
                    mime_type?: string
                    file_size?: number
                    url?: string
                    thumbnail_url?: string | null
                    alt_text?: string | null
                    caption?: string | null
                    folder?: string
                    uploaded_by?: string | null
                    created_at?: string
                }
            }
            order_status_history: {
                Row: {
                    id: string
                    order_id: string
                    status: string
                    note: string | null
                    changed_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    status: string
                    note?: string | null
                    changed_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    status?: string
                    note?: string | null
                    changed_by?: string | null
                    created_at?: string
                }
            }

        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
