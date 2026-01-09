import { useState, useCallback, useRef, useEffect } from 'react';
import { AiAnalysisService } from './services/AiAnalysisService';
import PhoneFrame from './components/PhoneFrame';
import DemoSetup from './components/DemoSetup';
import SimulationRunning from './components/SimulationRunning';
import SplashScreen from './components/auth/SplashScreen';
import LoginScreen from './components/auth/LoginScreen';
import Dashboard from './components/dashboard/Dashboard';
import EventsScreen from './components/EventsScreen';
import StatusScreen, { MonitorStatus } from './components/StatusScreen';
import BottomNav from './components/layout/BottomNav';
import { VideoConfig, SimulationEvent, Camera, NotificationItem } from './types';
import StatisticsScreen from './components/stats/StatisticsScreen';
import { Activity } from 'lucide-react';
import SettingsScreen from './components/SettingsScreen';
import AIDebugScreen from './components/AIDebugScreen';
import NotificationScreen from './components/notification/NotificationScreen';
import clsx from 'clsx';
import GroupManagementScreen from './components/group/GroupManagementScreen';

function App() {
    const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'main'>('splash');
    const [activeTab, setActiveTab] = useState<'overview' | 'statistics' | 'status' | 'users' | 'settings' | 'notifications'>('overview');
    const [settingsView, setSettingsView] = useState<'main' | 'ai-debug'>('main');
    const [simulationState, setSimulationState] = useState<'setup' | 'running'>('setup');
    const [isDemoActive, setIsDemoActive] = useState(false);
    const [activeEventCameraId, setActiveEventCameraId] = useState<string | null>(null);
    const [showStatistics, setShowStatistics] = useState(false);

    // Data State
    const [currentConfig, setCurrentConfig] = useState<VideoConfig | null>(null);
    const [events, setEvents] = useState<SimulationEvent[]>([]);

    // Refs for stable callbacks
    const eventsRef = useRef(events);
    const configRef = useRef(currentConfig);

    useEffect(() => { eventsRef.current = events; }, [events]);
    useEffect(() => { configRef.current = currentConfig; }, [currentConfig]);

    // AI Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Camera List State (Initialized with dummy Camera 1)
    const [cameras, setCameras] = useState<Camera[]>([
        {
            id: 'cam-01',
            name: 'Camera 1',
            source: 'camera',
            status: 'offline', // Image shows "No connection"
            events: []
        }
    ]);

    // Handlers
    const handleSplashFinish = () => setCurrentScreen('login');
    const handleLogin = () => {
        setCurrentScreen('main');
        setActiveTab('overview');
        setIsDemoActive(false);
    };

    const handleStartSimulation = async (config: VideoConfig) => {
        setIsAnalyzing(true);
        setCurrentConfig(config); // Set immediately to maybe show context?

        // Call AI Service
        try {
            const result = await AiAnalysisService.analyzeVideo(config);
            setEvents(result.events); // Pre-populate events from AI
            // We could store result.summary here if needed for later
        } catch (error) {
            console.error("AI Analysis Failed", error);
            setEvents([]);
        } finally {
            setIsAnalyzing(false);
            setSimulationState('running');
        }
    };

    const handleStopSimulation = useCallback(() => {
        // When stopped (or finished), we save the session as a new "Camera" source
        const finalConfig = configRef.current;
        if (finalConfig) {
            setCameras(prev => {
                const newCamera: Camera = {
                    id: crypto.randomUUID(),
                    name: finalConfig.cameraName,
                    source: 'demo',
                    status: 'online',
                    events: [...eventsRef.current], // Read from ref
                    config: finalConfig
                };
                return [newCamera, ...prev];
            });
        }

        setSimulationState('setup');
        setIsDemoActive(false);
    }, []); // No dependencies! Stable forever.

    const handleValidationEvent = useCallback((event: SimulationEvent) => {
        setEvents(prev => [event, ...prev]);
    }, []);

    const handleTryDemo = () => {
        setIsDemoActive(true);
        setActiveEventCameraId(null);
    };

    const handleViewEvents = (cameraId: string) => {
        setActiveEventCameraId(cameraId);
        setIsDemoActive(false); // Ensure we are not in demo mode
    };

    const handleBackFromEvents = () => {
        setActiveEventCameraId(null);
    };

    const handleTabChange = (tab: 'overview' | 'statistics' | 'status' | 'users' | 'settings' | 'notifications') => {
        setActiveTab(tab);
        setShowStatistics(false); // Reset statistics view when changing tabs
        if (tab !== 'overview') {
            setIsDemoActive(false);
            setActiveEventCameraId(null);
        }
    };

    const handleDeleteCamera = (cameraId: string) => {
        setCameras(prev => prev.filter(c => c.id !== cameraId));
    };

    // Theme State
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Notification State
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        { id: '1', type: 'success', message: '✅ ระบบพร้อมทำงาน: Life Guardian เริ่มการดูแลแล้วครับ ปลอดภัยหายห่วง! 🛡️✨', isNew: false },
        { id: '2', type: 'warning', message: '👀 พักสายตา: จ้องจอนานระวังตาล้านะครับ พักมองต้นไม้สีเขียวๆ สัก 5 นาทีเถอะ 🌳👁️', isNew: false },
        { id: '3', type: 'warning', message: '💊 เตือนทานยา: ถึงเวลาทานยาหลังอาหารแล้วครับ เพื่อสุขภาพที่แข็งแรงนะ! ❤️🏥', isNew: false },
        { id: '4', type: 'error', message: '🚨 ฉุกเฉิน!: ตรวจพบการ ล้ม ที่ห้องนั่งเล่น! โปรดตรวจสอบทันที! 🆘💥', isNew: false },
        { id: '5', type: 'success', message: '💤 การพักผ่อน: ผู้ใช้งานเข้านอนแล้วครับ ราตรีสวัสดิ์ 🌙✨', isNew: false },
        { id: '6', type: 'warning', message: 'ระวังออฟฟิศซินโดรมถามหานะครับ! ⚠️ ลุกขึ้นหมุนหัวไหล่ และสะบัดข้อมือสัก 2-3 นาทีดีไหมครับ? 💪', isNew: true },
        { id: '7', type: 'error', message: '🚨 ฉุกเฉิน!: ตรวจพบการ ล้ม ที่ห้องครัว! โปรดตรวจสอบทันที! 🆘💥', isNew: true }
    ]);

    const hasUnread = notifications.some(n => n.isNew);

    const handleOpenNotifications = () => {
        setActiveTab('notifications');
        // Mark all as read when opening history
        setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
    };

    // ... (existing code)

    const renderContent = () => {
        if (currentScreen === 'splash') {
            return <SplashScreen onFinish={handleSplashFinish} />;
        }

        if (currentScreen === 'login') {
            return <LoginScreen onLogin={handleLogin} />;
        }

        // Main App content with Bottom Nav
        return (
            <div className={clsx("flex flex-col h-full transition-colors duration-300", isDarkMode ? "dark bg-gray-900" : "bg-white")}>
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    {/* Main (Overview/Home) Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="h-full flex flex-col">
                            {activeEventCameraId ? (
                                // Events Screen View
                                <EventsScreen
                                    camera={cameras.find(c => c.id === activeEventCameraId) || cameras[0]}
                                    onBack={handleBackFromEvents}
                                    onOpenNotifications={handleOpenNotifications}
                                    hasUnread={hasUnread}
                                />
                            ) : isDemoActive ? (
                                // Simulation/Demo View
                                <div className="h-full flex flex-col">
                                    {isAnalyzing ? (
                                        // AI Analysis Loading Screen
                                        <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 text-center space-y-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full border-4 border-gray-100"></div>
                                                <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin"></div>
                                                <Activity className="absolute inset-0 m-auto w-10 h-10 text-[#0D9488] animate-pulse" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">AI Analyzing Video...</h2>
                                                <p className="text-gray-500 text-sm mt-2">LifeGuardian AI is detecting events and potential risks.</p>
                                            </div>
                                        </div>
                                    ) : simulationState === 'setup' ? (
                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <DemoSetup
                                                onStart={handleStartSimulation}
                                                onOpenNotifications={handleOpenNotifications}
                                                hasUnread={hasUnread}
                                            />
                                            {/* Show events below setup if any exist (optional, maybe remove for cleaner UI) */}
                                        </div>
                                    ) : (
                                        currentConfig && (
                                            <SimulationRunning
                                                config={currentConfig}
                                                onStop={handleStopSimulation}
                                                onEventAdded={handleValidationEvent}
                                                onOpenNotifications={handleOpenNotifications}
                                                hasUnread={hasUnread}
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                // Default Dashboard View
                                <Dashboard
                                    cameras={cameras}
                                    onTryDemo={handleTryDemo}
                                    onViewEvents={handleViewEvents}
                                    onDeleteCamera={handleDeleteCamera}
                                    onOpenNotifications={handleOpenNotifications}
                                    hasUnread={hasUnread}
                                />
                            )}
                        </div>
                    )}

                    {/* Statistics Tab (New 2nd Tab) */}
                    {activeTab === 'statistics' && (
                        (() => {
                            // Logic to get events for statistics (e.g. from demo camera)
                            const demoCam = cameras.find(c => c.source === 'demo');
                            const events = demoCam?.events || [];
                            return <StatisticsScreen events={events} />;
                        })()
                    )}

                    {/* Status Tab */}
                    {activeTab === 'status' && (
                        (() => {
                            // Shared Logic for Status & Statistics
                            // Derive status from the LAST applied config (or current one)
                            // Strategy: Find the latest 'demo' camera.
                            const demoCam = cameras.find(c => c.source === 'demo');

                            let status: MonitorStatus = 'none';
                            let config = demoCam?.config || null;
                            const events = demoCam?.events || [];

                            if (demoCam && demoCam.config) {
                                if (demoCam.config.eventType === 'falling') status = 'emergency';
                                else if (demoCam.config.eventType === 'sitting') status = 'warning';
                                else if (demoCam.config.eventType === 'laying') status = 'normal';
                                else status = 'normal';
                            }

                            // If user clicked "Statistics" button inside Status page, show it?
                            // Or maybe remove that button now that we have a tab?
                            // Let's keep logic compatible.
                            return showStatistics ? (
                                <StatisticsScreen events={events} />
                            ) : (
                                <StatusScreen
                                    status={status}
                                    events={events}
                                    config={config}
                                    onShowStatistics={() => setShowStatistics(true)}
                                    // Pass notification props
                                    onOpenNotifications={handleOpenNotifications}
                                    hasUnread={hasUnread}
                                />
                            );
                        })()
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        settingsView === 'main' ? (
                            <SettingsScreen
                                isDarkMode={isDarkMode}
                                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                                onNavigate={(screen) => {
                                    if (screen === 'ai-debug') setSettingsView('ai-debug');
                                    else if (screen === 'overview') setActiveTab('overview');
                                    else if (screen === 'status') setActiveTab('status');
                                    else if (screen === 'statistics') setActiveTab('statistics');
                                    // 'notification', 'users' -> no action yet
                                }} />
                        ) : (
                            <AIDebugScreen onBack={() => setSettingsView('main')} />
                        )
                    )}

                    {/* Notification History Screen */}
                    {activeTab === 'notifications' && (
                        <NotificationScreen
                            notifications={notifications}
                            onBack={() => setActiveTab('overview')}
                        />
                    )}

                    {/* Users / Group Management Tab */}
                    {activeTab === 'users' && (
                        <GroupManagementScreen
                            onOpenNotifications={handleOpenNotifications}
                            hasUnread={hasUnread}
                        />
                    )}
                </div>

                {/* Navigation Bar */}
                <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center sm:p-4 font-sans">
            <PhoneFrame>
                {renderContent()}
            </PhoneFrame>

            {/* Version Label */}
            <div className="fixed bottom-4 right-4 text-gray-600 text-xs font-mono opacity-50">
                LifeGuardian v0.5.0 (Events & Simulation Flow)
            </div>
        </div>
    );
}

export default App;
