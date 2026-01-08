import React from 'react';

interface PhoneFrameProps {
    children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
            <div className="relative w-[393px] h-[852px] bg-black rounded-[50px] shadow-2xl border-[14px] border-black overflow-hidden ring-4 ring-gray-900/40">
                {/* Dynamic Island */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-b-[24px] z-50"></div>

                {/* Screen Content */}
                <div className="w-full h-full bg-white relative">
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[140px] h-[5px] bg-black rounded-full z-50 opacity-50"></div>
            </div>
        </div>
    );
};

export default PhoneFrame;
