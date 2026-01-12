import React, { useState } from 'react';
import { Bell, Copy, Trash2, Smartphone, Users } from 'lucide-react';
import clsx from 'clsx';
import { GroupMember, UserRole } from '../../types';

interface GroupManagementScreenProps {
    onOpenNotifications?: () => void;
    onOpenProfile?: () => void;
    hasUnread?: boolean;
}

const GroupManagementScreen: React.FC<GroupManagementScreenProps> = ({ onOpenNotifications, onOpenProfile, hasUnread }) => {
    const [activeTab, setActiveTab] = useState<'my-group' | 'join-group'>('my-group');

    // Generate or retrieve persistent invite code for "My Group" (One group per owner)
    const [inviteCode] = useState(() => {
        const stored = localStorage.getItem('owner_invite_code');
        if (stored) return stored;
        const newCode = 'LG-' + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem('owner_invite_code', newCode);
        return newCode;
    });

    const [joinCode, setJoinCode] = useState('');

    // Mock Members Data
    const [members, setMembers] = useState<GroupMember[]>([
        { id: '1', name: 'Anna', title: 'Daughter(Anna)', role: 'Owner', avatarSeed: 'Anna', isCurrentUser: true },
        { id: '2', name: 'Grandson', title: 'Grandson', role: 'Viewer', avatarSeed: 'Grandson' },
        { id: '3', name: 'Dr. Somchai', title: 'Doctor Somchai', role: 'Admin', avatarSeed: 'Somchai' },
    ]);

    // Mock Pending Requests
    const [pendingRequests, setPendingRequests] = useState<GroupMember[]>([
        { id: 'p1', name: 'Auntie Ju', title: 'Auntie Ju', role: 'Viewer', avatarSeed: 'Ju' }
    ]);

    const handleRoleChange = (memberId: string, newRole: UserRole) => {
        // Prevent changing the last Owner or stripping own ownership safely implementation
        // For prototype, just update state
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };

    const handleDeleteMember = (memberId: string) => {
        setMembers(prev => prev.filter(m => m.id !== memberId));
    };

    const handleApprove = (request: GroupMember) => {
        setMembers(prev => [...prev, request]);
        setPendingRequests(prev => prev.filter(r => r.id !== request.id));
    };

    const handleDecline = (requestId: string) => {
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(inviteCode);
    };

    const handleJoin = () => {
        alert(`Request sent to join group ${joinCode}`);
        setJoinCode('');
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300 relative">
            {/* Header */}
            <div className="bg-[#0D9488] pt-14 pb-8 px-6 relative z-10 w-full shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-white tracking-wide">LifeGuardain</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative cursor-pointer" onClick={onOpenNotifications}>
                            <Bell className="w-6 h-6 text-white fill-current" />
                            {hasUnread && (
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0D9488]"></div>
                            )}
                        </div>
                        <div
                            className="w-9 h-9 bg-yellow-100 rounded-full border-2 border-white overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={onOpenProfile}
                        >
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
                        </div>
                    </div>
                </div>

                <div className="text-center text-white mb-6">
                    <h2 className="text-xl font-bold mb-1">Manage user groups</h2>
                    <p className="text-teal-100 text-xs">Share health information or join to care for others.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab('my-group')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all",
                            activeTab === 'my-group'
                                ? "bg-[#0D9488] text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                    >
                        <Users className="w-4 h-4" />
                        My Group
                    </button>
                    <button
                        onClick={() => setActiveTab('join-group')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all",
                            activeTab === 'join-group'
                                ? "bg-[#0D9488] text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                    >
                        <Smartphone className="w-4 h-4" />
                        Join Group
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 px-4 pt-6 pb-20 overflow-y-auto scrollbar-hide">

                {activeTab === 'my-group' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Invitation Code Card */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 text-center relative overflow-hidden">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-4">Your group invitation code (Invite Code)</h3>
                            <div
                                onClick={handleCopyCode}
                                className="flex items-center justify-center gap-3 cursor-pointer group"
                            >
                                <span className="text-4xl font-bold text-[#0D9488] dark:text-teal-400 tracking-wider group-active:scale-95 transition-transform">{inviteCode}</span>
                                <Copy className="w-6 h-6 text-gray-400 group-hover:text-[#0D9488] transition-colors" />
                            </div>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 max-w-[200px] mx-auto">
                                Send this code to the administrator to authorize access to the data.
                            </p>
                        </div>

                        {/* Pending Requests Section */}
                        {pendingRequests.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4 px-2">
                                    <span className="text-yellow-500 text-lg">⏳</span>
                                    <h3 className="text-[#0D9488] dark:text-teal-400 font-bold text-base">Request to join ({pendingRequests.length})</h3>
                                </div>
                                <div className="space-y-3">
                                    {pendingRequests.map((req) => (
                                        <div key={req.id} className="bg-white dark:bg-gray-800 rounded-3xl p-4 flex flex-col gap-3 shadow-sm border border-orange-100 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.avatarSeed}`} alt="Avatar" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">{req.title}</h4>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Requesting to join...</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(req)}
                                                    className="flex-1 bg-[#0D9488] hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDecline(req.id)}
                                                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs font-bold py-2 rounded-xl transition-colors"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Member List */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <span className="text-orange-400 text-lg">👑</span>
                                <h3 className="text-[#0D9488] dark:text-teal-400 font-bold text-base">Group members ({members.length})</h3>
                            </div>

                            <div className="space-y-3">
                                {members.map((member) => (
                                    <div key={member.id} className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-4 flex items-center gap-3 shadow-sm border border-transparent dark:border-gray-700 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-[#0D9488]"></div>

                                        {/* Avatar & Name */}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">{member.title}</h4>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                {member.role === 'Owner' ? 'Owner (You)' : member.role}
                                            </span>
                                        </div>

                                        {/* Role Selector */}
                                        <div className="relative w-24">
                                            {member.role === 'Owner' ? (
                                                <div className="w-full h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg border border-red-200 dark:border-red-800">
                                                    Owner
                                                </div>
                                            ) : (
                                                <div className="relative w-full">
                                                    <select
                                                        value={member.role}
                                                        onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                                                        className={clsx(
                                                            "appearance-none w-full h-8 pl-3 pr-2 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-colors text-center",
                                                            member.role === 'Admin'
                                                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                                                                : "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800"
                                                        )}
                                                    >
                                                        <option value="Admin">Admin</option>
                                                        <option value="Viewer">Viewer</option>
                                                    </select>
                                                    {/* Custom Arrow for consistency if needed, but text-center helps */}
                                                </div>
                                            )}
                                        </div>

                                        {/* Delete Action */}
                                        {member.role !== 'Owner' && (
                                            <button
                                                onClick={() => handleDeleteMember(member.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                        {member.role === 'Owner' && <div className="w-9"></div>} {/* Spacer */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-300 h-full">
                        {/* Join Group Form */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-transparent dark:border-gray-700">
                            <div className="mb-4">
                                <h3 className="text-gray-700 dark:text-gray-200 font-bold mb-2">Enter Invitation Code</h3>
                                <input
                                    type="text"
                                    placeholder="Ex. LG-9821"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-900 rounded-xl px-4 py-3 text-gray-700 dark:text-white font-medium outline-none border border-gray-200 dark:border-gray-700 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all"
                                />
                            </div>
                            <button
                                onClick={handleJoin}
                                disabled={!joinCode}
                                className="w-full bg-[#0D9488] hover:bg-teal-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-900/10"
                            >
                                Join
                            </button>
                        </div>

                        <div className="text-center px-8">
                            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                                เมื่อเข้าร่วมแล้ว คุณจะสามารถดูสถานะและการแจ้งเตือนจากเจ้าของกลุ่มได้
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupManagementScreen;
