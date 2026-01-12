import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Bell, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

import { Camera } from '../types';
import StickmanViewer from './simulation/StickmanViewer';

interface EventsScreenProps {
    camera: Camera;
    onBack: () => void;
    onOpenNotifications?: () => void;
    onOpenProfile?: () => void;
    hasUnread?: boolean;
    onViewStatus?: () => void;
}

const EventsScreen: React.FC<EventsScreenProps> = ({ camera, onBack, onOpenNotifications, onOpenProfile, hasUnread, onViewStatus }) => {
    const { user } = useUser();
    // Mock thumbnails mostly static for now as per design image
    const thumbnails = [
        { label: 'Sitting sleep', posture: 'sitting' },
        { label: 'Sitting clip', posture: 'sitting' },
        { label: 'Stand up', posture: 'standing' },
        { label: 'Working', posture: 'sitting' },
    ] as const;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300 relative">
            {/* Header */}
            <div className="bg-[#0D9488] pt-14 pb-8 px-6 relative z-10 w-full shadow-md">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <h1 className="text-3xl font-bold text-white tracking-wide">Events</h1>
                    </div>
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
            <div className="flex-1 px-4 pt-4 z-20 space-y-6 overflow-y-auto pb-20 scrollbar-hide">

                {/* Events of Camera Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-colors duration-300">
                    <h2 className="text-[#0D9488] dark:text-teal-400 font-bold text-sm mb-3">Events of {camera.name}</h2>

                    <div className="grid grid-cols-4 gap-2">
                        {/* Show actual events if available, otherwise fallback or empty */}
                        {camera.events.length > 0 ? (
                            camera.events.slice(0, 4).map((event) => (
                                <div key={event.id} className="flex flex-col items-center gap-1">
                                    <div className="w-full aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                                        {event.snapshotUrl ? (
                                            <img src={event.snapshotUrl} alt={event.type} className="w-full h-full object-cover" />
                                        ) : (
                                            <StickmanViewer posture={event.type} className={clsx("w-10 h-10", event.type === 'falling' ? "text-amber-500" : "text-yellow-400")} />
                                        )}
                                        <div className="absolute top-1 right-1 text-[8px] text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md font-mono border border-white/10">
                                            {event.timestamp}
                                        </div>
                                    </div>

                                    <span className="text-[10px] font-medium text-center leading-tight capitalize text-gray-500 dark:text-gray-400">
                                        {event.type}
                                    </span>
                                </div>
                            ))
                        ) : (
                            thumbnails.map((thumb, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1 opacity-50">
                                    <div className="w-full aspect-square bg-primary-950 rounded-lg flex items-center justify-center border border-primary-900 overflow-hidden relative">
                                        <StickmanViewer posture={thumb.posture} className="text-yellow-400 w-10 h-10" />
                                        <div className="absolute top-1 right-1 text-[8px] text-gray-500">Demo {4 - idx}</div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium text-center leading-tight">{thumb.label}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Status Navigation Button */}
                <button
                    onClick={onViewStatus}
                    className="w-full bg-white border border-[#0D9488] text-[#0D9488] hover:bg-teal-50 font-bold py-3 rounded-xl shadow-sm transition-transform active:scale-95 mb-2"
                >
                    View Status & Statistics
                </button>

                {/* Recent Events List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 min-h-[300px] transition-colors duration-300">
                    <h2 className="text-[#0D9488] dark:text-teal-400 font-bold text-sm mb-3">Recent Events</h2>
                    <div className="space-y-3">
                        {camera.events.length === 0 ? (
                            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No recent events found.</p>
                        ) : (
                            (() => {
                                // Calculate dates for ALL events
                                const startDateStr = camera.config?.date || 'xxxx-xx-xx';
                                const startTimeStr = camera.config?.startTime || '00:00';

                                const sortedEvents = [...camera.events].reverse(); // Oldest to Newest

                                // Parse safely to local time
                                const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
                                let currentDate = new Date(sYear, sMonth - 1, sDay);

                                let previousTime = startTimeStr;
                                const eventDates = new Map<string, string>(); // ID -> DateString

                                sortedEvents.forEach(e => {
                                    // Check for midnight crossing
                                    if (e.timestamp < previousTime && Math.abs(parseInt(e.timestamp.split(':')[0]) - parseInt(previousTime.split(':')[0])) > 12) {
                                        currentDate.setDate(currentDate.getDate() + 1);
                                    }
                                    previousTime = e.timestamp;

                                    // Format manually to avoid UTC shifts
                                    const y = currentDate.getFullYear();
                                    const m = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                                    const d = currentDate.getDate().toString().padStart(2, '0');
                                    eventDates.set(e.id, `${y}-${m}-${d}`);
                                });

                                // Perform check: do we have > 1 unique date OR does simulation span multiple days?
                                const uniqueDates = new Set(eventDates.values());
                                const originalDate = camera.config?.originalDate || startDateStr;
                                const currentDateStr = camera.config?.date || startDateStr;

                                const showDate = uniqueDates.size > 1 || originalDate !== currentDateStr;

                                return camera.events.map((event) => {
                                    const dateStr = eventDates.get(event.id);
                                    // Format DD/MM/YYYY or similar? User image shows 2026/01/13.
                                    // Let's use YYYY/MM/DD to match common dashboard style if possible, 
                                    // but usually DD/MM is better for small row.
                                    // Actually, let's use the format from the dashboard for consistency: YYYY/MM/DD
                                    const formattedDate = dateStr ? dateStr.replace(/-/g, '/') : '';

                                    return (
                                        <div key={event.id} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-700 pb-2 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded-lg transition-colors">
                                            <span className="font-bold text-sm capitalize text-gray-600 dark:text-gray-300">{event.type}</span>
                                            <div className="flex items-center gap-2">
                                                {showDate && <span className="text-gray-400 dark:text-gray-500 text-[10px]">{formattedDate}</span>}
                                                <span className="text-gray-400 dark:text-gray-500 text-xs font-mono">{event.timestamp}</span>
                                            </div>
                                        </div>
                                    );
                                });
                            })()
                        )}
                        {/* Fallback mock events DELETED as requested by user to remove unused stick items? 
                            User said "Image stick from old overlays remove... remove unused ones too". 
                            The fallback list was hardcoded. Removing it now. 
                         */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsScreen;
