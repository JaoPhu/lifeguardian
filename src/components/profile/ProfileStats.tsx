import React from 'react';
import { User } from 'lucide-react';

interface ProfileStatsProps {
    gender: string; // 'Male' | 'Female' | 'Other'
    bloodType: string;
    age: number;
    height: number;
    weight: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ gender, bloodType, age, height, weight }) => {
    return (
        <div className="w-full px-8 py-8">
            {/* Top Row: Gender and Blood Type */}
            <div className="flex justify-between items-start mb-8 px-8">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-gray-500 font-medium text-sm">Gender</span>
                    <div className="text-gray-700">
                        {/* Using a generic User icon for Gender as placeholder if specific gender icons not available/passed */}
                        {/* In a real app we might switch icon based on gender string */}
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" title={gender}>
                            <User className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-gray-500 font-medium text-sm">Blood Type</span>
                    <span className="text-xl font-semibold text-gray-800">{bloodType}</span>
                </div>
            </div>

            {/* Bottom Row: Age, Height, Weight */}
            <div className="flex justify-between items-center px-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-gray-500 font-medium text-sm">Age</span>
                    <span className="text-xl font-semibold text-gray-800">{age}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-gray-500 font-medium text-sm">Height</span>
                    <span className="text-xl font-semibold text-gray-800">{height}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-gray-500 font-medium text-sm">Weight</span>
                    <span className="text-xl font-semibold text-gray-800">{weight}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileStats;
