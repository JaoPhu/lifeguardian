import React from 'react';

interface ProfileInfoProps {
    name: string;
    username: string;
    avatarUrl: string;
    onEdit?: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ name, username, avatarUrl, onEdit }) => {
    return (
        <div className="flex flex-col items-center w-full mt-2">
            {/* Avatar Circle */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm mb-4">
                <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Name and Username */}
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <p className="text-gray-400 font-medium mt-1">{username}</p>

            {/* Edit Profile Button */}
            <button
                onClick={onEdit}
                className="mt-6 bg-[#0D9488] text-white font-semibold py-2.5 px-12 rounded-full hover:bg-[#0f766e] transition-colors shadow-sm text-base"
            >
                Edit Profile
            </button>
        </div>
    );
};

export default ProfileInfo;
