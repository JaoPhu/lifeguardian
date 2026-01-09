import React, { useState } from 'react';
import { Bell, Settings, Folder } from 'lucide-react';
import { Camera } from '../../types';
import StickmanViewer from '../simulation/StickmanViewer';

interface DashboardProps {
    cameras: Camera[];
    onTryDemo: () => void;
    onViewEvents: (cameraId: string) => void;
    onDeleteCamera: (cameraId: string) => void;
    onOpenNotifications?: () => void; // Optional for backward compatibility if needed, but App provides it
    hasUnread?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ cameras, onTryDemo, onViewEvents, onDeleteCamera, onOpenNotifications, hasUnread }) => {
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
                        <div className="w-9 h-9 bg-yellow-100 rounded-full border-2 border-white overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 z-20 space-y-4 overflow-y-auto pb-20 scrollbar-hide">

                {cameras.map((camera) => (
                    <div key={camera.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 relative transition-colors duration-300">
                        <div className="flex justify-between items-center px-2 mb-2">
                            <span className="text-[#0D9488] font-bold text-sm">{camera.name}</span>

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
                                <div className="w-full h-full flex items-center justify-center">
                                    <StickmanViewer posture="sitting" className="w-20 h-20 text-yellow-400" />
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
                            {/* Left: Date */}
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold flex-1">
                                {camera.status === 'online' ? (camera.config?.date || '19/09/2021').replace(/-/g, '/') : ''}
                            </span>

                            {/* Center: Events Button */}
                            <div className="flex justify-center flex-1">
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

                {/* Fallback Camera 1 if list is empty */}
                {cameras.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 transition-colors duration-300">
                        <div className="flex justify-between items-center px-2 mb-2">
                            <span className="text-[#0D9488] font-bold text-sm">Camera 1</span>
                        </div>
                        <div className="bg-[#D9D9D9] dark:bg-gray-600 aspect-video rounded-lg flex flex-col items-center justify-center gap-1 mb-2">
                            <p className="font-bold text-sm text-[#8F9197] dark:text-gray-400">No connection</p>
                            <p className="text-[10px] text-[#8F9197] dark:text-gray-400">This function is not available.</p>
                        </div>
                        <div className="flex items-center px-1 mb-2">
                            <span className="text-[10px] text-gray-500 font-bold flex-1"></span>

                            <div className="flex justify-center flex-1">
                                <button
                                    disabled={true}
                                    className="flex items-center gap-1 text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                                >
                                    <Folder className="w-4 h-4" />
                                    <span className="text-sm font-bold">Events</span>
                                </button>
                            </div>

                            <span className="text-[10px] text-gray-400 lowercase flex-1 text-right">camera</span>
                        </div>
                    </div>
                )}


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
