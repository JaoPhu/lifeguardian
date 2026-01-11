import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProfileHeaderProps {
    onBack?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onBack }) => {
    return (
        <div className="w-full flex items-center p-4 pt-12 md:pt-4">
            <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            {/* If a title is needed consistent with other screens but white style */}
            {/* <h1 className="text-xl font-bold ml-2 text-gray-800">Profile</h1> */}
        </div>
    );
};

export default ProfileHeader;
