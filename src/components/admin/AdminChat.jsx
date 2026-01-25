import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminChat() {
    const [conversations, setConversations] = useState([]);
    const [selectedConvId, setSelectedConvId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // 1. Fetch Conversations
    useEffect(() => {
        fetchConversations();

        // Subscribe to NEW conversations (optional, for realtime list update)
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
            // Fetch Support Conversations + Participants
            const { data: convs, error } = await supabase
                .from('conversations')
                .select(`
                    id, updated_at, type,
                    conversation_participants (
                        user_id,
                        profiles ( full_name, email )
                    )
                `)
                .eq('type', 'support')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setConversations(convs || []);

            // Fetch Unread Counts
            // We want messages that are NOT from admin (is_admin = false) and NOT read
            const { data: unreadData } = await supabase
                .from('messages')
                .select('conversation_id')
                .eq('is_read', false)
                .eq('is_admin', false); // Only count user messages as unread for admin

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
        const { data, error } = await supabase
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
                    // If the new message is from the user, mark it as read immediately
                    if (!payload.new.is_admin) {
                        markAsRead(convId);
                    }
                }
            )
            .subscribe();
    };

    const markAsRead = async (convId) => {
        // Optimistic update
        setUnreadCounts(prev => ({ ...prev, [convId]: 0 }));

        await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', convId)
            .eq('is_read', false)
            .eq('is_admin', false); // Only mark user messages as read
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedConvId) return;

        const content = inputValue.trim();
        setInputValue("");

        try {
            // Admin sends message (sender_id can be null or specific admin ID if logged in)
            // For now, let's try to get current session user
            const { data: { session } } = await supabase.auth.getSession();
            const senderId = session?.user?.id || null;

            const { error } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: selectedConvId,
                    sender_id: senderId,
                    content: content,
                    is_admin: true // Mark as admin message
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
            const { error } = await supabase.from('conversations').delete().eq('id', convId);
            if (error) throw error;

            setConversations(prev => prev.filter(c => c.id !== convId));
            if (selectedConvId === convId) setSelectedConvId(null);
        } catch (err) {
            console.error("Error deleting conversation:", err);
            alert("Failed to delete conversation");
        }
    };

    // Helper to get customer name
    const getCustomerName = (conv) => {
        if (!conv || !conv.conversation_participants) return 'Unknown User';
        const customerParticipant = conv.conversation_participants.find(p => p.user_id !== null); // Assuming admin user_id is known or null
        return customerParticipant?.profiles?.full_name || customerParticipant?.profiles?.email || 'Unknown User';
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* Sidebar (Conversation List) */}
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
                                className={`relative w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${selectedConvId === conv.id ? 'bg-[#D4AF37]/10 border-l-4 border-l-[#D4AF37]' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1 pr-6">
                                    <span className={`font-bold text-sm ${selectedConvId === conv.id ? 'text-[#D4AF37]' : 'text-white'}`}>
                                        {getCustomerName(conv)}
                                    </span>
                                    {/* Unread Badge */}
                                    {unreadCounts[conv.id] > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {unreadCounts[conv.id]}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-white/30 ml-auto">
                                        {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="text-xs text-white/50 truncate">
                                    Click to view conversation
                                </div>

                                <button
                                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete Conversation"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-[#111]">
                {selectedConvId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-[#161616] flex justify-between items-center">
                            <h3 className="text-white font-bold">
                                Chat with <span className="text-[#D4AF37]">{getCustomerName(conversations.find(c => c.id === selectedConvId))}</span>
                            </h3>
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20">Live</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map(msg => {
                                const isAdmin = msg.is_admin;
                                return (
                                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl p-3 text-sm ${isAdmin
                                            ? 'bg-[#D4AF37] text-black rounded-tr-none'
                                            : 'bg-white/10 text-white rounded-tl-none'
                                            }`}>

                                            {/* Order Card Attachment */}
                                            {msg.metadata?.order_id && (
                                                <div className="mb-2 bg-black/20 rounded p-2 flex items-center gap-2 cursor-pointer hover:bg-black/40 transition-colors"
                                                    onClick={() => window.open(`/admin/orders?search=${msg.metadata.order_id}`, '_blank')}>
                                                    <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center text-black font-bold text-xs">
                                                        ORD
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-xs">Order #{msg.metadata.order_id.slice(0, 8)}</p>
                                                        <p className="text-[10px] opacity-70">Click to view details</p>
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
                                            <div className={`text-[10px] mt-1 opacity-50 ${isAdmin ? 'text-black' : 'text-white'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-[#161616] border-t border-white/10">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
