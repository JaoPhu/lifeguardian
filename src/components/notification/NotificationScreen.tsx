import React from 'react';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

import { NotificationItem } from '../../types';

interface NotificationScreenProps {
    notifications: NotificationItem[];
    onBack: () => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ notifications, onBack }) => {
    // Mock Data REMOVED - Using props now
    // Helper for colors
    const getIconColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'warning': return 'bg-yellow-400';
            case 'error': return 'bg-red-600';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300 relative">
            {/* Header - Adjusted to match Home/Dashboard height (approx pt-16 pb-12) */}
            <div className="bg-[#0D9488] pt-16 pb-12 px-6 relative z-10 w-full shadow-md">
                <div className="flex items-center gap-4">
                    <ArrowLeft className="w-6 h-6 text-white cursor-pointer" onClick={onBack} />
                    <h1 className="text-2xl font-bold text-white tracking-wide">Notifications</h1>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 px-4 pt-6 pb-20 overflow-y-auto scrollbar-hide">

                {/* Notification List - Moved up, no inner title */}
                <div className="space-y-4">
                    {notifications.map((item) => (
                        <div key={item.id} className="relative flex gap-4 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-sm rounded-2xl transition-all duration-200">
                            {/* Vertical Line Segment (visual style from image) */}
                            <div className="absolute left-0 top-4 bottom-4 w-[2px] bg-gray-100 dark:bg-gray-700 hidden"></div>

                            {/* Status Dot */}
                            <div className="pt-1">
                                <div className={clsx(
                                    "w-4 h-4 rounded-full shadow-md border-2 border-white dark:border-gray-800",
                                    getIconColor(item.type)
                                )}></div>
                            </div>

                            {/* Message */}
                            <div className="flex-1">
                                <p className="text-gray-700 dark:text-gray-200 text-sm font-bold leading-relaxed">
                                    {item.message}
                                </p>
                            </div>

                            {/* New Badge */}
                            {item.isNew && (
                                <div className="absolute right-2 bottom-2">
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">new</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationScreen;
