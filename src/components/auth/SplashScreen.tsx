import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(onFinish, 2000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-primary-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-400 to-transparent animate-pulse"></div>

            <div className="z-10 flex flex-col items-center animate-fade-in-up">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary-950/50 transform rotate-3">
                    <Activity className="w-12 h-12 text-primary-600" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">LifeGuardian</h1>
                <p className="text-primary-200 text-sm font-medium tracking-widest uppercase">Senior Safety System</p>
            </div>

            <div className="absolute bottom-10 z-10 w-full px-12">
                <div className="h-1 bg-primary-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-300 w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
