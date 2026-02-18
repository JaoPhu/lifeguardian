import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
    name: string;
    username: string;
    avatarUrl: string;
    email: string;
    birthDate: string;
    age: string;
    gender: string;
    bloodType: string;
    height: string;
    weight: string;
    medicalCondition: string;
    currentMedications: string;
    drugAllergies: string;
    foodAllergies: string;
    joinedGroups: { id: string, name: string, owner: string, role: string, avatarSeed: string }[];
}

interface UserContextType {
    user: UserProfile;
    updateUser: (updates: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
    name: 'hewkai',
    username: '@Inwhewkaimak',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    email: '@Inwzakai@gmail...',
    birthDate: '06/30/2004',
    age: '21',
    gender: 'Female',
    bloodType: 'O',
    height: '169',
    weight: '68',
    medicalCondition: 'None',
    currentMedications: 'None',
    drugAllergies: 'None',
    foodAllergies: 'Shrimp, Peanuts, ...',
    joinedGroups: []
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>(defaultUser);

    const updateUser = (updates: Partial<UserProfile>) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
