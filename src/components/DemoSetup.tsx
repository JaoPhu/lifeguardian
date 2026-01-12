import { useState, useRef, useEffect } from 'react';
import { Bell, Plus, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
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

    // Time Picker Modal State
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [tempHour, setTempHour] = useState(8);
    const [tempMinute, setTempMinute] = useState(0);

    // Speed Picker Modal State
    const [showSpeedPicker, setShowSpeedPicker] = useState(false);
    const [tempSpeed, setTempSpeed] = useState(1);

    const hourScrollRef = useRef<HTMLDivElement>(null);
    const minuteScrollRef = useRef<HTMLDivElement>(null);
    const speedScrollRef = useRef<HTMLDivElement>(null);

    // Grab-to-scroll refs
    const isDragging = useRef(false);
    const startY = useRef(0);
    const scrollStartTop = useRef(0);

    const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;
        isDragging.current = true;
        startY.current = e.pageY - ref.current.offsetTop;
        scrollStartTop.current = ref.current.scrollTop;
        ref.current.style.scrollSnapType = 'none';
        ref.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
        if (!isDragging.current || !ref.current) return;
        e.preventDefault();
        const y = e.pageY - ref.current.offsetTop;
        const walk = (y - startY.current) * 1.5;
        ref.current.scrollTop = scrollStartTop.current - walk;
    };

    const handleMouseUpOrLeave = (ref: React.RefObject<HTMLDivElement>) => {
        if (!isDragging.current || !ref.current) return;
        isDragging.current = false;
        ref.current.style.scrollSnapType = 'y mandatory';
        ref.current.style.cursor = 'grab';
    };

    const handleInfiniteScroll = (e: React.UIEvent<HTMLDivElement>, baseLength: number) => {
        const element = e.currentTarget;
        const itemHeight = 40;
        const scrollTop = element.scrollTop;
        const oneSetHeight = baseLength * itemHeight;

        // Wider safe zone to prevent jitter
        // If we are in the middle set (oneSetHeight to 2*oneSetHeight), we are safe.
        // We teleport only if we cross significantly into the first or third set.
        if (scrollTop < oneSetHeight * 0.2) {
            element.scrollTop = scrollTop + oneSetHeight;
            return -1; // Indicate teleport
        } else if (scrollTop > oneSetHeight * 2.8) {
            element.scrollTop = scrollTop - oneSetHeight;
            return -1; // Indicate teleport
        }

        const centeredIndex = Math.round(element.scrollTop / itemHeight) + 1;
        return centeredIndex % baseLength;
    };

    // Initialize infinite scroll position
    useEffect(() => {
        if (showTimePicker) {
            setTimeout(() => {
                if (hourScrollRef.current) hourScrollRef.current.scrollTop = (24 + tempHour - 1) * 40;
                if (minuteScrollRef.current) minuteScrollRef.current.scrollTop = (60 + tempMinute - 1) * 40;
            }, 10);
        }
    }, [showTimePicker]);

    useEffect(() => {
        if (showSpeedPicker) {
            setTimeout(() => {
                const speedVal = tempSpeed - 1; // 0-based index
                if (speedScrollRef.current) speedScrollRef.current.scrollTop = (25 + speedVal - 1) * 40;
            }, 10);
        }
    }, [showSpeedPicker]);



    // File Upload State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setThumbnailUrl(null);
        }
    };

    const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const video = e.currentTarget;
        video.currentTime = 0.5; // Capture at 0.5s to likely hit a non-black frame
    };

    const handleVideoSeeked = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const video = e.currentTarget;
        if (video.currentTime === 0.5) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setThumbnailUrl(canvas.toDataURL('image/jpeg', 0.7));
                video.currentTime = 0; // Reset
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleStart = () => {
        // Construct YYYY-MM-DD from local date to avoid UTC shift (toISOString uses UTC)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const isoDate = `${year}-${month}-${day}`;

        onStart({
            id: crypto.randomUUID(),
            cameraName,
            startTime,
            speed,
            date: isoDate,
            // eventType removed as AI handles it
            videoUrl: previewUrl || undefined,
            thumbnailUrl: thumbnailUrl || undefined,
            originalDate: isoDate
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
                            <video
                                src={previewUrl}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                onLoadedData={handleVideoLoad}
                                onSeeked={handleVideoSeeked}
                            />
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
                    <div className="relative group">
                        <input
                            type="text"
                            value={cameraName}
                            onChange={(e) => setCameraName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 font-semibold border-2 border-transparent focus:border-[#0D9488] focus:bg-white outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Config Grid - Custom Layout: 1fr (Start) - 0.7fr (Speed) - 1.4fr (Date) */}
                <div className="grid grid-cols-[1fr_0.7fr_1.4fr] gap-3">
                    {/* Time Picker Trigger */}
                    <div className="space-y-1">
                        <label className="text-[#0D9488] dark:text-teal-400 font-bold text-sm ml-1">Start time</label>
                        <button
                            onClick={() => {
                                const [h, m] = startTime.split(':').map(Number);
                                setTempHour(h);
                                setTempMinute(m || 0);
                                setShowTimePicker(true);
                            }}
                            className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-2 py-3 flex items-center justify-center gap-1.5 text-gray-700 dark:text-gray-200 font-semibold text-sm border-2 border-transparent hover:border-teal-200 dark:hover:border-teal-900 transition-all shadow-sm"
                        >
                            <span>{startTime}</span>
                            <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                        </button>
                    </div>

                    {/* Speed Picker Trigger */}
                    <div className="space-y-1">
                        <label className="text-[#0D9488] dark:text-teal-400 font-bold text-sm ml-1">Speed</label>
                        <button
                            onClick={() => {
                                setTempSpeed(speed);
                                setShowSpeedPicker(true);
                            }}
                            className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-2 py-3 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold text-sm border-2 border-transparent hover:border-teal-200 dark:hover:border-teal-900 transition-all shadow-sm"
                        >
                            <span>{speed}</span>
                            <span className="text-[#0D9488] font-bold ml-1">x</span>
                        </button>
                    </div>

                    {/* Date Picker Custom */}
                    <div className="space-y-1 relative">
                        <label className="text-[#0D9488] dark:text-teal-400 font-bold text-sm ml-1">Date</label>
                        <button
                            onClick={() => {
                                setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                                setShowDatePicker(true);
                            }}
                            className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-3 flex items-center justify-between text-gray-700 dark:text-gray-200 font-semibold text-sm border-2 border-transparent hover:border-teal-200 dark:hover:border-teal-900 transition-all shadow-sm"
                        >
                            <span>{formatDate(date)}</span>
                            <Calendar className="w-4 h-4 text-[#0D9488]" />
                        </button>

                        {/* Modal Calendar */}
                        {showDatePicker && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-black/50"
                                    onClick={() => setShowDatePicker(false)}
                                />

                                {/* Calendar Content */}
                                <div className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-5 w-full max-w-xs border border-white/20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex justify-between items-center mb-5">
                                        <button
                                            onClick={() => changeMonth(-1)}
                                            className="p-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full text-[#0D9488] transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="font-bold text-base text-gray-800 dark:text-white">
                                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button
                                            onClick={() => changeMonth(1)}
                                            className="p-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-full text-[#0D9488] transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-7 text-center mb-3">
                                        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                                            <span key={day} className="text-[9px] font-bold text-gray-400 tracking-wider">
                                                {day}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 text-center gap-y-1">
                                        {[...Array(getFirstDayOfMonth(currentMonth))].map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}

                                        {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                                            const day = i + 1;
                                            const isSelected =
                                                date.getDate() === day &&
                                                date.getMonth() === currentMonth.getMonth() &&
                                                date.getFullYear() === currentMonth.getFullYear();

                                            const isToday =
                                                new Date().getDate() === day &&
                                                new Date().getMonth() === currentMonth.getMonth() &&
                                                new Date().getFullYear() === currentMonth.getFullYear();

                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => handleDateClick(day)}
                                                    className={clsx(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center mx-auto text-sm font-bold transition-all",
                                                        isSelected
                                                            ? "bg-[#ef4444] text-white shadow-lg shadow-red-500/30 scale-110"
                                                            : isToday
                                                                ? "text-[#0D9488] bg-teal-50 dark:bg-teal-900/20"
                                                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                    )}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setShowDatePicker(false)}
                                        className="w-full mt-6 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 active:scale-95 transition-all text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Time Picker Modal */}
                        {showTimePicker && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                                <div className="absolute inset-0 bg-black/50" onClick={() => setShowTimePicker(false)} />
                                <div className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-5 w-full max-w-xs border border-white/20 animate-in fade-in zoom-in-95 duration-200">
                                    <h3 className="text-center font-bold text-gray-800 dark:text-white mb-4">Select Start Time</h3>

                                    <div className="flex justify-center items-center gap-4 h-[120px] mb-6 relative">
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-teal-50 dark:bg-teal-900/20 rounded-xl -z-10 pointer-events-none" />

                                        {/* Hours */}
                                        <div
                                            ref={hourScrollRef}
                                            onScroll={(e) => {
                                                const val = handleInfiniteScroll(e, 24);
                                                if (val !== -1 && val !== tempHour) setTempHour(val);
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, hourScrollRef)}
                                            onMouseMove={(e) => handleMouseMove(e, hourScrollRef)}
                                            onMouseUp={() => handleMouseUpOrLeave(hourScrollRef)}
                                            onMouseLeave={() => handleMouseUpOrLeave(hourScrollRef)}
                                            className="flex-1 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory text-center cursor-grab select-none"
                                        >
                                            {[...Array(24 * 3)].map((_, i) => {
                                                const val = i % 24;
                                                return (
                                                    <div
                                                        key={`hour-${i}`}
                                                        onClick={() => {
                                                            setTempHour(val);
                                                            if (hourScrollRef.current) hourScrollRef.current.scrollTop = (24 + val - 1) * 40;
                                                        }}
                                                        className={clsx(
                                                            "h-10 flex items-center justify-center snap-center cursor-pointer transition-all",
                                                            tempHour === val ? "text-[#0D9488] font-black text-2xl" : "text-gray-300 dark:text-gray-600 text-sm"
                                                        )}
                                                    >
                                                        <span className="leading-none">{val.toString().padStart(2, '0')}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex flex-col h-full items-center justify-center">
                                            <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 mb-1">:</span>
                                        </div>

                                        {/* Minutes */}
                                        <div
                                            ref={minuteScrollRef}
                                            onScroll={(e) => {
                                                const val = handleInfiniteScroll(e, 60);
                                                if (val !== -1 && val !== tempMinute) setTempMinute(val);
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, minuteScrollRef)}
                                            onMouseMove={(e) => handleMouseMove(e, minuteScrollRef)}
                                            onMouseUp={() => handleMouseUpOrLeave(minuteScrollRef)}
                                            onMouseLeave={() => handleMouseUpOrLeave(minuteScrollRef)}
                                            className="flex-1 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory text-center cursor-grab select-none"
                                        >
                                            {[...Array(60 * 3)].map((_, i) => {
                                                const val = i % 60;
                                                return (
                                                    <div
                                                        key={`min-${i}`}
                                                        onClick={() => {
                                                            setTempMinute(val);
                                                            if (minuteScrollRef.current) minuteScrollRef.current.scrollTop = (60 + val - 1) * 40;
                                                        }}
                                                        className={clsx(
                                                            "h-10 flex items-center justify-center snap-center cursor-pointer transition-all",
                                                            tempMinute === val ? "text-[#0D9488] font-black text-2xl" : "text-gray-300 dark:text-gray-600 text-sm"
                                                        )}
                                                    >
                                                        <span className="leading-none">{val.toString().padStart(2, '0')}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowTimePicker(false)}
                                            className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold rounded-xl active:scale-95 transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setStartTime(`${tempHour.toString().padStart(2, '0')}:${tempMinute.toString().padStart(2, '0')}`);
                                                setShowTimePicker(false);
                                            }}
                                            className="flex-1 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 active:scale-95 transition-all text-sm"
                                        >
                                            Set Time
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Speed Picker Modal */}
                        {showSpeedPicker && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                                <div className="absolute inset-0 bg-black/50" onClick={() => setShowSpeedPicker(false)} />
                                <div className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-5 w-full max-w-xs border border-white/20 animate-in fade-in zoom-in-95 duration-200">
                                    <h3 className="text-center font-bold text-gray-800 dark:text-white mb-4">Select Speed</h3>

                                    <div className="flex justify-center items-center gap-4 h-[120px] mb-6 relative">
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-teal-50 dark:bg-teal-900/20 rounded-xl -z-10 pointer-events-none" />

                                        <div
                                            ref={speedScrollRef}
                                            onScroll={(e) => {
                                                const val = handleInfiniteScroll(e, 25);
                                                if (val !== -1 && (val + 1) !== tempSpeed) setTempSpeed(val + 1);
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, speedScrollRef)}
                                            onMouseMove={(e) => handleMouseMove(e, speedScrollRef)}
                                            onMouseUp={() => handleMouseUpOrLeave(speedScrollRef)}
                                            onMouseLeave={() => handleMouseUpOrLeave(speedScrollRef)}
                                            className="flex-1 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory text-center cursor-grab select-none"
                                        >
                                            {[...Array(25 * 3)].map((_, i) => {
                                                const val = (i % 25) + 1;
                                                return (
                                                    <div
                                                        key={`speed-${i}`}
                                                        onClick={() => {
                                                            setTempSpeed(val);
                                                            if (speedScrollRef.current) speedScrollRef.current.scrollTop = (25 + val - 1 - 1) * 40;
                                                        }}
                                                        className={clsx(
                                                            "h-10 flex items-center justify-center snap-center cursor-pointer transition-all",
                                                            tempSpeed === val ? "text-[#0D9488] font-black text-2xl" : "text-gray-300 dark:text-gray-600 text-sm"
                                                        )}
                                                    >
                                                        <span className="leading-none">{val}x</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowSpeedPicker(false)}
                                            className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold rounded-xl active:scale-95 transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSpeed(tempSpeed);
                                                setShowSpeedPicker(false);
                                            }}
                                            className="flex-1 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 active:scale-95 transition-all text-sm"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Event Type Buttons */}


                {/* Play Button */}
                <div className="pt-8 pb-4">
                    <button
                        onClick={handleStart}
                        disabled={!previewUrl}
                        className={clsx(
                            "w-full text-white text-xl font-black py-4 rounded-2xl transition-all duration-300 active:scale-95 shadow-2xl",
                            !previewUrl
                                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-100 dark:border-gray-700 shadow-none"
                                : "bg-gradient-to-r from-[#0D9488] to-[#14b8a6] hover:from-[#0b7e73] hover:to-[#0D9488] shadow-[#0D9488]/40 hover:shadow-[#0D9488]/60"
                        )}
                    >
                        Play
                    </button>
                    {!previewUrl && (
                        <p className="text-center text-[10px] text-gray-400 mt-2 font-bold animate-pulse">
                            Please upload a video to start the demo
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemoSetup;
