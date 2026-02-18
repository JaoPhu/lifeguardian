import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Bell, ChevronLeft, ChevronRight, Armchair, Footprints, AlertTriangle, Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, LabelList } from 'recharts';
import clsx from 'clsx';
import { SimulationEvent } from '../../types';

interface StatisticsScreenProps {
    events: SimulationEvent[];
    onOpenProfile?: () => void;
    onOpenNotifications?: () => void;
    hasUnread?: boolean;
}

// Custom Label for Weekly Chart Alert
const renderCustomAlert = (props: any) => {
    const { x, y, width, value } = props;
    if (value > 0) {
        return (
            <g>
                <foreignObject x={x + width / 2 - 10} y={y - 25} width={20} height={20}>
                    <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-xs">!</span>
                    </div>
                </foreignObject>
            </g>
        );
    }
    return null;
};

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ events, onOpenProfile, onOpenNotifications, hasUnread }) => {
    const { user } = useUser();
    // Mock Data
    const [selectedDate, setSelectedDate] = useState(new Date()); // Start at Today
    const [currentMonth, setCurrentMonth] = useState(new Date()); // State for currently viewed month
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Format Date: DD/MM/YY (Thai Year)
    const formatDate = (date: Date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = (date.getFullYear() + 543).toString().slice(-2); // BE Year 2 digits
        const isToday = date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();
        return `${isToday ? 'Today' : ''} ${d}/${m}/${y}`.trim();
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
        setShowDatePicker(false);
    };

    const changeMonth = (offset: number) => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
        setCurrentMonth(newMonth);
    };

    // Helper to get days in month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Helper to get day of week for start of month (0 = Sun, 6 = Sat)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Helper to parse duration string "X.XX hr" to minutes
    const parseDurationToMinutes = (durationStr?: string) => {
        if (!durationStr) return 0;
        // Handle "3.27 hr", "3.27hr", "3 hr", etc.
        const cleanStr = durationStr.toLowerCase().replace('hr', '').trim().replace(',', '.');
        const hours = parseFloat(cleanStr);
        return isNaN(hours) ? 0 : Math.round(hours * 60);
    };

    // Helper to get color for state
    const getColorForState = (state: string) => {
        switch (state.toLowerCase()) {
            case 'sitting':
            case 'laying':
                return '#3b82f6'; // Blue-500
            case 'falling':
                return '#ef4444'; // Red-500
            case 'walking':
            case 'standing':
                return '#10b981'; // Emerald-500
            default:
                return '#e5e7eb'; // Gray-200
        }
    };

    // Calculate segments for the timeline
    const timelineSegments: { name: string; value: number; color: string }[] = [];

    // 1. Find all events that overlap with the selected date (00:00 - 24:00)
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(24, 0, 0, 0); // Next day 00:00

    const todaysSegments: { start: number; end: number; type: string }[] = [];

    (events || []).forEach(e => {
        if (!e.date || !e.timestamp) return;

        // Parse Event Start
        const [y, m, d] = e.date.split('-').map(Number);
        const [hh, mm] = e.timestamp.split(':').map(Number);
        const eventStart = new Date(y, m - 1, d, hh, mm);

        // Parse Duration & End
        const durationMins = parseDurationToMinutes(e.duration);
        if (durationMins <= 0) return; // Skip instantaneous or invalid events for chart

        const eventEnd = new Date(eventStart.getTime() + durationMins * 60000);

        // Check Overlap
        const overlapStart = eventStart < dayStart ? dayStart : eventStart;
        const overlapEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

        if (overlapEnd > overlapStart) {
            // Convert to minutes from midnight (0 - 1440)
            const startMins = Math.floor((overlapStart.getTime() - dayStart.getTime()) / 60000);
            const endMins = Math.floor((overlapEnd.getTime() - dayStart.getTime()) / 60000);

            todaysSegments.push({
                start: startMins,
                end: endMins,
                type: e.type.toLowerCase().trim()
            });
        }
    });

    // 2. Sort segments by start time
    todaysSegments.sort((a, b) => a.start - b.start);

    // 3. Build continuous timeline with gaps
    let cursorTime = 0; // Minutes from 00:00

    todaysSegments.forEach(seg => {
        // Gap before this segment
        if (seg.start > cursorTime) {
            timelineSegments.push({
                name: 'Empty',
                value: seg.start - cursorTime,
                color: '#ffffff' // White for empty space
            });
        }

        // The segment itself
        // Handle overlaps? (Simple case: assume sequential or prioritize latest)
        // For strictly correct visualization if overlaps exist, logic gets complex. 
        // Assuming "lifeguardian" events don't overlap (single camera subject).
        // But if they technically overlap due to slight data errors, clamp it using new cursor.
        const effectiveStart = Math.max(cursorTime, seg.start);
        const duration = seg.end - effectiveStart;

        if (duration > 0) {
            timelineSegments.push({
                name: seg.type,
                value: duration,
                color: getColorForState(seg.type)
            });
            cursorTime = effectiveStart + duration;
        }
    });

    // 4. Fill remaining day
    if (cursorTime < 24 * 60) {
        timelineSegments.push({
            name: 'Empty',
            value: (24 * 60) - cursorTime,
            color: '#ffffff'
        });
    }

    // Determine hasData for the UI states
    const hasData = todaysSegments.length > 0;

    // Recalculate counts based on DURATION (Hours)
    // Filter segments for explicit types and sum up duration
    const getDurationHours = (types: string[]) => {
        const totalMins = todaysSegments
            .filter(s => types.includes(s.type))
            .reduce((acc, curr) => acc + (curr.end - curr.start), 0);
        return (totalMins / 60).toFixed(1);
    };

    const relaxHours = getDurationHours(['sitting', 'laying']);
    const workHours = getDurationHours(['working']); // Assuming 'working' type exists or is mapped
    const walkHours = getDurationHours(['walking', 'standing']);

    // Falls are point events, keep count based on start date matching
    const fallCount = (events || []).filter(e => {
        if (e.type !== 'falling' || !e.date) return false;
        const [y, m, d] = e.date.split('-').map(Number);
        return selectedDate.getFullYear() === y && selectedDate.getMonth() === (m - 1) && selectedDate.getDate() === d;
    }).length;

    // Pie Data: If no segments (meaning no events processed properly or !hasData), show 100% Gray.
    const pieData = (timelineSegments.length > 0 && hasData) ? timelineSegments : [{ name: 'Empty', value: 1, color: '#e5e7eb' }];

    // Summary Cards Data
    const summaryData = [
        { label: 'Relax', value: `${relaxHours}h`, icon: Armchair, bg: 'bg-blue-100', text: 'text-gray-600', subText: `Relax: ${relaxHours}h` },
        { label: 'Work', value: `${workHours}h`, icon: Briefcase, bg: 'bg-amber-100', text: 'text-gray-600', subText: `Work: ${workHours}h` },
        { label: 'Walk', value: `${walkHours}h`, icon: Footprints, bg: 'bg-emerald-100', text: 'text-gray-600', subText: `Walk: ${walkHours}h` },
        { label: 'Falls', value: `${fallCount}`, icon: AlertTriangle, bg: 'bg-red-300', text: 'text-red-900', subText: `Falls: ${fallCount}`, isAlert: true }
    ];

    // Weekly Data (Stacked) - Updated with darker fill colors
    const weeklyData = [
        { name: 'Mon', relax: 0, work: 0, walk: 0, falls: 0, placeholder: 10 },
        { name: 'Tue', relax: 0, work: 0, walk: 0, falls: 0, placeholder: 10 },
        { name: 'Wed', relax: 0, work: 0, walk: 0, falls: 0, placeholder: 10 },
        { name: 'Thu', relax: 0, work: 0, walk: 0, falls: 0, placeholder: 10 },
        { name: 'Fri', relax: 0, work: 0, walk: 0, falls: 0, placeholder: 10 },
        { name: 'Sat', relax: 0, work: 0, walk: 0, falls: 0, placeholder: 10 },
        { name: 'Sun', relax: 0, work: 0, walk: 0, falls: 0, placeholder: 10 },
    ];

    // Populate weekly data from all events
    (events || []).forEach(e => {
        if (!e.date) return;
        const [y, m, d] = e.date.split('-').map(Number);
        const eventDate = new Date(y, m - 1, d);

        // Check if event is in the current viewed week (simplified: match the month/year of currentMonth)
        // More robust: calculate which day of week it is
        const dayIndex = eventDate.getDay(); // 0-6 (Sun-Sat)
        const mapIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 0-6 (Mon-Sun)

        if (weeklyData[mapIndex]) {
            if (e.type === 'sitting' || e.type === 'laying') weeklyData[mapIndex].relax += 0.5; // match card calc
            if (e.type === 'falling') weeklyData[mapIndex].falls += 1;
            weeklyData[mapIndex].placeholder = 0;
        }
    });

    return (
        <div className="flex flex-col h-full bg-[#0D9488] relative">
            {/* Header (Green) */}
            <div className="pt-14 pb-8 px-6 flex justify-between items-center bg-[#0D9488] z-20">
                <h1 className="text-3xl font-bold tracking-wide text-white">Statistics</h1>
                <div className="flex items-center gap-4">
                    <div className="relative cursor-pointer" onClick={onOpenNotifications}>
                        <Bell className="w-6 h-6 text-white fill-current" />
                        {hasUnread && (
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0D9488]"></div>
                        )}
                    </div>
                    <div
                        className="w-9 h-9 bg-yellow-100 rounded-full border-2 border-white overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={onOpenProfile}
                    >
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col overflow-y-auto z-10 transition-colors duration-300">

                {/* Date Selection Area */}
                <div className="px-6 py-4 flex flex-col items-end gap-2 relative">
                    <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md text-xs font-bold text-gray-600 dark:text-gray-300">
                        {formatDate(selectedDate)}
                    </div>
                    <button
                        onClick={() => {
                            if (!showDatePicker) {
                                setCurrentMonth(new Date()); // Reset to current month when opening
                            }
                            setShowDatePicker(!showDatePicker);
                        }}
                        className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        choose date
                    </button>

                    {/* Popover Date Picker */}
                    {showDatePicker && (
                        <div className="absolute top-20 right-6 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-4 w-72 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-4 text-[#374151] dark:text-gray-200">
                                <ChevronLeft
                                    className="w-5 h-5 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400"
                                    onClick={() => changeMonth(-1)}
                                />
                                <span className="font-bold text-sm">
                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <ChevronRight
                                    className="w-5 h-5 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400"
                                    onClick={() => changeMonth(1)}
                                />
                            </div>
                            <div className="grid grid-cols-7 text-center gap-y-2 text-xs font-medium text-gray-400 mb-2">
                                <span>SAN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                            </div>
                            <div className="grid grid-cols-7 text-center gap-y-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {/* Empty slots for previous month */}
                                {[...Array(getFirstDayOfMonth(currentMonth))].map((_, i) => (
                                    <span key={`empty-${i}`} className="text-transparent">00</span>
                                ))}

                                {/* Calendar Days */}
                                {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                                    const day = i + 1;
                                    const isSelected =
                                        selectedDate.getDate() === day &&
                                        selectedDate.getMonth() === currentMonth.getMonth() &&
                                        selectedDate.getFullYear() === currentMonth.getFullYear();

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => handleDateClick(day)}
                                            className={clsx(
                                                "w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-colors",
                                                isSelected ? "bg-[#ef4444] text-white shadow-md" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                            )}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Clock Chart Section */}
                <div className="relative h-64 w-full flex items-center justify-center mb-4">
                    {/* Outer Circle (Clock Face) */}
                    <div className="w-56 h-56 rounded-full border border-gray-400 flex items-center justify-center relative shadow-inner bg-white dark:bg-gray-800 transition-colors">
                        {/* Tick Marks */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-400 z-20"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-400 z-20"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-gray-400 z-20"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-gray-400 z-20"></div>

                        {/* Clock Labels - Moved Inside/Adjusted for visibility */}
                        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-gray-500 text-xs font-bold z-20 bg-white dark:bg-gray-800 dark:text-gray-300 px-1">12</span>
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-gray-500 text-xs font-bold z-20 bg-white dark:bg-gray-800 dark:text-gray-300 px-1">6</span>
                        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold z-20 bg-white dark:bg-gray-800 dark:text-gray-300 px-1">9</span>
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold z-20 bg-white dark:bg-gray-800 dark:text-gray-300 px-1">3</span>

                        {/* Pie Chart */}
                        <div className="w-full h-full p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={0}
                                        outerRadius="100%"
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        stroke="none"
                                        isAnimationActive={false}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-3 px-6 mb-8">
                    {summaryData.map((item, idx) => (
                        <div key={idx} className={clsx("flex flex-col items-center justify-center p-2 rounded-2xl shadow-sm aspect-square", item.bg)}>
                            <item.icon className={clsx("w-6 h-6 mb-1", item.isAlert ? "text-red-900" : "text-gray-800")} strokeWidth={2.5} />
                            <span className={clsx("text-[10px] font-bold text-center whitespace-nowrap", item.text)}>{item.subText}</span>
                        </div>
                    ))}
                </div>

                {/* Divider Line */}
                <div className="px-6 mb-6">
                    <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Weekly Chart Section */}
                <div className="px-6 pb-8">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-[2rem] p-6 transition-colors">
                        <h2 className="text-[#1e3a3a] dark:text-white font-bold text-base mb-4">Weekly</h2>

                        <div className="h-48 mb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData} barCategoryGap={10}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#888888', fontSize: 10, fontWeight: 'bold' }} // Using gray-ish for compatibility
                                        dy={10}
                                    />
                                    {/* Stacked Bars with darker colors */}
                                    <Bar dataKey="placeholder" stackId="a" fill="#e5e7eb" radius={[4, 4, 4, 4]} />
                                    <Bar dataKey="relax" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="work" stackId="a" fill="#f59e0b" />
                                    <Bar dataKey="walk" stackId="a" fill="#10b981" />
                                    <Bar dataKey="falls" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]}>
                                        <LabelList dataKey="falls" content={renderCustomAlert} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Weekly Explanation Text */}
                        <div className="text-center">
                            <p className="text-gray-400 text-[10px] font-medium">
                                Weekly statistics for this week
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StatisticsScreen;
