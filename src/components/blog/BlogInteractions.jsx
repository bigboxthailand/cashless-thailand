import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function BlogInteractions({ postId, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [votes, setVotes] = useState({ up: 0, down: 0 });
    const [userVote, setUserVote] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const PER_PAGE = 5;

    const [currentUser, setCurrentUser] = useState(user);

    useEffect(() => {
        // If user prop is not provided (e.g. SSR mismatch or new login), fetch client-side
        if (!currentUser) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) setCurrentUser(session.user);
            });
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [user]);

    useEffect(() => {
        if (postId) {
            fetchComments();
            fetchVotes();
        }
    }, [postId, currentUser, page]);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('blog_comments')
            .select('*, profiles(full_name, avatar_url)')
            .eq('post_id', postId)
            .order('created_at', { ascending: false })
            .range(0, (page * PER_PAGE) - 1);

        if (error) console.error("Error fetching comments:", error);
        else setComments(data || []);
    };

    const fetchVotes = async () => {
        const { data, error } = await supabase
            .from('blog_votes')
            .select('vote_type, user_id')
            .eq('post_id', postId);

        if (error) {
            console.error("Error fetching votes:", error);
            return;
        }

        const up = data.filter(v => v.vote_type === 1).length;
        const down = data.filter(v => v.vote_type === -1).length;
        setVotes({ up, down });

        if (currentUser) {
            const myVote = data.find(v => v.user_id === currentUser.id);
            setUserVote(myVote ? myVote.vote_type : null);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น");
            return;
        }
        if (!newComment.trim()) return;

        const { error } = await supabase
            .from('blog_comments')
            .insert([{
                post_id: postId,
                user_id: currentUser.id,
                content: newComment.trim()
            }]);

        if (error) alert("แสดงความเห็นล้มเหลว: " + error.message);
        else {
            setNewComment('');
            setPage(1); // Reset to first page to see new comment
            fetchComments();
        }
    };

    const handleVote = async (type) => {
        if (!currentUser) {
            alert("กรุณาเข้าสู่ระบบเพื่อลงคะแนน");
            return;
        }

        if (userVote === type) {
            // Unvote
            await supabase.from('blog_votes').delete().eq('post_id', postId).eq('user_id', currentUser.id);
        } else {
            // Vote or Switch
            await supabase.from('blog_votes').upsert({
                post_id: postId,
                user_id: currentUser.id,
                vote_type: type
            });
        }
        fetchVotes();
    };

    return (
        <div className="mt-20 space-y-16">
            {/* Voting Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-y border-white/5 bg-white/[0.01] rounded-3xl px-8 backdrop-blur-sm">
                <div className="space-y-1 text-center sm:text-left">
                    <p className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-[10px]">Article Rating</p>
                    <p className="text-white text-lg font-black tracking-tight">คุณชอบบทความนี้ไหม?</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleVote(1)}
                        className={`flex items-center gap-3 px-8 py-3 rounded-2xl border transition-all transform active:scale-95 ${userVote === 1 ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'border-white/10 text-white hover:border-[#D4AF37]/50 hover:bg-white/5'}`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={userVote === 1 ? "black" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                        <span className="font-black text-lg">{votes.up}</span>
                    </button>
                    <button
                        onClick={() => handleVote(-1)}
                        className={`flex items-center gap-3 px-8 py-3 rounded-2xl border transition-all transform active:scale-95 ${userVote === -1 ? 'bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 text-white hover:border-red-500/50 hover:bg-white/5'}`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={userVote === -1 ? "white" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                        <span className="font-black text-lg">{votes.down}</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-12">
                <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                        ความคิดเห็น <span className="text-[#D4AF37] ml-2">({comments.length})</span>
                    </h3>
                </div>

                {/* Post Form */}
                {currentUser ? (
                    <form onSubmit={handleComment} className="flex gap-6 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#996515] flex-shrink-0 flex items-center justify-center text-black font-black text-sm uppercase">
                            {currentUser.email?.[0] || 'U'}
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-[#D4AF37] transition-all h-32 text-base placeholder:text-white/20 shadow-inner"
                            ></textarea>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-[#D4AF37] text-black font-black uppercase tracking-widest px-10 py-3.5 rounded-xl text-xs hover:bg-white transition-all transform active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                    ส่งความคิดเห็น
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="p-12 text-center bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
                        <p className="text-white/40 text-sm mb-6 font-medium">เข้าร่วมการสนทนาโดยการล็อกอินเข้าสู่ระบบ</p>
                        <a href="/login" className="inline-block bg-white/5 text-[#D4AF37] border border-[#D4AF37]/30 font-black uppercase tracking-widest text-[10px] px-10 py-4 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all">
                            เข้าสู่ระบบทันที
                        </a>
                    </div>
                )}

                {/* List */}
                <div className="space-y-8">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-6 group relative">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 transition-transform group-hover:scale-105">
                                {comment.profiles?.avatar_url ? (
                                    <img src={comment.profiles.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-black uppercase">
                                        {comment.profiles?.full_name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2 pt-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-white font-black text-sm tracking-tight">
                                        {comment.profiles?.full_name || 'Anonymous User'}
                                    </span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                    <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                                        {new Date(comment.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <p className="text-white/70 text-base leading-relaxed bg-white/[0.01] p-5 rounded-2xl border border-white/[0.02] group-hover:bg-white/[0.03] transition-colors">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}

                    {comments.length >= (page * PER_PAGE) && (
                        <div className="pt-10 flex justify-center">
                            <button
                                onClick={() => setPage(page + 1)}
                                className="px-12 py-4 rounded-2xl border border-white/5 text-white/40 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
                            >
                                ดูความคิดเห็นเพิ่มเติม
                            </button>
                        </div>
                    )}

                    {comments.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <p className="text-white/20 italic text-sm font-medium tracking-wide">ยังไม่มีความคิดเห็นในขณะนี้ เป็นคนแรกที่เริ่มการสนทนา!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
