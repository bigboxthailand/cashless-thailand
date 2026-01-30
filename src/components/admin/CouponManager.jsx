import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Trash2, Edit2, Search, Percent, Hash, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const CouponManager = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
    const [usageHistory, setUsageHistory] = useState([]);
    const [selectedCode, setSelectedCode] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState({
        id: null,
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        usage_limit: '',
        expiry_date: '',
        is_active: true,
        once_per_user: false,
        min_spend: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCoupons(data || []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsageDetails = async (code) => {
        setLoading(true);
        setSelectedCode(code);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('id, customer_name, customer_email, total_price, created_at')
                .eq('coupon_code', code)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsageHistory(data || []);
            setIsUsageModalOpen(true);
        } catch (error) {
            console.error('Error fetching usage:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                code: currentCoupon.code.toUpperCase(),
                discount_type: currentCoupon.discount_type,
                discount_value: parseFloat(currentCoupon.discount_value),
                usage_limit: currentCoupon.usage_limit ? parseInt(currentCoupon.usage_limit) : null,
                expiry_date: currentCoupon.expiry_date || null,
                is_active: currentCoupon.is_active,
                once_per_user: currentCoupon.once_per_user,
                min_spend: currentCoupon.min_spend ? parseFloat(currentCoupon.min_spend) : 0
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('coupons')
                    .update(payload)
                    .eq('id', currentCoupon.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('coupons')
                    .insert([payload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchCoupons();
            resetForm();
        } catch (error) {
            alert('Error saving coupon: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('ยืนยันการลบโค้ดส่วนลดนี้?')) return;
        try {
            const { error } = await supabase
                .from('coupons')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchCoupons();
        } catch (error) {
            alert('Error deleting coupon: ' + error.message);
        }
    };

    const handleEdit = (coupon) => {
        setCurrentCoupon({
            ...coupon,
            usage_limit: coupon.usage_limit || '',
            min_spend: coupon.min_spend || '',
            expiry_date: coupon.expiry_date ? coupon.expiry_date.split('T')[0] : ''
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentCoupon({
            id: null,
            code: '',
            discount_type: 'percentage',
            discount_value: '',
            usage_limit: '',
            expiry_date: '',
            is_active: true,
            once_per_user: false,
            min_spend: ''
        });
        setIsEditing(false);
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Coupon Management</h2>
                    <p className="text-white/50 text-sm">สร้างและจัดการโค้ดส่วนลดสำหรับลูกค้า</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                    <Plus size={20} />
                    Create New Coupon
                </button>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหาตามโค้ด..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-white/20 focus:border-[#D4AF37] outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-white/40 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">Min Spend</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4">Remaining</th>
                                <th className="px-6 py-4">Expires</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading && coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-[#D4AF37] mb-2" size={32} />
                                        <p className="text-white/50">Loading coupons...</p>
                                    </td>
                                </tr>
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-white/30">
                                        ไม่พบโค้ดส่วนลด
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded">
                                                {coupon.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-white/60">
                                                {coupon.discount_type === 'percentage' ? <Percent size={14} /> : <Hash size={14} />}
                                                {coupon.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-bold">
                                                {coupon.discount_value.toLocaleString()} {coupon.discount_type === 'percentage' ? '%' : '฿'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white/60 text-xs">
                                                {coupon.min_spend > 0 ? `${coupon.min_spend.toLocaleString()} ฿` : 'No Min'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => fetchUsageDetails(coupon.code)}
                                                    className="text-[#D4AF37] hover:underline text-left"
                                                >
                                                    {coupon.usage_count} Used
                                                </button>
                                                {coupon.once_per_user && (
                                                    <span className="text-[10px] text-[#D4AF37]/60">1 reuse/user</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${coupon.usage_limit && (coupon.usage_limit - coupon.usage_count) <= 5 ? 'text-orange-500' : 'text-white'}`}>
                                                    {coupon.usage_limit ? (coupon.usage_limit - coupon.usage_count).toLocaleString() : '∞'}
                                                </span>
                                                {coupon.usage_limit && (
                                                    <span className="text-[10px] text-white/30">of {coupon.usage_limit}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                                <Calendar size={14} />
                                                {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString('th-TH') : 'No Expiry'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {coupon.is_active ? (
                                                <span className="flex items-center gap-1.5 text-green-500 text-xs font-medium">
                                                    <CheckCircle2 size={14} /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                                                    <XCircle size={14} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="p-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors border border-white/10"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/30 hover:text-white">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase mb-2">Coupon Code</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCoupon.code}
                                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, code: e.target.value })}
                                    placeholder="EX: SAVE20"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase mb-2">Discount Type</label>
                                    <select
                                        value={currentCoupon.discount_type}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, discount_type: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (฿)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase mb-2">Value</label>
                                    <input
                                        type="number"
                                        required
                                        value={currentCoupon.discount_value}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, discount_value: e.target.value })}
                                        placeholder="20"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase mb-2">Usage Limit</label>
                                    <input
                                        type="number"
                                        value={currentCoupon.usage_limit}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, usage_limit: e.target.value })}
                                        placeholder="Unlimited"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase mb-2">Min Spend (฿)</label>
                                    <input
                                        type="number"
                                        value={currentCoupon.min_spend}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, min_spend: e.target.value })}
                                        placeholder="0"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase mb-2">Expiry Date</label>
                                <input
                                    type="date"
                                    value={currentCoupon.expiry_date}
                                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, expiry_date: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={currentCoupon.is_active}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#D4AF37] focus:ring-[#D4AF37]"
                                    />
                                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Active for customers</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={currentCoupon.once_per_user}
                                        onChange={(e) => setCurrentCoupon({ ...currentCoupon, once_per_user: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#D4AF37] focus:ring-[#D4AF37]"
                                    />
                                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Once per user (Required Login)</span>
                                </label>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-50 text-black font-bold rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20"
                                >
                                    {loading ? 'Saving...' : (isEditing ? 'Update Coupon' : 'Create Coupon')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isUsageModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h3 className="text-xl font-bold text-white">Usage History: {selectedCode}</h3>
                                <p className="text-white/40 text-xs">รายชื่อลูกค้าที่ใช้โค้ดส่วนลดนี้</p>
                            </div>
                            <button onClick={() => setIsUsageModalOpen(false)} className="text-white/30 hover:text-white">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-0 max-h-[60vh] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-white/40 text-[10px] uppercase font-bold sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">Customer</th>
                                        <th className="px-6 py-3">Order Total</th>
                                        <th className="px-6 py-3">Used At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {usageHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-10 text-center text-white/30">
                                                ยังไม่มีประวัติการใช้งาน
                                            </td>
                                        </tr>
                                    ) : (
                                        usageHistory.map((usage) => (
                                            <tr key={usage.id} className="hover:bg-white/[0.01]">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium">{usage.customer_name}</span>
                                                        <span className="text-white/30 text-xs font-mono">{usage.customer_email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white font-bold">
                                                    {usage.total_price?.toLocaleString()} ฿
                                                </td>
                                                <td className="px-6 py-4 text-white/50">
                                                    {new Date(usage.created_at).toLocaleString('th-TH')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                            <button
                                onClick={() => setIsUsageModalOpen(false)}
                                className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManager;
