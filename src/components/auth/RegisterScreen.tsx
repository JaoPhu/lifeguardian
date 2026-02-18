import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Check, ChevronLeft } from 'lucide-react';
import appleIcon from '../../assets/icons/apple.png'; // Assuming this exists from LoginScreen
// If appleIcon doesn't exist, I'll need to mock it or handle it.
// Checking LoginScreen again, it imports appleIcon.

interface RegisterScreenProps {
    onBack: () => void;
    onRegister: () => void;
    onLogin: () => void;
    onGoogleLogin?: () => void;
    onAppleLogin?: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack, onRegister, onLogin, onGoogleLogin, onAppleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    return (
        <div className="flex flex-col h-full bg-white relative font-sans overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="pt-16 px-6 pb-2">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors mb-4 group"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-900 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <h1 className="text-3xl font-bold text-[#0D9488] mb-1 tracking-tight">Create account</h1>
                <p className="text-gray-500 text-sm font-normal">Sign up to continue</p>
            </div>

            {/* Form */}
            <div className="flex-1 px-6 pt-6 pb-8 space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-600 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm group-focus-within:shadow-md"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-600 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create password"
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

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Confirm password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-600 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
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

                {/* Terms Checkbox */}
                <div className="flex items-center gap-3 pt-1">
                    <button
                        onClick={() => setAgreeTerms(!agreeTerms)}
                        className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${agreeTerms ? 'bg-teal-600 border-teal-600' : 'bg-white border-gray-400'}`}
                    >
                        {agreeTerms && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </button>
                    <span className="text-gray-500 text-sm">
                        I agree to <span className="font-bold text-gray-700">Terms</span> and <span className="font-bold text-gray-700">Conditions</span>
                    </span>
                </div>

                {/* Register Button */}
                <button
                    onClick={onRegister}
                    className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-lg font-bold py-3.5 rounded-lg shadow-lg shadow-teal-500/20 transition-all mt-4"
                >
                    Create account
                </button>

                {/* Divider */}
                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-4 bg-white text-gray-400">or sign up with</span>
                    </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onGoogleLogin}
                        className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24-2.19-2.6z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">Google</span>
                    </button>
                    <button
                        onClick={onAppleLogin}
                        className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        {/* We use appleIcon from import if it works, else use text or svg */}
                        {/* Assuming import worked similar to LoginScreen */}
                        <img src={appleIcon} alt="" className="w-5 h-5" />
                        <span className="text-sm font-semibold text-gray-700">Apple</span>
                    </button>
                </div>

                {/* Footer Login Link */}
                <div className="pt-4 text-center pb-2">
                    <span className="text-gray-500 text-sm">Already have an account? </span>
                    <button onClick={onLogin} className="text-gray-900 text-sm font-semibold hover:underline">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
