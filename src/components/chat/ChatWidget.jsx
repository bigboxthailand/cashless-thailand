
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [session, setSession] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            // 1. Check Supabase Session
            const { data: { session: sbSession } } = await supabase.auth.getSession();
            let currentUser = sbSession?.user || null;

            // 2. If no session, check Wallet
            if (!currentUser) {
                const walletAddress = localStorage.getItem('user_wallet');
                if (walletAddress) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('wallet_address', walletAddress)
                        .single();

                    if (profile) {
                        currentUser = { id: profile.id, role: 'authenticated' };
                    }
                }
            }

            if (currentUser) {
                setSession({ user: currentUser });
                fetchSupportConversation(currentUser.id);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (conversationId) {
            // Subscribe to real-time messages
            const channel = supabase
                .channel(`chat:${conversationId}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    scrollToBottom();
                    if (!isOpen) {
                        setHasUnread(true);
                    }
                })
                .subscribe();

            return () => { supabase.removeChannel(channel); }
        }
    }, [conversationId, isOpen]);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    const fetchSupportConversation = async (userId) => {
        // Find existing 'support' type conversation for this user
        // Complex query: Join participants.
        // For simplicity, we assume we store 'support_user_ID' in metadata or just query by type 'support' where I am participant

        // Supabase Query: Conversations I am in AND type = 'support'
        const { data: participations } = await supabase
            .from('conversation_participants')
            .select('conversation_id, conversation:conversations(id, type)')
            .eq('user_id', userId);

        // @ts-ignore
        const supportConv = participations?.find(p => p.conversation?.type === 'support');

        if (supportConv) {
            // @ts-ignore
            setConversationId(supportConv.conversation.id);
            fetchMessages(supportConv.conversation.id);
        }
    };

    const fetchMessages = async (convId) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });
        setMessages(data || []);
        scrollToBottom();
    };

    const startSupportChat = async () => {
        if (!session) {
            window.location.href = '/login';
            return;
        }
        setLoading(true);

        // Create Conversation
        const { data: conv, error } = await supabase
            .from('conversations')
            .insert({ type: 'support', title: 'Support Chat' })
            .select()
            .single();

        if (conv) {
            // Add Self
            await supabase.from('conversation_participants').insert({
                conversation_id: conv.id,
                user_id: session.user.id
            });
            // Add Admin? (We don't know admin ID yet, maybe admin auto-joins or we have a "system" user)
            // For now, just create meaningful room. Admin dashboard will list all support chats.

            setConversationId(conv.id);
            setMessages([]);
        }
        setLoading(false);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !conversationId || !session) return;

        const content = input.trim();
        setInput(""); // Optimistic clear

        const { error } = await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_id: session.user.id,
            content: content
        });

        if (error) {
            console.error("Send failed", error);
            // Optionally restore input
        }
    };

    if (!session) return null; // Or show "Login to Chat" button

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setHasUnread(false);
                    }}
                    className="w-14 h-14 bg-[#D4AF37] hover:bg-white rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-90 group relative"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>

                    {/* Notification Badge */}
                    {hasUnread && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] h-[500px] bg-[#111] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-[#0a0a0a] p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <h3 className="font-bold text-white">Support</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50">
                        {!conversationId ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <p className="text-white/60 text-sm">Need help with an order?</p>
                                <button
                                    onClick={startSupportChat}
                                    disabled={loading}
                                    className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-full hover:scale-105 transition-transform"
                                >
                                    {loading ? 'Starting...' : 'Start Chat'}
                                </button>
                            </div>
                        ) : (
                            messages.length === 0 ? (
                                <p className="text-center text-white/30 text-xs mt-10">Start the conversation...</p>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === session.user.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-[#D4AF37] text-black rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                                                {/* Order Attachment */}
                                                {msg.metadata?.order_id && (
                                                    <div className={`mb-2 rounded p-2 flex items-center gap-2 cursor-pointer transition-colors ${isMe ? 'bg-black/10 hover:bg-black/20' : 'bg-black/30 hover:bg-black/50'}`}
                                                        onClick={() => window.open(`/profile?order=${msg.metadata.order_id}`, '_blank')}>
                                                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${isMe ? 'bg-black text-[#D4AF37]' : 'bg-[#D4AF37] text-black'}`}>
                                                            ORD
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-xs">Order #{msg.metadata.order_id.slice(0, 8)}</p>
                                                            <p className="text-[10px] opacity-70">Click to view</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Image Attachment */}
                                                {msg.attachment_url && (
                                                    <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                                                        <img src={msg.attachment_url} alt="Attachment" className="max-w-full h-auto object-cover" />
                                                    </div>
                                                )}

                                                {msg.content}
                                            </div>
                                        </div>
                                    )
                                })
                            )
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    {conversationId && (
                        <form onSubmit={sendMessage} className="p-4 bg-[#0a0a0a] border-t border-white/10 flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm focus:border-[#D4AF37] outline-none"
                            />
                            <button type="submit" disabled={!input.trim()} className="bg-[#D4AF37] text-black p-2 rounded-full hover:scale-110 disabled:opacity-50 disabled:scale-100 transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
