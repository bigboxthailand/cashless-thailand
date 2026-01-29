
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

const SellerSettings = ({ shopId: propShopId }) => {
    const [shopId, setShopId] = useState(propShopId);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');

    // Payment Methods
    const [promptpayId, setPromptpayId] = useState('');
    const [lightningAddress, setLightningAddress] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    useEffect(() => {
        if (propShopId) {
            setShopId(propShopId);
        } else {
            const wallet = localStorage.getItem('user_wallet');
            if (wallet) resolveWalletShop(wallet);
            else setLoading(false);
        }
    }, [propShopId]);

    useEffect(() => {
        if (shopId) fetchShopDetails();
    }, [shopId]);

    const resolveWalletShop = async (wallet) => {
        try {
            setLoading(true);
            const { data: profile } = await supabase.from('profiles').select('id').eq('wallet_address', wallet).single();
            if (profile) {
                const { data: shopData } = await supabase.from('shops').select('id').eq('owner_id', profile.id).single();
                if (shopData) {
                    setShopId(shopData.id);
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        } catch (e) {
            console.error("Error resolving shop:", e);
            setLoading(false);
        }
    };

    const fetchShopDetails = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('shops')
                .select('*')
                .eq('id', shopId)
                .single();

            if (error) throw error;

            setShop(data);
            setName(data.name || '');
            setDescription(data.description || '');
            setLogoUrl(data.logo_url || '');
            setBannerUrl(data.banner_url || '');
            setPromptpayId(data.promptpay_id || '');
            setLightningAddress(data.lightning_address || '');
            setWalletAddress(data.wallet_address || '');

        } catch (error) {
            console.error('Error fetching shop:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updates = {
                name,
                description,
                logo_url: logoUrl,
                banner_url: bannerUrl,
                promptpay_id: promptpayId,
                lightning_address: lightningAddress,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('shops')
                .update(updates)
                .eq('id', shopId);

            if (error) throw error;
            alert('Shop settings updated successfully!');

            // Refresh local data
            fetchShopDetails();

        } catch (error) {
            alert('Error updating settings: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    // Helper to upload image (simplified)
    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `shop-assets/${shopId}/${type}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('shops') // Assuming 'shops' bucket exists, else 'public'
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('shops')
                .getPublicUrl(fileName);

            if (type === 'logo') setLogoUrl(publicUrl);
            else setBannerUrl(publicUrl);

        } catch (error) {
            alert('Upload failed: ' + error.message + ' (Check if "shops" bucket exists)');
        } finally {
            setSaving(false);
        }
    };

    if (loading && !shop) return <div className="text-white/50 text-center py-12">Loading settings...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
            <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-wider">Shop Settings</h2>
                <p className="text-white/50 text-sm mt-2">Manage your shop profile and payment methods</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Branding Section */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6">
                    <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#D4AF37] rounded-full"></span>
                        Branding
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Logo Upload */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-white/60 uppercase">Shop Logo</label>
                            <div className="relative w-32 h-32 bg-black/50 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group">
                                {logoUrl ? (
                                    <img src={logoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl text-white/20">📷</span>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <span className="text-xs text-white font-bold">Change</span>
                                </div>
                            </div>
                        </div>

                        {/* Banner Upload */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-white/60 uppercase">Shop Banner</label>
                            <div className="relative w-full h-32 bg-black/50 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group">
                                {bannerUrl ? (
                                    <img src={bannerUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl text-white/20">🖼️</span>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <span className="text-xs text-white font-bold">Change</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-white/60 uppercase mb-2">Shop Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-colors font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/60 uppercase mb-2">Description</label>
                            <textarea
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-colors resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6">
                    <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#D4AF37] rounded-full"></span>
                        Payment Methods
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-white/60 uppercase mb-2">PromptPay ID</label>
                            <input
                                type="text"
                                value={promptpayId}
                                onChange={(e) => setPromptpayId(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-colors"
                                placeholder="Phone, ID Card, or e-Wallet ID"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/60 uppercase mb-2">Bitcoin Lightning Address</label>
                            <input
                                type="text"
                                value={lightningAddress}
                                onChange={(e) => setLightningAddress(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-colors"
                                placeholder="email@provider.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h4 className="text-white font-bold uppercase text-sm">Shop Status</h4>
                        <p className={`text-xs uppercase font-bold mt-1 ${shop?.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {shop?.status}
                        </p>
                    </div>
                    <div className="text-right">
                        <h4 className="text-white/40 font-bold uppercase text-[10px]">Shop ID</h4>
                        <p className="text-white/60 text-xs font-mono">{shopId}</p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#D4AF37] text-black font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-[#b89530] transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerSettings;
