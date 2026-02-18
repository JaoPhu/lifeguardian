import React from 'react';
import { Check } from 'lucide-react';

interface PasswordChangedScreenProps {
    onLogin: () => void;
}

const PasswordChangedScreen: React.FC<PasswordChangedScreenProps> = ({ onLogin }) => {
    return (
        <div className="flex flex-col h-full bg-white relative font-sans overflow-y-auto scrollbar-hide items-center justify-center px-6">

            <div className="flex flex-col items-center justify-center w-full max-w-xs text-center">
                {/* Check Icon */}
                <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-teal-500/30">
                    <Check className="w-12 h-12 text-white stroke-[3]" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Password changed</h1>
                <p className="text-gray-500 text-sm mb-10">
                    Your password has been changed successfully
                </p>

                {/* Back to Login Button */}
                <button
                    onClick={onLogin}
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-bold py-3.5 rounded-lg shadow-lg shadow-teal-500/20 transition-all"
                >
                    Back to login
                </button>
            </div>
        </div>
    );
};

export default PasswordChangedScreen;
