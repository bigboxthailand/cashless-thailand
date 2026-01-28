
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Check for redirect parameter in URL
                const urlParams = new URLSearchParams(window.location.search);
                const redirectTo = urlParams.get('redirect') || '/profile';
                window.location.href = redirectTo;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectTo = urlParams.get('redirect') || '/profile';

            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}${redirectTo}`,
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
                        {isLogin ? 'Welcome Back' : 'Join the Revolution'}
                    </h2>
                    <p className="text-white/50 text-sm">
                        {isLogin ? 'Sign in to access your account' : 'Create your account to start shopping'}
                    </p>
                </div>

                {/* Social Login */}
                <div className="space-y-3 mb-8">
                    <button
                        onClick={() => handleSocialLogin('google')}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Continue with Google
                    </button>

                    <button
                        onClick={() => handleSocialLogin('facebook')}
                        className="w-full bg-[#1877F2] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#166fe5] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.654h4.286l-.76 3.667h-3.526v7.98H9.101Z" /></svg>
                        Continue with Facebook
                    </button>

                    <button
                        onClick={() => handleSocialLogin('line')}
                        className="w-full bg-[#06C755] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#05b34c] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .648.256.648.574v3.126c0 .318-.299.574-.648.574-.348 0-.648-.256-.648-.574v-3.126c0-.318.3-.574.648-.574zM4 12c0-4.075 3.582-7.379 8-7.379 4.418 0 8 3.304 8 7.379S16.418 19.379 12 19.379c-1.348 0-2.623-.312-3.766-.864l-2.079.578c-.68.188-1.127-.589-.757-1.1l.995-1.37C4.945 15.394 4 13.784 4 12zm8.567-2.137h-3.134c-.349 0-.648.256-.648.574v3.126c0 .318.299.574.648.574.348 0 .648-.256.648-.574v-1.74h1.838c.349 0 .648-.256.648-.574 0-.317-.299-.574-.648-.574h-1.838v-0.237h2.486c.349 0 .648-.256.648-.574 0-.317-.299-.575-.648-.575zM12 9.863c-.349 0-.648.256-.648.574v3.126c0 .318.299.574.648.574.348 0 .648-.256.648-.574V9.863zm5.086 2.552l-1.636-2.247c-.124-.173-.243-.277-.458-.293-.335-.026-.648.232-.648.558v3.14c0 .319.299.574.648.574.349 0 .648-.256.648-.574v-1.956l1.621 2.222c.113.15.267.247.46.262.336.026.648-.231.648-.557l-.001-3.153c0-.319-.299-.574-.648-.574-.349 0-.648.256-.648.574v2.014z" /></svg>
                        Continue with Line
                    </button>

                    <button
                        onClick={async () => {
                            if (typeof window.ethereum !== 'undefined') {
                                try {
                                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                                    localStorage.setItem('user_wallet', accounts[0]);
                                    window.location.reload();
                                } catch (err) {
                                    alert('ไม่สามารถเชื่อมต่อกระเป๋าเงินได้: ' + err.message);
                                }
                            } else {
                                alert('กรุณาติดตั้ง Metamask ก่อนใช้งาน!');
                            }
                        }}
                        className="w-full bg-[#F6851B] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#e27613] transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.378 11.232l-2.07-5.06-2.528-1.127.351-1.408c.14-.528.07-.845-.14-.986-.176-.14-.563-.07-1.02.14l-4.116 1.83-4.116-1.83c-.457-.21-1.23-.281-1.02.14l.351 1.408-2.528 1.127-2.07 5.06c-.317.774-.14 1.83.42 2.393l4.742 4.083.493 2.076c.14.634.704 1.126 1.337 1.126h5.836c.633 0 1.196-.492 1.337-1.126l.492-2.076 4.742-4.083c.563-.563.738-1.62.42-2.393zM10.865 7.185l1.09-1.09 1.09 1.09.281 1.9-1.372 1.548-1.371-1.548.282-1.9zm-4.36 4.962l-.774-3.098 3.378-1.513-1.02 4.152-1.584.458zm5.451 7.214l-.387-1.62h3.905l-.386 1.62H11.956zm2.815-3.026l-1.337 1.373-1.442-1.302-1.442 1.302-1.337-1.373-.633-3.414 1.97-2.217h3.378l1.97 2.217-.633 3.414zm.81-4.645l-1.02-4.152 3.378 1.513-.775 3.097-1.583-.458z" /></svg>
                        เข้าสู่ระบบด้วย Metamask
                    </button>
                </div>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#111] text-white/40">Or continue with email</span></div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-xs">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-[#b89530] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-white/60 hover:text-[#D4AF37] text-sm transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
