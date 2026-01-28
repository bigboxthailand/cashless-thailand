import { e as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate, f as createAstro, h as addAttribute, k as renderComponent, o as renderHead, p as renderSlot } from './astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$ClientRouter } from './ClientRouter_C1rCoDYq.mjs';
/* empty css                        */
/* empty css                            */
import 'clsx';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { s as supabase } from './supabase_BcyI2ayE.mjs';

const $$CartDrawer = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="cart-drawer-container" class="fixed inset-0 z-[200] pointer-events-none invisible transition-all duration-300" data-astro-cid-fwi5d3ie> <div id="cart-backdrop" class="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 pointer-events-auto" data-astro-cid-fwi5d3ie></div> <div id="cart-panel" class="absolute top-0 right-0 h-full w-full md:w-[450px] bg-[#0A0A0A] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transform translate-x-full transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-auto flex flex-col" data-astro-cid-fwi5d3ie> <div class="h-20 px-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-md" data-astro-cid-fwi5d3ie> <h2 class="text-xl font-black tracking-widest text-white uppercase flex items-center gap-3" data-astro-cid-fwi5d3ie> <span class="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" data-astro-cid-fwi5d3ie></span>
Shopping Cart
</h2> <button id="close-cart-btn" class="p-2 text-white/50 hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-white/5" data-astro-cid-fwi5d3ie> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-fwi5d3ie><path d="M18 6 6 18" data-astro-cid-fwi5d3ie></path><path d="m6 6 12 12" data-astro-cid-fwi5d3ie></path></svg> </button> </div> <div id="cart-items-container" class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" data-astro-cid-fwi5d3ie></div> <div class="p-6 border-t border-white/5 bg-black/80 backdrop-blur-md" data-astro-cid-fwi5d3ie> <div class="flex justify-between items-end mb-6" data-astro-cid-fwi5d3ie> <span class="text-white/50 text-sm uppercase tracking-wider" data-astro-cid-fwi5d3ie>Subtotal</span> <div class="text-right" data-astro-cid-fwi5d3ie> <div id="cart-total" class="text-2xl font-black text-white" data-astro-cid-fwi5d3ie>
0 THB
</div> <div id="cart-sats" class="text-xs text-[#D4AF37] tracking-widest" data-astro-cid-fwi5d3ie>
≈ 0 SATS
</div> </div> </div> <button id="checkout-btn" class="w-full bg-[#D4AF37] hover:bg-[#B3932D] text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none" data-astro-cid-fwi5d3ie>
Checkout Now
</button> </div> </div> </div>  ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/CartDrawer.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/CartDrawer.astro", void 0);

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      if (session2) fetchSupportConversation(session2.user.id);
    });
  }, []);
  useEffect(() => {
    if (conversationId) {
      const channel = supabase.channel(`chat:${conversationId}`).on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        scrollToBottom();
        if (!isOpen) {
          setHasUnread(true);
        }
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, isOpen]);
  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const fetchSupportConversation = async (userId) => {
    const { data: participations } = await supabase.from("conversation_participants").select("conversation_id, conversation:conversations(id, type)").eq("user_id", userId);
    const supportConv = participations?.find((p) => p.conversation?.type === "support");
    if (supportConv) {
      setConversationId(supportConv.conversation.id);
      fetchMessages(supportConv.conversation.id);
    }
  };
  const fetchMessages = async (convId) => {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true });
    setMessages(data || []);
    scrollToBottom();
  };
  const startSupportChat = async () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    const { data: conv, error } = await supabase.from("conversations").insert({ type: "support", title: "Support Chat" }).select().single();
    if (conv) {
      await supabase.from("conversation_participants").insert({
        conversation_id: conv.id,
        user_id: session.user.id
      });
      setConversationId(conv.id);
      setMessages([]);
    }
    setLoading(false);
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversationId || !session) return;
    const content = input.trim();
    setInput("");
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: session.user.id,
      content
    });
    if (error) {
      console.error("Send failed", error);
    }
  };
  if (!session) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-50", children: [
    !isOpen && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          setIsOpen(true);
          setHasUnread(false);
        },
        className: "w-14 h-14 bg-[#D4AF37] hover:bg-white rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-90 group relative",
        children: [
          /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-6 h-6 text-black", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }),
          hasUnread && /* @__PURE__ */ jsxs("span", { className: "absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3", children: [
            /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }),
            /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-red-500" })
          ] })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "w-[350px] h-[500px] bg-[#111] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-[#0a0a0a] p-4 border-b border-white/10 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-white", children: "Support" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(false), className: "text-white/50 hover:text-white", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-black/50", children: [
        !conversationId ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-white/60 text-sm", children: "Need help with an order?" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: startSupportChat,
              disabled: loading,
              className: "px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-full hover:scale-105 transition-transform",
              children: loading ? "Starting..." : "Start Chat"
            }
          )
        ] }) : messages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-white/30 text-xs mt-10", children: "Start the conversation..." }) : messages.map((msg) => {
          const isMe = msg.sender_id === session.user.id;
          return /* @__PURE__ */ jsx("div", { className: `flex ${isMe ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsx("div", { className: `max-w-[80%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-[#D4AF37] text-black rounded-tr-none" : "bg-white/10 text-white rounded-tl-none"}`, children: msg.content }) }, msg.id);
        }),
        /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
      ] }),
      conversationId && /* @__PURE__ */ jsxs("form", { onSubmit: sendMessage, className: "p-4 bg-[#0a0a0a] border-t border-white/10 flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: input,
            onChange: (e) => setInput(e.target.value),
            placeholder: "Type a message...",
            className: "flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm focus:border-[#D4AF37] outline-none"
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: !input.trim(), className: "bg-[#D4AF37] text-black p-2 rounded-full hover:scale-110 disabled:opacity-50 disabled:scale-100 transition-all", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }) }) })
      ] })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Cashless Thailand - The Future of Digital Finance"
  } = Astro2.props;
  return renderTemplate`<html lang="th" class="bg-[#050505] scroll-smooth"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/images/ui/favicon.svg"><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@100;300;400;500;600;700&family=Inter:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,900&display=swap" rel="stylesheet">${renderComponent($$result, "ViewTransitions", $$ClientRouter, {})}${renderHead()}</head> <body class="text-white/90 antialiased selection:bg-[#D4AF37] selection:text-black cursor-none overflow-x-hidden"> <div class="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div> <div id="cursor" class="fixed w-8 h-8 border border-[#D4AF37] rounded-full pointer-events-none z-[10000] transition-transform duration-75 ease-out scale-0 md:block hidden mix-blend-difference"></div> <div id="cursor-dot" class="fixed w-1.5 h-1.5 bg-[#D4AF37] rounded-full pointer-events-none z-[10000] md:block hidden mix-blend-difference"></div> <div class="relative z-10 flex flex-col min-h-screen"> ${renderSlot($$result, $$slots["default"])} </div> ${renderScript($$result, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")} ${renderComponent($$result, "CartDrawer", $$CartDrawer, {})} ${renderComponent($$result, "ChatWidget", ChatWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/chat/ChatWidget.jsx", "client:component-export": "default" })} </body></html>`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/layouts/Layout.astro", void 0);

export { $$Layout as $, $$CartDrawer as a };
