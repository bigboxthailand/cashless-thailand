import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function ChatOrderSelector({ userId, shopId, onSelect, onClose }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchOrders();
    }, [userId, shopId]);

    const fetchOrders = async () => {
        try {
            let query = supabase.from('orders').select('*');

            if (shopId) {
                // If shopId is provided, the user is likely the seller
                query = query.eq('shop_id', shopId);
            } else {
                // Otherwise fetch user's personal orders
                query = query.eq('user_id', userId);
            }

            const { data, error } = await query
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Select Order to Attach</h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="text-center text-white/40 py-10">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center text-white/40 py-10">No past orders found.</div>
                    ) : (
                        orders.map(order => (
                            <button
                                key={order.id}
                                onClick={() => onSelect(order)}
                                className="w-full text-left bg-[#1a1a1a] border border-white/5 p-4 rounded-xl hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                                        {order.id}
                                    </span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-bold text-sm">
                                            {order.total_price?.toLocaleString()} THB
                                        </div>
                                        <div className="text-xs text-white/40 mt-1 capitalize">
                                            Status: {order.shipping_status || 'Pending'}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
