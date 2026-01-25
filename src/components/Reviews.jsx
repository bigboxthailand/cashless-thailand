import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Reviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ average: 0, total: 0, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    profile:user_id (full_name, avatar_url)
                `)
                .ilike('product_id', `${productId}%`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setReviews(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        if (!data.length) return;

        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let sum = 0;

        data.forEach(r => {
            counts[r.rating] = (counts[r.rating] || 0) + 1;
            sum += r.rating;
        });

        setStats({
            average: (sum / data.length).toFixed(1),
            total: data.length,
            counts
        });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const REVIEWS_PER_PAGE = 5;

    // Calculate pagination
    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
    const indexOfLastReview = currentPage * REVIEWS_PER_PAGE;
    const indexOfFirstReview = indexOfLastReview - REVIEWS_PER_PAGE;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="text-white/40 text-center py-10 animate-pulse">Loading reviews...</div>;

    if (reviews.length === 0) return (
        <div className="text-center py-20 border-t border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]/50">
                <span className="text-2xl">★</span>
            </div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-1">No Reviews Yet</h3>
            <p className="text-white/40 text-sm">Be the first to review this product!</p>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-20 border-t border-white/5" id="reviews-section">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-12">Customer Reviews</h2>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Stats Column */}
                <div className="lg:col-span-4 bg-[#111] border border-white/5 rounded-[2rem] p-8 h-fit">
                    <div className="flex items-end gap-4 mb-8">
                        <span className="text-6xl font-black text-white leading-none">{stats.average}</span>
                        <div className="mb-2">
                            <div className="flex text-[#D4AF37] text-lg mb-1">
                                {'★'.repeat(Math.round(stats.average)).padEnd(5, '☆')}
                            </div>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{stats.total} Reviews</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="flex items-center gap-3">
                                <span className="text-white/40 font-mono text-xs w-3">{star}</span>
                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#D4AF37]"
                                        style={{ width: `${(stats.counts[star] / stats.total) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-white/40 font-mono text-xs w-6 text-right">{stats.counts[star]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-8 space-y-6">
                    {currentReviews.map(review => (
                        <div key={review.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                                        {review.profile?.avatar_url ? (
                                            <img src={review.profile.avatar_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-[#D4AF37]">{review.profile?.full_name?.[0] || 'U'}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">
                                            {review.profile?.full_name || 'Anonymous User'}
                                        </p>
                                        <div className="flex text-[#D4AF37] text-xs">
                                            {'★'.repeat(review.rating).padEnd(5, '☆')}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                                    {new Date(review.created_at).toLocaleDateString('th-TH')}
                                </span>
                            </div>
                            <p className="text-white/70 font-light leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-8">
                            <button
                                onClick={() => {
                                    paginate(Math.max(1, currentPage - 1));
                                    document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${currentPage === 1 ? 'border-white/5 text-white/20 cursor-not-allowed' : 'border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button
                                        key={number}
                                        onClick={() => {
                                            paginate(number);
                                            document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${currentPage === number ? 'bg-[#D4AF37] text-black' : 'bg-transparent text-white/40 hover:text-white'}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    paginate(Math.min(totalPages, currentPage + 1));
                                    document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' });
                                }}
                                disabled={currentPage === totalPages}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${currentPage === totalPages ? 'border-white/5 text-white/20 cursor-not-allowed' : 'border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
