import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Bell, ChevronLeft } from 'lucide-react';

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

                {/* Events of Camera Card - Horizontal Scroll Gallery */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-colors duration-300">
                    <h2 className="text-[#0D9488] dark:text-teal-400 font-bold text-sm mb-3">Events of Camera view : {camera.name}</h2>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {camera.events.length > 0 ? (
                            camera.events.map((event) => {
                                // Dynamic label / Stickman
                                let label: string = event.type;
                                if (event.type === 'sitting') label = 'Sitting';
                                else if (event.type === 'standing') label = 'Stand up';
                                else if (event.type === 'laying') label = 'Sitting sleep';

                                return (
                                    <div key={event.id} className="flex flex-col items-center gap-2 min-w-[6rem]">
                                        <div className="w-24 h-24 bg-[#778B91] rounded-xl flex items-center justify-center relative overflow-hidden shadow-sm">
                                            {/* Snapshot or Stickman */}
                                            <div className="w-full h-full relative">
                                                {event.snapshotUrl ? (
                                                    <img
                                                        src={event.snapshotUrl}
                                                        alt={label}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full p-4">
                                                        <StickmanViewer posture={event.type} className="text-[#FFCB4C] w-full h-full" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Time Tag */}
                                            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-[2px] rounded text-[10px] text-white px-1.5 py-0.5 font-bold">
                                                {event.timestamp}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium capitalize">{label}</span>
                                    </div>
                                );
                            })
                        ) : (
                            // Fallback Mock List if no events yet
                            thumbnails.map((thumb, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 min-w-[6rem] opacity-40">
                                    <div className="w-24 h-24 bg-[#778B91] rounded-xl flex items-center justify-center relative overflow-hidden">
                                        <div className="w-16 h-20">
                                            <StickmanViewer posture={thumb.posture} className="text-[#FFCB4C] w-full h-full" />
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{thumb.label}</span>
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

                                // Sort oldest to newest for date tracking
                                const sortedEvents = [...camera.events].reverse();

                                const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
                                let currentDate = new Date(sYear, sMonth - 1, sDay);

                                let previousTime = startTimeStr;
                                const eventDates = new Map<string, string>(); // ID -> DateString

                                sortedEvents.forEach(e => {
                                    // Check for midnight crossing (Time drops significantly, e.g. 23:59 -> 00:01)
                                    // Or simply if current timestamp is smaller than previous timestamp (assuming linear progression)
                                    const prevParts = previousTime.split(':').map(Number);
                                    const currParts = e.timestamp.split(':').map(Number);
                                    const prevH = prevParts[0];
                                    const currH = currParts[0];

                                    // Heuristic: If time jumps backward by more than 12 hours, it's probably the next day (e.g. 23:00 -> 01:00)
                                    // Or if it just jumps backward at all, it's likely next day given continuous recording? 
                                    // Safe bet: > 12 hour diff implies wrap.
                                    if (e.timestamp < previousTime && (prevH - currH) > 12) {
                                        currentDate.setDate(currentDate.getDate() + 1);
                                    }
                                    previousTime = e.timestamp;

                                    const y = currentDate.getFullYear();
                                    const m = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                                    const d = currentDate.getDate().toString().padStart(2, '0');
                                    eventDates.set(e.id, `${y}-${m}-${d}`);
                                });


                                return camera.events.map((event) => {
                                    const dateStr = eventDates.get(event.id);
                                    const formattedDate = dateStr ? dateStr.replace(/-/g, '/') : '';

                                    return (
                                        <div key={event.id} className="flex justify-between items-start border-b border-gray-50 dark:border-gray-700 pb-3 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded-lg transition-colors py-2">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm capitalize text-gray-600 dark:text-gray-300">{event.type}</span>
                                                {event.duration && event.duration !== '0.00 hr' && (
                                                    <span className="text-xs font-semibold text-[#0D9488] mt-0.5">Duration: {event.duration}</span>
                                                )}
                                                {event.description && (!event.duration || event.duration !== '0.00 hr') && (
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight mt-1">{event.description}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-0.5">
                                                {/* Always show date as requested */}
                                                <span className="text-gray-400 dark:text-gray-500 text-[10px] font-medium">{formattedDate}</span>
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
