import { e as createComponent, m as maybeRenderHead, k as renderComponent, l as renderScript, r as renderTemplate } from './astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_BcyI2ayE.mjs';
/* empty css                            */

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!isOpen) return null;
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { error: error2 } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error2) throw error2;
        window.location.reload();
      } else {
        const { error: error2 } = await supabase.auth.signUp({
          email,
          password
        });
        if (error2) throw error2;
        alert("Check your email for the confirmation link!");
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
      const { error: error2 } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error2) throw error2;
    } catch (err) {
      setError(err.message);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/80 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(212,175,55,0.1)]", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 text-white/50 hover:text-white",
          children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("path", { d: "M18 6 6 18" }),
            /* @__PURE__ */ jsx("path", { d: "m6 6 12 12" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-white uppercase tracking-widest mb-2", children: isLogin ? "Welcome Back" : "Join the Revolution" }),
        /* @__PURE__ */ jsx("p", { className: "text-white/50 text-sm", children: isLogin ? "Sign in to access your account" : "Create your account to start shopping" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-8", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleSocialLogin("google"),
            className: "w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors",
            children: [
              /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }),
                /* @__PURE__ */ jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
                /* @__PURE__ */ jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }),
                /* @__PURE__ */ jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })
              ] }),
              "Continue with Google"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleSocialLogin("facebook"),
            className: "w-full bg-[#1877F2] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#166fe5] transition-colors",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.654h4.286l-.76 3.667h-3.526v7.98H9.101Z" }) }),
              "Continue with Facebook"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleSocialLogin("line"),
            className: "w-full bg-[#06C755] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#05b34c] transition-colors",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M19.365 9.863c.349 0 .648.256.648.574v3.126c0 .318-.299.574-.648.574-.348 0-.648-.256-.648-.574v-3.126c0-.318.3-.574.648-.574zM4 12c0-4.075 3.582-7.379 8-7.379 4.418 0 8 3.304 8 7.379S16.418 19.379 12 19.379c-1.348 0-2.623-.312-3.766-.864l-2.079.578c-.68.188-1.127-.589-.757-1.1l.995-1.37C4.945 15.394 4 13.784 4 12zm8.567-2.137h-3.134c-.349 0-.648.256-.648.574v3.126c0 .318.299.574.648.574.348 0 .648-.256.648-.574v-1.74h1.838c.349 0 .648-.256.648-.574 0-.317-.299-.574-.648-.574h-1.838v-0.237h2.486c.349 0 .648-.256.648-.574 0-.317-.299-.575-.648-.575zM12 9.863c-.349 0-.648.256-.648.574v3.126c0 .318.299.574.648.574.348 0 .648-.256.648-.574V9.863zm5.086 2.552l-1.636-2.247c-.124-.173-.243-.277-.458-.293-.335-.026-.648.232-.648.558v3.14c0 .319.299.574.648.574.349 0 .648-.256.648-.574v-1.956l1.621 2.222c.113.15.267.247.46.262.336.026.648-.231.648-.557l-.001-3.153c0-.319-.299-.574-.648-.574-.349 0-.648.256-.648.574v2.014z" }) }),
              "Continue with Line"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: async () => {
              if (typeof window.ethereum !== "undefined") {
                try {
                  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                  localStorage.setItem("user_wallet", accounts[0]);
                  window.location.reload();
                } catch (err) {
                  alert("ไม่สามารถเชื่อมต่อกระเป๋าเงินได้: " + err.message);
                }
              } else {
                alert("กรุณาติดตั้ง Metamask ก่อนใช้งาน!");
              }
            },
            className: "w-full bg-[#F6851B] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#e27613] transition-colors",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M21.378 11.232l-2.07-5.06-2.528-1.127.351-1.408c.14-.528.07-.845-.14-.986-.176-.14-.563-.07-1.02.14l-4.116 1.83-4.116-1.83c-.457-.21-1.23-.281-1.02.14l.351 1.408-2.528 1.127-2.07 5.06c-.317.774-.14 1.83.42 2.393l4.742 4.083.493 2.076c.14.634.704 1.126 1.337 1.126h5.836c.633 0 1.196-.492 1.337-1.126l.492-2.076 4.742-4.083c.563-.563.738-1.62.42-2.393zM10.865 7.185l1.09-1.09 1.09 1.09.281 1.9-1.372 1.548-1.371-1.548.282-1.9zm-4.36 4.962l-.774-3.098 3.378-1.513-1.02 4.152-1.584.458zm5.451 7.214l-.387-1.62h3.905l-.386 1.62H11.956zm2.815-3.026l-1.337 1.373-1.442-1.302-1.442 1.302-1.337-1.373-.633-3.414 1.97-2.217h3.378l1.97 2.217-.633 3.414zm.81-4.645l-1.02-4.152 3.378 1.513-.775 3.097-1.583-.458z" }) }),
              "เข้าสู่ระบบด้วย Metamask"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-white/10" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ jsx("span", { className: "px-2 bg-[#111] text-white/40", children: "Or continue with email" }) })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-xs", children: error }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleEmailAuth, className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            placeholder: "Email address",
            className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            placeholder: "Password",
            className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true
          }
        ) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-[#b89530] transition-colors disabled:opacity-50",
            children: loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsLogin(!isLogin),
          className: "text-white/60 hover:text-[#D4AF37] text-sm transition-colors",
          children: isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"
        }
      ) })
    ] })
  ] });
}

