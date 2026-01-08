import React from 'react';
import { Home, Grid, ShieldPlus, Users, Settings } from 'lucide-react';
import clsx from 'clsx';

interface BottomNavProps {
    activeTab: 'overview' | 'layout' | 'status' | 'users' | 'settings';
    onTabChange: (tab: 'overview' | 'layout' | 'status' | 'users' | 'settings') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    // Define tabs with consistent shape
    const tabs = [
        { id: 'overview', icon: Home, label: '', highlight: false },
        { id: 'layout', icon: Grid, label: '', highlight: false },
        { id: 'status', icon: ShieldPlus, label: '', highlight: true },
        { id: 'users', icon: Users, label: '', highlight: false },
        { id: 'settings', icon: Settings, label: '', highlight: false },
    ] as const;

    return (
        <div className="bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 rounded-b-[3.5rem] relative">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={clsx(
                        "flex flex-col items-center justify-center transition-all duration-300",
                        tab.highlight
                            ? "w-12 h-12 bg-gray-600 rounded-full text-white shadow-lg -mt-2 hover:scale-105 active:scale-95"
                            : clsx(activeTab === tab.id ? "text-gray-900" : "text-gray-400 hover:text-gray-600")
                    )}
                >
                    <tab.icon className={clsx("w-7 h-7", tab.highlight ? "w-6 h-6" : "")} strokeWidth={2.5} />
                </button>
            ))}
        </div>
    );
};

export default BottomNav;
