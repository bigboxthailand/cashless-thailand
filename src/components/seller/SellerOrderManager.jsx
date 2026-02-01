import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../../lib/toast';

const SellerOrderManager = ({ shopId: propShopId }) => {
    const [shopId, setShopId] = useState(propShopId);
    const [shopName, setShopName] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Shipping Modal State
    const [isShipModalOpen, setIsShipModalOpen] = useState(false);
    const [shipData, setShipData] = useState({ orderId: '', currentTracking: '', newTracking: '', provider: 'EMS' });
    const [isSaving, setIsSaving] = useState(false);

    // 1. Resolve Shop ID (Wallet Support)
    useEffect(() => {
        const resolveShop = async () => {
            if (propShopId) {
                setShopId(propShopId);
                // Fetch shop name for logic if needed, usually passed or fetched
                const { data } = await supabase.from('shops').select('name').eq('id', propShopId).single();
                if (data) setShopName(data.name);
            } else {
                const wallet = localStorage.getItem('user_wallet');
                if (wallet) {
                    const { data: profile } = await supabase.from('profiles').select('id').eq('wallet_address', wallet).single();
                    if (profile) {
                        const { data: shop } = await supabase.from('shops').select('id, name').eq('owner_id', profile.id).single();
                        if (shop) {
                            setShopId(shop.id);
                            setShopName(shop.name);
                        }
                    }
                }
            }
        };
        resolveShop();
    }, [propShopId]);

    // 2. Fetch Orders
    useEffect(() => {
        if (shopId) fetchOrders();
        else if (propShopId === undefined && !localStorage.getItem('user_wallet')) setIsLoading(false); // No auth
    }, [shopId]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            // A. Get My Products
            const { data: products } = await supabase.from('products').select('id').eq('shop_id', shopId);
            const myProductIds = products?.map(p => p.id) || [];

            if (myProductIds.length === 0) {
                setOrders([]);
                setIsLoading(false);
                return;
            }

            // B. Get Order Items containing my products
            const { data: orderItems } = await supabase
                .from('order_items')
                .select('order_id')
                .in('product_id', myProductIds);

            const uniqueOrderIds = [...new Set(orderItems?.map(i => i.order_id))];

            if (uniqueOrderIds.length === 0) {
                setOrders([]);
                setIsLoading(false);
                return;
            }

            // C. Fetch Full Orders
            const { data: fullOrders, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        product:products (id, meta, shop_id, media, image_url)
                    ),
                    user:profiles (full_name, email, phone)
                `)
                .in('id', uniqueOrderIds)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // D. Process Orders (Filter items & Calc Total)
            const processedOrders = fullOrders.map(order => {
                const myItems = order.order_items.filter(item =>
                    item.product?.shop_id === shopId || myProductIds.includes(item.product_id)
                );

                const myTotal = myItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                return { ...order, myItems, myTotal };
            });

            setOrders(processedOrders);

        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Handlers
    const openShipModal = (orderId, tracking) => {
        setShipData({ orderId, currentTracking: tracking || '', newTracking: '', provider: 'EMS' });
        setIsShipModalOpen(true);
    };

    const handleShipUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { orderId, currentTracking, newTracking, provider } = shipData;

            // Smart Append Logic
            const entry = `${shopName} [${provider}]: ${newTracking}`;
            let finalTracking = "";

            if (!currentTracking || currentTracking === "null") {
                finalTracking = entry;
            } else {
                if (currentTracking.includes(shopName + ":")) {
                    const parts = currentTracking.split(", ");
                    const updatedParts = parts.map(p => p.startsWith(shopName + ":") ? entry : p);
                    finalTracking = updatedParts.join(", ");
                } else {
                    finalTracking = `${currentTracking}, ${entry}`;
                }
            }

            const { error } = await supabase
                .from('orders')
                .update({
                    shipping_status: 'shipped',
                    tracking_number: finalTracking,
                    shipping_provider: provider, // Set as primary if needed, or seller can just rely on the string
                    updated_at: new Date()
                })
                .eq('id', orderId);

            if (error) throw error;

            toast.success("Order shipped! Tracking updated.");
            setIsShipModalOpen(false);
            fetchOrders(); // Refresh

        } catch (err) {
            toast.error("Error: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const formatter = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" });

    if (isLoading) return <div className="text-white/50 p-8 text-center">Loading orders...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider">Order Management</h1>
                    <p className="text-white/50 text-sm">Manage and fulfill your orders.</p>
                </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                {orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-4xl mb-4">📦</div>
                        <h3 className="text-white font-bold mb-2">No Orders Yet</h3>
                        <p className="text-white/40 text-sm">When customers buy your products, they will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {orders.map(order => (
                            <div key={order.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[#D4AF37] font-black text-lg">
                                                Order #{order.id.substring(0, 8)}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${['shipped', 'delivered'].includes(order.shipping_status)
                                                ? "bg-green-500/20 text-green-500 border border-green-500/30"
                                                : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                                                }`}>
                                                {order.shipping_status || "Pending"}
                                            </span>
                                        </div>
                                        <div className="text-white/60 text-xs">
                                            Customer: <span className="text-white font-bold">{order.customer_name || order.user?.full_name || "Guest"}</span>
                                            <span className="mx-2">•</span>
                                            Date: {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                        {order.tracking_number && (
                                            <div className="mt-3 inline-flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Tracking Info:</span>
                                                <span className="text-white font-mono text-xs">{order.tracking_number}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">My Revenue</p>
                                        <p className="text-2xl font-black text-[#D4AF37]">{formatter.format(order.myTotal)}</p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="bg-black/30 rounded-xl overflow-hidden border border-white/5 mb-6">
                                    <table className="w-full text-left text-sm text-white/70">
                                        <thead className="bg-white/5 text-[10px] font-bold uppercase text-white/40 tracking-widest">
                                            <tr>
                                                <th className="p-3">Product</th>
                                                <th className="p-3 text-center">Qty</th>
                                                <th className="p-3 text-right">Price</th>
                                                <th className="p-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {order.myItems.map(item => (
                                                <tr key={item.id}>
                                                    <td className="p-3 flex items-center gap-3">
                                                        <img
                                                            src={item.product?.media?.mainImage || item.product?.image_url || "https://placehold.co/50"}
                                                            className="w-10 h-10 rounded object-cover border border-white/10"
                                                            alt=""
                                                        />
                                                        <div>
                                                            <div className="text-white font-bold">{item.title}</div>
                                                            <div className="text-xs text-white/40">{item.variant_name || "Standard"}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center text-white">{item.quantity}</td>
                                                    <td className="p-3 text-right">{formatter.format(item.price)}</td>
                                                    <td className="p-3 text-right font-bold text-white">{formatter.format(item.price * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-white/40">
                                        <p>Shipping Address:</p>
                                        <p className="text-white">{order.shipping_address || "No address provided"}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {order.shipping_status !== "delivered" && (
                                            <button
                                                onClick={() => openShipModal(order.id, order.tracking_number)}
                                                className="px-6 py-2 bg-[#D4AF37] hover:bg-[#b89530] text-black font-bold uppercase tracking-widest rounded-lg shadow-lg transition-all"
                                            >
                                                {order.tracking_number ? "Update Tracking" : "Mark as Shipped"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isShipModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsShipModalOpen(false)}></div>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-fade-in-up">
                        <h3 className="text-2xl font-black text-white uppercase mb-6">Ship Order</h3>
                        <form onSubmit={handleShipUpdate} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Provider</label>
                                    <select
                                        value={shipData.provider}
                                        onChange={e => setShipData({ ...shipData, provider: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none text-sm"
                                    >
                                        <option value="EMS">Thailand Post</option>
                                        <option value="Kerry">Kerry</option>
                                        <option value="Flash">Flash</option>
                                        <option value="J&T">J&T</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tracking ID</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="TH12345"
                                        value={shipData.newTracking}
                                        onChange={e => setShipData({ ...shipData, newTracking: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-white/30">Existing tracking info from other shops will be preserved.</p>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsShipModalOpen(false)} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20">Cancel</button>
                                <button type="submit" disabled={isSaving} className="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-[#b89530]">
                                    {isSaving ? "Processing..." : "Confirm Ship"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrderManager;
