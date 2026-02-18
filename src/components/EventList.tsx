import React from 'react';
import { SimulationEvent } from '../types';
import { Armchair, Bed, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface EventListProps {
    events: SimulationEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
    if (events.length === 0) return null;

    return (
        <div className="bg-white p-6 pt-0">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Session Events</h2>
            <div className="space-y-3">
                {events.slice().reverse().map((event) => (
                    <div key={event.id} className="flex gap-4 p-4 rounded-3xl bg-gray-50 border border-gray-100 shadow-sm items-center group hover:bg-white hover:shadow-md transition-all">
                        {/* Thumbnail Icon */}
                        <div className={clsx(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                            event.type === 'falling' ? "bg-red-100 text-red-500 group-hover:bg-red-500 group-hover:text-white" :
                                event.type === 'sitting' ? "bg-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white" :
                                    "bg-amber-100 text-amber-500 group-hover:bg-amber-500 group-hover:text-white"
                        )}>
                            {event.type === 'falling' ? <AlertTriangle className="w-6 h-6" /> :
                                event.type === 'sitting' ? <Armchair className="w-6 h-6" /> :
                                    <Bed className="w-6 h-6" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className={clsx(
                                "font-bold text-sm capitalize truncate",
                                event.isCritical ? "text-red-900" : "text-gray-900"
                            )}>
                                {event.type} Detected
                            </h3>
                            <p className="text-gray-400 text-xs font-medium mt-0.5">
                                {event.timestamp} • Cam 01
                            </p>
                        </div>

                        <div className="">
                            {event.isCritical && (
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;