function UserMenu() {
  const [session, setSession] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      if (session2) fetchProfile(session2.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session2) => {
      setSession(session2);
      if (session2) fetchProfile(session2.user.id);
      else setProfile(null);
    });
    const storedWallet = localStorage.getItem("user_wallet");
    if (storedWallet) {
      setWallet(storedWallet);
    }
    return () => subscription.unsubscribe();
  }, []);
  const fetchProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("avatar_url, full_name").eq("id", userId).single();
    setProfile(data);
  };
  const handleLogout = async () => {
    if (session) {
      await supabase.auth.signOut();
    } else if (wallet) {
      localStorage.removeItem("user_wallet");
      setWallet(null);
      window.location.reload();
    }
  };
  const shortAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  if (session || wallet) {
    return /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsx("a", { href: "/profile", className: "flex items-center gap-3 hover:opacity-80 transition-opacity", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-xs overflow-hidden border border-[#D4AF37]", children: session ? profile?.avatar_url ? /* @__PURE__ */ jsx("img", { src: profile.avatar_url, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("span", { children: profile?.full_name?.[0] || session.user.email[0].toUpperCase() }) : (
        // Wallet Icon / Avatar
        /* @__PURE__ */ jsx("span", { className: "text-[10px]", children: "0x" })
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-white/5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-white text-xs font-bold truncate", children: session ? profile?.full_name || "User" : "Metamask User" }),
          /* @__PURE__ */ jsx("p", { className: "text-white/40 text-[10px] truncate", children: session ? session.user.email : shortAddress(wallet) })
        ] }),
        session && /* @__PURE__ */ jsx("a", { href: "/profile", className: "block px-4 py-3 text-white/70 hover:text-[#D4AF37] hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-colors", children: "My Profile" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleLogout,
            className: "w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-colors",
            children: "Sign Out"
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setShowModal(true),
        className: "text-xs font-bold uppercase tracking-widest text-white/90 hover:text-[#D4AF37] transition-colors",
        children: "Login"
      }
    ),
    /* @__PURE__ */ jsx(AuthModal, { isOpen: showModal, onClose: () => setShowModal(false) })
  ] });
}

function MobileUserMenu() {
  const [session, setSession] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      if (session2) fetchProfile(session2.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session2) => {
      setSession(session2);
      if (session2) fetchProfile(session2.user.id);
      else setProfile(null);
    });
    const storedWallet = localStorage.getItem("user_wallet");
    if (storedWallet) {
      setWallet(storedWallet);
    }
    return () => subscription.unsubscribe();
  }, []);
  const fetchProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("avatar_url, full_name").eq("id", userId).single();
    setProfile(data);
  };
  const handleLogout = async () => {
    if (session) {
      await supabase.auth.signOut();
    } else if (wallet) {
      localStorage.removeItem("user_wallet");
      setWallet(null);
      window.location.reload();
    }
  };
  const linkClass = "mobile-nav-link text-3xl font-black text-white hover:text-[#D4AF37] transition-colors tracking-widest uppercase flex items-center justify-center gap-3 group w-full cursor-pointer";
  const dotLeft = /* @__PURE__ */ jsx("span", { className: "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]", children: "•" });
  const dotRight = /* @__PURE__ */ jsx("span", { className: "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]", children: "•" });
  if (session || wallet) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[300ms] w-full text-center", children: /* @__PURE__ */ jsxs("a", { href: "/profile", className: linkClass, children: [
        dotLeft,
        "My Profile",
        dotRight
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[350ms] w-full text-center", children: /* @__PURE__ */ jsxs("button", { onClick: handleLogout, className: linkClass, children: [
        dotLeft,
        /* @__PURE__ */ jsx("span", { className: "text-red-500 group-hover:text-red-400", children: "Logout" }),
        dotRight
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[300ms] w-full text-center", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setShowModal(true),
        className: linkClass,
        children: [
          dotLeft,
          "Login / Register",
          dotRight
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(AuthModal, { isOpen: showModal, onClose: () => setShowModal(false) })
  ] });
}

