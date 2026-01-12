import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
    children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
    return (
        <div className="flex items-center justify-center bg-transparent w-full h-full">
            <div className="relative w-full h-full sm:w-[393px] sm:h-[852px] bg-black sm:rounded-[50px] shadow-2xl sm:border-[14px] border-black overflow-hidden sm:ring-4 ring-gray-900/40 transition-all duration-300">

                {/* Status Bar */}
                <div className="hidden sm:flex absolute top-0 w-full h-11 px-6 items-center justify-between z-[60] pointer-events-none">
                    {/* Time & ISP */}
                    <div className="flex items-center gap-1.5 min-w-[100px]">
                        <span className="text-[14px] font-bold text-gray-900 ml-2">9:41</span>
                        <span className="text-[10px] font-extrabold text-black uppercase tracking-tighter truncate">LG NET</span>
                    </div>

                    {/* Dynamic Island Placeholder (Centered) */}
                    <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-b-[24px] z-50"></div>

                    {/* Status Icons */}
                    <div className="flex items-center gap-1.5 text-gray-900 mr-2 min-w-[80px] justify-end">
                        <Signal className="w-4 h-4" />
                        <Wifi className="w-4 h-4" />
                        <Battery className="w-5 h-5" />
                    </div>
                </div>

                {/* Screen Content */}
                <div className="w-full h-full bg-white relative overflow-hidden">
                    {children}
                </div>

                {/* Home Indicator - Only visible on sm and up */}
                <div className="hidden sm:block absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[140px] h-[5px] bg-black rounded-full z-50 opacity-50"></div>
            </div>
        </div>
    );
};

export default PhoneFrame;
