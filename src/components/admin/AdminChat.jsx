import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import ChatOrderSelector from '../chat/ChatOrderSelector';
import EmojiPicker from '../chat/EmojiPicker';

export default function AdminChat() {
    const [conversations, setConversations] = useState([]);
    const [selectedConvId, setSelectedConvId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showOrderSelector, setShowOrderSelector] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // 1. Fetch Conversations
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setCurrentUserId(session?.user?.id);
            fetchConversations();
        };
        init();

        const channel = supabase.channel('admin_conversations')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'conversations' },
                () => fetchConversations()
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    // 2. Fetch Messages when Conversation Selected
    useEffect(() => {
        if (selectedConvId) {
            fetchMessages(selectedConvId);
            const channel = subscribeToMessages(selectedConvId);
            return () => supabase.removeChannel(channel);
        }
    }, [selectedConvId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const [unreadCounts, setUnreadCounts] = useState({});

    // Mark as read when opening conversation
    useEffect(() => {
        if (selectedConvId) {
            markAsRead(selectedConvId);
        }
    }, [selectedConvId]);

    const fetchConversations = async () => {
        try {
            const { data: convs, error } = await supabase
                .from('conversations')
                .select(`
                    id, updated_at, type,
                    conversation_participants (
                        user_id,
                        profiles ( full_name, email, wallet_address )
                    )
                `)
                .eq('type', 'support')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setConversations(convs || []);

            const { data: unreadData } = await supabase
                .from('messages')
                .select('conversation_id')
                .eq('is_read', false)
                .eq('is_admin', false);

            if (unreadData) {
                const counts = {};
                unreadData.forEach(m => {
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
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
    };

    const subscribeToMessages = (convId) => {
        return supabase
            .channel(`admin_chat:${convId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    if (!payload.new.is_admin) {
                        markAsRead(convId);
                    }
                }
            )
            .subscribe();
    };

    const markAsRead = async (convId) => {
        setUnreadCounts(prev => ({ ...prev, [convId]: 0 }));

        await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', convId)
            .eq('is_read', false)
            .eq('is_admin', false);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || !selectedConvId) return;

        const content = inputValue.trim();
        setInputValue("");
        setShowEmojiPicker(false);

        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: selectedConvId,
                    sender_id: currentUserId,
                    content: content,
                    is_admin: true
                }]);

            if (error) throw error;
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send");
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !selectedConvId) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${selectedConvId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('chat-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('chat-images')
                .getPublicUrl(filePath);

            await supabase.from('messages').insert({
                conversation_id: selectedConvId,
                sender_id: currentUserId,
                content: "Sent an image",
                type: 'image',
                image_url: publicUrl,
                attachment_url: publicUrl,
                is_admin: true
            });

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleOrderSelect = async (order) => {
        if (!selectedConvId) return;

        await supabase.from('messages').insert({
            conversation_id: selectedConvId,
            sender_id: currentUserId,
            content: `Referenced Order #${order.id.slice(0, 8)}`,
            type: 'order',
            order_id: order.id,
            metadata: { order_id: order.id },
            is_admin: true
        });

        setShowOrderSelector(false);
    };

    const handleDeleteConversation = async (e, convId) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this conversation? This cannot be undone.")) return;

        try {
            const { error } = await supabase.from('conversations').delete().eq('id', convId);
            if (error) throw error;

            setConversations(prev => prev.filter(c => c.id !== convId));
            if (selectedConvId === convId) setSelectedConvId(null);
        } catch (err) {
            console.error("Error deleting conversation:", err);
            alert("Failed to delete conversation");
        }
    };

    const getCustomerName = (conv) => {
        if (!conv || !conv.conversation_participants) return 'Unknown User';
        const customerParticipant = conv.conversation_participants.find(p => p.user_id !== currentUserId);
        if (!customerParticipant?.profiles) return 'Unknown User';
        const { full_name, email, wallet_address } = customerParticipant.profiles;
        return full_name || email || (wallet_address ? "Meta Mask's Shop" : 'Unknown User');
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-white/10 bg-[#0A0A0A] flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-white font-bold uppercase tracking-wider text-sm">Active Chats</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-white/30 text-center text-sm">Loading...</div>
                    ) : conversations.length === 0 ? (
                        <div className="p-4 text-white/30 text-center text-sm">No active chats</div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConvId(conv.id)}
                                className={`relative w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${selectedConvId === conv.id ? 'bg-[#D4AF37]/10 border-l-4 border-l-[#D4AF37]' : ''}`}
                            >
                                <div className="flex flex-col mb-1 pr-6">
                                    <div className="flex justify-between items-start w-full gap-2">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className={`font-bold text-sm truncate ${selectedConvId === conv.id ? 'text-[#D4AF37]' : 'text-white'}`}>
                                                {getCustomerName(conv)}
                                            </span>
                                            {unreadCounts[conv.id] > 0 && (
                                                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                                                    {unreadCounts[conv.id]}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-white/30 shrink-0">
                                            {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <span className="text-[9px] text-white/20 font-mono truncate">
                                        ID: {conv.conversation_participants.find(p => p.user_id !== currentUserId)?.user_id || 'Unknown'}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col bg-[#111] relative">
                {selectedConvId ? (
                    <>
                        <div className="p-4 border-b border-white/10 bg-[#161616] flex justify-between items-center">
                            <h3 className="text-white font-bold">
                                Chat with <span className="text-[#D4AF37]">{getCustomerName(conversations.find(c => c.id === selectedConvId))}</span>
                            </h3>
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20">Live</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
                            {messages.map(msg => {
                                // isMe = true if Admin sent it (sender perspectiva in AdminChat)
                                const isMe = msg.is_admin;

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
                                        <div className={`max-w-[70%] rounded-2xl p-3 text-sm ${isMe
                                            ? 'bg-[#D4AF37] text-black rounded-tr-none'
                                            : 'bg-white/10 text-white rounded-tl-none'
                                            }`}>

                                            {(msg.order_id || msg.metadata?.order_id) && (
                                                <div className="mb-2 bg-black/20 rounded p-2 flex items-center gap-2 cursor-pointer hover:bg-black/40 transition-colors"
                                                    onClick={() => window.open(`/admin/orders?search=${msg.order_id || msg.metadata?.order_id}`, '_blank')}>
                                                    <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center text-black font-bold text-xs">
                                                        ORD
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-xs">Order #{(msg.order_id || msg.metadata?.order_id || '').slice(0, 8)}</p>
                                                        <p className="text-[10px] opacity-70">Click to view details</p>
                                                    </div>
                                                </div>
                                            )}

                                            {(msg.image_url || msg.attachment_url) && (
                                                <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                                                    <a href={msg.image_url || msg.attachment_url} target="_blank" rel="noopener noreferrer">
                                                        <img src={msg.image_url || msg.attachment_url} alt="Attachment" className="max-w-[300px] max-h-[300px] object-cover hover:scale-105 transition-transform" />
                                                    </a>
                                                </div>
                                            )}

                                            <p>{msg.content}</p>
                                            <div className={`text-[10px] mt-1 opacity-50 ${isMe ? 'text-black/60' : 'text-white/40'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Emoji Picker Popover */}
                        {showEmojiPicker && (
                            <EmojiPicker
                                onEmojiSelect={(emoji) => {
                                    setInputValue(prev => prev + emoji);
                                }}
                                onStickerSelect={async (sticker) => {
                                    setShowEmojiPicker(false);
                                    if (!selectedConvId) return;

                                    await supabase.from('messages').insert({
                                        conversation_id: selectedConvId,
                                        sender_id: currentUserId,
                                        content: sticker.url,
                                        type: 'sticker',
                                        metadata: { type: 'sticker', sticker_id: sticker.id },
                                        is_admin: true
                                    });
                                }}
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        )}

                        <div className="p-4 bg-[#161616] border-t border-white/10 space-y-4 relative z-[60]">
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Image
                                </button>
                                <button
                                    onClick={() => setShowOrderSelector(true)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    Ref Order
                                </button>
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className={`p-2 rounded-lg text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold ${showEmojiPicker ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 hover:bg-white/10'}`}
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

                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    placeholder={isUploading ? "Uploading..." : "Type your reply..."}
                                    disabled={isUploading}
                                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isUploading}
                                    className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            {showOrderSelector && (
                <ChatOrderSelector
                    userId={conversations.find(c => c.id === selectedConvId)?.conversation_participants.find(p => p.user_id !== currentUserId)?.user_id}
                    onSelect={handleOrderSelect}
                    onClose={() => setShowOrderSelector(false)}
                />
            )}
        </div>
    );
}
