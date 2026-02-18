import React, { useState } from 'react';
import { ChevronLeft, Mail } from 'lucide-react';

interface ForgotPasswordScreenProps {
    onBack: () => void;
    onSend: (email: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBack, onSend }) => {
    const [email, setEmail] = useState('');

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
                <h1 className="text-2xl font-bold text-[#0D9488] mb-1 tracking-tight">Forgot password</h1>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 flex flex-col items-center pt-10">
                {/* Big Mail Icon */}
                <div className="mb-8 relative">
                    {/* Placeholder for the line-art mail icon in design. Using Lucide with some compounding/styling */}
                    <div className="w-24 h-24 flex items-center justify-center">
                        <Mail className="w-20 h-20 text-gray-900 stroke-[1.5]" />
                        {/* We could try to overlay a checkmark if needed, but standard Mail is fine for now or maybe MailCheck */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-1 bg-white rounded-full p-1">
                            <div className="rounded-full border-2 border-gray-900 p-0.5">
                                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3">Verify Email</h2>
                <p className="text-center text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                    Enter your email or number then we will send you a code to reset your password
                </p>

                {/* Email Input */}
                <div className="w-full mb-8">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-600 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your gmail"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm group-focus-within:shadow-md"
                        />
                    </div>
                </div>

                {/* Send Button */}
                <button
                    onClick={() => onSend(email)}
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-bold py-3.5 rounded-lg shadow-lg shadow-teal-500/20 transition-all"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;
