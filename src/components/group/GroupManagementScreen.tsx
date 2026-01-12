import React, { useState } from 'react';
import { Bell, Copy, Trash2, Smartphone, Users, PenLine, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { GroupMember, UserRole } from '../../types';

interface GroupManagementScreenProps {
    onOpenNotifications?: () => void;
    onOpenProfile?: () => void;
    hasUnread?: boolean;
}

import { useUser } from '../../contexts/UserContext';

// --- MOCK DATA FOR GROUP OWNER PROFILE (PHU) ---
interface GroupOwnerProfile {
    name: string;
    username: string;
    avatarUrl?: string; // Optional for dicebear logic or uploaded
    email: string;
    birthDate: string;
    age: string;
    gender: string;
    bloodType: string;
    height: string;
    weight: string;
    medicalCondition: string;
    currentMedications: string;
    drugAllergies: string;
    foodAllergies: string;
}

// Default mock data for "Phu"
const defaultPhuProfile: GroupOwnerProfile = {
    name: 'Phu',
    username: '@PhuTheOwner',
    email: 'phu@example.com',
    birthDate: '01/01/1980',
    age: '45',
    gender: 'Male',
    bloodType: 'A',
    height: '175',
    weight: '70',
    medicalCondition: 'Hypertension',
    currentMedications: 'Amlodipine',
    drugAllergies: 'None',
    foodAllergies: 'Shellfish'
};

// Module-level mock data storage to persist across navigation (SPA) but reset on reload
let mockMyGroupName = 'Group members';

// Maintain a map of group IDs to their Profile Data (Mocking backend storage)
// Key: group.id, Value: GroupOwnerProfile
let mockGroupProfiles: Record<string, GroupOwnerProfile> = {};


// joinedGroups moved to UserContext
let mockPendingRequests: GroupMember[] = [
    { id: 'p1', name: 'Auntie Ju', title: 'Auntie Ju', role: 'Viewer', avatarSeed: 'Ju' }
];

let mockMembers: GroupMember[] | null = null;

const GroupManagementScreen: React.FC<GroupManagementScreenProps> = ({ onOpenNotifications, onOpenProfile, hasUnread }) => {
    const { user, updateUser } = useUser();
    const joinedGroups = user.joinedGroups || [];

    // Ensure mock data exists for joined groups when accessing
    // In a real app, this would be fetched. Here we init if missing.
    joinedGroups.forEach(g => {
        if (!mockGroupProfiles[g.id]) {
            if (g.owner === 'Phu') {
                mockGroupProfiles[g.id] = { ...defaultPhuProfile };
            } else {
                // Generic fallback for others
                mockGroupProfiles[g.id] = {
                    name: g.owner,
                    username: `@${g.owner}User`,
                    email: `${g.owner}@test.com`,
                    birthDate: '01/01/1990',
                    age: '30',
                    gender: 'Other',
                    bloodType: 'O',
                    height: '170',
                    weight: '60',
                    medicalCondition: 'None',
                    currentMedications: 'None',
                    drugAllergies: 'None',
                    foodAllergies: 'None'
                };
            }
        }
    });

    const updateJoinedGroups = (newGroups: typeof joinedGroups) => {
        updateUser({ joinedGroups: newGroups });
    };

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

    // Group Name State - Init from Module Variable
    const [myGroupName, setMyGroupName] = useState(mockMyGroupName);

    const updateMyGroupName = (name: string) => {
        setMyGroupName(name);
        mockMyGroupName = name;
    };

    const [isRenaming, setIsRenaming] = useState(false);
    const [tempName, setTempName] = useState('');

    const openRenameModal = () => {
        setTempName(myGroupName);
        setIsRenaming(true);
    };

    const handleRenameSubmit = () => {
        if (tempName.trim()) {
            updateMyGroupName(tempName);
        }
        setIsRenaming(false);
    };

    // Mock Members Data - Init or Re-create
    const [members, setMembers] = useState<GroupMember[]>(() => {
        if (mockMembers) return mockMembers;
        const initialMembers: GroupMember[] = [
            { id: '1', name: user.name, title: 'Owner (You)', role: 'Owner', avatarSeed: 'Anna', isCurrentUser: true, avatarUrl: user.avatarUrl },
            { id: '2', name: 'Grandson', title: 'Grandson', role: 'Viewer', avatarSeed: 'Grandson' },
            { id: '3', name: 'Dr. Somchai', title: 'Doctor Somchai', role: 'Admin', avatarSeed: 'Somchai' },
        ];
        mockMembers = initialMembers;
        return initialMembers;
    });

    const updateMembers = (newMembers: GroupMember[] | ((prev: GroupMember[]) => GroupMember[])) => {
        setMembers(prev => {
            const next = typeof newMembers === 'function' ? newMembers(prev) : newMembers;
            mockMembers = next;
            return next;
        });
    };

    // Mock Pending Requests - Init from Module Variable
    const [pendingRequests, setPendingRequests] = useState<GroupMember[]>(mockPendingRequests);
    const updatePendingRequests = (reqs: GroupMember[] | ((prev: GroupMember[]) => GroupMember[])) => {
        setPendingRequests(prev => {
            const next = typeof reqs === 'function' ? reqs(prev) : reqs;
            mockPendingRequests = next;
            return next;
        });
    };

    const handleRoleChange = (memberId: string, newRole: UserRole) => {
        updateMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };

    const handleDeleteMember = (memberId: string) => {
        updateMembers(prev => prev.filter(m => m.id !== memberId));
    };

    const handleApprove = (request: GroupMember) => {
        updateMembers(prev => [...prev, request]);
        updatePendingRequests(prev => prev.filter(r => r.id !== request.id));
    };

    const handleDecline = (requestId: string) => {
        updatePendingRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(inviteCode);
    };

    const handleJoin = () => {
        const inputCode = joinCode.trim().toUpperCase();

        if (inputCode === 'LG-0001') {
            const code = inputCode;
            setJoinCode('');
            alert(`Request sent to join group ${code}`);

            setTimeout(() => {
                const newGroup = {
                    id: `joined-${Date.now()}`,
                    name: 'Phu Group',
                    owner: 'Phu',
                    role: 'Admin',
                    avatarSeed: 'Phu'
                };
                updateJoinedGroups([...joinedGroups, newGroup]);
                setActiveTab('my-group');
            }, 3000);

        } else if (inputCode.startsWith('LG-')) {
            const code = inputCode;
            setJoinCode('');
            alert(`Request sent to join group ${code}`);

            setTimeout(() => {
                const newGroup = {
                    id: `joined-${Date.now()}`,
                    name: 'Kan Group',
                    owner: 'Kan',
                    role: 'Viewer',
                    avatarSeed: 'Kan'
                };
                updateJoinedGroups([...joinedGroups, newGroup]);
                setActiveTab('my-group');
            }, 3000);

        } else {
            alert("Please enter a valid code starting with LG-");
        }
    };

    // --- GROUP OWNER PROFILE VIEW/EDIT LOGIC ---
    const [viewingGroup, setViewingGroup] = useState<{ id: string, role: string, owner: string } | null>(null);
    const [profileData, setProfileData] = useState<GroupOwnerProfile | null>(null);

    const handleGroupClick = (group: { id: string, role: string, owner: string }) => {
        if (mockGroupProfiles[group.id]) {
            setProfileData({ ...mockGroupProfiles[group.id] }); // Clone to avoid direct mutation before save
            setViewingGroup(group);
        }
    };

    const handleCloseProfile = () => {
        setViewingGroup(null);
        setProfileData(null);
    };

    const handleProfileChange = (field: keyof GroupOwnerProfile, value: string) => {
        if (profileData) {
            setProfileData({ ...profileData, [field]: value });
        }
    };

    const handleSaveProfile = () => {
        if (viewingGroup && profileData) {
            mockGroupProfiles[viewingGroup.id] = profileData; // Save to "DB"
            handleCloseProfile();
        }
    };

    // --- Render Components ---

    const ProfileInputField = ({ label, value, field, width = 'full', readOnly }: { label: string, value: string, field: keyof GroupOwnerProfile, width?: 'full' | 'half', readOnly: boolean }) => (
        <div className={clsx("mb-4", width === 'half' ? 'w-[48%]' : 'w-full')}>
            <label className="block text-sm font-bold text-[#0D9488] mb-1.5 ml-1">{label}</label>
            <div className="relative group">
                {!readOnly && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <PenLine className="w-4 h-4" />
                    </div>
                )}
                {readOnly ? (
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-gray-700 text-sm font-medium">
                        {value || '-'}
                    </div>
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleProfileChange(field, e.target.value)}
                        className="w-full bg-[#EEEEEE] rounded-lg pl-9 pr-4 py-2.5 text-gray-600 text-sm font-medium outline-none border border-transparent focus:border-teal-500 focus:bg-white transition-all"
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300 relative">
            {/* Profile Modal */}
            {viewingGroup && profileData && (
                <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
                    {/* Header */}
                    <div className="pt-12 px-4 pb-2 bg-white z-10 w-full flex flex-col shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={handleCloseProfile}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                        <h1 className="text-xl font-bold text-gray-600 mb-6 pl-4">
                            {viewingGroup.role === 'Admin' ? `Edit ${viewingGroup.owner}'s Profile` : `${viewingGroup.owner}'s Profile`}
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-24">
                        {/* Avatar */}
                        <div className="flex justify-center mb-8 relative">
                            <div className="w-28 h-28 rounded-full border-2 border-gray-200 p-1">
                                <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden">
                                    {/* Mock Avatar Logic - using seed for simplicity */}
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingGroup.owner}`} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="flex flex-col">
                            {/* ReadOnly = True if NOT Admin */}
                            {(() => {
                                const isReadOnly = viewingGroup.role !== 'Admin';
                                return (
                                    <>
                                        <ProfileInputField label="Name" value={profileData.name} field="name" readOnly={isReadOnly} />
                                        <ProfileInputField label="Username" value={profileData.username} field="username" readOnly={isReadOnly} />
                                        <ProfileInputField label="Email" value={profileData.email} field="email" readOnly={isReadOnly} />
                                        <div className="flex justify-between">
                                            <ProfileInputField label="Birth Date" value={profileData.birthDate} field="birthDate" width="half" readOnly={isReadOnly} />
                                            <ProfileInputField label="Age" value={profileData.age} field="age" width="half" readOnly={isReadOnly} />
                                        </div>
                                        <div className="flex justify-between">
                                            <ProfileInputField label="Gender" value={profileData.gender} field="gender" width="half" readOnly={isReadOnly} />
                                            <ProfileInputField label="Blood Type" value={profileData.bloodType} field="bloodType" width="half" readOnly={isReadOnly} />
                                        </div>
                                        <div className="flex justify-between">
                                            <ProfileInputField label="Height" value={profileData.height} field="height" width="half" readOnly={isReadOnly} />
                                            <ProfileInputField label="Weight" value={profileData.weight} field="weight" width="half" readOnly={isReadOnly} />
                                        </div>
                                        <ProfileInputField label="Medical condition" value={profileData.medicalCondition} field="medicalCondition" readOnly={isReadOnly} />
                                        <ProfileInputField label="Current Medications" value={profileData.currentMedications} field="currentMedications" readOnly={isReadOnly} />
                                        <ProfileInputField label="Drug Allergies" value={profileData.drugAllergies} field="drugAllergies" readOnly={isReadOnly} />
                                        <ProfileInputField label="Food Allergies" value={profileData.foodAllergies} field="foodAllergies" readOnly={isReadOnly} />
                                    </>
                                );
                            })()}
                        </div>

                        {/* Action Buttons (Only if Admin) */}
                        {viewingGroup.role === 'Admin' && (
                            <div className="flex gap-4 mt-6 mb-8">
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20 transition-all"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCloseProfile}
                                    className="flex-1 bg-[#EEEEEE] hover:bg-gray-200 active:scale-[0.98] text-[#0D9488] text-base font-bold py-3 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        {viewingGroup.role !== 'Admin' && (
                            <div className="flex gap-4 mt-6 mb-8">
                                <button
                                    onClick={handleCloseProfile}
                                    className="w-full bg-[#EEEEEE] hover:bg-gray-200 active:scale-[0.98] text-gray-600 text-base font-bold py-3 rounded-xl transition-all"
                                >
                                    Back
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}

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
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
                                <h3 className="text-[#0D9488] dark:text-teal-400 font-bold text-base">{myGroupName} ({members.length})</h3>
                                <button onClick={openRenameModal} className="text-gray-400 hover:text-[#0D9488] transition-colors ml-1 p-1">
                                    <PenLine className="w-4 h-4" />
                                </button>
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

                        {/* Rename Modal */}
                        {isRenaming && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 text-center">
                                <div className="bg-white dark:bg-gray-800 w-[80%] max-w-[280px] rounded-[1.5rem] p-5 shadow-2xl animate-in zoom-in-95 duration-200">
                                    <h3 className="text-center text-gray-600 dark:text-gray-200 font-bold text-base mb-5">Change group name</h3>

                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        placeholder="Enter name"
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-center text-gray-700 dark:text-white outline-none focus:border-teal-500 mb-6 font-medium"
                                        autoFocus
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsRenaming(false)}
                                            className="flex-1 bg-[#EB5757] hover:bg-red-600 active:scale-95 text-white font-bold py-3 rounded-3xl transition-all shadow-lg shadow-red-500/20"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleRenameSubmit}
                                            className="flex-1 bg-[#0D9488] hover:bg-teal-700 active:scale-95 text-white font-bold py-3 rounded-3xl transition-all shadow-lg shadow-teal-500/20"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Joined Groups Section */}
                        {joinedGroups.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4 px-2 mt-8">
                                    <span className="text-blue-500 text-lg">🔗</span>
                                    <h3 className="text-[#0D9488] dark:text-teal-400 font-bold text-base">Joined Groups ({joinedGroups.length})</h3>
                                </div>
                                <div className="space-y-3">
                                    {joinedGroups.map((group) => (
                                        <div
                                            key={group.id}
                                            onClick={() => handleGroupClick(group)}
                                            className="bg-white dark:bg-gray-800 rounded-3xl p-4 flex items-center gap-3 shadow-sm border border-transparent dark:border-gray-700 transition-colors cursor-pointer hover:bg-gray-50 active:scale-[0.99]"
                                        >
                                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${group.avatarSeed}`} alt="Group Owner" />
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">{group.name}</h4>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                    Owner: {group.owner}
                                                </span>
                                            </div>

                                            <div className={clsx(
                                                "w-24 h-8 flex items-center justify-center rounded-lg text-xs font-bold border",
                                                group.role === 'Admin'
                                                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                                                    : "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800"
                                            )}>
                                                {group.role}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
