import React from 'react';
import welcomeHero from '../../assets/welcome_hero.png';

interface WelcomeScreenProps {
    onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden font-sans">
            {/* Illustration Area - Moved down via padding */}
            <div className="flex items-end justify-center pt-24 pb-6">
                <img
                    src={welcomeHero}
                    alt="Welcome Characters"
                    className="w-[55%] max-w-[220px] object-contain mix-blend-multiply"
                />
            </div>

            {/* Content Area - Clustered content */}
            <div className="px-8 flex flex-col items-center text-center z-10 bg-white flex-1">
                {/* Title Section */}
                <span className="text-gray-500 font-medium text-sm mb-1 tracking-wide">welcome to</span>
                <h1 className="text-4xl font-bold text-[#0D9488] tracking-tight mb-8">LifeGuardian</h1>

                {/* Body Text - Moved up (no large spacer above) */}
                <div className="flex flex-col items-center justify-center mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">We're glad you're here.</h2>
                    <p className="text-gray-500 text-base leading-relaxed max-w-[280px]">
                        Your personal guardian for a safer, healthier life.
                    </p>
                </div>

                {/* Button - Moved up (follows body text) */}
                <button
                    onClick={onGetStarted}
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-bold py-4 rounded-lg shadow-lg shadow-teal-500/20 transition-all uppercase tracking-wider"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
