import React from 'react';
import { HeartPulse, Pill, X, LucideIcon } from 'lucide-react';

export interface MedicalHistoryItem {
    type: 'condition' | 'medication' | 'allergy_drug' | 'allergy_food';
    label: string;
    value: string;
}

interface MedicalHistoryProps {
    items: MedicalHistoryItem[];
}

const getIconForType = (type: MedicalHistoryItem['type']): LucideIcon => {
    switch (type) {
        case 'condition': return HeartPulse;
        case 'medication': return Pill;
        case 'allergy_drug': return X;
        case 'allergy_food': return X;
        default: return HeartPulse;
    }
};

const getLabelForType = (type: MedicalHistoryItem['type']): string => {
    switch (type) {
        case 'condition': return 'Medical condition';
        case 'medication': return 'Current Medications';
        case 'allergy_drug': return 'Drug Allergies';
        case 'allergy_food': return 'Food Allergies';
        default: return '';
    }
};

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ items }) => {
    return (
        <div className="w-full px-6 pb-8">
            <div className="bg-gray-100/80 rounded-[2rem] p-6 shadow-sm">
                <h3 className="text-[#0D9488] font-bold text-lg mb-6">Medical history</h3>

                <div className="space-y-6">
                    {items.map((item, index) => {
                        const Icon = getIconForType(item.type);
                        const label = item.label || getLabelForType(item.type);

                        return (
                            <div key={index} className="flex items-start gap-4">
                                <div className="mt-1">
                                    <Icon className="w-6 h-6 text-[#0D9488] stroke-[2.5px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#0D9488] font-bold text-sm">
                                        {label}
                                    </span>
                                    <span className="text-gray-500 text-sm mt-0.5 font-medium">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MedicalHistory;
