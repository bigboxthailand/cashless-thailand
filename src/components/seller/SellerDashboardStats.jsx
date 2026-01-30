import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function SellerDashboardStats({ shopId: propShopId }) {
    const [shopId, setShopId] = useState(propShopId);
    const [stats, setStats] = useState({
        sales: 0,
        orders: 0,
        products: 0,
        rating: 0,
    });
    const [loading, setLoading] = useState(true);

    // 1. Resolve Shop ID (Session vs Wallet)
    useEffect(() => {
        const resolve = async () => {
            if (propShopId) {
                setShopId(propShopId);
                return;
            }

            // Wallet user fallback
            const wallet = localStorage.getItem('user_wallet');
            if (wallet) {
                try {
                    const { data: profile } = await supabase.from('profiles').select('id').eq('wallet_address', wallet).single();
                    if (profile) {
                        const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', profile.id).single();
                        if (shop) {
                            setShopId(shop.id);
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Wallet shop resolution fail", e);
                }
            }

            // If we reach here, no shop was found
            setLoading(false);
        };
        resolve();
    }, [propShopId]);

    // 2. Fetch Data
    useEffect(() => {
        if (!shopId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // A. Get Products
                const { data: products, count: productCount, error: prodError } = await supabase
                    .from('products')
                    .select('id', { count: 'exact' })
                    .eq('shop_id', shopId);

                if (prodError) throw prodError;

                const productIds = products?.map(p => p.id) || [];

                if (productIds.length === 0) {
                    setStats({ sales: 0, orders: 0, products: 0, rating: 0 });
                    return;
                }

                // B. Get Order Items (Joined with Orders to check status)
                const { data: items, error: itemsError } = await supabase
                    .from('order_items')
                    .select(`
                        price, 
                        quantity, 
                        order:order_id (payment_status, id)
                    `)
                    .in('product_id', productIds);

                if (itemsError) throw itemsError;

                // Calc Sales & Unique Orders (Only PAID/SHIPPED/DELIVERED)
                let totalSales = 0;
                const uniqueOrders = new Set();

                items?.forEach(item => {
                    if (item.order && ['paid', 'shipped', 'delivered'].includes(item.order.payment_status)) {
                        totalSales += (Number(item.price) * (item.quantity || 1));
                        uniqueOrders.add(item.order.id);
                    }
                });

                // C. Get Reviews (for Rating)
                let avgRating = 5.0;
                const { data: reviews, error: reviewError } = await supabase
                    .from('reviews')
                    .select('rating')
                    .in('product_id', productIds);

                if (!reviewError && reviews?.length > 0) {
                    const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                    avgRating = sumRating / reviews.length;
                }

                setStats({
                    sales: totalSales,
                    orders: uniqueOrders.size,
                    products: productCount || 0,
                    rating: avgRating
                });

            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shopId]);

    const statItems = [
        { label: "Total Sales", value: `฿${stats.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: "💰" },
        { label: "Orders", value: stats.orders, icon: "📦" },
        { label: "Products", value: stats.products, icon: "🏷️" },
        { label: "Rating", value: stats.rating.toFixed(1), icon: "⭐" },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[#111] border border-white/10 rounded-2xl p-6 animate-pulse">
                        <div className="h-10 w-10 bg-white/10 rounded mb-2"></div>
                        <div className="h-4 w-20 bg-white/10 rounded mb-1"></div>
                        <div className="h-8 w-32 bg-white/10 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statItems.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-colors"
                >
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className="text-white/40 text-sm mb-1">
                        {stat.label}
                    </div>
                    <div className="text-2xl font-bold text-[#D4AF37]">
                        {stat.value}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
