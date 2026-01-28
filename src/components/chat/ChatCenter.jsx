
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import ChatOrderSelector from './ChatOrderSelector';

export default function ChatCenter() {
    const [conversations, setConversations] = useState([]);
    const [activeConvId, setActiveConvId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [session, setSession] = useState(null);
    const [myShopIds, setMyShopIds] = useState([]); // [NEW] Track my shops

    // Attachment State
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [pendingAttachment, setPendingAttachment] = useState(null); // { type: 'image' | 'order', data: ... }

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // 1. Init Session & Check Params
    useEffect(() => {
        const init = async () => {
            // A. Check Supabase Session
            const { data: { session: sbSession } } = await supabase.auth.getSession();
            let currentUser = sbSession ? sbSession.user : null;

            // B. If no session, check Wallet
            if (!currentUser) {
                const walletAddress = localStorage.getItem('user_wallet');
                if (walletAddress) {
                    const { data: profile } = await supabase.from('profiles').select('id').eq('wallet_address', walletAddress).single();
                    if (profile) currentUser = { id: profile.id, role: 'authenticated' };
                }
            }

            if (!currentUser) {
                window.location.href = '/login';
                return;
            }

            setSession({ user: currentUser });
            fetchConversations(currentUser.id);
            fetchMyShops(currentUser.id); // [NEW] Fetch my shops

            // Check URL params
            const params = new URLSearchParams(window.location.search);
            const initialId = params.get('id');
            const targetShopId = params.get('shop_id');
            const targetShopName = params.get('shop_name');

            if (initialId) {
                setActiveConvId(initialId);
            } else if (targetShopId) {
                await handleShopContact(targetShopId, targetShopName, currentUser.id);
            }
        };
        init();
    }, []);

    // [NEW] Fetch shops owned by current user
    const fetchMyShops = async (userId) => {
        const { data } = await supabase.from('shops').select('id').eq('owner_id', userId);
        if (data) setMyShopIds(data.map(s => s.id));
    };

    const handleShopContact = async (shopId, shopName, myUserId) => {
        try {
            // A. Find Shop Owner
            const { data: shop, error: shopError } = await supabase
                .from('shops')
                .select('owner_id, name')
                .eq('id', shopId)
                .single();

            if (shopError || !shop) {
                console.error("Shop not found:", shopError);
                return;
            }

            if (shop.owner_id === myUserId) {
                alert("You cannot chat with yourself!");
                return;
            }

            // B. Check if conversation already exists
            const { data: myConvs } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', myUserId);

            if (myConvs && myConvs.length > 0) {
                const myConvIds = myConvs.map(c => c.conversation_id);

                // Check if shop owner is in any of these conversations
                const { data: existing } = await supabase
                    .from('conversation_participants')
                    .select('conversation_id')
                    .eq('user_id', shop.owner_id)
                    .in('conversation_id', myConvIds)
                    .single();

                if (existing) {
                    setActiveConvId(existing.conversation_id);
                    return;
                }
            }

            // C. Create New Conversation
            const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert({
                    title: shopName || shop.name || 'Shop Chat',
                    type: 'p2p',
                    metadata: { shop_id: shopId }
                })
                .select()
                .single();

            if (createError) throw createError;

            // D. Add Participants
            await supabase.from('conversation_participants').insert([
                { conversation_id: newConv.id, user_id: myUserId },
                { conversation_id: newConv.id, user_id: shop.owner_id }
            ]);

            // Refresh list and set active
            fetchConversations(myUserId);
            setActiveConvId(newConv.id);

        } catch (error) {
            console.error("Error initiating chat:", error);
            alert("Could not start chat. Please try again.");
        }
    };

    // 2. Fetch Conversation List & Subscribe
    const fetchConversations = async (userId) => {
        try {
            const { data: myConvs } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', userId);

            if (!myConvs || myConvs.length === 0) {
                setConversations([]);
                return;
            }

            const ids = myConvs.map(c => c.conversation_id);

            const { data: convs, error } = await supabase
                .from('conversations')
                .select(`
                    id, type, title, updated_at, metadata,
                    participants:conversation_participants(
                        user_id,
                        profile:profiles(full_name, avatar_url, email, wallet_address)
                    )
                `)
                .in('id', ids)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error("Error fetching chats:", error);
                return;
            }

            if (convs) {
                setConversations(convs);
            }
        } catch (err) {
            console.error("Fetch Exception:", err);
        }
    };

    // 3. Fetch Messages & Subscribe
    useEffect(() => {
        if (!activeConvId || !session) return;

        const loadMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', activeConvId)
                .order('created_at', { ascending: true });

            setMessages(data || []);
            scrollToBottom();
        };
        loadMessages();

        const channel = supabase
            .channel(`chat:${activeConvId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConvId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
                scrollToBottom();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [activeConvId, session]);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview locally
        const reader = new FileReader();
        reader.onload = (e) => {
            setPendingAttachment({
                type: 'image',
                preview: e.target.result,
                file: file
            });
        };
        reader.readAsDataURL(file);
    };

    const handleOrderSelect = (order) => {
        setPendingAttachment({
            type: 'order',
            data: order
        });
        setIsOrderModalOpen(false);
    };

    const clearAttachment = () => {
        setPendingAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if ((!input.trim() && !pendingAttachment) || !activeConvId || !session) return;
        if (uploading) return;

        setUploading(true);
        const content = input.trim();
        let imageUrl = null;
        let orderId = null;
        let msgType = 'text';
        let metadata = {};

        try {
            // A. Upload Image if present
            if (pendingAttachment?.type === 'image' && pendingAttachment.file) {
                const file = pendingAttachment.file;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                const filePath = `${activeConvId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('chat-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('chat-images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
                msgType = 'image';
            }

            // B. Attach Order if present
            if (pendingAttachment?.type === 'order') {
                orderId = pendingAttachment.data.id;
                msgType = 'order';
                metadata = { order_snapshot: { total: pendingAttachment.data.total_price, status: pendingAttachment.data.shipping_status } };
            }

            // C. Send Message
            const { error } = await supabase.from('messages').insert({
                conversation_id: activeConvId,
                sender_id: session.user.id,
                content: content || (msgType === 'image' ? 'Sent an image' : `Attached Order: ${orderId}`),
                image_url: imageUrl,
                order_id: orderId,
                type: msgType,
                metadata: metadata
            });

            if (error) throw error;

            setInput("");
            clearAttachment();

        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (!session) return <div className="p-10 text-center text-white">Loading Chat...</div>;

    const activeConv = conversations.find(c => c.id === activeConvId);

    return (
        <div className="flex h-[calc(100vh-80px)] bg-[#050505] overflow-hidden">
            {/* Sidebar */}
            <div className={`w-full md:w-80 bg-[#111] border-r border-white/10 flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-6 text-white/30 text-center text-sm">No conversations yet.</div>
                    ) : (
                        conversations.map(conv => {
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveConvId(conv.id)}
                                    className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${activeConvId === conv.id ? 'bg-white/5 border-l-2 border-l-[#D4AF37]' : ''}`}
                                >
                                    {(() => {
                                        // Calc Display Names
                                        let displayName = conv.title;
                                        let subTitle = conv.type;

                                        if (conv.type === 'p2p' && conv.participants) {
                                            const other = conv.participants.find(p => String(p.user_id) !== String(session.user.id));

                                            if (other && other.profile) {
                                                const personName = other.profile.full_name
                                                    || other.profile.email
                                                    || (other.profile.wallet_address ? "Meta Mask's Shop" : 'Customer');

                                                // Logic:
                                                // If I AM the seller (this conv is for one of my shops) -> Show Person Name on Top
                                                // If I AM the customer -> Show Shop Name on Top

                                                // Standardize: Always show User ID in subtitle
                                                subTitle = `ID: ${other.user_id}`;

                                                const shopIdStr = String(conv.metadata?.shop_id || '');
                                                const amISeller = shopIdStr && myShopIds.includes(shopIdStr);

                                                if (amISeller) {
                                                    // Seller View: Customer Name TOP
                                                    displayName = personName;
                                                } else {
                                                    // Customer View: Shop Name TOP
                                                    if (conv.title && conv.title !== 'Shop Chat') {
                                                        displayName = conv.title;
                                                    } else {
                                                        displayName = personName;
                                                    }
                                                }
                                            }
                                        }

                                        return (
                                            <>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className="text-white font-bold truncate pr-2">
                                                        {displayName || 'Conversation'}
                                                    </h4>
                                                    <span className="text-[10px] text-white/30 whitespace-nowrap">
                                                        {new Date(conv.updated_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded uppercase tracking-wider break-all">
                                                        {subTitle}
                                                    </span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#050505] relative ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
                {!activeConvId ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>Select a conversation to start chatting</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-6 border-b border-white/10 flex items-center gap-4 bg-[#111]/50 backdrop-blur-md">
                            <button onClick={() => setActiveConvId(null)} className="md:hidden text-white/50 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <div>
                                <h3 className="text-white font-bold">
                                    {(() => {
                                        if (!activeConv) return 'Chat';
                                        let name = activeConv.title;
                                        if (activeConv.type === 'p2p' && activeConv.participants) {
                                            const other = activeConv.participants.find(p => p.user_id !== session.user.id);
                                            if (other && other.profile) {
                                                const personName = other.profile.full_name
                                                    || other.profile.email
                                                    || (other.profile.wallet_address ? "Meta Mask's Shop" : 'Customer');

                                                const shopIdStr = String(activeConv.metadata?.shop_id || '');
                                                const amISeller = shopIdStr && myShopIds.includes(shopIdStr);

                                                if (amISeller) {
                                                    name = personName;
                                                } else {
                                                    // Prioritize Shop Name (Title) for Customer View if it's set
                                                    if (activeConv.title && activeConv.title !== 'Shop Chat') {
                                                        name = activeConv.title;
                                                    } else {
                                                        name = personName;
                                                    }
                                                }
                                            }
                                        }
                                        return name || 'Chat';
                                    })()}
                                </h3>
                                <span className="text-xs text-[#D4AF37] opacity-80 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Online
                                </span>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender_id === session.user.id;
                                return (
                                    <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] md:max-w-[50%] p-3 rounded-2xl text-sm leading-relaxed space-y-2 ${isMe ? 'bg-[#D4AF37] text-black rounded-tr-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-[#222] text-white rounded-tl-sm border border-white/10'}`}>
                                            {/* Image Attachment */}
                                            {msg.image_url && (
                                                <div className="rounded-lg overflow-hidden mb-1 border border-black/10">
                                                    <a href={msg.image_url} target="_blank" rel="noopener noreferrer">
                                                        <img src={msg.image_url} alt="Attachment" className="max-w-full h-auto object-cover max-h-60 cursor-pointer hover:scale-105 transition-transform" />
                                                    </a>
                                                </div>
                                            )}

                                            {/* Order Attachment */}
                                            {(msg.order_id || msg.type === 'order') && (
                                                <div className={`p-3 rounded-xl border ${isMe ? 'bg-black/10 border-black/10' : 'bg-black/40 border-white/10'}`}>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMe ? 'bg-black/20 text-black' : 'bg-white/10 text-white'}`}>
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-xs uppercase tracking-wider opacity-60">Order</div>
                                                            <div className="font-mono text-xs truncate font-bold">{msg.order_id}</div>
                                                        </div>
                                                    </div>
                                                    {isMe ? (
                                                        <a href={`/seller/orders?id=${msg.order_id}`} className="text-xs font-bold underline opacity-70 hover:opacity-100">View Details</a>
                                                    ) : (
                                                        <a href="/profile?tab=history" className="text-xs font-bold underline opacity-70 hover:opacity-100">View My Orders</a>
                                                    )}
                                                </div>
                                            )}

                                            {/* Text Content */}
                                            {msg.content && (!msg.image_url && !msg.order_id ? (
                                                <p>{msg.content}</p>
                                            ) : msg.content !== 'Sent an image' && !msg.content.startsWith('Attached Order:') && (
                                                <p className="pt-1">{msg.content}</p>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        {/* Input Area */}
                        <div className="p-4 md:p-6 bg-[#111] border-t border-white/10 relative">
                            {/* Pending Attachment Preview */}
                            {pendingAttachment && (
                                <div className="absolute bottom-full left-0 w-full bg-[#111]/95 backdrop-blur border-t border-white/10 p-3 px-6 flex items-center justify-between animate-fade-in-up">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                            {pendingAttachment.type === 'image' ? (
                                                <img src={pendingAttachment.preview} className="w-full h-full object-cover" />
                                            ) : (
                                                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold">
                                                {pendingAttachment.type === 'image' ? 'Send Image' : `Attach Order #${pendingAttachment.data.id}`}
                                            </p>
                                            <p className="text-white/40 text-xs">
                                                {pendingAttachment.type === 'image' ? 'Image selected' : 'Order details will be shared'}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={clearAttachment} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}

                            <form onSubmit={sendMessage} className="flex gap-4 max-w-4xl mx-auto items-end">
                                {/* Attachment Actions */}
                                <div className="flex gap-2 pb-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                                        title="Attach Image"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsOrderModalOpen(true)}
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                                        title="Attach Order"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    </button>
                                </div>

                                <div className="flex-1 relative">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={pendingAttachment ? "Add a message..." : "Type your message..."}
                                        className="w-full bg-[#222] border border-white/10 rounded-full pl-6 pr-12 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={(!input.trim() && !pendingAttachment) || uploading}
                                    className="bg-[#D4AF37] text-black w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] shrink-0"
                                >
                                    {uploading ? (
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Order Selector Modal */}
                        {isOrderModalOpen && session && (
                            <ChatOrderSelector
                                userId={session.user.id}
                                onSelect={handleOrderSelect}
                                onClose={() => setIsOrderModalOpen(false)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
