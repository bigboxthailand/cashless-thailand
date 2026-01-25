import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [conversationId, setConversationId] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Unread Count State
    const [unreadCount, setUnreadCount] = useState(0);
    const userRef = useRef(null);
    const isOpenRef = useRef(isOpen);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // New Feature States
    const [orders, setOrders] = useState([]);
    const [showOrderSelector, setShowOrderSelector] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // --- New Feature Handlers ---

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.8);
                };
            };
        });
    };

    const handleFileUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        try {
            // Compress and Show Preview Only
            const compressedBlob = await compressImage(file);
            const url = URL.createObjectURL(compressedBlob);

            setSelectedFile(compressedBlob);
            setPreviewUrl(url);

            // Reset input so same file can be selected again if needed
            e.target.value = '';
        } catch (error) {
            console.error("Compression failed", error);
        }
    };

    const clearPreview = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const fetchOrders = async () => {
        if (!user) return;
        console.log("Fetching orders for user:", user.id);
        setShowOrderSelector(true);
        if (orders.length > 0) return; // Cache simple

        const { data, error } = await supabase
            .from('orders')
            .select('id, total_price, order_items(title)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        console.log("Orders fetched:", data, "Error:", error);

        if (data) setOrders(data);
    };

    const sendOrderLink = async (order) => {
        await sendMessage({
            content: `Linked Order #${order.id.slice(0, 8)}`,
            metadata: { order_id: order.id }
        });
        setShowOrderSelector(false);
    };

    // Refactored sendMessage to accept overrides
    const sendMessage = async ({ content, attachment_url = null, metadata = null }) => {
        if (!conversationId || !user) return;

        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content: content,
                    attachment_url,
                    metadata
                }]);

            if (error) throw error;
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUser(session.user);
            fetchConversation(session.user.id);
        } else {
            setLoading(false);
        }
    };

    const fetchConversation = async (userId) => {
        try {
            // Find existing support conversation
            const { data: convs } = await supabase
                .from('conversation_participants')
                .select('conversation_id, conversations(type)')
                .eq('user_id', userId);

            let activeConvId = null;

            if (convs && convs.length > 0) {
                for (let c of convs) {
                    if (c.conversations?.type === 'support') {
                        activeConvId = c.conversation_id;
                        break;
                    }
                }
            }

            if (activeConvId) {
                setConversationId(activeConvId);
                fetchMessages(activeConvId, userId);
                subscribeToMessages(activeConvId);
            }
        } catch (error) {
            console.error("Error fetching conversation:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && conversationId) {
            markMessagesAsRead();
        }
        scrollToBottom();
    }, [messages, isOpen]);

    const markMessagesAsRead = async () => {
        if (!conversationId || !user) return;

        // Optimistic update
        setUnreadCount(0);

        await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', user.id) // Mark admins' messages as read
            .eq('is_read', false);
    };

    // Corrected fetchMessages to accept userId to avoid state race condition
    const fetchMessages = async (convId, currentUserId = user?.id) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

        if (data) {
            setMessages(data);
            if (currentUserId) {
                const unread = data.filter(m => m.sender_id !== currentUserId && !m.is_read).length;
                setUnreadCount(unread);
            }
        }
    };

    const subscribeToMessages = (convId) => {
        const channel = supabase
            .channel(`chat:${convId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    // Increment unread if chat is closed and message is NOT from me OR is from admin
                    // Use refs to avoid stale closures
                    if (!isOpenRef.current && (payload.new.sender_id !== userRef.current?.id || payload.new.is_admin)) {
                        setUnreadCount(prev => prev + 1);
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        // Allow sending if there is text OR a file
        if ((!inputValue.trim() && !selectedFile) || !user) return;

        const content = inputValue.trim() || (selectedFile ? "Sent an image" : "");
        setInputValue("");

        let attachmentUrl = null;

        try {
            if (selectedFile) {
                setUploading(true);
                const fileName = `${Date.now()}-img.jpg`;
                const compressedFile = new File([selectedFile], fileName, { type: 'image/jpeg' });

                const { error: uploadError } = await supabase.storage
                    .from('chat-attachments')
                    .upload(fileName, compressedFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('chat-attachments').getPublicUrl(fileName);
                attachmentUrl = data.publicUrl;

                clearPreview();
            }

            let currentConvId = conversationId;

            // 0. Ensure Profile Exists (Self-Repair)
            const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
            if (!profile) {
                console.log("Profile missing, attempting to create...");
                await supabase.from('profiles').insert([{
                    id: user.id,
                    email: user.email,
                    full_name: user?.user_metadata?.full_name || 'User',
                    created_at: new Date().toISOString()
                }]);
            }

            // Create conversation if doesn't exist
            if (!currentConvId) {
                // 1. Create Conversation
                const { data: newConv, error: convError } = await supabase
                    .from('conversations')
                    .insert([{ type: 'support' }])
                    .select()
                    .single();

                if (convError) throw convError;
                currentConvId = newConv.id;
                setConversationId(currentConvId);

                // 2. Add Participant
                await supabase
                    .from('conversation_participants')
                    .insert([{ conversation_id: currentConvId, user_id: user.id }]);

                // Subscribe now
                subscribeToMessages(currentConvId);
            }

            // Send Message
            const { error: msgError } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: currentConvId,
                    sender_id: user.id,
                    content: content,
                    attachment_url: attachmentUrl
                }]);

            if (msgError) throw msgError;

        } catch (error) {
            console.error("Error sending message:", error);
            alert(`Failed to send message: ${error.message || error.error_description || JSON.stringify(error)}`);
        } finally {
            setUploading(false);
        }
    };

    if (!user && !loading) {
        // Option: Show nothing, or show "Login to Chat"
        return (
            <div className="fixed bottom-6 right-6 z-50">
                {isOpen && (
                    <div className="absolute bottom-16 right-0 w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-4 text-center">
                        <p className="text-white mb-2">Please login to chat with us.</p>
                        <a href="/login" className="block w-full py-2 bg-[#D4AF37] text-black font-bold rounded">Login</a>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 md:w-96 h-[500px] bg-[#111] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#1A1A1A] p-4 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-white">Support Chat</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-white/50">We're online</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">✕</button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50">
                            {messages.length === 0 ? (
                                <div className="text-center text-white/30 mt-10">
                                    <p>👋 Hello! How can we help you today?</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === user?.id; // Or if msg.is_admin is false and we are user
                                    const isMyMessage = msg.sender_id === user?.id && !msg.is_admin;

                                    return (
                                        <div key={msg.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${isMyMessage
                                                ? 'bg-[#D4AF37] text-black rounded-tr-none'
                                                : 'bg-white/10 text-white rounded-tl-none'
                                                }`}>

                                                {/* Order Card Attachment */}
                                                {msg.metadata?.order_id && (
                                                    <div className="mb-2 bg-black/10 rounded p-2 flex items-center gap-2 cursor-pointer border border-black/5">
                                                        <div className="w-8 h-8 bg-black/20 rounded flex items-center justify-center text-[10px] font-bold">
                                                            ORD
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-xs">Order #{msg.metadata.order_id.slice(0, 8)}</p>
                                                            <p className="text-[10px] opacity-70">Linked to chat</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Image Attachment */}
                                                {msg.attachment_url && (
                                                    <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                                                        <img src={msg.attachment_url} alt="Attachment" className="max-w-[200px] max-h-[200px] object-cover" />
                                                    </div>
                                                )}

                                                <p>{msg.content}</p>
                                                <div className={`text-[10px] mt-1 opacity-50 ${isMyMessage ? 'text-black' : 'text-white'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Order Selector Overlay */}
                        <AnimatePresence>
                            {showOrderSelector && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    className="absolute inset-x-0 bottom-[70px] bg-[#1A1A1A] border-t border-white/10 rounded-t-xl p-4 shadow-xl z-50 max-h-[300px] overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">Select Order</h4>
                                        <button onClick={() => setShowOrderSelector(false)} className="text-white/50 hover:text-white">✕</button>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="text-center py-8 text-white/30 text-xs">No recent orders found.</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {orders.map(order => (
                                                <button
                                                    key={order.id}
                                                    onClick={() => sendOrderLink(order)}
                                                    className="w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 flex justify-between items-center group transition-colors"
                                                >
                                                    <div>
                                                        <div className="text-[#D4AF37] font-bold text-xs">#{order.id.slice(0, 8)}...</div>
                                                        <div className="text-[10px] text-white/50">{order.items?.[0]?.title} {order.items?.length > 1 ? `+${order.items.length - 1} more` : ''}</div>
                                                    </div>
                                                    <div className="text-xs font-bold text-white mb-0.5">{Number(order.total_price).toLocaleString()} ฿</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Image Preview Overlay (Refactored to Inline Block) */}
                        <AnimatePresence>
                            {previewUrl && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="w-full bg-[#1A1A1A] border-t border-white/10 px-4 pt-4 overflow-hidden"
                                >
                                    <div className="relative inline-block">
                                        <img src={previewUrl} alt="Preview" className="h-24 rounded-lg border border-white/10" />
                                        <button
                                            type="button"
                                            onClick={clearPreview}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="mt-2 text-[10px] text-white/50 mb-2">Image ready to send</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-[#1A1A1A] border-t border-white/10 relative z-30">
                            {uploading && (
                                <div className="absolute top-0 left-0 right-0 -mt-8 text-center">
                                    <span className="bg-black/80 text-white text-[10px] px-3 py-1 rounded-full border border-white/10">Uploading image...</span>
                                </div>
                            )}
                            <div className="flex gap-2 items-center">
                                {/* Extra Actions */}
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-[#D4AF37] transition-colors"
                                        title="Send Image"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => !showOrderSelector ? fetchOrders() : setShowOrderSelector(false)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${showOrderSelector ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white/50 hover:text-[#D4AF37] hover:bg-white/10'}`}
                                        title="Link Order"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        if (e.target.value.endsWith('@')) {
                                            fetchOrders();
                                        }
                                    }}
                                    placeholder="Type a message... (Type @ to link order)"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() && !selectedFile}
                                    className="w-9 h-9 bg-[#D4AF37] rounded-full flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform relative z-50"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}

                {/* Notification Badge */}
                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] font-bold rounded-full border-2 border-[#111] flex items-center justify-center animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}