function SellerCTA() {
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    checkStatus();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkStatus();
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setStatus("guest");
      return;
    }
    const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", session.user.id).single();
    if (shop) {
      setStatus("seller");
    } else {
      setStatus("user");
    }
  };
  if (status === "loading" || status === "seller") return null;
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: "/seller/register",
      className: "hidden md:flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/50 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]",
      children: /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Start Selling" })
    }
  );
}

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b border-white/5 bg-[#050505]" id="main-nav" data-astro-cid-5blmo7yk> <div class="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl transition-all duration-500 pointer-events-none overflow-hidden" id="nav-glass" data-astro-cid-5blmo7yk></div> <div class="absolute inset-0 pointer-events-none overflow-hidden z-0 mix-blend-screen" data-astro-cid-5blmo7yk> <canvas id="quantum-canvas" class="w-full h-full" data-astro-cid-5blmo7yk></canvas> </div> <div class="max-w-[1800px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between relative z-10 transition-all duration-500 pointer-events-none" id="nav-content" data-astro-cid-5blmo7yk> <a href="/" class="group relative flex items-center gap-3 pointer-events-auto" data-astro-cid-5blmo7yk> <img src="/images/ui/logo.webp" alt="Cashless Thailand Logo" class="h-10 w-auto object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]" data-astro-cid-5blmo7yk> </a> <div class="hidden lg:flex items-center gap-10 pointer-events-auto" data-astro-cid-5blmo7yk> <a href="/" class="shimmer-link eng text-xs font-bold uppercase tracking-widest text-white/90" data-astro-cid-5blmo7yk> <span class="relative z-10" data-astro-cid-5blmo7yk>Home</span> </a> <div class="relative group h-24 flex items-center" data-astro-cid-5blmo7yk> <a href="/shop" class="shimmer-link eng text-xs font-bold uppercase tracking-widest text-white/90 flex items-center gap-1" data-astro-cid-5blmo7yk> <span class="relative z-10 flex items-center gap-1" data-astro-cid-5blmo7yk>
Shop
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-180 transition-transform duration-500 text-[#D4AF37]" data-astro-cid-5blmo7yk><path d="m6 9 6 6 6-6" data-astro-cid-5blmo7yk></path></svg> </span> </a> <div class="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-4" data-astro-cid-5blmo7yk> <div class="bg-[#0a0a0a]/90 border border-[#D4AF37]/30 rounded-2xl p-2 min-w-[240px] shadow-[0_0_30px_rgba(212,175,55,0.1)] backdrop-blur-2xl flex flex-col relative overflow-hidden" data-astro-cid-5blmo7yk> <a href="/shop" class="px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 flex items-center justify-between group/item mb-1 transition-colors relative overflow-hidden" data-astro-cid-5blmo7yk> <span class="text-white text-xs font-black uppercase tracking-widest relative z-10" data-astro-cid-5blmo7yk>All Products</span> <svg class="w-4 h-4 text-[#D4AF37] -translate-x-2 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5blmo7yk><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" data-astro-cid-5blmo7yk></path></svg> </a> <div class="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mx-2 mb-2" data-astro-cid-5blmo7yk></div> <a href="/shop#clock" class="px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 text-white/70 hover:text-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-3 relative overflow-hidden group/item" data-astro-cid-5blmo7yk> <svg class="w-4 h-4 text-white/30 group-hover/item:text-[#D4AF37] transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5blmo7yk><circle cx="12" cy="12" r="10" data-astro-cid-5blmo7yk></circle><polyline points="12 6 12 12 16 14" data-astro-cid-5blmo7yk></polyline></svg> <span class="relative z-10" data-astro-cid-5blmo7yk>CryptoClock</span> </a> <a href="/shop#kiosk" class="px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 text-white/70 hover:text-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-3 relative overflow-hidden group/item" data-astro-cid-5blmo7yk> <svg class="w-4 h-4 text-white/30 group-hover/item:text-[#D4AF37] transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5blmo7yk><rect x="2" y="3" width="20" height="14" rx="2" ry="2" data-astro-cid-5blmo7yk></rect><line x1="8" y1="21" x2="16" y2="21" data-astro-cid-5blmo7yk></line><line x1="12" y1="17" x2="12" y2="21" data-astro-cid-5blmo7yk></line></svg> <span class="relative z-10" data-astro-cid-5blmo7yk>BiTTerm</span> </a> <a href="/shop#pos" class="px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 text-white/70 hover:text-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-3 relative overflow-hidden group/item" data-astro-cid-5blmo7yk> <svg class="w-4 h-4 text-white/30 group-hover/item:text-[#D4AF37] transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5blmo7yk><rect x="1" y="4" width="22" height="16" rx="2" ry="2" data-astro-cid-5blmo7yk></rect><line x1="1" y1="10" x2="23" y2="10" data-astro-cid-5blmo7yk></line></svg> <span class="relative z-10" data-astro-cid-5blmo7yk>BiTPos</span> </a> <a href="/shop#node" class="px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 text-white/70 hover:text-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-3 relative overflow-hidden group/item" data-astro-cid-5blmo7yk> <svg class="w-4 h-4 text-white/30 group-hover/item:text-[#D4AF37] transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5blmo7yk><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" data-astro-cid-5blmo7yk></path><line x1="8" y1="16" x2="8.01" y2="16" data-astro-cid-5blmo7yk></line><line x1="8" y1="20" x2="8.01" y2="20" data-astro-cid-5blmo7yk></line><line x1="12" y1="18" x2="12.01" y2="18" data-astro-cid-5blmo7yk></line><line x1="12" y1="22" x2="12.01" y2="22" data-astro-cid-5blmo7yk></line><line x1="16" y1="16" x2="16.01" y2="16" data-astro-cid-5blmo7yk></line><line x1="16" y1="20" x2="16.01" y2="20" data-astro-cid-5blmo7yk></line></svg> <span class="relative z-10" data-astro-cid-5blmo7yk>BiTNode</span> </a> </div> </div> </div> <a href="/course" class="shimmer-link eng text-xs font-bold uppercase tracking-widest text-white/90" data-astro-cid-5blmo7yk> <span class="relative z-10" data-astro-cid-5blmo7yk>Courses</span> </a> <a href="/blog" class="shimmer-link eng text-xs font-bold uppercase tracking-widest text-white/90" data-astro-cid-5blmo7yk> <span class="relative z-10" data-astro-cid-5blmo7yk>Knowledge</span> </a> </div> <div class="flex items-center gap-4 md:gap-6 pointer-events-auto" data-astro-cid-5blmo7yk> ${renderComponent($$result, "SellerCTA", SellerCTA, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/SellerCTA", "client:component-export": "default", "data-astro-cid-5blmo7yk": true })} <div class="hidden md:block" data-astro-cid-5blmo7yk> ${renderComponent($$result, "UserMenu", UserMenu, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/UserMenu", "client:component-export": "default", "data-astro-cid-5blmo7yk": true })} </div> <button id="cart-trigger" class="relative group p-3 hover:bg-[#D4AF37]/10 rounded-xl transition-all duration-300 border border-transparent hover:border-[#D4AF37]/30" data-astro-cid-5blmo7yk> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/90 group-hover:text-[#D4AF37] transition-colors duration-300" data-astro-cid-5blmo7yk><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" data-astro-cid-5blmo7yk></path><path d="M3 6h18" data-astro-cid-5blmo7yk></path><path d="M16 10a4 4 0 0 1-8 0" data-astro-cid-5blmo7yk></path></svg> <span id="cart-badge" class="cart-count absolute top-0 right-0 w-5 h-5 bg-[#D4AF37] text-black text-[10px] font-black flex items-center justify-center rounded-full transform scale-0 transition-all duration-500 shadow-[0_0_15px_#D4AF37] border border-black" data-astro-cid-5blmo7yk>0</span> </button> <button id="mobile-menu-trigger" class="lg:hidden group p-2 relative w-10 h-10 flex flex-col justify-center items-center gap-[6px] border border-white/10 rounded-lg hover:border-[#D4AF37]/50 transition-all" data-astro-cid-5blmo7yk> <span class="hamburger-line w-6 h-[2px] bg-white/90 block transition-all duration-300 origin-center group-hover:bg-[#D4AF37]" data-astro-cid-5blmo7yk></span> <span class="hamburger-line w-6 h-[2px] bg-white/90 block transition-all duration-300 origin-center group-hover:bg-[#D4AF37]" data-astro-cid-5blmo7yk></span> <span class="hamburger-line w-6 h-[2px] bg-white/90 block transition-all duration-300 origin-center group-hover:bg-[#D4AF37]" data-astro-cid-5blmo7yk></span> </button> </div> </div> </nav> <div id="mobile-menu" class="fixed inset-0 z-[200] pointer-events-none invisible transition-all duration-500" data-astro-cid-5blmo7yk> <div id="mobile-menu-backdrop" class="absolute inset-0 bg-[#050505]/70 backdrop-blur-md opacity-0 transition-all duration-500" data-astro-cid-5blmo7yk></div> <div id="mobile-menu-panel" class="absolute top-0 right-0 h-full w-full bg-[#050505] transform translate-x-full transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col pointer-events-auto z-10 shadow-[-30px_0_80px_rgba(0,0,0,0.8)] overflow-hidden" data-astro-cid-5blmo7yk> <div class="absolute inset-0 pointer-events-none z-0" data-astro-cid-5blmo7yk> <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:30px_30px] animate-grid-scroll" data-astro-cid-5blmo7yk></div> <div class="absolute -top-1/4 -right-1/4 w-[300px] h-[300px] bg-[#D4AF37]/20 blur-[80px] rounded-full animate-pulse-slow" data-astro-cid-5blmo7yk></div> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[100px] rounded-full" data-astro-cid-5blmo7yk></div> </div> <div class="w-full px-6 h-24 flex items-center justify-between border-b border-white/10 relative z-10 bg-black/50 backdrop-blur-md" data-astro-cid-5blmo7yk> <img src="/images/ui/logo.webp" alt="Cashless Thailand Logo" class="h-10 w-auto object-contain" data-astro-cid-5blmo7yk> <button id="close-mobile-menu" class="text-white/80 hover:text-[#D4AF37] transition-all p-3 border border-white/10 rounded-lg hover:border-[#D4AF37]/50 active:scale-90" data-astro-cid-5blmo7yk> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5blmo7yk><path d="M18 6 6 18" data-astro-cid-5blmo7yk></path><path d="m6 6 12 12" data-astro-cid-5blmo7yk></path></svg> </button> </div> <div class="flex-1 flex flex-col justify-center items-center p-8 gap-10 relative z-10 w-full" data-astro-cid-5blmo7yk> <div class="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[100ms] w-full text-center" data-astro-cid-5blmo7yk> <a href="/" class="mobile-nav-link text-4xl font-black text-white hover:text-[#D4AF37] transition-colors tracking-widest uppercase flex items-center justify-center gap-3 group" data-astro-cid-5blmo7yk> <span class="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" data-astro-cid-5blmo7yk>•</span>
Home
<span class="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" data-astro-cid-5blmo7yk>•</span> </a> </div> <div class="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[150ms] w-full text-center" data-astro-cid-5blmo7yk> <a href="/shop" class="mobile-nav-link text-4xl font-black text-white hover:text-[#D4AF37] transition-colors tracking-widest uppercase flex items-center justify-center gap-3 group" data-astro-cid-5blmo7yk> <span class="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" data-astro-cid-5blmo7yk>•</span>
Shop
<span class="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" data-astro-cid-5blmo7yk>•</span> </a> </div> <div class="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[200ms] w-full text-center" data-astro-cid-5blmo7yk> <a href="/course" class="mobile-nav-link text-4xl font-black text-white hover:text-[#D4AF37] transition-colors tracking-widest uppercase flex items-center justify-center gap-3 group" data-astro-cid-5blmo7yk> <span class="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" data-astro-cid-5blmo7yk>•</span>
Courses
<span class="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" data-astro-cid-5blmo7yk>•</span> </a> </div> <div class="mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[250ms] w-full text-center" data-astro-cid-5blmo7yk> <a href="/blog" class="mobile-nav-link text-4xl font-black text-white hover:text-[#D4AF37] transition-colors tracking-widest uppercase flex items-center justify-center gap-3 group" data-astro-cid-5blmo7yk> <span class="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" data-astro-cid-5blmo7yk>•</span>
Knowledge
<span class="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" data-astro-cid-5blmo7yk>•</span> </a> </div> ${renderComponent($$result, "MobileUserMenu", MobileUserMenu, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/MobileUserMenu", "client:component-export": "default", "data-astro-cid-5blmo7yk": true })} </div> <div class="p-8 border-t border-white/5 bg-black/50 backdrop-blur-md relative z-10 mobile-link-item translate-y-12 opacity-0 transition-all duration-500 delay-[350ms]" data-astro-cid-5blmo7yk> <a href="https://linktr.ee/CryptoClock" target="_blank" class="flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 group active:bg-[#D4AF37]/20 transition-all" data-astro-cid-5blmo7yk> <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" data-astro-cid-5blmo7yk></span> <span class="eng text-sm font-bold uppercase tracking-widest text-[#D4AF37]" data-astro-cid-5blmo7yk>Support Terminal</span> </a> </div> </div> </div>  ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/Navbar.astro", void 0);

export { $$Navbar as $ };
