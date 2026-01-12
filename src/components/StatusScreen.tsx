import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Bell, Check, AlertTriangle, Plus, Activity, User } from 'lucide-react';
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

const StatusScreen: React.FC<StatusScreenProps> = ({ status, events, config, onShowStatistics, onOpenNotifications, onOpenProfile, hasUnread }) => {
    const { user } = useUser();

    // Mock Data Generator based on Status
    const getMockActivity = () => {
        let uiConfig = {
            statusTitle: 'Status : None',
            statusDesc: 'No information.',
            bg: 'bg-gray-100',
            iconBg: 'bg-transparent',
            icon: null as any,
            textColor: 'text-gray-500',
            iconColor: 'text-gray-400',
            activities: [] as { icon: any, text: string, highlight: boolean }[]
        };

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
                    activities: []
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
                    activities: []
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
                    activities: []
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
        } else if (events && events.length > 0) {
            // 3. Generate from Real Events if no specific config
            const latestEvents = events.slice(0, 4);
            uiConfig.activities = latestEvents.map(event => {
                let text = '';
                let Icon = Activity;
                let highlight = event.isCritical;

                // Thai translation & formatting
                const durationTxt = event.duration ? ` (${event.duration})` : '';

                switch (event.type) {
                    case 'sitting':
                        text = `นั่งทำงาน${durationTxt}`;
                        Icon = Activity;
                        break;
                    case 'laying':
                        text = `นอนพักผ่อน${durationTxt}`;
                        Icon = User;
                        break;
                    case 'falling':
                        text = `ตรวจพบการล้ม!${durationTxt}`;
                        Icon = AlertTriangle;
                        highlight = true;
                        break;
                    case 'walking':
                        text = `เดิน${durationTxt}`;
                        Icon = User;
                        break;
                    case 'standing':
                        text = `ยืน${durationTxt}`;
                        Icon = User;
                        break;
                    default:
                        text = `กิจกรรม: ${event.type}`;
                }

                return {
                    icon: Icon,
                    text: text,
                    highlight: highlight
                };
            });
        }

        return { ...uiConfig };
    };

    const { bg, iconBg, icon: StatusIcon, statusTitle, statusDesc, textColor, iconColor, activities } = getMockActivity();

    return (
        <div className="flex flex-col h-full bg-[#0D9488] dark:bg-gray-900 transition-colors duration-300 relative">
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
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white dark:bg-gray-900 px-6 pt-8 pb-4 flex flex-col gap-6 overflow-y-auto z-10 transition-colors duration-300">

                {/* Status Card */}
                <div className={clsx("w-full rounded-[2rem] p-6 shadow-md transition-colors duration-300 relative overflow-hidden", bg, status === 'none' && 'dark:bg-gray-800 dark:border dark:border-gray-700')}>
                    <div className="flex items-center gap-4 relative z-10">
                        {/* Status Icon Circle (Left) */}
                        {StatusIcon && (
                            <div className={clsx("w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0", iconBg)}>
                                <StatusIcon className={clsx("w-8 h-8", iconColor)} strokeWidth={3} />
                            </div>
                        )}

                        {/* Text (Right) */}
                        <div className={clsx("flex flex-col flex-1", !StatusIcon && "text-center items-center justify-center")}>
                            <h2 className={clsx("text-xl font-bold mb-0.5", textColor)}>{statusTitle}</h2>
                            <p className={clsx("text-sm font-medium opacity-80", textColor)}>{statusDesc}</p>
                        </div>
                    </div>
                </div>

                {/* Activity Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-lg border border-gray-100 dark:border-gray-700 flex-1 transition-colors duration-300">
                    <h3 className="text-[#0D9488] dark:text-teal-400 font-bold text-sm mb-4">Activity Summary</h3>

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
            <div className="h-2 bg-white dark:bg-gray-900 transition-colors duration-300"></div>
        </div>
    );
};

// Helper Component for List Items
const SummaryItem: React.FC<{ icon: React.ElementType, text: string, highlight?: boolean }> = ({ icon: Icon, text, highlight }) => (
    <div className={clsx(
        "flex items-center gap-3 p-3 rounded-xl transition-colors",
        highlight
            ? "bg-gray-200/80 dark:bg-gray-700/80"
            : "bg-gray-100 dark:bg-gray-700/40"
    )}>
        <Icon className={clsx("w-5 h-5", "text-[#0D9488] dark:text-teal-400")} />
        <span className={clsx("text-xs font-bold", "text-gray-600 dark:text-gray-300")}>
            {text}
        </span>
    </div>
);

export default StatusScreen;
