import React from 'react';
import { ArrowLeft } from 'lucide-react';
// import preloginMascot from '../../assets/prelogin_mascot.png';
import mascotImage from '../../assets/image-16.png';

interface PreLoginScreenProps {
    onBack: () => void;
    onLogin: () => void;
    onRegister: () => void;
}

const PreLoginScreen: React.FC<PreLoginScreenProps> = ({ onBack, onLogin, onRegister }) => {
    return (
        <div className="flex flex-col h-full bg-white relative font-sans">
            {/* Header / Back Button */}
            <div className="px-6 pt-12 pb-2">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors group"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-900 group-hover:-translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Title Section */}
            <div className="px-6 text-center mt-4">
                <h1 className="text-3xl font-bold text-[#0D9488] mb-1 tracking-tight">LifeGuardain</h1>
                <p className="text-gray-400 text-sm">Login or signup to continue</p>
            </div>

            {/* Illustration Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <img
                    src={mascotImage}
                    alt="Celebration Mascot"
                    className="w-full max-w-[260px] object-contain"
                />
            </div>

            {/* Bottom Actions */}
            <div className="px-6 pb-20 w-full space-y-3">
                <button
                    onClick={onRegister}
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-medium py-3.5 rounded-xl shadow-lg shadow-teal-500/20 transition-all"
                >
                    Create account
                </button>
                <button
                    onClick={onLogin}
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-medium py-3.5 rounded-xl shadow-lg shadow-teal-500/20 transition-all"
                >
                    Already have an account
                </button>
            </div>
        </div>
    );
};

export default PreLoginScreen;
