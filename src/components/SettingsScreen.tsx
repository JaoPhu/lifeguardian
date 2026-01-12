import React from 'react';
import {
    ChevronRight,
    Bell,
    Bug,
    ArrowLeft,
    Lock,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';

interface SettingsScreenProps {
    onNavigate: (screen: string) => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate, isDarkMode, onToggleTheme }) => {

    // Default Profile Data
    const profile = {
        name: 'Profile',
        username: '@Profile',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    };

    const menuItems = [
        { icon: Bug, label: 'AI Debug', id: 'ai-debug' }, // Status removed
    ];

    return (
        <div className={clsx("flex flex-col h-full relative transition-colors duration-300", isDarkMode ? "bg-gray-900" : "bg-[#FAFAFA]")}>
            {/* Header */}
            <div className="pt-14 pb-8 px-6 bg-[#0D9488] shadow-md z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => onNavigate('overview')} />
                        <h1 className="text-2xl font-bold">Settings</h1>
                    </div>
                    {/* Notification Icon - Matches Dashboard Style (White Filled) */}
                    <div className="relative cursor-pointer">
                        <Bell className="w-6 h-6 text-white fill-current" />
                    </div>
                </div>
            </div>

            {/* Profile Card Container */}
            <div className={clsx("px-6 -mt-0 pt-6 pb-4 z-10 transition-colors duration-300", isDarkMode ? "bg-gray-900" : "bg-[#FAFAFA]")}>
                <div
                    onClick={() => onNavigate('profile')}
                    className={clsx("rounded-[1.5rem] p-4 shadow-lg flex items-center gap-4 transition-colors duration-300 cursor-pointer hover:bg-opacity-90", isDarkMode ? "bg-gray-800" : "bg-white")}
                >
                    <div className={clsx("w-16 h-16 rounded-full overflow-hidden border-2 shadow-inner", isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-100")}>
                        <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h2 className={clsx("text-xl font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{profile.name}</h2>
                        <p className={clsx("text-sm font-medium", isDarkMode ? "text-gray-400" : "text-gray-500")}>{profile.username}</p>
                        <p className={clsx("text-xs mt-1", isDarkMode ? "text-gray-500" : "text-gray-300")}>life guardian account</p>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 px-6 z-20 pb-24 overflow-y-auto scrollbar-hide space-y-4">

                {/* Theme Toggle */}
                <div className={clsx("rounded-full p-1.5 shadow-sm flex items-center justify-between border transition-colors duration-300", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100")}>
                    <div className={clsx("flex-1 text-center py-2 text-sm font-bold transition-colors", isDarkMode ? "text-gray-400" : "text-gray-700")}>Light Mode</div>
                    <div className={clsx("w-px h-6", isDarkMode ? "bg-gray-700" : "bg-gray-200")}></div>
                    <div className="flex-1 flex justify-between items-center px-4 text-gray-400 text-sm font-medium cursor-pointer" onClick={onToggleTheme}>
                        <div className={clsx("mr-2", isDarkMode && "text-white font-bold")}>Dark Mode</div>
                        <div className={clsx("w-10 h-6 rounded-full p-1 transition-colors duration-300", isDarkMode ? "bg-teal-500" : "bg-gray-300")}>
                            <div className={clsx("w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300", isDarkMode ? "translate-x-4" : "")} />
                        </div>
                    </div>
                </div>

                {/* Menu List */}
                <div className={clsx("rounded-[2rem] shadow-sm border overflow-hidden transition-colors duration-300", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100")}>
                    {menuItems.map((item, idx) => (
                        <div
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={clsx(
                                "flex items-center gap-4 p-4 cursor-pointer transition-colors",
                                isDarkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-50 text-gray-700",
                                idx !== menuItems.length - 1 && (isDarkMode ? "border-b border-gray-700" : "border-b border-gray-100")
                            )}
                        >
                            <item.icon className={clsx("w-6 h-6 fill-current", isDarkMode ? "text-gray-200" : "text-black")} />
                            <span className="flex-1 font-medium text-base">{item.label}</span>
                            <ChevronRight className={clsx("w-5 h-5", isDarkMode ? "text-gray-500" : "text-gray-400")} />
                        </div>
                    ))}

                    {/* Reset Password */}
                    <div className={clsx("flex items-center gap-4 p-4 cursor-pointer border-t transition-colors", isDarkMode ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-50 border-gray-100")}>
                        <Lock className="w-6 h-6 text-red-500 mr-2" />
                        <span className="flex-1 text-red-500 font-medium text-base">Reset Password</span>
                    </div>

                    {/* Logout */}
                    <div className={clsx("flex items-center gap-4 p-4 cursor-pointer border-t transition-colors", isDarkMode ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-50 border-gray-100")}>
                        <LogOut className="w-6 h-6 text-red-500 mr-2" />
                        <span className="flex-1 text-red-500 font-medium text-base">Logout</span>
                    </div>
                </div>

                <div className="text-center text-gray-500 text-xs mt-4 pb-4">
                    version 1.0.0
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
