
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AuthModal from './AuthModal';

export default function MobileUserMenu() {
    const [session, setSession] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // 1. Check Supabase Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
            else setProfile(null);
        });

        // 2. Check Local Wallet (Metamask)
        const storedWallet = localStorage.getItem('user_wallet');
        if (storedWallet) {
            setWallet(storedWallet);
        }

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        const { data } = await supabase.from('profiles').select('avatar_url, full_name').eq('id', userId).single();
        setProfile(data);
    };

    const handleLogout = async () => {
        if (session) {
            await supabase.auth.signOut();
        } else if (wallet) {
            localStorage.removeItem('user_wallet');
            setWallet(null);
            window.location.reload();
        }
    };

    // Shared styling for mobile links
    const linkClass = "mobile-nav-link text-3xl font-black text-white hover:text-[#D4AF37] transition-colors tracking-widest uppercase flex items-center justify-center gap-3 group w-full cursor-pointer";
    const dotLeft = <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]">•</span>;
    const dotRight = <span className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]">•</span>;

    // Helper to close mobile menu (simulated by triggering click on a link which Navbar.astro observes)
    // Note: Navbar.astro listens to .mobile-nav-link clicks to close the menu.

    if (session || wallet) {
        return (
            <>
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
