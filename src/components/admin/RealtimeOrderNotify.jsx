import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const RealtimeOrderNotify = () => {
    const [latestOrder, setLatestOrder] = useState(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Subtle chime

        const channel = supabase
            .channel('admin-orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('New Order Received!', payload.new);
                    setLatestOrder(payload.new);
                    setShowToast(true);
                    audio.play().catch(e => console.log('Audio play blocked'));

                    // Auto hide after 10 seconds
                    setTimeout(() => setShowToast(false), 10000);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (!showToast || !latestOrder) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[9999] animate-bounce-in-right">
            <div className="bg-[#111] border border-[#D4AF37] rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.2)] flex items-center gap-6 min-w-[350px]">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_#D4AF37]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-1">New Order Received! ⚡</p>
                    <h4 className="text-white font-black text-xl">#{latestOrder.id.substring(0, 8)}</h4>
                    <p className="text-white/60 text-sm">Customer: <span className="text-white font-bold">{latestOrder.customer_name}</span></p>
                    <p className="text-white font-black mt-2 text-lg">฿{Number(latestOrder.total_price).toLocaleString()}</p>
                </div>
                <button
                    onClick={() => setShowToast(false)}
                    className="text-white/20 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounceInRight {
                    from { opacity: 0; transform: translateX(200px) scale(0.8); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                .animate-bounce-in-right {
                    animation: bounceInRight 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
            `}} />
        </div>
    );
};

export default RealtimeOrderNotify;
