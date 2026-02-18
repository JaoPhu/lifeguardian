import React, { useState } from 'react';
import { ChevronLeft, Lock, Eye, EyeOff } from 'lucide-react';

interface ResetPasswordScreenProps {
    onBack: () => void;
    onSubmit: (password: string) => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ onBack, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (!password) {
            alert("Please enter a password");
            return;
        }
        onSubmit(password);
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
                <h1 className="text-2xl font-bold text-[#0D9488] mb-1 tracking-tight">Reset password</h1>
                <p className="text-gray-500 text-sm font-normal">Please type something you’ll remember</p>
            </div>

            {/* Form */}
            <div className="flex-1 px-6 pt-8 pb-8 space-y-5">
                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">New password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-600 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm group-focus-within:shadow-md"
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 outline-none transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Confirm new password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-600 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm group-focus-within:shadow-md"
                        />
                        <button
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 outline-none transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-bold py-3.5 rounded-lg shadow-lg shadow-teal-500/20 transition-all mt-6"
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default ResetPasswordScreen;
