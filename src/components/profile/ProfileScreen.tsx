import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import MedicalHistory from './MedicalHistory';
import { useUser } from '../../contexts/UserContext';


// We might want to wrap this in a container that handles the white background if the parent doesn't.
// But based on App.tsx, the content is rendered inside a PhoneFrame.

interface ProfileScreenProps {
    onBack: () => void;
    onEdit?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onEdit }) => {
    const { user } = useUser();

    // Map context user data to medicalHistory array format
    const medicalHistory = [
        { type: 'condition', label: 'Medical condition', value: user.medicalCondition },
        { type: 'medication', label: 'Current Medications', value: user.currentMedications },
        { type: 'allergy_drug', label: 'Drug Allergies', value: user.drugAllergies },
        { type: 'allergy_food', label: 'Food Allergies', value: user.foodAllergies },
    ] as any[];

    return (
        <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
            <ProfileHeader onBack={onBack} />

            <div className="flex-1 overflow-y-auto scrollbar-hide w-full max-w-md mx-auto flex flex-col items-center">
                <ProfileInfo
                    name={user.name}
                    username={user.username}
                    avatarUrl={user.avatarUrl}
                    onEdit={onEdit}
                />

                <ProfileStats
                    gender={user.gender}
                    bloodType={user.bloodType}
                    age={parseInt(user.age) || 0}
                    height={parseInt(user.height) || 0}
                    weight={parseInt(user.weight) || 0}
                />

                <MedicalHistory items={medicalHistory} />
            </div>
        </div>
    );
};

export default ProfileScreen;
