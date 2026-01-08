import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const StatisticsScreen: React.FC = () => {
    const activityData = [
        { name: 'Sitting', value: 45, color: '#3b82f6' }, // Blue
        { name: 'Standing', value: 30, color: '#10b981' }, // Emerald
        { name: 'Lying', value: 15, color: '#f59e0b' }, // Amber
        { name: 'Walking', value: 10, color: '#8b5cf6' }, // Violet
    ];

    const weeklyData = [
        { name: 'Mon', events: 2 },
        { name: 'Tue', events: 5 },
        { name: 'Wed', events: 1 },
        { name: 'Thu', events: 0 },
        { name: 'Fri', events: 3 },
        { name: 'Sat', events: 1 },
        { name: 'Sun', events: 4 },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-6 scrollbar-hide p-6 space-y-6 pt-12">
            <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>

            {/* Assessment Score */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                <h2 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-4">Daily Safety Score</h2>
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[12px] border-gray-100"></div>
                    <div className="absolute inset-0 rounded-full border-[12px] border-primary-500 border-t-transparent border-l-transparent transform -rotate-45"></div>
                    <div className="text-center">
                        <span className="text-4xl font-black text-gray-900 block">92</span>
                        <span className="text-gray-400 text-xs font-bold">EXCELLENT</span>
                    </div>
                </div>
                <p className="text-gray-400 text-xs text-center mt-4 px-4">
                    Your overall safety score is high. Routine monitoring is active.
                </p>
            </div>

            {/* Activity Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-gray-900 font-bold text-lg mb-4">Activity Distribution</h2>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={activityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {activityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {activityData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs text-gray-500 font-medium">{item.name} ({item.value}%)</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Events Bar Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-gray-900 font-bold text-lg mb-4">Weekly Events</h2>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                            <Bar dataKey="events" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatisticsScreen;
