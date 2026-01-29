import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function BlogInteractions({ postId, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [votes, setVotes] = useState({ up: 0, down: 0 });
    const [userVote, setUserVote] = useState(null);
    const [loading, setLoading] = useState(true);

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
    }, [postId, currentUser]);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('blog_comments')
            .select('*, profiles(full_name, avatar_url)')
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

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
        <div className="mt-20 space-y-12">
            {/* Voting Section */}
            <div className="flex items-center gap-8 py-8 border-y border-white/5">
                <p className="text-white/50 font-bold uppercase tracking-widest text-xs">คุณชอบบทความนี้ไหม?</p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleVote(1)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${userVote === 1 ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/10 text-white hover:border-[#D4AF37]/50'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={userVote === 1 ? "black" : "none"} stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                        <span className="font-black">{votes.up}</span>
                    </button>
                    <button
                        onClick={() => handleVote(-1)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${userVote === -1 ? 'bg-red-500 border-red-500 text-white' : 'border-white/10 text-white hover:border-red-500/50'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={userVote === -1 ? "white" : "none"} stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                        <span className="font-black">{votes.down}</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">ความคิดเห็น ({comments.length})</h3>

                {/* Post Form */}
                {currentUser ? (
                    <form onSubmit={handleComment} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#996515] flex-shrink-0 flex items-center justify-center text-black font-black text-xs uppercase">
                            {currentUser.email?.[0] || 'U'}
                        </div>
                        <div className="flex-1 space-y-3">
                            <textarea
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="เขียนแสดงความคิดเห็น..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all h-24 text-sm"
                            ></textarea>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-[#D4AF37] text-black font-black uppercase tracking-widest px-8 py-2.5 rounded-xl text-xs hover:bg-white transition-all">ส่งความเห็น</button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="p-8 text-center bg-white/5 border border-white/10 rounded-3xl">
                        <p className="text-white/50 text-sm mb-4">กรุณาเข้าสู่ระบบเพื่อร่วมแสดงความคิดเห็น</p>
                        <a href="/login" className="text-[#D4AF37] font-black uppercase tracking-widest text-xs hover:underline">เข้าสู่ระบบตอนนี้</a>
                    </div>
                )}

                {/* List */}
                <div className="space-y-6 pt-8">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-white/10">
                                {comment.profiles?.avatar_url ? (
                                    <img src={comment.profiles.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-bold uppercase">
                                        {comment.profiles?.full_name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-white font-bold text-sm">
                                        {comment.profiles?.full_name || 'Anonymous'}
                                    </span>
                                    <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                                        {new Date(comment.created_at).toLocaleDateString('th-TH')}
                                    </span>
                                </div>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && <p className="text-white/20 italic text-sm text-center py-10">ยังไม่มีความคิดเห็น...</p>}
                </div>
            </div>
        </div>
    );
}
