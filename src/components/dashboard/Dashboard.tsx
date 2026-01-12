import React, { useState } from 'react';
import { Bell, Settings, Folder } from 'lucide-react';
import { Camera, SimulationEvent } from '../../types';
import { MonitorStatus } from '../StatusScreen';
import clsx from 'clsx';

interface DashboardProps {
    cameras: Camera[];
    onTryDemo: () => void;
    onViewEvents: (cameraId: string) => void;
    onDeleteCamera: (cameraId: string) => void;
    onOpenNotifications?: () => void;
    onOpenProfile?: () => void;
    hasUnread?: boolean;
    calculateHealthStatus: (events: SimulationEvent[]) => { status: MonitorStatus, score: number };
}

import { useUser } from '../../contexts/UserContext';

const Dashboard: React.FC<DashboardProps> = ({ cameras, onTryDemo, onViewEvents, onDeleteCamera, onOpenNotifications, onOpenProfile, hasUnread, calculateHealthStatus }) => {
    const { user } = useUser();
    const [openSettingsId, setOpenSettingsId] = useState<string | null>(null);

    const toggleSettings = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenSettingsId(openSettingsId === id ? null : id);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300 relative" onClick={() => setOpenSettingsId(null)}>
            {/* Header */}
            <div className="bg-[#0D9488] pt-16 pb-12 px-6 relative z-10 w-full transition-colors duration-300">
                <div className="flex justify-between items-center">
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
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 z-20 space-y-4 overflow-y-auto pb-20 scrollbar-hide">

                {cameras.map((camera) => (
                    <div key={camera.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 pt-3 px-3 pb-2.5 relative transition-colors duration-300">
                        <div className="flex justify-between items-center px-2 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[#0D9488] font-bold text-sm">{camera.name}</span>
                                {camera.status === 'online' && (
                                    <div className={clsx(
                                        "w-2 h-2 rounded-full",
                                        calculateHealthStatus(camera.events).status === 'emergency' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                            calculateHealthStatus(camera.events).status === 'warning' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                                                calculateHealthStatus(camera.events).status === 'none' ? "bg-gray-400" :
                                                    "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                    )} />
                                )}
                            </div>

                            {/* Settings / Delete Menu - Not available for default Camera 1 */}
                            {camera.id !== 'cam-01' && (
                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleSettings(camera.id, e)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-gray-400" />
                                    </button>

                                    {openSettingsId === camera.id && (
                                        <div className="absolute top-6 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl py-1 z-50 min-w-[80px] animate-in fade-in zoom-in-95 duration-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteCamera(camera.id);
                                                }}
                                                className="w-full text-center px-3 py-1 text-sm text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={`aspect-video rounded-lg flex flex-col items-center justify-center gap-1 mb-2 relative overflow-hidden ${camera.status === 'online' ? 'bg-primary-950' : 'bg-[#D9D9D9] dark:bg-gray-600'}`}>
                            {camera.status === 'online' ? (
                                <div className="w-full h-full relative">
                                    {camera.config?.thumbnailUrl ? (
                                        <img
                                            src={camera.config.thumbnailUrl}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-black flex items-center justify-center">
                                            {/* No thumbnail available */}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="font-bold text-sm text-[#8F9197] dark:text-gray-400">No connection</p>
                                    <p className="text-[10px] text-[#8F9197] dark:text-gray-400">This function is not available.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Info Row */}
                        <div className="flex items-center px-1 mb-2">
                            {/* Left: Date Display Logic */}
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold flex-1 leading-tight">
                                {(() => {
                                    if (camera.status !== 'online') return '';
                                    if (!camera.config?.date) return '19/09/2021';

                                    const originalDate = camera.config.originalDate || camera.config.date;
                                    const currentDate = camera.config.date;

                                    const fmtStart = originalDate.replace(/-/g, '/');
                                    const fmtEnd = currentDate.replace(/-/g, '/');

                                    if (fmtStart !== fmtEnd) {
                                        return (
                                            <>
                                                <span className="block">Start : {fmtStart}</span>
                                                <span className="block">End : {fmtEnd}</span>
                                            </>
                                        );
                                    }
                                    return fmtStart;
                                })()}
                            </span>

                            {/* Center: Events Button */}
                            <div className="flex justify-center items-center flex-1 h-9">
                                <button
                                    onClick={() => onViewEvents(camera.id)}
                                    disabled={camera.status === 'offline'}
                                    className={`flex items-center gap-1 transition-colors ${camera.status === 'offline'
                                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                                        : 'text-[#0D9488] hover:text-[#0b7d72] font-bold'
                                        }`}
                                >
                                    <Folder className={`w-4 h-4 ${camera.status === 'offline' ? 'text-gray-300 dark:text-gray-600' : 'text-[#0D9488]'}`} />
                                    <span className="text-sm">Events</span>
                                </button>
                            </div>

                            {/* Right: Source */}
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 lowercase flex-1 text-right">{camera.source}</span>
                        </div>
                    </div>
                ))}

                {/* Shared Camera Cards (From Joined Groups) */}
                {user.joinedGroups?.map((group) => (
                    <div key={group.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 pt-3 px-3 pb-2.5 relative transition-colors duration-300">
                        <div className="flex justify-between items-center px-2 mb-2">
                            <span className="text-[#0D9488] font-bold text-sm">
                                {group.owner === 'Phu' ? 'Camera : Living Room' : `${group.owner}'s Camera`}
                            </span>
                        </div>

                        <div className="bg-[#D9D9D9] dark:bg-gray-600 aspect-video rounded-lg flex flex-col items-center justify-center gap-1 mb-2 relative overflow-hidden">
                            <div className="text-center">
                                <p className="font-bold text-sm text-[#8F9197] dark:text-gray-400">No connection</p>
                                <p className="text-[10px] text-[#8F9197] dark:text-gray-400">This function is not available.</p>
                            </div>
                        </div>

                        {/* Footer Info Row */}
                        <div className="flex items-center px-1 mb-2">
                            {/* Left Spacer */}
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold flex-1"></span>

                            {/* Center: Events Button */}
                            <div className="flex justify-center items-center flex-1 h-9">
                                <button
                                    disabled={true}
                                    className="flex items-center gap-1 transition-colors text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                                >
                                    <Folder className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                                    <span className="text-sm font-bold">Events</span>
                                </button>
                            </div>

                            {/* Right: Source */}
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 lowercase flex-1 text-right">
                                {group.owner === 'Phu' ? "Phu's Group" : group.name}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Joined group cameras will show up here */}


                <div className="flex justify-center mt-6">
                    <button
                        onClick={onTryDemo}
                        className="bg-[#0D9488] hover:bg-primary-800 text-white font-bold py-3 px-12 rounded-xl shadow-lg shadow-primary-600/30 transition-transform active:scale-95"
                    >
                        Try Demo
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
