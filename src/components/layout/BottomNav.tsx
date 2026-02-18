import { Home, BarChart2, ShieldPlus, Users, Settings } from 'lucide-react';
import clsx from 'clsx';

interface BottomNavProps {
    activeTab: 'overview' | 'statistics' | 'status' | 'users' | 'settings' | 'notifications';
    onTabChange: (tab: 'overview' | 'statistics' | 'status' | 'users' | 'settings' | 'notifications') => void;
    status?: 'none' | 'normal' | 'warning' | 'emergency';
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, status: _status = 'normal' }) => {
    // Define tabs with consistent shape
    const tabs = [
        { id: 'overview', icon: Home, label: '', highlight: false },
        { id: 'statistics', icon: BarChart2, label: '', highlight: false }, // 2nd item is Statistics
        { id: 'status', icon: ShieldPlus, label: '', highlight: true },
        { id: 'users', icon: Users, label: '', highlight: false }, // Keeping users as 4th
        { id: 'settings', icon: Settings, label: '', highlight: false },
    ] as const;

    return (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center z-50 rounded-b-[3.5rem] relative transition-colors duration-300">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id as any)}
                    className={clsx(
                        "flex flex-col items-center justify-center transition-all duration-300",
                        tab.highlight
                            ? "w-12 h-12 bg-[#0D9488] rounded-full text-white shadow-lg -mt-2 hover:scale-105 active:scale-95 shadow-teal-500/40 transition-all duration-300"
                            : clsx(activeTab === tab.id ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400")
                    )}
                >
                    <tab.icon className={clsx("w-7 h-7", tab.highlight ? "w-6 h-6" : "")} strokeWidth={2.5} />
                </button>
            ))}
        </div>
    );
};

export default BottomNav;
