import React from 'react';
import { Bell, Check, AlertTriangle, Plus, Activity, User, Clock, Eye } from 'lucide-react';
import clsx from 'clsx';
import { SimulationEvent, VideoConfig } from '../types';

export type MonitorStatus = 'none' | 'normal' | 'warning' | 'emergency';

interface StatusScreenProps {
    status: MonitorStatus;
    events: SimulationEvent[];
    config: VideoConfig | null;
    onShowStatistics: () => void;
    onOpenNotifications?: () => void;
    onOpenProfile?: () => void;
    hasUnread?: boolean;
}

const StatusScreen: React.FC<StatusScreenProps> = ({ status, config, onShowStatistics, onOpenNotifications, onOpenProfile, hasUnread }) => {

    // Helper to determine styles and content based on status
    const getStatusConfig = () => {
        switch (status) {
            case 'normal':
                return {
                    bg: 'bg-emerald-400',
                    iconBg: 'bg-emerald-500/30',
                    icon: Check,
                    title: 'Status : Normal',
                    description: 'No abnormal behavior detected.',
                    textColor: 'text-emerald-900',
                    iconColor: 'text-emerald-900'
                };
            case 'warning':
                return {
                    bg: 'bg-amber-400',
                    iconBg: 'bg-amber-500/30',
                    icon: AlertTriangle,
                    title: 'Status : Warning',
                    description: 'Detect risky behavior.',
                    textColor: 'text-amber-900',
                    iconColor: 'text-amber-900'
                };
            case 'emergency':
                return {
                    bg: 'bg-red-500',
                    iconBg: 'bg-red-600/30',
                    icon: Plus, // Medical cross representation
                    title: 'Status : Emergency',
                    description: 'Emergency detected.',
                    textColor: 'text-white',
                    iconColor: 'text-white'
                };
            default: // none
                return {
                    bg: 'bg-gray-100',
                    iconBg: 'bg-transparent',
                    icon: null,
                    title: 'Status : None',
                    description: 'No information.',
                    textColor: 'text-gray-500',
                    iconColor: 'text-gray-400'
                };
        }
    };

    const { bg, iconBg, icon: StatusIcon, title, description, textColor, iconColor } = getStatusConfig();

    return (
        <div className="flex flex-col h-full bg-[#0D9488] relative">
            {/* Header */}
            <div className="pt-14 pb-8 px-6 flex justify-between items-center bg-[#0D9488] z-20">
                <h1 className="text-3xl font-bold tracking-wide text-white">LifeGuardain</h1>
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

            {/* Content Area (Rounded Top removed) */}
            <div className="flex-1 bg-white px-6 pt-8 pb-4 flex flex-col gap-6 overflow-y-auto z-10">

                {/* Status Card */}
                <div className={clsx("w-full rounded-[2rem] p-6 shadow-sm transition-colors duration-300 relative overflow-hidden", bg)}>
                    <div className="flex items-center gap-4 relative z-10 h-32">
                        {/* Status Icon Circle */}
                        {StatusIcon && (
                            <div className={clsx("w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm", iconBg)}>
                                <StatusIcon className={clsx("w-10 h-10", iconColor)} strokeWidth={3} />
                            </div>
                        )}

                        {/* Text */}
                        <div className={clsx("flex flex-col", !StatusIcon && "w-full text-center items-center justify-center h-full")}>
                            <h2 className={clsx("text-2xl font-bold", textColor)}>{title}</h2>
                            <p className={clsx("text-sm font-medium opacity-80", textColor)}>{description}</p>
                        </div>
                    </div>
                </div>

                {/* Activity Summary Card */}
                <div className="bg-gray-100 rounded-[2rem] p-6 shadow-sm border border-gray-200 flex-1">
                    <h3 className="text-[#0D9488] font-bold text-sm mb-4">Activity Summary</h3>

                    <div className="space-y-3">
                        {status === 'none' ? (
                            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                                No information.
                            </div>
                        ) : (
                            // Mock List or Generated from Events
                            <>
                                {/* Display specific item if we have config data */}
                                {config && (
                                    <SummaryItem
                                        icon={
                                            config.eventType === 'sitting' ? Activity :
                                                config.eventType === 'falling' ? Activity :
                                                    config.eventType === 'laying' ? Activity : User
                                        }
                                        text={
                                            config.eventType === 'sitting' ? 'นั่งเป็นเวลา 1.30 ชั่วโมง' :
                                                config.eventType === 'falling' ? 'ตรวจพบการล้ม ผู้ได้รับบาดเจ็บไม่มีสติ' :
                                                    config.eventType === 'laying' ? 'นอนพักผ่อน 30 นาที' :
                                                        'ตรวจพบกิจกรรมปกติ'
                                        }
                                        highlight={config.eventType === 'sitting' || config.eventType === 'falling'}
                                    />
                                )}

                                {/* Add some filler items for "Normal" look if needed, or specific items */}
                                <SummaryItem icon={Clock} text="เดินล่าสุดเมื่อ 2 ชั่วโมงที่แล้ว" />
                                <SummaryItem icon={Eye} text="จ้องหน้าจอมาเป็นเวลา 0.30 ชั่วโมง" />
                                <SummaryItem icon={User} text="เวลานอนทั้งหมดเวลา 8 ชั่วโมง" />
                            </>
                        )}
                    </div>
                </div>

                {/* Statistics Button */}
                <div className="w-full">
                    <button
                        onClick={onShowStatistics}
                        className="w-full bg-[#0D9488] hover:bg-teal-700 text-white text-lg font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/30 transition-transform active:scale-95"
                    >
                        Statistics
                    </button>

                </div>

            </div>
            {/* Bottom spacer for nav */}
            <div className="h-2 bg-white"></div>
        </div>
    );
};

// Helper Component for List Items
const SummaryItem: React.FC<{ icon: React.ElementType, text: string, highlight?: boolean }> = ({ icon: Icon, text, highlight }) => (
    <div className={clsx(
        "flex items-center gap-3 p-3 rounded-xl transition-colors",
        highlight ? "bg-white shadow-sm" : "bg-gray-200/50"
    )}>
        <Icon className={clsx("w-5 h-5", highlight ? "text-[#0D9488]" : "text-gray-500")} />
        <span className={clsx("text-xs font-bold", highlight ? "text-gray-800" : "text-gray-500")}>
            {text}
        </span>
    </div>
);

export default StatusScreen;
