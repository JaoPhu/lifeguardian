import React, { useState, useRef } from 'react';
import { ChevronLeft, Lock } from 'lucide-react';

interface OtpVerificationScreenProps {
    onBack: () => void;
    onContinue: (otp: string) => void;
    email?: string;
}

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({ onBack, onContinue, email = "xxxx@gmail.com" }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto move to next input if value is entered
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle Backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleContinue = () => {
        onContinue(otp.join(''));
    };

    return (
        <div className="flex flex-col h-full bg-white relative font-sans overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="pt-8 px-6 pb-2">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors mb-4 group"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-900 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <h1 className="text-2xl font-bold text-[#0D9488] mb-1 tracking-tight">OTP Verification</h1>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 flex flex-col items-center pt-10">
                {/* Lock Icon */}
                <div className="mb-8 relative flex flex-col items-center">
                    {/* Placeholder compound icon for Lock + **** */}
                    <Lock className="w-16 h-16 text-gray-900 stroke-[1.5] mb-[-10px] z-10 bg-white px-2" />
                    <div className="border border-gray-900 rounded-md px-2 py-1 flex gap-1 -mt-2 pt-4">
                        <span className="text-xl font-bold tracking-widest">****</span>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3">Verification</h2>
                <p className="text-center text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                    Enter the 4-digit that we have sent vai the phone number <span className="text-gray-900 font-medium">{email}</span>
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-between w-full max-w-[280px] mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text" // numeric input but keep as text for simple handling
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-14 h-14 border border-gray-300 rounded-lg text-center text-2xl font-bold text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all shadow-sm"
                        />
                    ))}
                </div>

                {/* Resend & Timer */}
                <div className="flex items-center justify-between w-full max-w-[280px] mb-10 text-xs font-medium">
                    <div>
                        <span className="text-gray-400">Don't have a code? </span>
                        <button className="text-[#0D9488] hover:underline">Re-Send</button>
                    </div>
                    <span className="text-gray-400">01:12</span>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-bold py-3.5 rounded-lg shadow-lg shadow-teal-500/20 transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default OtpVerificationScreen;
