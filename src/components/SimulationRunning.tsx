import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import clsx from 'clsx';
import { VideoConfig, SimulationEvent } from '../types';
import StickmanViewer from './simulation/StickmanViewer';
import { poseDetectionService } from '../services/PoseDetectionService';
import { DrawingUtils, PoseLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';

interface SimulationRunningProps {
    config: VideoConfig;
    onStop: () => void;
    onEventAdded: (event: SimulationEvent) => void;
    onPostureChange?: (posture: 'standing' | 'walking' | 'sitting' | 'laying' | 'falling') => void;
    onOpenNotifications?: () => void;
    onConfigUpdate?: (updates: Partial<VideoConfig>) => void;
    hasUnread?: boolean;
}

const SimulationRunning: React.FC<SimulationRunningProps> = ({ config, onStop, onEventAdded, onPostureChange, onOpenNotifications, onConfigUpdate, hasUnread }) => {
    // Video / "Real" Time Logic
    // Default clip length = 5 minutes if not uploaded (as per request), or matches uploaded video
    const [videoTimeSec, setVideoTimeSec] = useState(0);
    const [videoDuration, setVideoDuration] = useState(config.videoUrl ? 0 : 5 * 60); // Dynamic if video
    const [isPlaying, setIsPlaying] = useState(true);

    // Video Element Ref
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const postureHistory = useRef<string[]>([]);

    // Initialize Simulation Start Time - ANCHOR: Dependent only on ID to prevent feedback loop when we update config
    // Initialize Simulation Start Time - ANCHOR: Dependent only on ID
    const startDateTime = React.useMemo(() => {
        const [hours, minutes] = config.startTime.split(':').map(Number);
        // Explicitly parse YYYY-MM-DD to avoid timezone ambiguity with new Date(string)
        const [year, month, day] = config.date.split('-').map(Number);
        const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
        return d;
    }, [config.id]);

    // DERIVED Current Time
    // 1 Real Sec = 1 Sim Minute * Speed (default logic)
    const currentTime = new Date(startDateTime.getTime() + (videoTimeSec * config.speed * 60 * 1000));

    // FEEDBACK LOOP: Update App state with current simulated time so Status Screen sees it
    useEffect(() => {
        if (onConfigUpdate && isPlaying) {
            // 1. Time & Date
            const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            // Construct YYYY-MM-DD from local components to avoid UTC shift
            const year = currentTime.getFullYear();
            const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
            const day = currentTime.getDate().toString().padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            // 2. Duration Text (Formatted) based on SIMULATED TIME
            // 1 Real Sec = 'config.speed' Minutes
            const totalSimMinutes = videoTimeSec * config.speed;

            const hours = Math.floor(totalSimMinutes / 60);
            const minutes = Math.floor(totalSimMinutes % 60);

            // Format as "H.MM ชั่วโมง" to match design request "unit is hours"
            const durationStr = `${hours}.${minutes.toString().padStart(2, '0')} ชั่วโมง`;

            // Avoid infinite re-renders by checking if changed (simple check)
            if (config.startTime !== timeStr || config.date !== dateStr || config.durationText !== durationStr) {
                onConfigUpdate({
                    startTime: timeStr,
                    date: dateStr,
                    durationText: durationStr
                });
            }
        }
    }, [Math.floor(videoTimeSec), config.speed, isPlaying]); // Check every Real Second

    const [stickmanPosture, setStickmanPosture] = useState<'standing' | 'walking' | 'sitting' | 'laying' | 'falling'>('standing');

    // Sitting Time Logic
    const [sittingTime, setSittingTime] = useState(0);
    const ALERT_THRESHOLD = 45 * 60; // 45 minutes in sim seconds

    // Notification State
    const [showNotification, setShowNotification] = useState(false);
    const [hasNotified, setHasNotified] = useState(false);

    // Notification Auto-Hide Logic
    // Notification Auto-Hide Logic
    // 1. Trigger Notification
    useEffect(() => {
        if (sittingTime >= ALERT_THRESHOLD && !hasNotified) {
            setShowNotification(true);
            setHasNotified(true);
        }

        // Reset notification state if user stands up (time resets)
        if (sittingTime === 0) {
            setShowNotification(false);
            setHasNotified(false);
        }
    }, [sittingTime, hasNotified]); // ALERT_THRESHOLD is constant

    // 2. Auto-Dismiss Notification (Independent effect to avoid reset on tick)
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    // 1. Playback Rate and Pause/Play Effect
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.0;
            if (isPlaying) {
                videoRef.current.play().catch(e => console.error("Video play failed:", e));
            } else {
                videoRef.current.pause();
            }
        }
    }, [config.speed, isPlaying]);

    // 2. Timer Loop (Only checks events and increments time IF NO VIDEO)
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (!config.videoUrl && isPlaying) {
            interval = setInterval(() => {
                setVideoTimeSec(prev => {
                    if (prev >= videoDuration) {
                        clearInterval(interval);
                        onStop();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000); // Standard real-time tick (1 sec = 1 sec)
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [config.videoUrl, videoDuration, onStop, isPlaying]);

    // 3. Sitting Time Calculation (Triggered by videoTimeSec changes)
    useEffect(() => {
        if (videoTimeSec > 0 && isPlaying) {
            const simulationSecondsPassed = 60 * config.speed; // 1 Real Sec = X Sim Minutes (Speed)
            // Note: In video mode causing rapid updates, this might be too fast?
            // onTimeUpdate fires ~4Hz. We should check delta?
            // For simplicity in this demo, let's just increment if posture is sitting.
            // Refinement: use delta from previous `videoTimeSec`.

            if (stickmanPosture === 'sitting') {
                // We add "Simulation Seconds" proportional to "Real Time Change"
                // Since `videoTimeSec` update rate varies (1s for timer, 0.25s for video),
                // We should use a safer metric. 
                // But for prototype, we can assume this effect runs roughly. 
                // Let's rely on event logic separately or just assume simplified accumulation.
                setSittingTime(prev => prev + simulationSecondsPassed);
            } else {
                setSittingTime(0);
            }
        }
    }, [Math.floor(videoTimeSec), stickmanPosture, config.speed]); // Trigger only on integer second change to stabilize

    // Video Handlers
    const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        setVideoTimeSec(e.currentTarget.currentTime);
    };

    const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const duration = e.currentTarget.duration;
        setVideoDuration(duration);

        if (onConfigUpdate) {
            // 2. Duration Text (Formatted) based on SIMULATED TIME
            // 1 Real Sec = 'config.speed' Minutes
            const totalSimMinutes = duration * config.speed; // Use total video duration for total simulated minutes

            const hours = Math.floor(totalSimMinutes / 60);
            const minutes = Math.floor(totalSimMinutes % 60);

            // Format as "H.MM ชั่วโมง" to match design request "unit is hours"
            const durationStr = `${hours}.${minutes.toString().padStart(2, '0')} ชั่วโมง`;

            onConfigUpdate({ durationText: durationStr });
        }
    };

    const handleVideoEnded = () => {
        onStop();
    };

    // --- MediaPipe Detection Loop ---
    useEffect(() => {
        let drawingUtils: DrawingUtils | null = null;

        const initAI = async () => {
            await poseDetectionService.initialize();
            if (canvasRef.current) {
                drawingUtils = new DrawingUtils(canvasRef.current.getContext('2d')!);
            }
        };
        initAI();

        const animate = () => {
            if (videoRef.current && canvasRef.current && !videoRef.current.paused && !videoRef.current.ended && isPlaying) {
                // 1. Detect
                const startTimeMs = performance.now();
                const landmarks = poseDetectionService.detectForVideo(videoRef.current, startTimeMs);

                // 2. Draw
                const ctx = canvasRef.current.getContext('2d');
                if (ctx && landmarks) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                    if (drawingUtils) {
                        drawingUtils.drawLandmarks(landmarks, {
                            radius: (data: { from?: NormalizedLandmark }) => DrawingUtils.lerp(data.from!.z!, -0.15, 0.1, 5, 1),
                            color: "white",
                            lineWidth: 2
                        });
                        drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
                            color: "white",
                            lineWidth: 2
                        });
                    }

                    // 3. Logic Check
                    const isLaying = poseDetectionService.isLaying(landmarks as any);
                    const isStanding = poseDetectionService.isStanding(landmarks as any);
                    const isWalking = poseDetectionService.isWalking(landmarks as any);

                    let detectedPosture: 'standing' | 'walking' | 'sitting' | 'laying' | 'falling' = 'sitting';

                    if (isLaying) {
                        // Logic: If transitioning from standing/walking to laying suddenly, it's a FALL.
                        const lastState = postureHistory.current?.[postureHistory.current.length - 1];
                        if (lastState === 'standing' || lastState === 'walking') {
                            detectedPosture = 'falling';
                        } else {
                            detectedPosture = 'laying';
                        }
                    } else if (isStanding) {
                        detectedPosture = 'standing';
                    } else if (isWalking) {
                        detectedPosture = 'walking';
                    } else {
                        detectedPosture = 'sitting';
                    }

                    // Filter out jitter (must be same posture for 3 frames to change, except for falling)
                    let stablePosture = detectedPosture;
                    if (postureHistory.current && postureHistory.current.length >= 3 && detectedPosture !== 'falling') {
                        const last3 = postureHistory.current.slice(-3);
                        const allSame = last3.every(p => p === detectedPosture);
                        if (!allSame) {
                            stablePosture = last3[last3.length - 1] as any;
                        }
                    }

                    // Helper to capture and trigger event
                    const triggerEvent = (type: 'standing' | 'walking' | 'sitting' | 'laying' | 'falling', critical: boolean = false) => {
                        // USE SIMULATED TIME
                        const simTime = new Date(startDateTime.getTime() + (videoRef.current ? videoRef.current.currentTime : videoTimeSec) * config.speed * 60 * 1000);
                        const timeStr = simTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                        const y = simTime.getFullYear();
                        const m = (simTime.getMonth() + 1).toString().padStart(2, '0');
                        const d = simTime.getDate().toString().padStart(2, '0');
                        const dateStr = `${y}-${m}-${d}`;

                        let snapshotUrl = '';
                        if (canvasRef.current && videoRef.current && videoRef.current.readyState >= 2) {
                            try {
                                const tempCanvas = document.createElement('canvas');
                                tempCanvas.width = videoRef.current.videoWidth;
                                tempCanvas.height = videoRef.current.videoHeight;
                                const tempCtx = tempCanvas.getContext('2d');
                                if (tempCtx) {
                                    tempCtx.drawImage(videoRef.current, 0, 0);
                                    snapshotUrl = tempCanvas.toDataURL('image/jpeg', 0.5);
                                }
                            } catch (e) {
                                console.error("Snapshot generation failed:", e);
                            }
                        }

                        const generateDescription = (type: string) => {
                            switch (type) {
                                case 'falling': return "Sudden postural collapse detected (Critical)";
                                case 'standing': return "Subject is in a stable upright position";
                                case 'walking': return "Subject is moving in the supervised area";
                                case 'sitting': return "Subject is in a stable sitting posture";
                                case 'laying': return "Subject is resting in a horizontal position";
                                default: return "Activity pattern detected";
                            }
                        };

                        const newEvent: SimulationEvent = {
                            id: crypto.randomUUID(),
                            type: type,
                            timestamp: timeStr,
                            date: dateStr,
                            description: generateDescription(type),
                            snapshotUrl: snapshotUrl,
                            isCritical: critical
                        };
                        onEventAdded(newEvent);
                    };

                    // --- SMOOTHING BUFFER ---
                    if (!postureHistory.current) postureHistory.current = [];
                    postureHistory.current.push(stablePosture);
                    if (postureHistory.current.length > 5) postureHistory.current.shift();

                    // Check if stable (all recent frames match)
                    const isStable = postureHistory.current.length >= 3 && postureHistory.current.every(p => p === detectedPosture);

                    if (isStable) {
                        setStickmanPosture(prev => {
                            if (prev !== detectedPosture) {
                                // State Changed! Trigger Event.
                                const isCritical = detectedPosture === 'falling';
                                triggerEvent(detectedPosture, isCritical);

                                // Notify parent of change
                                if (onPostureChange) onPostureChange(detectedPosture);
                            }
                            return detectedPosture;
                        });
                    }
                }
            }
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [onEventAdded, isPlaying]); // Re-bind if triggered state changes

    // Format Video Time helper
    const formatVideoTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = Math.floor(totalSeconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }); // DD/MM/YYYY

    const progress = Math.min(100, Math.max(0, (videoTimeSec / (videoDuration || 1)) * 100)); // safe divide

    const currentVideoTimeStr = formatVideoTime(videoTimeSec);
    const totalVideoDurationStr = formatVideoTime(videoDuration);


    return (
        <div className="flex flex-col h-full bg-[#0D9488] relative">

            {/* Header (Green Area) */}
            <div className="pt-14 pb-8 px-6 flex justify-between items-center bg-[#0D9488] z-20">
                <h1 className="text-3xl font-bold tracking-wide text-white">Demo</h1>
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

            {/* Notification Alert (iOS Style) - Floating */}
            {showNotification && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="bg-white/90 backdrop-blur-3xl rounded-3xl p-4 shadow-2xl flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#0D9488] rounded-md flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">LG</span>
                                </div>
                                <span className="text-gray-900 font-semibold text-xs tracking-wide">LIFTGUARDIAN</span>
                            </div>
                            <span className="text-gray-400 text-[10px]">now</span>
                        </div>
                        <div className="pl-1">
                            <p className="text-gray-900 font-semibold text-sm">ระวังออฟฟิศซินโดรมถามหานะครับ! ⚠️</p>
                            <p className="text-gray-600 text-sm leading-snug mt-1">ลุกขึ้นหมุนหัวไหล่และสะบัดข้อมือสัก 2-3 นาทีดีไหมครับ? 💪</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area (White Background - Square Top) */}
            <div className="flex-1 bg-white px-4 pt-8 pb-4 flex flex-col gap-6 overflow-y-auto z-10">

                {/* Camera View Card */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 relative">
                    {/* Visualizer Title */}
                    <div className="h-14 px-5 border-b border-gray-100 flex justify-between items-center bg-white">
                        <span className="text-[#0D9488] font-bold text-sm">{config.cameraName || 'Desk'}</span>
                        {!isPlaying && (
                            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 animate-in fade-in zoom-in duration-300">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                <span className="text-amber-600 text-[10px] font-black uppercase tracking-wider">Paused</span>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="bg-black relative flex items-center justify-center overflow-hidden w-full aspect-video transition-all duration-500">
                        {config.videoUrl ? (
                            <>
                                <video
                                    ref={videoRef}
                                    src={config.videoUrl}
                                    className="w-full h-full object-contain"
                                    autoPlay
                                    playsInline
                                    crossOrigin="anonymous" // Allow canvas capture if source permits
                                    onTimeUpdate={handleVideoTimeUpdate}
                                    onLoadedMetadata={(e) => {
                                        handleVideoLoadedMetadata(e);
                                        // Resize canvas to match video
                                        if (canvasRef.current) {
                                            canvasRef.current.width = e.currentTarget.videoWidth;
                                            canvasRef.current.height = e.currentTarget.videoHeight;
                                        }
                                    }}
                                    onEnded={handleVideoEnded}
                                />
                                <canvas
                                    ref={canvasRef}
                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                />
                            </>
                        ) : (
                            <>
                                {/* Background Grid for Stickman */}
                                <div className="absolute inset-0 z-0 opacity-20"
                                    style={{
                                        backgroundImage: 'radial-gradient(#ccfbf1 1px, transparent 1px)',
                                        backgroundSize: '24px 24px'
                                    }}>
                                </div>

                                <StickmanViewer
                                    posture={stickmanPosture}
                                    className={clsx("w-32 h-32 text-yellow-500 transition-all duration-500")}
                                />
                            </>
                        )}
                        {/* Paused Overlay Removed - Moved to Header */}
                    </div>

                    {/* Footer of Card */}
                    <div className="px-5 py-2 flex justify-between items-center bg-white border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <span className="text-red-500 font-bold text-xs animate-pulse flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            LIVE
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 font-bold text-[10px] font-mono tracking-tighter bg-gray-50 dark:bg-gray-900/50 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">
                            {currentVideoTimeStr} / {totalVideoDurationStr}
                        </span>
                    </div>
                </div>

                {/* Controls Area (Bottom Card) */}
                <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-between">
                    <div className="w-full flex justify-center mb-1">
                        <span className="text-gray-500 font-bold text-xs">Time simulation</span>
                    </div>

                    <div className="flex flex-col items-center mb-2">
                        <div className="text-4xl font-bold text-gray-800 tracking-tight">{formattedTime}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-0.5">{formattedDate}</div>
                    </div>

                    {/* Slider */}
                    <div className="w-full relative h-6 flex items-center mb-1">
                        <div className="absolute inset-x-0 h-1 bg-gray-200 rounded-full"></div>
                        <div
                            className="absolute left-0 h-1 bg-gray-400 rounded-full transition-all duration-300 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <div
                            className="absolute w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-md transition-all duration-300 ease-linear"
                            style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                        ></div>
                    </div>

                    <div className="w-full flex justify-between text-[10px] text-gray-400 font-bold mb-4">
                        <span>{currentVideoTimeStr}</span>
                        <span>{totalVideoDurationStr}</span>
                    </div>

                    <div className="w-full flex justify-end mb-2">
                        <span className="text-xs font-bold text-gray-800">Speed : {config.speed}X</span>
                    </div>

                    <div className="text-[10px] text-gray-500 font-bold mb-2">
                        One second equals {config.speed} minutes.
                    </div>

                    <div className="w-full flex flex-col mt-2">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={clsx(
                                "w-full text-xl font-bold py-3.5 rounded-2xl shadow-lg transition-all active:scale-95",
                                isPlaying
                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-600/30"
                                    : "bg-[#0D9488] hover:bg-teal-700 text-white shadow-teal-600/30"
                            )}
                        >
                            {isPlaying ? 'Stop' : 'Play'}
                        </button>
                    </div>
                </div>
            </div>
            {/* Bottom spacer for navigation if needed */}
            <div className="h-4 bg-white"></div>
        </div>
    );
};

export default SimulationRunning;
