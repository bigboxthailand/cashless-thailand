import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CY66lzGI.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
export { renderers } from '../../renderers.mjs';

function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id);
      fetchConversations();
    };
    init();
    const channel = supabase.channel("admin_conversations").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "conversations" },
      () => fetchConversations()
    ).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);
  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
      const channel = subscribeToMessages(selectedConvId);
      return () => supabase.removeChannel(channel);
    }
  }, [selectedConvId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const [unreadCounts, setUnreadCounts] = useState({});
  useEffect(() => {
    if (selectedConvId) {
      markAsRead(selectedConvId);
    }
  }, [selectedConvId]);
  const fetchConversations = async () => {
    try {
      const { data: convs, error } = await supabase.from("conversations").select(`
                    id, updated_at, type,
                    conversation_participants (
                        user_id,
                        profiles ( full_name, email, wallet_address )
                    )
                `).eq("type", "support").order("updated_at", { ascending: false });
      if (error) throw error;
      setConversations(convs || []);
      const { data: unreadData } = await supabase.from("messages").select("conversation_id").eq("is_read", false).eq("is_admin", false);
      if (unreadData) {
        const counts = {};
        unreadData.forEach((m) => {
          counts[m.conversation_id] = (counts[m.conversation_id] || 0) + 1;
        });
        setUnreadCounts(counts);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchMessages = async (convId) => {
    const { data, error } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true });
    if (data) setMessages(data);
  };
  const subscribeToMessages = (convId) => {
    return supabase.channel(`admin_chat:${convId}`).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${convId}` },
      (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        if (!payload.new.is_admin) {
          markAsRead(convId);
        }
      }
    ).subscribe();
  };
  const markAsRead = async (convId) => {
    setUnreadCounts((prev) => ({ ...prev, [convId]: 0 }));
    await supabase.from("messages").update({ is_read: true }).eq("conversation_id", convId).eq("is_read", false).eq("is_admin", false);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedConvId) return;
    const content = inputValue.trim();
    setInputValue("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const senderId = session?.user?.id || null;
      const { error } = await supabase.from("messages").insert([{
        conversation_id: selectedConvId,
        sender_id: senderId,
        content,
        is_admin: true
        // Mark as admin message
      }]);
      if (error) throw error;
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send");
    }
  };
  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from("conversations").delete().eq("id", convId);
      if (error) throw error;
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (selectedConvId === convId) setSelectedConvId(null);
    } catch (err) {
      console.error("Error deleting conversation:", err);
      alert("Failed to delete conversation");
    }
  };
  const getCustomerName = (conv) => {
    if (!conv || !conv.conversation_participants) return "Unknown User";
    const customerParticipant = conv.conversation_participants.find((p) => p.user_id !== currentUserId);
    if (!customerParticipant?.profiles) return "Unknown User";
    const { full_name, email, wallet_address } = customerParticipant.profiles;
    return full_name || email || (wallet_address ? "Meta Mask's Shop" : "Unknown User");
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-[calc(100vh-120px)] bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 border-r border-white/10 bg-[#0A0A0A] flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-white/10", children: /* @__PURE__ */ jsx("h2", { className: "text-white font-bold uppercase tracking-wider text-sm", children: "Active Chats" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-4 text-white/30 text-center text-sm", children: "Loading..." }) : conversations.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-4 text-white/30 text-center text-sm", children: "No active chats" }) : conversations.map((conv) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => setSelectedConvId(conv.id),
          className: `relative w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${selectedConvId === conv.id ? "bg-[#D4AF37]/10 border-l-4 border-l-[#D4AF37]" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-1 pr-6", children: [
              /* @__PURE__ */ jsx("span", { className: `font-bold text-sm ${selectedConvId === conv.id ? "text-[#D4AF37]" : "text-white"}`, children: getCustomerName(conv) }),
              unreadCounts[conv.id] > 0 && /* @__PURE__ */ jsx("span", { className: "ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full", children: unreadCounts[conv.id] }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-white/30 ml-auto", children: new Date(conv.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/50 truncate", children: "Click to view conversation" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => handleDeleteConversation(e, conv.id),
                className: "absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all",
                title: "Delete Conversation",
                children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                  /* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
                  /* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
                  /* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" })
                ] })
              }
            )
          ]
        },
        conv.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col bg-[#111]", children: selectedConvId ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-white/10 bg-[#161616] flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-white font-bold", children: [
          "Chat with ",
          /* @__PURE__ */ jsx("span", { className: "text-[#D4AF37]", children: getCustomerName(conversations.find((c) => c.id === selectedConvId)) })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20", children: "Live" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [
        messages.map((msg) => {
          const isAdmin = msg.is_admin;
          return /* @__PURE__ */ jsx("div", { className: `flex ${isAdmin ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxs("div", { className: `max-w-[70%] rounded-2xl p-3 text-sm ${isAdmin ? "bg-[#D4AF37] text-black rounded-tr-none" : "bg-white/10 text-white rounded-tl-none"}`, children: [
            (msg.order_id || msg.metadata?.order_id) && /* @__PURE__ */ jsxs(
              "div",
              {
                className: "mb-2 bg-black/20 rounded p-2 flex items-center gap-2 cursor-pointer hover:bg-black/40 transition-colors",
                onClick: () => window.open(`/admin/orders?search=${msg.order_id || msg.metadata?.order_id}`, "_blank"),
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center text-black font-bold text-xs", children: "ORD" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("p", { className: "font-bold text-xs", children: [
                      "Order #",
                      (msg.order_id || msg.metadata?.order_id || "").slice(0, 8)
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] opacity-70", children: "Click to view details" })
                  ] })
                ]
              }
            ),
            (msg.image_url || msg.attachment_url) && /* @__PURE__ */ jsx("div", { className: "mb-2 rounded-lg overflow-hidden border border-black/10", children: /* @__PURE__ */ jsx("a", { href: msg.image_url || msg.attachment_url, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx("img", { src: msg.image_url || msg.attachment_url, alt: "Attachment", className: "max-w-[200px] max-h-[200px] object-cover hover:scale-105 transition-transform" }) }) }),
            /* @__PURE__ */ jsx("p", { children: msg.content }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] mt-1 opacity-50 ${isAdmin ? "text-black" : "text-white"}`, children: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
          ] }) }, msg.id);
        }),
        /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSendMessage, className: "p-4 bg-[#161616] border-t border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value),
            placeholder: "Type your reply...",
            className: "flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: !inputValue.trim(),
            className: "px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50",
            children: "Send"
          }
        )
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-white/30", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 mb-4 opacity-50", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1", d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }),
      /* @__PURE__ */ jsx("p", { children: "Select a conversation to start chatting" })
    ] }) })
  ] });
}

const $$Chat = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Support Chat" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <div class="flex justify-between items-center"> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Support Tickets
</h1> </div> ${renderComponent($$result2, "AdminChatComponent", AdminChat, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/admin/AdminChat.jsx", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/chat.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/chat.astro";
const $$url = "/admin/chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Chat,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
