import { supabase } from '../supabase';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type OrderStatusHistory = Database['public']['Tables']['order_status_history']['Row'];

export const orderApi = {
    // Get all orders with items
    async getAll(): Promise<(Order & { items: OrderItem[] })[]> {
        const { data: orders, error } = await (supabase as any)
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const ordersWithItems = await Promise.all(
            (orders || []).map(async (order: any) => {
                const { data: items } = await (supabase as any)
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);

                return {
                    ...order,
                    items: items || []
                };
            })
        );

        return ordersWithItems;
    },

    // Get order by ID with items
    async getById(id: string): Promise<(Order & { items: OrderItem[]; history: OrderStatusHistory[] }) | null> {
        const { data: order, error } = await (supabase as any)
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!order) return null;

        const { data: items } = await (supabase as any)
            .from('order_items')
            .select('*')
            .eq('order_id', id);

        const { data: history } = await (supabase as any)
            .from('order_status_history')
            .select('*')
            .eq('order_id', id)
            .order('created_at', { ascending: false });

        return {
            ...order,
            items: items || [],
            history: history || []
        };
    },

    // Get orders by status
    async getByStatus(status: string): Promise<(Order & { items: OrderItem[] })[]> {
        const { data: orders, error } = await (supabase as any)
            .from('orders')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const ordersWithItems = await Promise.all(
            (orders || []).map(async (order: any) => {
                const { data: items } = await (supabase as any)
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);

                return {
                    ...order,
                    items: items || []
                };
            })
        );

        return ordersWithItems;
    },

    // Create new order
    async create(order: OrderInsert, items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]): Promise<Order> {
        const { data: newOrder, error: orderError } = await (supabase as any)
            .from('orders')
            .insert(order)
            .select()
            .single();

        if (orderError) throw orderError;

        const orderItems = items.map(item => ({
            ...item,
            order_id: newOrder.id
        }));

        const { error: itemsError } = await (supabase as any)
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return newOrder;
    },

    // Update order
    async update(id: string, updates: OrderUpdate): Promise<Order> {
        const { data, error } = await (supabase as any)
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update order status
    async updateStatus(id: string, status: string, note?: string, changedBy?: string): Promise<Order> {
        const { data: order, error: orderError } = await (supabase as any)
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (orderError) throw orderError;

        // Add to status history
        const { error: historyError } = await (supabase as any)
            .from('order_status_history')
            .insert({
                order_id: id,
                status,
                note,
                changed_by: changedBy
            });

        if (historyError) throw historyError;

        return order;
    },

    // Delete order
    async delete(id: string): Promise<void> {
        const { error } = await (supabase as any)
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get orders by customer
    async getByCustomer(customerId: string): Promise<(Order & { items: OrderItem[] })[]> {
        const { data: orders, error } = await (supabase as any)
            .from('orders')
            .select('*')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const ordersWithItems = await Promise.all(
            (orders || []).map(async (order: any) => {
                const { data: items } = await (supabase as any)
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);

                return {
                    ...order,
                    items: items || []
                };
            })
        );

        return ordersWithItems;
    },

    // Get recent orders
    async getRecent(limit: number = 10): Promise<(Order & { items: OrderItem[] })[]> {
        const { data: orders, error } = await (supabase as any)
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        const ordersWithItems = await Promise.all(
            (orders || []).map(async (order: any) => {
                const { data: items } = await (supabase as any)
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);

                return {
                    ...order,
                    items: items || []
                };
            })
        );

        return ordersWithItems;
    }
};
