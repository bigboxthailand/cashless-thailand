
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AuthModal from './AuthModal';

export default function UserMenu() {
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
        const { data } = await supabase.from('profiles').select('avatar_url, first_name').eq('id', userId).single();
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

    // Helper to truncate address
    const shortAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

    if (session || wallet) {
        return (
            <div className="relative group">
                <a href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-xs overflow-hidden border border-[#D4AF37]">
                        {session ? (
                            profile?.avatar_url ? (
                                <img src={profile.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                                <span>{profile?.first_name?.[0] || session.user.email[0].toUpperCase()}</span>
                            )
                        ) : (
                            // Wallet Icon / Avatar
                            <span className="text-[10px]">0x</span>
                        )}
                    </div>
                </a>

                {/* Dropdown for Logout (Optional but good UX) */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-xs font-bold truncate">
                            {session ? (profile?.first_name || 'User') : 'Metamask User'}
                        </p>
                        <p className="text-white/40 text-[10px] truncate">
                            {session ? session.user.email : shortAddress(wallet)}
                        </p>
                    </div>
                    {session && (
                        <a href="/profile" className="block px-4 py-3 text-white/70 hover:text-[#D4AF37] hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-colors">
                            My Profile
                        </a>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="text-xs font-bold uppercase tracking-widest text-white/90 hover:text-[#D4AF37] transition-colors"
            >
                Login
            </button>
            <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
