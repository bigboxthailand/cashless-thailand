import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SellerCTA() {
    const [status, setStatus] = useState('loading'); // loading, guest, seller, pending, user
    const [shopSlug, setShopSlug] = useState('');

    useEffect(() => {
        checkStatus();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            checkStatus();
        });

        // Listen for wallet changes (custom event or polling if needed, but simple check is ok for now)
        window.addEventListener('storage', checkStatus);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('storage', checkStatus);
        };
    }, []);

    const checkStatus = async () => {
        const walletAddress = localStorage.getItem('user_wallet');
        const { data: { session } } = await supabase.auth.getSession();

        if (!session && !walletAddress) {
            setStatus('guest');
            return;
        }

        let userId = session?.user?.id;

        // If wallet user, find profile first
        if (!userId && walletAddress) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('wallet_address', walletAddress)
                .single();

            if (profile) userId = profile.id;
        }

        if (userId) {
            // Check if user has a shop
            const { data: shop } = await supabase
                .from('shops')
                .select('status, slug')
                .eq('owner_id', userId)
                .single();

            if (shop) {
                setShopSlug(shop.slug);
                if (shop.status === 'active') {
                    setStatus('seller');
                } else {
                    setStatus('pending');
                }
            } else {
                setStatus('user');
            }
        } else {
            setStatus('guest');
        }
    };

    if (status === 'loading' || status === 'guest') return null;

    if (status === 'seller') {
        return (
            <a
                href="/seller/dashboard"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/50 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]"
            >
                <span className="relative z-10">MY SHOP</span>
            </a>
        );
    }

    if (status === 'pending') {
        return (
            <a
                href="/seller/pending"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
                <span className="relative z-10 animate-pulse">Pending Review</span>
            </a>
        );
    }

    return (
        <a
            href="/seller/register"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/50 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]"
        >
            <span className="relative z-10">Start Selling</span>
        </a>
    );
}
