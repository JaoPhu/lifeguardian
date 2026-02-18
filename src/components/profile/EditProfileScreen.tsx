import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Camera, PenLine, User } from 'lucide-react';
import clsx from 'clsx';
import { useUser } from '../../contexts/UserContext';

interface EditProfileScreenProps {
    onBack: () => void;
    onComplete: () => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack, onComplete }) => {
    const { user, updateUser } = useUser();

    // Form State initialized from Context
    const [formData, setFormData] = useState({ ...user });
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync if user context changes externally
    useEffect(() => {
        setFormData({ ...user });
        setAvatarUrl(user.avatarUrl);
    }, [user]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setAvatarUrl(objectUrl);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Update Global Context
        updateUser({
            ...formData,
            avatarUrl: avatarUrl || user.avatarUrl
        });
        onComplete();
    };

    const InputField = ({ label, value, field, width = 'full' }: { label: string, value: string, field: string, width?: 'full' | 'half' }) => (
        <div className={clsx("mb-4", width === 'half' ? 'w-[48%]' : 'w-full')}>
            <label className="block text-sm font-bold text-[#0D9488] mb-1.5 ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <PenLine className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full bg-[#EEEEEE] rounded-lg pl-9 pr-4 py-2.5 text-gray-600 text-sm font-medium outline-none border border-transparent focus:border-teal-500 focus:bg-white transition-all"
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white relative font-sans overflow-hidden">
            {/* Fixed Header */}
            <div className="pt-12 px-4 pb-2 bg-white z-10 w-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    {/* Title can be separate if needed, but for alignment with ProfileHeader we keep the button position consistent */}
                </div>
                <h1 className="text-xl font-bold text-gray-600 mb-6 pl-4">edit profile</h1>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-24">
                {/* Avatar Section */}
                <div className="flex justify-center mb-8 relative">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <div className="w-28 h-28 rounded-full border-2 border-gray-200 p-1">
                            <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center overflow-hidden">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-yellow-600 opacity-50" />
                                )}
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 bg-gray-200 p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-gray-300 transition-colors">
                            <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col">
                    <InputField label="Name" value={formData.name} field="name" />
                    <InputField label="Username" value={formData.username} field="username" />
                    <InputField label="Email" value={formData.email} field="email" />

                    <div className="flex justify-between">
                        <InputField label="Birth Date" value={formData.birthDate} field="birthDate" width="half" />
                        <InputField label="Age" value={formData.age} field="age" width="half" />
                    </div>

                    <div className="flex justify-between">
                        <InputField label="Gender" value={formData.gender} field="gender" width="half" />
                        <InputField label="Blood Type" value={formData.bloodType} field="bloodType" width="half" />
                    </div>

                    <div className="flex justify-between">
                        <InputField label="Height" value={formData.height} field="height" width="half" />
                        <InputField label="Weight" value={formData.weight} field="weight" width="half" />
                    </div>

                    <div className="flex justify-between">
                        <InputField label="Medical condition" value={formData.medicalCondition} field="medicalCondition" />
                        <InputField label="Current Medications" value={formData.currentMedications} field="currentMedications" />
                        <InputField label="Drug Allergies" value={formData.drugAllergies} field="drugAllergies" />
                        <InputField label="Food Allergies" value={formData.foodAllergies} field="foodAllergies" />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6 mb-8">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.98] text-white text-base font-bold py-3 rounded-xl shadow-lg shadow-teal-500/20 transition-all"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onBack}
                        className="flex-1 bg-[#EEEEEE] hover:bg-gray-200 active:scale-[0.98] text-[#0D9488] text-base font-bold py-3 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileScreen;
