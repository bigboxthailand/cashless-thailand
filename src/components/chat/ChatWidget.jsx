
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import ChatOrderSelector from './ChatOrderSelector';
import EmojiPicker from './EmojiPicker';
import { checkAILimit, formatLimitMessage } from '../../lib/aiRateLimit';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [session, setSession] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showOrderSelector, setShowOrderSelector] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // [NEW] Widget visibility state
    const [aiLimitInfo, setAiLimitInfo] = useState(null); // AI rate limit info
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            const { data: { session: sbSession } } = await supabase.auth.getSession();
            let currentUser = sbSession?.user || null;

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
        const { data: participations } = await supabase
            .from('conversation_participants')
            .select('conversation_id, conversation:conversations(id, type)')
            .eq('user_id', userId);

        const supportConv = participations?.find(p => p.conversation?.type === 'support');

        if (supportConv) {
            setConversationId(supportConv.conversation.id);
            fetchMessages(supportConv.conversation.id);
            // Check AI limit for this conversation
            checkAILimit(userId, supportConv.conversation.id).then(setAiLimitInfo);
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

        const { data: conv } = await supabase
            .from('conversations')
            .insert({ type: 'support', title: 'Support Chat' })
            .select()
            .single();

        if (conv) {
            await supabase.from('conversation_participants').insert({
                conversation_id: conv.id,
                user_id: session.user.id
            });

            setConversationId(conv.id);
            setMessages([]);
            // Check AI limit for new conversation
            checkAILimit(session.user.id, conv.id).then(setAiLimitInfo);
        }
        setLoading(false);
    };

    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || !conversationId || !session) return;

        const content = input.trim();
        setInput("");
        setShowEmojiPicker(false);

        const { error } = await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_id: session.user.id,
            content: content,
            is_admin: false
        });

        if (error) console.error("Send failed", error);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !conversationId || !session) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${conversationId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('chat-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('chat-images')
                .getPublicUrl(filePath);

            await supabase.from('messages').insert({
                conversation_id: conversationId,
                sender_id: session.user.id,
                content: "Sent an image",
                type: 'image',
                image_url: publicUrl,
                attachment_url: publicUrl, // For compatibility
                is_admin: false
            });

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleOrderSelect = async (order) => {
        if (!conversationId || !session) return;

        await supabase.from('messages').insert({
            conversation_id: conversationId,
            sender_id: session.user.id,
            content: `Attached Order #${order.id.slice(0, 8)}`,
            type: 'order',
            order_id: order.id,
            metadata: { order_id: order.id },
            is_admin: false
        });

        setShowOrderSelector(false);
    };

    if (!session || !isVisible) return null; // Hide if not visible

    return (
        <div className="fixed bottom-6 right-6 z-50">
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

                    {hasUnread && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </button>
            )}

            {isOpen && (
                <div className="w-[350px] h-[500px] bg-[#111] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up md:w-[380px]">
                    <div className="bg-[#0a0a0a] p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <h3 className="font-bold text-white">Support</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {session && (
                                <button
                                    onClick={() => window.location.href = '/profile?tab=chat'}
                                    className="text-white/50 hover:text-[#D4AF37] transition-colors p-1"
                                    title="Open Full Chat"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </button>
                            )}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-white/50 hover:text-red-500 transition-colors p-1"
                                title="Hide Chat Widget (Refresh to show again)"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors p-1" title="Minimize">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* AI Limit Warning Banner */}
                    {aiLimitInfo && aiLimitInfo.remaining <= 30 && (
                        <div className={`px-4 py-2 border-b flex items-center gap-2 ${
                            aiLimitInfo.remaining === 0 
                                ? 'bg-red-500/10 border-red-500/20' 
                                : aiLimitInfo.remaining <= 10
                                    ? 'bg-orange-500/10 border-orange-500/20'
                                    : 'bg-yellow-500/10 border-yellow-500/20'
                        }`}>
                            <svg className={`w-4 h-4 ${
                                aiLimitInfo.remaining === 0 
                                    ? 'text-red-400' 
                                    : aiLimitInfo.remaining <= 10
                                        ? 'text-orange-400'
                                        : 'text-yellow-400'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className={`text-xs ${
                                aiLimitInfo.remaining === 0 
                                    ? 'text-red-300' 
                                    : aiLimitInfo.remaining <= 10
                                        ? 'text-orange-300'
                                        : 'text-yellow-300'
                            }`}>
                                {formatLimitMessage(aiLimitInfo.remaining)}
                            </p>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50 relative">
                        {!conversationId ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-6">
                                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-2 animate-pulse">
                                    <span className="text-3xl">🤖</span>
                                </div>
                                <div className="text-sm prose prose-invert max-w-none">
                                    <ReactMarkdown>Ready</ReactMarkdown>
                                </div>
                                <div className="text-sm prose prose-invert max-w-none">
                                    <ReactMarkdown>ถามได้ทุกเรื่อง! ทั้งวิธีใช้งานระบบ, รายละเอียดสินค้า, หรือติดตามสถานะออเดอร์</ReactMarkdown>
                                </div>
                                <button
                                    onClick={startSupportChat}
                                    disabled={loading}
                                    className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    {loading ? (
                                        <span>Connecting...</span>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                            <span>Start Chatting</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => {
                                    // isMe = true if I sent it (is_admin = false)
                                    // isMe = false if admin sent it (is_admin = true)
                                    const isMe = !msg.is_admin;

                                    // Handle Sticker Message Type
                                    if (msg.type === 'sticker' || (msg.metadata && msg.metadata.type === 'sticker')) {
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                                                <div className="max-w-[120px] hover:scale-105 transition-transform">
                                                    <img
                                                        src={msg.content || msg.image_url}
                                                        alt="Sticker"
                                                        className="w-full h-auto object-contain drop-shadow-lg"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-[#D4AF37] text-black rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                                                {(msg.metadata?.order_id || msg.order_id) && (
                                                    <div className={`mb-2 rounded p-2 flex items-center gap-2 cursor-pointer transition-colors ${isMe ? 'bg-black/10 hover:bg-black/20' : 'bg-black/30 hover:bg-black/50'}`}
                                                        onClick={() => window.open(`/profile?order=${msg.metadata?.order_id || msg.order_id}`, '_blank')}>
                                                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${isMe ? 'bg-black text-[#D4AF37]' : 'bg-[#D4AF37] text-black'}`}>
                                                            ORD
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-xs">Order #{(msg.metadata?.order_id || msg.order_id || '').slice(0, 8)}</p>
                                                            <p className="text-[10px] opacity-70">Click to view</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {(msg.attachment_url || msg.image_url) && (
                                                    <div className="mb-2 rounded-lg overflow-hidden border border-black/10 bg-black/20">
                                                        <img src={msg.attachment_url || msg.image_url} alt="Attachment" className="max-w-full h-auto object-cover" />
                                                    </div>
                                                )}

                                                {msg.content}
                                                <div className={`text-[9px] mt-1 opacity-40 text-right ${isMe ? 'text-black' : 'text-white'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Emoji Picker Popover */}
                    {showEmojiPicker && (
                        <EmojiPicker
                            onEmojiSelect={(emoji) => {
                                setInput(prev => prev + emoji);
                                // Don't close immediately allows multiple emoji
                            }}
                            onStickerSelect={async (sticker) => {
                                setShowEmojiPicker(false);
                                // Send sticker as a message with type 'sticker'
                                if (!conversationId || !session) return;

                                await supabase.from('messages').insert({
                                    conversation_id: conversationId,
                                    sender_id: session.user.id,
                                    content: sticker.url, // Store URL in content for simplicity or use metadata
                                    type: 'sticker',
                                    metadata: { type: 'sticker', sticker_id: sticker.id },
                                    is_admin: false
                                });
                            }}
                            onClose={() => setShowEmojiPicker(false)}
                        />
                    )}

                    {conversationId && (
                        <div className="p-3 bg-[#0a0a0a] border-t border-white/10 space-y-3 relative z-[60]">
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Image
                                </button>
                                <button
                                    onClick={() => setShowOrderSelector(true)}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    Order
                                </button>
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className={`p-1.5 rounded text-white/50 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${showEmojiPicker ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 hover:bg-white/10'}`}
                                >
                                    <span className="text-sm">😊</span>
                                    Emoji
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isUploading ? "Uploading..." : "Type a message..."}
                                    disabled={isUploading}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm focus:border-[#D4AF37] outline-none disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isUploading}
                                    className="bg-[#D4AF37] text-black p-2 rounded-full hover:scale-110 disabled:opacity-50 disabled:scale-100 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )
            }

            {
                showOrderSelector && (
                    <ChatOrderSelector
                        userId={session.user.id}
                        onSelect={handleOrderSelect}
                        onClose={() => setShowOrderSelector(false)}
                    />
                )
            }
        </div >
    );
}
