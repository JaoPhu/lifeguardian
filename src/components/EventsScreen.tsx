import React from 'react';
import { Bell, ChevronLeft } from 'lucide-react';
import { Camera } from '../types';
import StickmanViewer from './simulation/StickmanViewer';

interface EventsScreenProps {
    camera: Camera;
    onBack: () => void;
}

const EventsScreen: React.FC<EventsScreenProps> = ({ camera, onBack }) => {
    // Mock thumbnails mostly static for now as per design image
    const thumbnails = [
        { label: 'Sitting sleep', posture: 'sitting' },
        { label: 'Sitting clip', posture: 'sitting' },
        { label: 'Stand up', posture: 'standing' },
        { label: 'Working', posture: 'sitting' },
    ] as const;

    return (
        <div className="flex flex-col h-full bg-white relative">
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
                        <Bell className="w-6 h-6 text-white fill-current" />
                        <div className="w-9 h-9 bg-yellow-100 rounded-full border-2 border-white overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 z-20 space-y-6 overflow-y-auto pb-20 scrollbar-hide">

                {/* Events of Camera Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <h2 className="text-[#0D9488] font-bold text-sm mb-3">Events of {camera.name}</h2>

                    <div className="grid grid-cols-4 gap-2">
                        {thumbnails.map((thumb, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                                <div className="w-full aspect-square bg-primary-950 rounded-lg flex items-center justify-center border border-primary-900 overflow-hidden relative">
                                    <StickmanViewer posture={thumb.posture} className="text-yellow-400 w-10 h-10" />
                                    <div className="absolute top-1 right-1 text-[8px] text-gray-500">Picture {4 - idx}</div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium text-center leading-tight">{thumb.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Events List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[300px]">
                    <h2 className="text-[#0D9488] font-bold text-sm mb-3">Recent Events</h2>
                    <div className="space-y-3">
                        {camera.events.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">No recent events found.</p>
                        ) : (
                            camera.events.map((event, idx) => (
                                <div key={event.id || idx} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                                    <span className="text-gray-600 font-bold text-sm capitalize">{event.type}</span>
                                    <span className="text-gray-400 text-xs font-mono">{event.timestamp}</span>
                                </div>
                            ))
                        )}
                        {/* Fallback mock events if empty for demo visual */}
                        {camera.events.length === 0 && (
                            <>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                    <span className="text-gray-600 font-bold text-sm">Sitting sleep</span>
                                    <span className="text-gray-400 text-xs font-mono">15:05</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                    <span className="text-gray-600 font-bold text-sm">Sitting clip</span>
                                    <span className="text-gray-400 text-xs font-mono">14:45</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                    <span className="text-gray-600 font-bold text-sm">Stand up</span>
                                    <span className="text-gray-400 text-xs font-mono">13:13</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                    <span className="text-gray-600 font-bold text-sm">Working</span>
                                    <span className="text-gray-400 text-xs font-mono">09:10</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsScreen;
