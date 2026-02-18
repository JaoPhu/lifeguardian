import React, { useState } from 'react';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Check, UserCircle } from 'lucide-react';
import clsx from 'clsx';

interface AppleLoginScreenProps {
    onBack: () => void;
    onLoginSuccess: () => void;
}

const AppleLoginScreen: React.FC<AppleLoginScreenProps> = ({ onBack, onLoginSuccess }) => {
    const [step, setStep] = useState<'select-account' | 'credentials'>('select-account');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const renderHeader = () => (
        <div className="pt-8 px-6 pb-2">
            <button
                onClick={step === 'credentials' ? () => setStep('select-account') : onBack}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors mb-4 group"
            >
                <ChevronLeft className="w-6 h-6 text-gray-900 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <h1 className="text-2xl font-bold mb-1 tracking-tight text-[#0D9488]">
                {step === 'credentials' ? 'Sign in with Apple Account' : 'Sign in with Apple'}
            </h1>
            <p className="text-gray-500 text-sm font-normal">
                {step === 'credentials' ? 'to continue to LifeGuardian' : 'Choose an account'}
            </p>
        </div>
    );

    const renderSelectAccount = () => (
        <div className="flex-1 px-6 pt-4 pb-8 space-y-4">
            {/* Mock Account 1 */}
            <div onClick={onLoginSuccess} className="flex items-center gap-4 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <span className="text-xl">🐱</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">Inwhew kaimak</p>
                    <p className="text-xs text-gray-500">บัญชีของท่าน</p>
                </div>
            </div>

            {/* Use Another Account */}
            <div onClick={() => setStep('credentials')} className="flex items-center gap-4 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <UserCircle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">Use another account</p>
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-400 leading-relaxed px-2">
                คุณอ่าน<span className="text-teal-600">นโยบายความเป็นส่วนตัว</span>และ<span className="text-teal-600">ข้อกำหนดในการให้บริการ</span> ของ LifeGuardian ได้ก่อนใช้แอปนี้
            </div>
        </div>
    );

    const renderCredentials = () => (
        <div className="flex-1 px-6 pt-6 pb-8 space-y-5">
            {/* Apple Account */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Apple Account
                </label>
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
                        placeholder="Enter password"
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

            {/* Options */}
            <div className="flex items-center justify-between pt-1">
                <button
                    onClick={() => setKeepLoggedIn(!keepLoggedIn)}
                    className="flex items-center gap-2 group outline-none"
                >
                    <div className={clsx(
                        "w-5 h-5 rounded border flex items-center justify-center transition-all",
                        keepLoggedIn ? "bg-gray-800 border-gray-800" : "bg-white border-gray-400 group-hover:border-gray-500"
                    )}>
                        {keepLoggedIn && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm text-gray-500 font-normal">Keep me logged in</span>
                </button>
                <button className="text-sm font-bold text-gray-700 hover:text-gray-900">
                    Forgot password?
                </button>
            </div>

            {/* Sign In Button */}
            <button
                onClick={onLoginSuccess}
                className="w-full bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-bold py-3.5 rounded-lg shadow-lg shadow-teal-500/20 transition-all mt-4"
            >
                Continue
            </button>

            <div className="mt-8 text-xs text-gray-400 leading-relaxed px-2 text-center">
                คุณอ่าน<span className="text-teal-600">นโยบายความเป็นส่วนตัว</span>และ<span className="text-teal-600">ข้อกำหนดในการให้บริการ</span> ของ LifeGuardian ได้ก่อนใช้แอปนี้
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white relative font-sans overflow-y-auto scrollbar-hide">
            {renderHeader()}
            {step === 'select-account' ? renderSelectAccount() : renderCredentials()}
        </div>
    );
};

export default AppleLoginScreen;
