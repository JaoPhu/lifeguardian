import React from 'react';

interface StickmanViewerProps {
    posture: 'standing' | 'sitting' | 'laying' | 'falling';
    className?: string;
}

const StickmanViewer: React.FC<StickmanViewerProps> = ({ posture, className }) => {
    // Simple Stickman using SVG
    // This is a simplified representation. In a real system this would be 3D skeleton data.

    const getPath = () => {
        switch (posture) {
            case 'sitting':
                return (
                    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {/* Head */}
                        <circle cx="50" cy="30" r="10" />
                        {/* Torso */}
                        <path d="M50 40 L50 80" />
                        {/* Legs (Sitting) */}
                        <path d="M50 80 L30 90 M30 90 L30 120" />
                        <path d="M50 80 L70 90 M70 90 L70 120" />
                        {/* Arms (Resting) */}
                        <path d="M50 50 L30 60 M30 60 L40 70" />
                        <path d="M50 50 L70 60 M70 60 L60 70" />
                    </g>
                );
            case 'laying':
                return (
                    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {/* Head */}
                        <circle cx="20" cy="110" r="10" />
                        {/* Torso */}
                        <path d="M30 110 L70 110" />
                        {/* Legs */}
                        <path d="M70 110 L100 110" />
                        <path d="M70 110 L100 115" />
                        {/* Arms */}
                        <path d="M35 110 L50 100" />
                        <path d="M35 110 L50 120" />
                    </g>
                );
            case 'falling':
                return (
                    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {/* Head */}
                        <circle cx="40" cy="50" r="10" />
                        {/* Torso */}
                        <path d="M40 60 L60 80" />
                        {/* Legs (Flailing) */}
                        <path d="M60 80 L40 100" />
                        <path d="M60 80 L80 90" />
                        {/* Arms (Flailing) */}
                        <path d="M45 65 L20 50" />
                        <path d="M45 65 L70 50" />

                        {/* Motion lines */}
                        <path d="M80 40 L90 30" strokeOpacity="0.5" strokeWidth="2" />
                        <path d="M10 80 L5 90" strokeOpacity="0.5" strokeWidth="2" />
                    </g>
                );
            case 'standing':
            default:
                return (
                    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {/* Head */}
                        <circle cx="50" cy="30" r="10" />
                        {/* Torso */}
                        <path d="M50 40 L50 90" />
                        {/* Legs */}
                        <path d="M50 90 L30 130" />
                        <path d="M50 90 L70 130" />
                        {/* Arms */}
                        <path d="M50 50 L20 70" />
                        <path d="M50 50 L80 70" />
                    </g>
                );
        }
    };

    return (
        <div className={`relative ${className}`}>
            <svg viewBox="0 0 100 150" className="w-full h-full text-current">
                {getPath()}
            </svg>
        </div>
    );
};

export default StickmanViewer;
