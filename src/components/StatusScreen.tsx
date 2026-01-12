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

    // Mock Data Generator based on Status
    const getMockActivity = () => {
        let uiConfig;

        // 1. Determine base colors and default daily activities
        switch (status) {
            case 'normal':
                uiConfig = {
                    statusTitle: 'Status : Normal',
                    statusDesc: 'No abnormal behavior detected.',
                    bg: 'bg-emerald-400',
                    iconBg: 'bg-emerald-500/30',
                    icon: Check,
                    textColor: 'text-emerald-900',
                    iconColor: 'text-emerald-900',
                    activities: [
                        { icon: Activity, text: 'นั่งเป็นเวลา 1.30 ชั่วโมง', highlight: false },
                        { icon: Clock, text: 'เดินล่าสุดเมื่อ 2 ชั่วโมงที่แล้ว', highlight: false },
                        { icon: Eye, text: 'จ้องหน้าจอมาเป็นเวลา 0.30 ชั่วโมง', highlight: false },
                        { icon: User, text: 'เวลานอนทั้งหมดเวลา 9 ชั่วโมง', highlight: false },
                    ]
                };
                break;
            case 'warning':
                uiConfig = {
                    statusTitle: 'Status : Warning',
                    statusDesc: 'Detect risky behavior.',
                    bg: 'bg-amber-400',
                    iconBg: 'bg-amber-500/30',
                    icon: AlertTriangle,
                    textColor: 'text-amber-900',
                    iconColor: 'text-amber-900',
                    activities: [
                        { icon: Activity, text: 'นั่งเป็นเวลา 4.30 ชั่วโมง', highlight: true },
                        { icon: User, text: 'ยังไม่ได้ทานอาหารมื้อเช้า', highlight: true },
                        { icon: Eye, text: 'จ้องหน้าจอมาเป็นเวลา 3 ชั่วโมง', highlight: false },
                        { icon: Clock, text: 'เวลานอนทั้งหมดเวลา 4 ชั่วโมง', highlight: false },
                    ]
                };
                break;
            case 'emergency':
                uiConfig = {
                    statusTitle: 'Status : Emergency',
                    statusDesc: 'Emergency detected.',
                    bg: 'bg-red-500',
                    iconBg: 'bg-red-600/30',
                    icon: Plus,
                    textColor: 'text-white',
                    iconColor: 'text-white',
                    activities: [
                        { icon: User, text: 'ยังไม่ได้ทานอาหารมื้อเช้า', highlight: true },
                        { icon: Activity, text: 'ตรวจพบการล้ม ผู้ได้รับบาดเจ็บไม่มีสติและไม่มีการขยับ', highlight: true },
                    ]
                };
                break;
            default: // none
                uiConfig = {
                    statusTitle: 'Status : None',
                    statusDesc: 'No information.',
                    bg: 'bg-gray-100',
                    iconBg: 'bg-transparent',
                    icon: null,
                    textColor: 'text-gray-500',
                    iconColor: 'text-gray-400',
                    activities: []
                };
                break;
        }

        // 2. Override activities if we are viewing a specific video result
        if (config) {
            let activityIcon = Activity;
            // Use config.durationText if available, otherwise fallback
            let durationStr = config.durationText || '1.30 ชั่วโมง';
            let activityText = 'ตรวจพบกิจกรรมปกติ';
            let isHighlight = false;

            if (config.eventType === 'sitting') {
                activityText = `นั่งเป็นเวลา ${durationStr}`;
                isHighlight = status === 'warning'; // Sitting can be warning
            } else if (config.eventType === 'falling') {
                activityText = 'ตรวจพบการล้ม ผู้ได้รับบาดเจ็บไม่มีสติ';
                isHighlight = true;
            } else if (config.eventType === 'laying') {
                activityText = `นอนพักผ่อน ${durationStr}`;
                activityIcon = User;
            }

            uiConfig.activities = [
                { icon: activityIcon, text: activityText, highlight: isHighlight }
            ];
        }

        return uiConfig;
    };

    const { bg, iconBg, icon: StatusIcon, statusTitle, statusDesc, textColor, iconColor, activities } = getMockActivity();

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

            {/* Content Area */}
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
                            <h2 className={clsx("text-2xl font-bold", textColor)}>{statusTitle}</h2>
                            <p className={clsx("text-sm font-medium opacity-80", textColor)}>{statusDesc}</p>
                        </div>
                    </div>
                </div>

                {/* Activity Summary Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 flex-1">
                    <h3 className="text-[#0D9488] font-bold text-sm mb-4">Activity Summary</h3>

                    <div className="space-y-3">
                        {activities.length === 0 ? (
                            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                                No information.
                            </div>
                        ) : (
                            activities.map((item, index) => (
                                <SummaryItem
                                    key={index}
                                    icon={item.icon}
                                    text={item.text}
                                    highlight={item.highlight}
                                />
                            ))
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
        highlight ? "bg-gray-200/80" : "bg-gray-100" // Highlight (Warning/Bad) gets darker gray background as per design mock
    )}>
        <Icon className={clsx("w-5 h-5", highlight ? "text-[#0D9488]" : "text-[#0D9488]")} />
        <span className={clsx("text-xs font-bold", "text-gray-600")}>
            {text}
        </span>
    </div>
);

export default StatusScreen;
