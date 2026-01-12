import React from 'react';

interface StickmanViewerProps {
    posture: 'standing' | 'sitting' | 'laying' | 'falling' | 'walking';
    className?: string;
}

const StickmanViewer: React.FC<StickmanViewerProps> = ({ posture, className }) => {
    // Simple Stickman using SVG
    const getPath = () => {
        switch (posture) {
            case 'sitting':
                return (
                    <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <circle cx="50" cy="35" r="12" />
                        <path d="M50 47 L50 85" />
                        <path d="M50 85 L85 85" />
                        <path d="M85 85 L85 130" />
                        <path d="M50 55 L75 75" />
                    </g>
                );
            case 'laying':
                return (
                    <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <circle cx="20" cy="110" r="12" />
                        <path d="M32 110 L90 110" />
                        <path d="M40 110 L40 90" />
                        <path d="M70 110 L70 90" />
                    </g>
                );
            case 'falling':
                return (
                    <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <g transform="rotate(45, 50, 75)">
                            <circle cx="50" cy="30" r="12" />
                            <path d="M50 42 L50 90" />
                            <path d="M50 90 L30 130" />
                            <path d="M50 90 L70 130" />
                            <path d="M50 50 L10 40" />
                            <path d="M50 50 L90 40" />
                        </g>
                        <path d="M90 20 L80 40" strokeWidth="3" strokeOpacity="0.6" />
                        <path d="M95 30 L85 50" strokeWidth="3" strokeOpacity="0.6" />
                    </g>
                );
            case 'walking':
                return (
                    <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <circle cx="50" cy="25" r="12" />
                        <path d="M50 37 L50 85" />
                        <path d="M50 85 L35 135" />
                        <path d="M50 85 L65 110 L75 135" />
                        <path d="M50 50 L75 65" />
                        <path d="M50 50 L25 40" />
                    </g>
                );
            case 'standing':
            default:
                return (
                    <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        <circle cx="50" cy="25" r="12" />
                        <path d="M50 37 L50 85" />
                        <path d="M50 85 L35 135" />
                        <path d="M50 85 L65 135" />
                        <path d="M50 50 L25 70" />
                        <path d="M50 50 L75 70" />
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
