import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../../lib/toast';
import {
    Loader2, Search, User, Shield, ShieldCheck, ShieldAlert,
    Crown, Ban, CheckCircle
} from 'lucide-react';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const USERS_PER_PAGE = 20;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('profiles')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });

            if (searchTerm) {
                query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
            }

            const from = (currentPage - 1) * USERS_PER_PAGE;
            const to = from + USERS_PER_PAGE - 1;

            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            setUsers(data || []);
            setTotalUsers(count || 0);

        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!confirm(`Are you sure you want to change role to ${newRole.toUpperCase()}?`)) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            toast.success(`Role updated to ${newRole}`);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            toast.error('Failed to update role: ' + error.message);
        }
    };

    const handleTierChange = async (userId, newTier) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ tier: newTier })
                .eq('id', userId);

            if (error) throw error;

            toast.success(`Tier updated to ${newTier}`);
            setUsers(users.map(u => u.id === userId ? { ...u, tier: newTier } : u));
        } catch (error) {
            toast.error('Failed to update tier: ' + error.message);
        }
    };

    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

    return (
        <div className="space-y-6">
            {/* Header / Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Name or Email..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#D4AF37] outline-none"
                    />
                </div>
                <div className="text-white/40 text-sm font-bold">
                    Total: <span className="text-[#D4AF37]">{totalUsers}</span> Users
                </div>
            </div>

            {/* Table */}
            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-white/80">
                        <thead className="bg-white/5 uppercase text-xs font-bold text-white/40 tracking-wider">
                            <tr>
                                <th className="p-4 px-6">User Profile</th>
                                <th className="p-4 px-6">Role</th>
                                <th className="p-4 px-6">Membership Tier</th>
                                <th className="p-4 px-6 text-right">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center">
                                        <Loader2 className="animate-spin mx-auto text-[#D4AF37]" size={32} />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-white/30">
                                        No users found matches "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent p-[1px]">
                                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={`https://unavatar.io/${user.email || user.wallet_address}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}`}
                                                            className="w-full h-full object-cover opacity-80"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{user.full_name || 'Anonymous'}</div>
                                                    <div className="text-xs text-white/40 font-mono">{user.email || user.wallet_address || 'No Contact'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 px-6">
                                            <select
                                                value={user.role || 'user'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className={`bg-black/50 border border-white/10 rounded-lg py-1 px-3 text-xs font-bold uppercase outline-none focus:border-[#D4AF37] ${user.role === 'admin' ? 'text-[#D4AF37] border-[#D4AF37]/30' :
                                                        user.role === 'seller' ? 'text-blue-400 border-blue-400/30' :
                                                            'text-white/60'
                                                    }`}
                                            >
                                                <option value="user">User</option>
                                                <option value="seller">Seller</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-4 px-6">
                                            <select
                                                value={user.tier || 'member'}
                                                onChange={(e) => handleTierChange(user.id, e.target.value)}
                                                className="bg-black/50 border border-white/10 rounded-lg py-1 px-3 text-xs font-bold uppercase outline-none focus:border-[#D4AF37] text-white/70"
                                            >
                                                <option value="member">Member</option>
                                                <option value="silver">Silver</option>
                                                <option value="gold">Gold</option>
                                                <option value="platinum">Platinum</option>
                                                <option value="bitcoin">Bitcoin (King)</option>
                                            </select>
                                        </td>
                                        <td className="p-4 px-6 text-right text-xs text-white/30 font-mono">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/10 flex justify-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold"
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-[#D4AF37]">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
