import { useState, useRef } from 'react';
import { Bell, Plus } from 'lucide-react';
import clsx from 'clsx';
import { VideoConfig } from '../types';

interface DemoSetupProps {
    onStart: (config: VideoConfig) => void;
}

const DemoSetup: React.FC<DemoSetupProps> = ({ onStart }) => {
    const [cameraName, setCameraName] = useState('Camera view : Desk');
    const [startTime, setStartTime] = useState('08:00');
    const [speed, setSpeed] = useState(1);
    const [date, setDate] = useState('19/12/2021');
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
        const isoDate = new Date().toISOString().split('T')[0];

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

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="bg-primary-700 pt-14 pb-12 px-6 relative z-10 w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white tracking-wide">Demo</h1>
                    <div className="flex items-center gap-4">
                        <Bell className="w-6 h-6 text-white fill-current" />
                        <div className="w-9 h-9 bg-yellow-100 rounded-full border-2 border-white overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pt-4 z-20 space-y-4 overflow-y-auto pb-20 scrollbar-hide">

                {/* Video Upload Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
                    <div className="px-3 py-2">
                        <span className="text-primary-600 font-bold text-sm">Video</span>
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
                        className="bg-gray-200 aspect-video rounded-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden group cursor-pointer hover:bg-gray-300 transition-colors"
                    >
                        {previewUrl ? (
                            <video src={previewUrl} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                            <>
                                <button className="w-12 h-12 bg-gray-400/50 rounded-full flex items-center justify-center pointer-events-none">
                                    <Plus className="w-6 h-6 text-white" />
                                </button>
                                <span className="text-[10px] text-gray-500 font-medium pointer-events-none">Upload video</span>
                            </>
                        )}
                    </div>
                    <div className="h-4"></div>
                </div>

                {/* Camera Name */}
                <div className="space-y-1">
                    <label className="text-primary-600 font-bold text-sm ml-1">Name Camera</label>
                    <input
                        type="text"
                        value={cameraName}
                        onChange={(e) => setCameraName(e.target.value)}
                        className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-500 font-medium border-none outline-none focus:ring-1 focus:ring-primary-500"
                    />
                </div>

                {/* Config Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <label className="text-[#0D9488] font-bold text-sm ml-1">Start time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-gray-100 rounded-xl px-2 py-3 text-center text-gray-500 font-medium text-sm outline-none focus:ring-1 focus:ring-[#0D9488]"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[#0D9488] font-bold text-sm ml-1">Speed</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="w-full bg-gray-100 rounded-xl px-2 py-3 text-center text-gray-500 font-medium text-sm outline-none focus:ring-1 focus:ring-[#0D9488]"
                                min="1"
                                max="100"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">x</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[#0D9488] font-bold text-sm ml-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-100 rounded-xl px-2 py-3 text-center text-gray-500 font-medium text-sm outline-none focus:ring-1 focus:ring-[#0D9488]"
                        />
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
                                    ? "bg-primary-700 text-white shadow-md shadow-primary-700/20"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
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
                        className="w-full bg-primary-700 hover:bg-primary-800 text-white text-xl font-bold py-4 rounded-xl shadow-lg shadow-primary-700/30 transition-transform active:scale-[0.98]"
                    >
                        Play
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DemoSetup;
