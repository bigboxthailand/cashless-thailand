import React from 'react';
import { Package, MapPin, Star, AlertCircle, TrendingUp, MessageSquare } from 'lucide-react';

export const AvatarVisual = () => {
    const seeds = ['Felix', 'Aneka', 'Bandit', 'Scooter'];
    return (
        <div className="flex flex-wrap gap-6 justify-center">
            {seeds.map((seed, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                            alt={seed}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{seed}</span>
                </div>
            ))}
        </div>
    );
};

export const AddressVisual = () => {
    return (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-sm w-full mx-auto relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-[10px] bg-[#D4AF37] text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider">Default</div>
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                    <MapPin size={18} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-white font-bold text-sm">Satoshi Nakamoto</h4>
                    <p className="text-white/60 text-xs text-sm leading-relaxed">
                        999 Blockchain Blvd, <br />
                        Crypto City, Decentralized Zone <br />
                        10101
                    </p>
                    <div className="pt-2 text-white/40 text-[10px]">+66 89 123 4567</div>
                </div>
            </div>
            <div className="absolute inset-0 border-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none"></div>
        </div>
    );
};

export const OrderHistoryVisual = () => {
    return (
        <div className="w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                        <Package size={16} />
                    </div>
                    <div>
                        <div className="text-xs text-white/40 uppercase">Order ID</div>
                        <div className="text-sm font-mono text-white">#ORD-2026-888</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-white/40 uppercase">Status</div>
                    <div className="text-green-500 font-bold text-xs bg-green-500/10 px-2 py-0.5 rounded">DELIVERED</div>
                </div>
            </div>
            <div className="p-4 bg-white/5 flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-lg border border-white/10 flex items-center justify-center text-white/20 text-xs">IMG</div>
                <div className="flex-1">
                    <h5 className="text-sm font-bold text-white">Ledger Nano X</h5>
                    <p className="text-xs text-white/40">Hardware Wallet (Onyx Black)</p>
                </div>
                <div className="text-white font-mono text-sm">฿5,500</div>
            </div>
            <div className="p-3 bg-[#111] text-center border-t border-white/5">
                <button className="text-xs text-[#D4AF37] hover:underline uppercase tracking-wider font-bold">Track Shipment</button>
            </div>
        </div>
    );
}

export const ReviewVisual = () => {
    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-[#111] border border-white/10 rounded-xl max-w-sm mx-auto">
            <div className="text-white font-bold text-sm">Rate this Product</div>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={24} className={`${star <= 4 ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/20"} cursor-pointer hover:scale-110 transition-transform`} />
                ))}
            </div>
            <textarea className="w-full bg-black border border-white/10 rounded p-2 text-xs text-white resize-none h-20 focus:outline-none focus:border-[#D4AF37]/50" placeholder="Write your review..."></textarea>
            <button className="w-full py-2 bg-white/10 text-white text-xs rounded hover:bg-white/20 font-bold transition-colors">Submit Review</button>
        </div>
    )
}

export const DisputeVisual = () => {
    return (
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-4 max-w-lg mx-auto">
            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
            </div>
            <div className="space-y-2">
                <h4 className="text-red-400 font-bold text-sm">Dispute Opened</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                    You have reported an issue for Order #ORD-2026-999. Do not close this case until you are satisfied with the resolution. The admin team has been notified.
                </p>
                <div className="flex gap-2 pt-2">
                    <button className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] rounded border border-red-500/20 hover:bg-red-500/20">Upload Evidence</button>
                    <button className="px-3 py-1 bg-white/5 text-white/40 text-[10px] rounded border border-white/10 hover:text-white">Cancel Dispute</button>
                </div>
            </div>
        </div>
    )
}

export const AffiliateVisual = () => {
    return (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-[#111] p-4 rounded-xl border border-white/10 text-center space-y-2">
                <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Total Clicks</div>
                <div className="text-2xl font-black text-white">1,240</div>
                <div className="text-[10px] text-green-500 flex items-center justify-center gap-1">
                    <TrendingUp size={10} /> +12%
                </div>
            </div>
            <div className="bg-[#111] p-4 rounded-xl border border-white/10 text-center space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#D4AF37]/20 blur-xl rounded-full"></div>
                <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Earnings</div>
                <div className="text-2xl font-black text-[#D4AF37]">฿4,500</div>
                <div className="text-[10px] text-white/20">Pending Payout</div>
            </div>
        </div>
    )
}

export const ChatVisual = () => {
    return (
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden max-w-sm mx-auto flex flex-col h-[300px]">
            <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-white">Admin Support</span>
                </div>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-end">
                    <div className="bg-[#D4AF37] text-black text-xs p-2 rounded-l-lg rounded-tr-lg max-w-[80%]">
                        Hello, my order hasn't arrived yet.
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="bg-white/10 text-white text-xs p-2 rounded-r-lg rounded-tl-lg max-w-[80%]">
                        Let me check that for you. Can you confirm your order ID?
                    </div>
                </div>
            </div>
            <div className="p-3 border-t border-white/5 flex gap-2">
                <input type="text" placeholder="Type a message..." className="flex-1 bg-black border border-white/10 rounded px-2 text-xs text-white focus:outline-none" />
                <button className="p-2 bg-white/10 rounded text-white hover:bg-white/20">
                    <MessageSquare size={14} />
                </button>
            </div>
        </div>
    )
}

export const AuthVisual = () => {
    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto p-8 bg-[#111] border border-white/10 rounded-xl relative overflow-hidden">
            <div className="text-center space-y-2 mb-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full mx-auto flex items-center justify-center text-black font-bold text-xl">C</div>
                <h4 className="text-white font-bold">Sign In</h4>
            </div>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-[10px] font-bold">S</div>
                <span className="text-sm text-white/80 group-hover:text-white">Continue with Supabase</span>
            </button>
            <div className="flex items-center gap-2 text-white/20 text-[10px] uppercase font-bold justify-center">
                <span className="h-[1px] w-full bg-white/10"></span> OR <span className="h-[1px] w-full bg-white/10"></span>
            </div>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#f6851b]/10 hover:bg-[#f6851b]/20 border border-[#f6851b]/20 transition-all group">
                <div className="w-6 h-6 rounded-full bg-[#f6851b] flex items-center justify-center">
                    <svg viewBox="0 0 318.6 318.6" width="12" height="12"><path fill="#fff" d="M274.9 159.3L159.3 43.7 43.7 159.3 159.3 274.9 274.9 159.3z" /></svg>
                </div>
                <span className="text-sm text-[#f6851b] font-bold group-hover:text-[#f6851b]">Connect Metamask</span>
            </button>
        </div>
    )
}

export const PersonalInfoVisual = () => {
    return (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 max-w-lg mx-auto space-y-6 opacity-90">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Full Name</label>
                    <div className="bg-black/50 border border-white/10 rounded p-2 text-white text-sm">Satoshi Nakamoto</div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Tax ID</label>
                    <div className="bg-black/50 border border-white/10 rounded p-2 text-white/60 text-sm font-mono">1-2345-67890-12-3</div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Gender</label>
                    <div className="flex gap-2">
                        <div className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded border border-[#D4AF37]/30">Male</div>
                        <div className="px-3 py-1 bg-white/5 text-white/40 text-xs rounded border border-white/10">Female</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Birthday</label>
                    <div className="bg-black/50 border border-white/10 rounded p-2 text-white text-sm">03 Jan 2009</div>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Bio</label>
                <div className="bg-black/50 border border-white/10 rounded p-2 text-white/60 text-xs h-16 italic">
                    "Chancellor on brink of second bailout for banks."
                </div>
            </div>
        </div>
    )
}
