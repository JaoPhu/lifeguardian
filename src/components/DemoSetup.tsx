import { useState, useRef } from 'react';
import { Bell, Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { VideoConfig } from '../types';

interface DemoSetupProps {
    onStart: (config: VideoConfig) => void;
    onOpenNotifications?: () => void;
    hasUnread?: boolean;
}

const DemoSetup: React.FC<DemoSetupProps> = ({ onStart, onOpenNotifications, hasUnread }) => {
    const [cameraName, setCameraName] = useState('Camera view : Desk');
    const [startTime, setStartTime] = useState('08:00');
    const [speed, setSpeed] = useState(1);

    // Date State
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [eventType, setEventType] = useState<'sitting' | 'laying' | 'falling'>('sitting');

    // File Upload State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleStart = () => {
        const isoDate = date.toISOString().split('T')[0];

        onStart({
            id: crypto.randomUUID(),
            cameraName,
            startTime,
            speed,
            date: isoDate,
            eventType: eventType,
            videoUrl: previewUrl || undefined
        });
    };

    // Date Picker Helpers
    const formatDate = (date: Date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = (date.getFullYear() + 543).toString().slice(-2); // Thai Year 2 digits
        return `${d}/${m}/${y}`;
    };

    const changeMonth = (offset: number) => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
        setCurrentMonth(newMonth);
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setDate(newDate);
        setShowDatePicker(false);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300 relative">
            {/* Header */}
            <div className="bg-[#0D9488] pt-14 pb-12 px-6 relative z-10 w-full shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white tracking-wide">Demo</h1>
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

                {/* Video Upload Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-1 transition-colors">
                    <div className="px-3 py-2">
                        <span className="text-[#0D9488] dark:text-teal-400 font-bold text-sm">Video</span>
                    </div>
                    {/* Hidden Input */}
                    <input
                        type="file"
                        accept="video/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <div
                        onClick={handleUploadClick}
                        className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden group cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        {previewUrl ? (
                            <video src={previewUrl} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                            <>
                                <button className="w-12 h-12 bg-gray-400/50 rounded-full flex items-center justify-center pointer-events-none">
                                    <Plus className="w-6 h-6 text-white" />
                                </button>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium pointer-events-none">Upload video</span>
                            </>
                        )}
                    </div>
                    <div className="h-4"></div>
                </div>

                {/* Camera Name */}
                <div className="space-y-1">
                    <label className="text-[#0D9488] dark:text-teal-400 font-bold text-sm ml-1">Name Camera</label>
                    <input
                        type="text"
                        value={cameraName}
                        onChange={(e) => setCameraName(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 text-gray-500 font-medium border-none outline-none focus:ring-1 focus:ring-[#0D9488] transition-colors"
                    />
                </div>

                {/* Config Grid - Custom Layout: 1fr (Start) - 0.7fr (Speed) - 1.4fr (Date) */}
                <div className="grid grid-cols-[1fr_0.7fr_1.4fr] gap-3">
                    <div className="space-y-1">
                        <label className="text-[#0D9488] dark:text-teal-400 font-bold text-sm ml-1">Start time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-xl px-2 py-3 text-center text-gray-500 font-medium text-sm outline-none focus:ring-1 focus:ring-[#0D9488] transition-colors"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[#0D9488] dark:text-teal-400 font-bold text-sm ml-1">Speed</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-xl px-2 py-3 text-center text-gray-500 font-medium text-sm outline-none focus:ring-1 focus:ring-[#0D9488] transition-colors"
                                min="1"
                                max="100"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs font-bold pointer-events-none">x</span>
                        </div>
                    </div>

                    {/* Date Picker Custom */}
                    <div className="space-y-1 relative">
                        <label className="text-[#0D9488] dark:text-teal-400 font-bold text-sm ml-1">Date</label>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-2 py-3 flex items-center justify-between text-gray-500 dark:text-gray-300 font-medium text-sm outline-none focus:ring-1 focus:ring-[#0D9488] transition-colors"
                        >
                            <span>{formatDate(date)}</span>
                            <Calendar className="w-4 h-4 text-gray-800 dark:text-gray-400" />
                        </button>

                        {/* Popover Calendar */}
                        {showDatePicker && (
                            <div className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 w-72 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-4 text-[#374151] dark:text-gray-200">
                                    <ChevronLeft
                                        className="w-5 h-5 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400"
                                        onClick={() => changeMonth(-1)}
                                    />
                                    <span className="font-bold text-sm">
                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <ChevronRight
                                        className="w-5 h-5 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400"
                                        onClick={() => changeMonth(1)}
                                    />
                                </div>
                                <div className="grid grid-cols-7 text-center gap-y-2 text-xs font-medium text-gray-400 mb-2">
                                    <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
                                </div>
                                <div className="grid grid-cols-7 text-center gap-y-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {[...Array(getFirstDayOfMonth(currentMonth))].map((_, i) => (
                                        <span key={`empty-${i}`} className="text-transparent">00</span>
                                    ))}

                                    {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                                        const day = i + 1;
                                        const isSelected =
                                            date.getDate() === day &&
                                            date.getMonth() === currentMonth.getMonth() &&
                                            date.getFullYear() === currentMonth.getFullYear();

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => handleDateClick(day)}
                                                className={clsx(
                                                    "w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-colors",
                                                    isSelected ? "bg-[#ef4444] text-white shadow-md" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                                )}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Event Type Buttons */}
                <div className="flex gap-3 pt-2">
                    {(['sitting', 'laying', 'falling'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setEventType(type)}
                            className={clsx(
                                "flex-1 py-3 rounded-lg font-bold text-sm capitalize shadow-sm transition-all active:scale-95",
                                eventType === type
                                    ? "bg-[#0D9488] text-white shadow-md shadow-[#0D9488]/20"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Play Button */}
                <div className="pt-4 pb-2">
                    <button
                        onClick={handleStart}
                        className="w-full bg-[#0D9488] hover:bg-[#0b7e73] text-white text-xl font-bold py-4 rounded-xl shadow-lg shadow-[#0D9488]/30 transition-transform active:scale-[0.98]"
                    >
                        Play
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DemoSetup;
