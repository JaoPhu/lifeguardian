import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import MedicalHistory from './MedicalHistory';


// We might want to wrap this in a container that handles the white background if the parent doesn't.
// But based on App.tsx, the content is rendered inside a PhoneFrame.

interface ProfileScreenProps {
    onBack: () => void;
    onEdit?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onEdit }) => {
    // Hardcoded data matching the image
    const profileData = {
        name: 'hewkai',
        username: '@lnwhewkaimak',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', // Placeholder
        gender: 'Female',
        bloodType: 'O',
        age: 21,
        height: 169,
        weight: 68,
        medicalHistory: [
            { type: 'condition', label: 'Medical condition', value: 'None' },
            { type: 'medication', label: 'Current Medications', value: 'None' },
            { type: 'allergy_drug', label: 'Drug Allergies', value: 'None' },
            { type: 'allergy_food', label: 'Food Allergies', value: 'Shrimp, Peanuts, Milk' },
        ] as any[]
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-y-auto scrollbar-hide">
            <ProfileHeader onBack={onBack} />

            <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto">
                <ProfileInfo
                    name={profileData.name}
                    username={profileData.username}
                    avatarUrl={profileData.avatarUrl}
                    onEdit={onEdit}
                />

                <ProfileStats
                    gender={profileData.gender}
                    bloodType={profileData.bloodType}
                    age={profileData.age}
                    height={profileData.height}
                    weight={profileData.weight}
                />

                <MedicalHistory items={profileData.medicalHistory} />
            </div>
        </div>
    );
};

export default ProfileScreen;
