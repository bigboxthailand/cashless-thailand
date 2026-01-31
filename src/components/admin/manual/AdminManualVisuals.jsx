import React from 'react';
import { ShieldCheck, Lock, UserCheck, Activity, Globe, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export const SecurityVisual = () => {
    return (
        <div className="w-full bg-[#050505] border border-green-500/20 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <ShieldCheck size={120} className="text-green-500" />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <Lock className="text-green-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Elevated Security Layer</h3>
                        <p className="text-green-500 text-xs font-mono uppercase tracking-widest">System Active • Protected</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-2">
                        <div className="flex justify-between items-center text-xs text-white/50 uppercase tracking-widest">
                            <span>Row Level Security (RLS)</span>
                            <span className="text-green-500">Enforced</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full shadow-[0_0_10px_#22c55e]" />
                        </div>
                        <p className="text-[10px] text-white/30">Direct DB Policy Check</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-2">
                        <div className="flex justify-between items-center text-xs text-white/50 uppercase tracking-widest">
                            <span>Admin Role Auth</span>
                            <span className="text-green-500">Verified</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full shadow-[0_0_10px_#22c55e]" />
                        </div>
                        <p className="text-[10px] text-white/30">JWT Metadata Validation</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-8">
                    <div className="flex items-center gap-3">
                        <Server size={16} className="text-[#D4AF37]" />
                        <div className="text-xs">
                            <div className="text-white/50">Edge Function</div>
                            <div className="text-white font-mono">ap-southeast-1</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity size={16} className="text-[#D4AF37]" />
                        <div className="text-xs">
                            <div className="text-white/50">Latency</div>
                            <div className="text-green-500 font-mono">24ms</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const OrderTableVisual = () => {
    const orders = [
        { id: "#ORD-9921", user: "Somchai K.", total: "฿4,500", status: "Paid", items: 3 },
        { id: "#ORD-9922", user: "Alice W.", total: "฿12,900", status: "Shipped", items: 1 },
        { id: "#ORD-9923", user: "CryptoBro", total: "฿2,450", status: "Pending", items: 5 },
    ];

    return (
        <div className="w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden font-mono text-sm">
            <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/5">
                <h4 className="text-white font-bold">Recent Orders</h4>
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="text-white/30 border-b border-white/5">
                        <th className="px-6 py-3 font-normal">ID</th>
                        <th className="px-6 py-3 font-normal">Customer</th>
                        <th className="px-6 py-3 font-normal">Total</th>
                        <th className="px-6 py-3 font-normal">Status</th>
                        <th className="px-6 py-3 font-normal text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {orders.map((o, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 text-[#D4AF37]">{o.id}</td>
                            <td className="px-6 py-4 text-white/70">{o.user}</td>
                            <td className="px-6 py-4 text-white font-bold">{o.total}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border border-white/10 
                                    ${o.status === 'Paid' ? 'bg-green-500/10 text-green-500' :
                                        o.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-yellow-500/10 text-yellow-500'}`}>
                                    {o.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-white/30 hover:text-white transition-colors">Manage</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const DisputeCenterVisual = () => {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-red-500 border-b border-red-500/20 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center font-bold">!</div>
                    <div>
                        <h4 className="font-bold">Buyer Complaint</h4>
                        <p className="text-[10px] opacity-70">Case #DSP-2024-001</p>
                    </div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg text-white/70 text-sm">
                    "I received the package but it was empty. The box looks tampered with."
                </div>
                <div className="flex gap-2">
                    <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xs text-white/30">img_1.jpg</div>
                    <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xs text-white/30">img_2.jpg</div>
                </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-blue-500 border-b border-blue-500/20 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center font-bold">@</div>
                    <div>
                        <h4 className="font-bold">Seller Response</h4>
                        <p className="text-[10px] opacity-70">Shop: Gadget Store</p>
                    </div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg text-white/70 text-sm">
                    "We have CCTV footage of the packing process. The weight recorded by courier matches the product."
                </div>
                <div className="flex gap-2">
                    <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-xs text-white/30">cctv.mp4</div>
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center pt-4">
                <div className="flex gap-4">
                    <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold text-sm">Refund Buyer</button>
                    <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-sm">Release Funds to Seller</button>
                </div>
            </div>
        </div>
    );
};

export const SettingsVisual = () => {
    return (
        <div className="w-full bg-[#111] border border-white/10 rounded-xl p-6 space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm border-b border-white/5 pb-4">Global Configuration</h4>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                    <div>
                        <div className="text-white font-bold text-sm">System Maintenance Mode</div>
                        <div className="text-white/40 text-xs">Shutdown all customer-facing interfaces</div>
                    </div>
                    <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white/30 rounded-full" />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                    <div>
                        <div className="text-white font-bold text-sm">VAT Logic (7%)</div>
                        <div className="text-white/40 text-xs">Apply tax to all eligible products</div>
                    </div>
                    <div className="w-12 h-6 bg-[#D4AF37] rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                    <div>
                        <div className="text-white font-bold text-sm">Crypto Gateway</div>
                        <div className="text-white/40 text-xs">Enable BTC/Lightning payments via BTCPay Server</div>
                    </div>
                    <div className="w-12 h-6 bg-orange-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};
