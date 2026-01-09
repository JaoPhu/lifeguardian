import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { ArrowLeft, Eye, EyeOff, Activity, Bug } from 'lucide-react';
import { poseDetectionService, PoseLandmark } from '../services/PoseDetectionService';
import clsx from 'clsx';

interface AIDebugScreenProps {
    onBack: () => void;
}

const AIDebugScreen: React.FC<AIDebugScreenProps> = ({ onBack }) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [statusText, setStatusText] = useState('Initializing...');
    const [eventLog, setEventLog] = useState<string[]>([]);

    // Configurable Parameters (for tuning)
    const [fallThreshold, setFallThreshold] = useState(0.35); // Matches default heuristic
    const [minConfidence, setMinConfidence] = useState(0.5); // Visbility threshold

    const requestRef = useRef<number>();
    const lastVideoTimeRef = useRef<number>(-1);

    useEffect(() => {
        const initAI = async () => {
            try {
                await poseDetectionService.initialize();
                setStatusText('AI Ready. Start Camera.');
            } catch (err) {
                console.error("AI Init Failed", err);
                setStatusText('AI Init Failed');
            }
        };
        initAI();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const runDetection = async () => {
        if (!webcamRef.current || !webcamRef.current.video || !canvasRef.current) return;

        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.readyState === 4 && video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime;

            // Ensure canvas matches video size
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            try {
                const startTimeMs = performance.now();
                const landmarks = poseDetectionService.detectForVideo(video, startTimeMs);

                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame

                    if (landmarks) {
                        // Check falling custom logic
                        // We can override the service logic here locally to test threshold sliders
                        const nose = landmarks[0];
                        const leftAnkle = landmarks[27];
                        const rightAnkle = landmarks[28];
                        const ankleY = (leftAnkle.y + rightAnkle.y) / 2;
                        const heightDiff = Math.abs(nose.y - ankleY);

                        const isFalling = heightDiff < fallThreshold; // Use slider value

                        if (showSkeleton) {
                            drawSkeleton(ctx, landmarks, isFalling);
                        }

                        if (isFalling) {
                            // Throttle logs slightly?
                            // addLog('⚠️ FALL DETECTED'); 
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            setStatusText('ADT: FALLING!');
                        } else {
                            setStatusText('ADT: Normal');
                        }
                    } else {
                        setStatusText('ADT: No Pose');
                    }
                }
            } catch (err) {
                console.error("Detection error:", err);
            }
        }

        if (isDetecting) {
            requestRef.current = requestAnimationFrame(runDetection);
        }
    };

    const drawSkeleton = (ctx: CanvasRenderingContext2D, landmarks: PoseLandmark[], isAlert: boolean) => {
        // Draw Points
        landmarks.forEach((landmark) => {
            if (landmark.visibility > minConfidence) {
                const x = landmark.x * ctx.canvas.width;
                const y = landmark.y * ctx.canvas.height;

                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = isAlert ? '#ef4444' : '#2dd4bf'; // Red if falling, Teal normal
                ctx.fill();
            }
        });

        // Simple connections (just for visual aid)
        // MediaPipe Pose Connections (Simplified subset)
        const connections = [
            [11, 12], [11, 23], [12, 24], [23, 24], // Torso
            [11, 13], [13, 15], [12, 14], [14, 16], // Arms
            [23, 25], [25, 27], [24, 26], [26, 28]  // Legs
        ];

        ctx.strokeStyle = isAlert ? '#fca5a5' : '#99f6e4';
        ctx.lineWidth = 2;

        connections.forEach(([i, j]) => {
            const p1 = landmarks[i];
            const p2 = landmarks[j];
            if (p1 && p2 && p1.visibility > minConfidence && p2.visibility > minConfidence) {
                ctx.beginPath();
                ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
                ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
                ctx.stroke();
            }
        });
    };

    const toggleDetection = () => {
        if (isDetecting) {
            setIsDetecting(false);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            setStatusText('Paused');
        } else {
            setIsDetecting(true);
            requestRef.current = requestAnimationFrame(runDetection);
            setStatusText('Detecting...');
        }
    };

    // const addLog = (msg: string) => {
    //     setEventLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)]); 
    // };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative transition-colors duration-300">
            {/* Header */}
            <div className="pt-14 pb-8 px-6 bg-white dark:bg-gray-800 flex items-center gap-4 z-20 shadow-md transition-colors duration-300">
                <ArrowLeft className="w-6 h-6 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={onBack} />
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Bug className="w-6 h-6 text-[#0D9488] dark:text-teal-400" /> AI Debug Playground
                </h1>
            </div>

            {/* Viewport */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    screenshotFormat="image/jpeg"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                />

                {/* Status Overlay */}
                <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs font-mono border border-teal-500/50 text-teal-300">
                    STATUS: {statusText}
                </div>
            </div>

            {/* Controls Panel */}
            <div className="h-64 bg-white dark:bg-gray-800 p-4 rounded-t-2xl z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex flex-col gap-4 transition-colors duration-300">

                {/* Toggles */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleDetection}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all w-32 justify-center text-white",
                            isDetecting ? "bg-red-500 hover:bg-red-600 shadow-md" : "bg-[#0D9488] hover:bg-teal-700 shadow-md"
                        )}
                    >
                        {isDetecting ? 'STOP' : 'START'}
                        <Activity className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => setShowSkeleton(!showSkeleton)}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors"
                    >
                        {showSkeleton ? <Eye className="w-5 h-5 text-[#0D9488] dark:text-teal-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    </button>
                </div>

                {/* Sliders */}
                <div className="space-y-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
                            <span>Fall Threshold (Height Diff &lt; X)</span>
                            <span className="text-[#0D9488] dark:text-teal-400">{fallThreshold.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0.1" max="0.8" step="0.01"
                            value={fallThreshold}
                            onChange={(e) => setFallThreshold(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#0D9488] dark:accent-teal-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
                            <span>Min Visibility Confidence</span>
                            <span className="text-[#0D9488] dark:text-teal-400">{minConfidence.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.05"
                            value={minConfidence}
                            onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#0D9488] dark:accent-teal-500"
                        />
                    </div>
                </div>

                <div className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-auto">
                    Adjust threshold to calibrate fall detection sensitivity.
                </div>
            </div>
        </div>
    );
};

export default AIDebugScreen;
