
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';

export default function MobileUserMenu() {
    const [session, setSession] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState(null);
    const [shop, setShop] = useState(null);

    useEffect(() => {
        // 1. Check Supabase Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id, null);
                fetchShop(session.user.id);
            } else {
                const storedWallet = localStorage.getItem('user_wallet');
                if (storedWallet) {
                    setWallet(storedWallet);
                    fetchProfile(null, storedWallet);
                }
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id, null);
                fetchShop(session.user.id);
            } else {
                setProfile(null);
                setShop(null);
                const storedWallet = localStorage.getItem('user_wallet');
                if (storedWallet) {
                    setWallet(storedWallet);
                    fetchProfile(null, storedWallet);
                } else {
                    setWallet(null);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId, walletAddr) => {
        try {
            let query = supabase.from('profiles').select('id, avatar_url, full_name');
            if (userId) query = query.eq('id', userId);
            else if (walletAddr) query = query.eq('wallet_address', walletAddr.toLowerCase());

            const { data } = await query.single();
            if (data) {
                setProfile(data);
                if (!userId) fetchShop(data.id);
            }
        } catch (err) {
            console.error("Error fetching mobile profile:", err);
        }
    };

    const fetchShop = async (userId) => {
        if (!userId) return;
        const { data } = await supabase.from('shops').select('status, name').eq('owner_id', userId).single();
        setShop(data);
    };

    const handleLogout = async () => {
        if (session) {
            await supabase.auth.signOut();
        } else if (wallet) {
            localStorage.removeItem('user_wallet');
            setWallet(null);
            setProfile(null);
            setShop(null);
            window.location.reload();
        }
    };

    // Shared styling for mobile links
    const linkClass = "mobile-nav-link text-3xl font-black text-white hover:text-[#D4AF37] transition-colors tracking-widest uppercase flex items-center justify-center gap-3 group w-full cursor-pointer";
    const shopLinkClass = "mobile-nav-link text-3xl font-black text-[#D4AF37] hover:text-white transition-colors tracking-widest uppercase flex items-center justify-center gap-3 group w-full cursor-pointer";
    const dotLeft = <div className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-2 h-2 bg-[#D4AF37] rounded-full"></div>;
    const dotRight = <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-2 h-2 bg-[#D4AF37] rounded-full"></div>;

    if (session || wallet) {
        return (
            <>
                {shop && (
                    <div className="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[250ms] w-full text-center">
                        <a href={shop.status === 'active' ? "/seller/dashboard" : "/seller/pending"} className={shopLinkClass}>
                            {dotLeft}
                            {shop.status === 'active' ? 'Seller Center' : 'Shop Pending'}
                            {dotRight}
                        </a>
                    </div>
                )}
                {!shop && (profile || session) && (
                    <div className="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[250ms] w-full text-center">
                        <a href="/seller/register" className={shopLinkClass}>
                            {dotLeft}
                            Start Selling
                            {dotRight}
                        </a>
                    </div>
                )}
                <div className="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[300ms] w-full text-center">
                    <a href="/profile" className={linkClass}>
                        {dotLeft}
                        My Profile
                        {dotRight}
                    </a>
                </div>
                <div className="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[350ms] w-full text-center">
                    <button onClick={handleLogout} className={linkClass}>
                        {dotLeft}
                        <span className="text-red-500 group-hover:text-red-400">Logout</span>
                        {dotRight}
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[300ms] w-full text-center">
                <button
                    onClick={() => setShowModal(true)}
                    className={linkClass}
                >
                    {dotLeft}
                    Login / Register
                    {dotRight}
                </button>
            </div>
            <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
