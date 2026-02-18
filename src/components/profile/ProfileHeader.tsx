import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ProfileHeaderProps {
    onBack?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onBack }) => {
    return (
        <div className="w-full flex flex-col pt-12 px-4 pb-2 bg-white z-10">
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
                </button>
            </div>
            <h1 className="text-xl font-bold text-gray-600 mb-6 pl-4">Profile</h1>
        </div>
    );
};

export default ProfileHeader;
