import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, ShieldOff, Search, Loader2 } from 'lucide-react';

const AdminRoleManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            // Fetch users who are either admins or matches search
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, email, role')
                .order('role', { ascending: true });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`ยืนยันการเปลี่ยนสถานะเป็น ${newRole.toUpperCase()}?`)) return;

        setSavingId(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert('Error updating role: ' + error.message);
        } finally {
            setSavingId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limit to top 10 for performance/UI

    return (
        <div className="space-y-4">
            <h3 className="text-white font-bold uppercase text-sm border-b border-white/10 pb-2 flex items-center gap-2">
                <Shield size={16} className="text-[#D4AF37]" />
                Admin Management
            </h3>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-[#D4AF37] outline-none transition-all"
                />
            </div>

            <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-white/5 text-white/40 uppercase font-bold">
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="px-4 py-8 text-center">
                                    <Loader2 className="animate-spin mx-auto text-[#D4AF37]" size={20} />
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-4 py-8 text-center text-white/30 italic">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-white">{user.full_name || 'Anonymous'}</div>
                                        <div className="text-white/40">{user.email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${user.role === 'admin' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/60'
                                            }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => toggleRole(user.id, user.role)}
                                            disabled={savingId === user.id}
                                            className={`p-2 rounded-lg transition-all ${user.role === 'admin'
                                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                                                : 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'
                                                }`}
                                        >
                                            {savingId === user.id ? (
                                                <Loader2 className="animate-spin" size={14} />
                                            ) : user.role === 'admin' ? (
                                                <ShieldOff size={14} />
                                            ) : (
                                                <Shield size={14} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <p className="text-[10px] text-white/20 italic">
                * Only top 10 results are shown. Use search to find specific users.
            </p>
        </div>
    );
};

export default AdminRoleManager;
