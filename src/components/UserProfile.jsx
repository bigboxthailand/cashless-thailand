
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const CARTOON_STYLES = [
    'adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles',
    'fun-emoji', 'micah', 'miniavs', 'open-peeps', 'personas'
];

export default function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'info' | 'addresses' | 'history'
    const [editingAddress, setEditingAddress] = useState(null);

    // Dispute State
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [disputeTarget, setDisputeTarget] = useState(null); // { orderId }
    const [disputeReason, setDisputeReason] = useState('not_received');
    const [disputeDescription, setDisputeDescription] = useState('');
    const [disputeImages, setDisputeImages] = useState([]); // Array of URLs (Future: File upload)
    const [uploadingDispute, setUploadingDispute] = useState(false);

    // Avatar State
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [avatarSeed, setAvatarSeed] = useState(Math.random().toString());
    const [avatarStyle, setAvatarStyle] = useState('avataaars');
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    // Stats
    const [orderHistory, setOrderHistory] = useState([]);

    // Review System State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewTarget, setReviewTarget] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchProfile();
        fetchAddresses();
        fetchOrders();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') console.error(error);

            setProfile(data ? {
                ...data,
                first_name: data.full_name?.split(' ')[0] || '',
                last_name: data.full_name?.split(' ').slice(1).join(' ') || ''
            } : {
                id: user.id,
                first_name: user.user_metadata.full_name?.split(' ')[0] || '',
                last_name: user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
                email: user.email,
                avatar_url: null
            });

        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            // [NEW] Check for Metamask Wallet if no profile loaded (or even if loaded)
            const wallet = localStorage.getItem('user_wallet');
            if (wallet && !profile) {
                setProfile(prev => prev || {
                    first_name: 'Wallet',
                    last_name: 'User',
                    email: wallet.substring(0, 6) + '...' + wallet.substring(38),
                    avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${wallet}`
                });
            }
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false });

        // Map DB fields to UI fields
        const formatted = (data || []).map(addr => ({
            ...addr,
            first_name: addr.full_name ? addr.full_name.split(' ')[0] : '',
            last_name: addr.full_name ? addr.full_name.split(' ').slice(1).join(' ') : '',
            zip_code: addr.zipcode,
            label: 'Home' // DB doesn't have label, default to Home
        }));
        setAddresses(formatted);
    };

    const fetchOrders = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            // Trigger Automation
            await supabase.rpc('check_order_automations');

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    reviews (product_id, rating),
                    order_items (
                        product_id,
                        *,
                        product:product_id (meta, media)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedOrders = data.map(order => ({
                id: order.id,
                date: new Date(order.created_at).toLocaleDateString('th-TH'),
                total: order.total_price,
                status: order.payment_status,
                shippingStatus: order.shipping_status || 'pending',
                trackingNumber: order.tracking_number, // NEW
                paymentMethod: order.payment_method?.toUpperCase() || 'UNKNOWN',
                items: order.order_items.map(item => ({
                    productId: item.product_id,
                    title: item.product?.meta?.title || item.title || 'Unknown Product',
                    quantity: item.quantity,
                    price: item.price,
                    image: item.product?.media?.mainImage || item.image_url || 'https://placehold.co/100x100?text=No+Image',
                    hasReviewed: order.reviews?.some(r => r.product_id === item.product_id)
                }))
            }));

            setOrderHistory(formattedOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const confirmReceipt = async (orderId) => {
        if (!confirm('ยืนยันว่าได้รับสินค้าแล้ว? (Confirm Receipt)')) return;

        const { error } = await supabase
            .from('orders')
            .update({
                shipping_status: 'delivered',
                received_at: new Date()
            })
            .eq('id', orderId);

        if (error) {
            alert('Error: ' + error.message);
        } else {
            await fetchOrders();
            alert('ขอบคุณ! เลิอกสินค้าเพื่อรีวิวได้เลย');
        }
    };

    const openReviewModal = (orderId, item) => {
        setReviewTarget({ orderId, productId: item.productId, title: item.title, image: item.image });
        setRating(5);
        setComment('');
        setShowReviewModal(true);
    };

    const submitReview = async (e) => {
        e.preventDefault();

        if (!reviewTarget?.productId) {
            alert('Error: Product ID is missing. Please try again.');
            console.error('Review Target Missing Product ID:', reviewTarget);
            return;
        }

        // Clean Product ID (Remove variant suffix like -standard, -xl, -s) to match Products table
        const baseProductId = reviewTarget.productId.replace(/-(standard|s|m|l|xl|xxl)$/i, '');

        try {
            const { error } = await supabase.from('reviews').insert({
                user_id: profile.id,
                order_id: reviewTarget.orderId,
                product_id: baseProductId,
                rating,
                comment
            });
            if (error) throw error;

            alert('รีวิวสำเร็จ! (Review Submitted)');
            setShowReviewModal(false);
            fetchOrders();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const openDisputeModal = (orderId) => {
        setDisputeTarget({ orderId });
        setDisputeReason('not_received');
        setDisputeDescription('');
        setShowDisputeModal(true);
    };

    const submitDispute = async (e) => {
        e.preventDefault();
        if (!confirm('ยืนยันแจ้งปัญหา? (Submit Dispute)')) return;

        try {
            // 1. Create Dispute
            const { error: disputeError } = await supabase
                .from('disputes')
                .insert({
                    order_id: disputeTarget.orderId,
                    user_id: profile.id,
                    reason: disputeReason,
                    description: disputeDescription,
                    status: 'open',
                    evidence_images: disputeImages
                });

            if (disputeError) throw disputeError;

            // 2. Update Order Status
            const { error: orderError } = await supabase
                .from('orders')
                .update({ shipping_status: 'dispute' })
                .eq('id', disputeTarget.orderId);

            if (orderError) throw orderError;

            alert('แจ้งปัญหาเรียบร้อย เจ้าหน้าที่จะรีบตรวจสอบครับ');
            setShowDisputeModal(false);
            fetchOrders();

        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const saveAddress = async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('กรุณา login ก่อนบันทึกที่อยู่');
            return;
        }
        const form = e.target;
        const fullName = `${form.first_name.value} ${form.last_name.value}`.trim();

        const newAddress = {
            user_id: user.id,
            full_name: fullName,
            phone: form.phone.value,
            address_line1: form.address_line1.value,
            district: form.district.value,
            province: form.province.value,
            zipcode: form.zip_code.value,
            is_default: form.is_default.checked
        };

        let result;
        if (editingAddress?.id) {
            result = await supabase.from('addresses').update(newAddress).eq('id', editingAddress.id);
        } else {
            result = await supabase.from('addresses').insert(newAddress);
        }

        if (result.error) {
            alert('Error saving address: ' + result.error.message);
            console.error(result.error);
        } else {
            setEditingAddress(null);
            fetchAddresses();
        }
    };

    const deleteAddress = async (id) => {
        if (!confirm('Are you sure?')) return;
        await supabase.from('addresses').delete().eq('id', id);
        fetchAddresses();
    };

    const updateProfile = async (e, overrides = {}) => {
        if (e) e.preventDefault();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const updates = {
                id: user.id,
                full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                phone: profile.phone,
                tax_id: profile.tax_id,
                date_of_birth: profile.date_of_birth,
                sex: profile.gender, // Map gender state to sex column
                bio: profile.bio,
                updated_at: new Date(),
                ...overrides
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            setProfile(prev => ({ ...prev, ...updates }));
            if (!overrides.avatar_url) alert('Profile updated successfully!');

        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    // --- AVATAR LOGIC ---
    const saveCartoonAvatar = () => {
        const url = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${avatarSeed}`;
        updateProfile(null, { avatar_url: url });
        setShowAvatarModal(false);
    };

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            updateProfile(null, { avatar_url: data.publicUrl });
            setShowAvatarModal(false);
        } catch (error) {
            alert('Error uploading avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const AvatarModal = () => (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAvatarModal(false)}></div>
            <div className="bg-[#111] border border-[#D4AF37]/20 rounded-3xl p-6 w-full max-w-lg relative z-10 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6 text-center">Customize Avatar</h3>

                <div className="flex gap-2 mb-6 p-1 bg-black rounded-xl border border-white/5">
                    <button onClick={() => setAvatarStyle('avataaars')} className="flex-1 py-2 rounded-lg text-sm font-bold text-[#D4AF37] bg-white/10 hover:bg-white/20 transition-all">Cartoon</button>
                    <button onClick={() => fileInputRef.current.click()} className="flex-1 py-2 rounded-lg text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">Upload Photo</button>
                    <input type="file" ref={fileInputRef} onChange={uploadAvatar} className="hidden" accept="image/*" />
                </div>

                <div className="flex justify-center mb-6">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-[0_0_30px_#D4AF37] bg-white">
                        <img
                            src={`https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${avatarSeed}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Style</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {CARTOON_STYLES.map(style => (
                                <button
                                    key={style}
                                    onClick={() => setAvatarStyle(style)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${avatarStyle === style ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setAvatarSeed(Math.random().toString())}
                            className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Randomize
                        </button>
                        <button
                            onClick={saveCartoonAvatar}
                            className="flex-[2] bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-[#b89530] transition-all active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        >
                            Use this Avatar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );


    if (loading) return (
        <div className="flex items-center justify-center min-h-[600px]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#D4AF37] animate-pulse">LOADING</div>
            </div>
        </div>
    );

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full text-left px-5 py-4 rounded-2xl transition-all border flex items-center gap-4 group ${activeTab === id ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}
        >
            <span className={`p-2 rounded-lg ${activeTab === id ? 'bg-black/20 text-black' : 'bg-white/5 text-white/60 group-hover:text-white'}`}>
                {icon}
            </span>
            <span className="font-bold uppercase text-xs tracking-widest flex-1">{label}</span>
            {activeTab === id && <svg className="w-4 h-4 animate-slide-left" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>}
        </button>
    );

    return (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
            {showAvatarModal && <AvatarModal />}
            {showReviewModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowReviewModal(false)}></div>
                    <div className="bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-[0_0_50px_rgba(212,175,55,0.2)] animate-fade-in-up">
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-6 text-center">Review Product</h3>

                        <div className="flex items-center gap-4 mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                            <img src={reviewTarget?.image} className="w-16 h-16 rounded-lg object-cover" />
                            <div>
                                <p className="font-bold text-white line-clamp-1">{reviewTarget?.title}</p>
                                <p className="text-xs text-white/40 uppercase tracking-widest">Order: {reviewTarget?.orderId}</p>
                            </div>
                        </div>

                        <form onSubmit={submitReview} className="space-y-6">
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-4xl transition-all hover:scale-110 ${rating >= star ? 'text-[#D4AF37]' : 'text-white/10'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-[#D4AF37] font-bold text-sm uppercase tracking-widest">
                                {rating} out of 5 Stars
                            </p>

                            <textarea
                                required
                                rows="4"
                                placeholder="Share your experience..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all resize-none"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            ></textarea>

                            <button className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-xl hover:bg-[#b89530] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] uppercase tracking-widest">
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* NEW: Dispute Modal */}
            {showDisputeModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowDisputeModal(false)}></div>
                    <div className="bg-[#1a1a1a] border border-red-500/30 rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6 justify-center text-red-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <h3 className="text-2xl font-black uppercase tracking-widest">Report Issue</h3>
                        </div>

                        <form onSubmit={submitDispute} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-white/50 text-xs font-bold uppercase tracking-widest">Reason</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:bg-black outline-none transition-all"
                                    value={disputeReason}
                                    onChange={e => setDisputeReason(e.target.value)}
                                >
                                    <option value="not_received">I did not receive the order</option>
                                    <option value="damaged">Goods were damaged</option>
                                    <option value="wrong_item">Received wrong item</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-white/50 text-xs font-bold uppercase tracking-widest">Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Please describe the issue in detail..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:bg-black outline-none transition-all resize-none"
                                    value={disputeDescription}
                                    onChange={e => setDisputeDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                <p className="text-red-400 text-xs flex gap-2">
                                    <span className="font-bold">Note:</span>
                                    Funds will be held by "Cashless Thailand" until the issue is resolved.
                                </p>
                            </div>

                            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-500 transition-all shadow-[0_4px_20px_rgba(220,38,38,0.3)] uppercase tracking-widest">
                                Submit Report
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="w-20 h-20 bg-[#D4AF37]/20 blur-[40px] rounded-full"></div>
                    </div>

                    <div className="text-center relative z-10 mb-8">
                        <div className="relative inline-block mb-4 group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)] bg-black mx-auto transition-transform group-hover:scale-105">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-[#D4AF37] bg-white/5">
                                        {profile?.first_name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-black rounded-full flex items-center justify-center border border-[#D4AF37] text-[#D4AF37]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider">{profile?.first_name || 'User'} {profile?.last_name}</h2>
                        <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mt-1">Verified Member</p>
                    </div>

                    <div className="space-y-2">
                        <TabButton
                            id="dashboard"
                            label="Dashboard"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                        />
                        <TabButton
                            id="info"
                            label="My Profile"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        />
                        <TabButton
                            id="addresses"
                            label="Addresses"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        />
                        <TabButton
                            id="history"
                            label="Order History"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-3 group"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-6">

                {/* 1. DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in space-y-8">
                        {/* Stats Header */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </div>
                                <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Total Orders</h3>
                                <p className="text-4xl font-black text-white">{orderHistory.length}</p>
                            </div>
                            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                </div>
                                <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Saved Addresses</h3>
                                <p className="text-4xl font-black text-white">{addresses.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-[#D4AF37] to-[#8a7020] rounded-3xl p-6 relative overflow-hidden text-black shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                                <h3 className="text-black/60 text-xs font-bold uppercase tracking-widest mb-1">Member Status</h3>
                                <p className="text-3xl font-black uppercase">Gold Tier</p>
                                <div className="mt-4 bg-black/10 rounded-full h-1 w-full overflow-hidden">
                                    <div className="bg-black w-3/4 h-full"></div>
                                </div>
                                <p className="text-[10px] font-bold mt-2 opacity-60">Points: 1,250 / 2,000</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#111]/50 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Recent Activity</h3>
                            {orderHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {orderHistory.map((order, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                                            <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold">{order.paymentMethod} Payment</h4>
                                                <p className="text-white/40 text-xs text-mono">ID: {order.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#D4AF37] font-bold">{order.total.toLocaleString()} ฿</p>
                                                <p className="text-white/30 text-[10px]">{order.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/40 italic">No recent activity.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. PROFILE INFO VIEW */}
                {activeTab === 'info' && (
                    <div className="bg-[#111]/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 animate-fade-in">
                        <div className="mb-8 border-b border-white/10 pb-4 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Edit Profile</h2>
                                <p className="text-white/40 text-sm mt-1">Manage your personal information.</p>
                            </div>
                        </div>

                        <form onSubmit={updateProfile} className="space-y-8">
                            {/* Section 1: Basic Stats */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all"
                                        value={profile?.first_name || ''}
                                        onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all"
                                        value={profile?.last_name || ''}
                                        onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Section 2: Contact & Identity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all font-mono"
                                        placeholder="+66"
                                        value={profile?.phone || ''}
                                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Tax ID (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all font-mono"
                                        placeholder="Identification Number"
                                        value={profile?.tax_id || ''}
                                        onChange={e => setProfile({ ...profile, tax_id: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Section 3: Personal Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all"
                                        value={profile?.date_of_birth || ''}
                                        onChange={e => setProfile({ ...profile, date_of_birth: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Gender</label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all appearance-none"
                                        value={profile?.gender || 'Not Specified'}
                                        onChange={e => setProfile({ ...profile, gender: e.target.value })}
                                    >
                                        <option value="Not Specified">Not Specified</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Bio / About Me</label>
                                <textarea
                                    rows="3"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:bg-black outline-none transition-all resize-none"
                                    placeholder="Tell us a little bit about yourself..."
                                    value={profile?.bio || ''}
                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-end">
                                <button className="bg-[#D4AF37] text-black font-bold px-10 py-4 rounded-xl hover:bg-[#b89530] transition-colors shadow-[0_4px_20px_rgba(212,175,55,0.3)] uppercase tracking-wider text-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 3. ADDRESSES VIEW */}
                {activeTab === 'addresses' && (
                    <div className="bg-[#111]/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">My Addresses</h2>
                                <p className="text-white/40 text-sm mt-1">Manage shipping locations.</p>
                            </div>
                            <button
                                onClick={() => setEditingAddress({})}
                                className="bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] border border-[#D4AF37]/50 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Add New
                            </button>
                        </div>

                        {editingAddress ? (
                            <form onSubmit={saveAddress} className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6 animate-fade-in-up">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xs">{editingAddress.id ? '✎' : '+'}</span>
                                    {editingAddress.id ? 'Edit Address' : 'New Address'}
                                </h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Receiver Name</label>
                                        <input name="first_name" defaultValue={editingAddress?.first_name || profile?.first_name} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Last Name</label>
                                        <input name="last_name" defaultValue={editingAddress?.last_name || profile?.last_name} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone</label>
                                        <input name="phone" defaultValue={editingAddress?.phone || profile?.phone} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Label (Optional)</label>
                                        <input name="label" placeholder="e.g. Home, Office" defaultValue={editingAddress?.label} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Address Line</label>
                                    <input name="address_line1" placeholder="House No, Soi, Road" defaultValue={editingAddress?.address_line1} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" required />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">District</label>
                                        <input name="district" defaultValue={editingAddress?.district} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Province</label>
                                        <input name="province" defaultValue={editingAddress?.province} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 items-end">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Zip Code</label>
                                        <input name="zip_code" defaultValue={editingAddress?.zip_code} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" required />
                                    </div>
                                    <label className="flex items-center gap-3 text-white text-sm cursor-pointer select-none bg-black/30 p-3 rounded-xl border border-white/5 hover:bg-black/50 transition-colors">
                                        <input name="is_default" type="checkbox" defaultChecked={editingAddress?.is_default} className="accent-[#D4AF37] w-5 h-5 rounded" />
                                        <span className="font-bold">Set as Default Address</span>
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-white/10 mt-6">
                                    <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#b89530] transition-colors shadow-lg">Save Address</button>
                                    <button type="button" onClick={() => setEditingAddress(null)} className="text-white/60 hover:text-white px-6 py-3 hover:bg-white/5 rounded-xl transition-all">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid gap-4">
                                {addresses.map(addr => (
                                    <div key={addr.id} className="p-6 border border-white/10 bg-[#161616] rounded-2xl flex flex-col md:flex-row justify-between items-start hover:border-[#D4AF37] transition-all group relative overflow-hidden">

                                        <div className="relative z-10 flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-white font-black text-lg uppercase tracking-wider">{addr.label || 'Home'}</span>
                                                {addr.is_default && <span className="bg-[#D4AF37] text-black text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest">Default</span>}
                                            </div>
                                            <div className="text-white/80 text-sm space-y-1">
                                                <p className="font-bold">{addr.first_name} {addr.last_name} <span className="text-white/30 font-normal ml-2">({addr.phone})</span></p>
                                                <p className="opacity-70">{addr.address_line1}, {addr.district}</p>
                                                <p className="opacity-70">{addr.province}, {addr.zip_code}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4 md:mt-0 relative z-10">
                                            <button onClick={() => setEditingAddress(addr)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all">
                                                Edit
                                            </button>
                                            <button onClick={() => deleteAddress(addr.id)} className="px-3 py-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {addresses.length === 0 && (
                                    <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                        </div>
                                        <p className="text-white/40 mb-6 max-w-sm mx-auto">You haven't saved any addresses yet. Add one to make checkout faster.</p>
                                        <button onClick={() => setEditingAddress({})} className="text-[#D4AF37] font-bold hover:underline uppercase tracking-widest text-xs">+ Add New Address</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. HISTORY VIEW */}
                {activeTab === 'history' && (
                    <div className="bg-[#111]/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 animate-fade-in">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">Order History</h2>

                        {orderHistory.length > 0 ? (
                            <div className="space-y-6">
                                {orderHistory.map((order, i) => (
                                    <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all shadow-lg">
                                        <div className="bg-black/40 p-4 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                                            <div>
                                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Order ID</p>
                                                <p className="text-white font-mono text-sm">{order.id}</p>
                                            </div>
                                            <div className="text-right flex items-center gap-3">
                                                {/* Confirm Button */}
                                                {order.shippingStatus === 'shipped' && (
                                                    <button
                                                        onClick={() => confirmReceipt(order.id)}
                                                        className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse"
                                                    >
                                                        Confirm Received
                                                    </button>
                                                )}

                                                {/* Report Button */}
                                                {['shipped', 'delivered'].includes(order.shippingStatus) && (
                                                    <button
                                                        onClick={() => openDisputeModal(order.id)}
                                                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                                                    >
                                                        Report Issue
                                                    </button>
                                                )}

                                                <span className={`inline-block px-3 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-widest ${['paid', 'shipped', 'delivered'].includes(order.status?.toLowerCase())
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                    }`}>
                                                    {order.shippingStatus === 'delivered' ? 'DELIVERED' : (order.status || 'Pending')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
                                                {order.items.map((item, j) => (
                                                    <div key={j} onClick={() => (order.shippingStatus === 'delivered' && !item.hasReviewed) ? openReviewModal(order.id, item) : null} className={`flex-shrink-0 w-16 h-16 bg-black rounded-lg overflow-hidden border border-white/10 relative group ${order.shippingStatus === 'delivered' && !item.hasReviewed ? 'cursor-pointer hover:border-[#D4AF37]' : ''}`}>
                                                        <img src={item.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-all" />
                                                        <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[10px] px-1 font-bold">x{item.quantity}</div>

                                                        {/* Review Overlay (Always Visible for unreviewed) */}
                                                        {order.shippingStatus === 'delivered' && !item.hasReviewed && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                                <span className="text-[8px] font-bold bg-[#D4AF37] text-black px-2 py-1 rounded shadow-lg uppercase animate-pulse">
                                                                    Review
                                                                </span>
                                                            </div>
                                                        )}
                                                        {/* Reviewed Badge */}
                                                        {item.hasReviewed && (
                                                            <div className="absolute top-0 right-0 bg-green-500 text-black text-[8px] font-black px-1 rounded-bl shadow-sm">✓</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                                <div>
                                                    <p className="text-white/40 text-xs mb-1">Date: {order.date}</p>
                                                    <p className="text-white/40 text-xs">Payment: <span className="text-white font-bold">{order.paymentMethod}</span></p>

                                                    {order.trackingNumber && (
                                                        <div className="mt-2 inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tracking:</span>
                                                            <span className="text-[#D4AF37] font-mono font-bold text-sm select-all">{order.trackingNumber}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-2xl font-black text-[#D4AF37]">{order.total.toLocaleString()} ฿</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">No Orders Found</h3>
                                <p className="text-white/40 text-sm mb-8">Once you make a purchase, it will appear here.</p>
                                <a href="/shop" className="bg-[#D4AF37] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#b89530] transition-colors inline-flex items-center gap-2">
                                    <span>Go to Shop</span>
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
