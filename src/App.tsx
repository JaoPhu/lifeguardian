import { useState } from 'react';
import { AiAnalysisService } from './services/AiAnalysisService';
import PhoneFrame from './components/PhoneFrame';
import DemoSetup from './components/DemoSetup';
import SimulationRunning from './components/SimulationRunning';
import SplashScreen from './components/auth/SplashScreen';
import LoginScreen from './components/auth/LoginScreen';
import Dashboard from './components/dashboard/Dashboard';
import EventsScreen from './components/EventsScreen';
import BottomNav from './components/layout/BottomNav';
import { VideoConfig, SimulationEvent, Camera } from './types';
import { Loader2 } from 'lucide-react';

function App() {
    // Navigation State
    const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'main'>('splash');
    const [activeTab, setActiveTab] = useState<'overview' | 'layout' | 'status' | 'users' | 'settings'>('overview');
    const [simulationState, setSimulationState] = useState<'setup' | 'running'>('setup');
    const [isDemoActive, setIsDemoActive] = useState(false);
    const [activeEventCameraId, setActiveEventCameraId] = useState<string | null>(null);

    // Data State
    const [currentConfig, setCurrentConfig] = useState<VideoConfig | null>(null);
    const [events, setEvents] = useState<SimulationEvent[]>([]);

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

    const handleStopSimulation = () => {
        // When stopped (or finished), we save the session as a new "Camera" source
        if (currentConfig) {
            const newCamera: Camera = {
                id: crypto.randomUUID(),
                name: currentConfig.cameraName,
                source: 'demo',
                status: 'online', // Or 'offline' if completed? Let's say online showing last state
                events: [...events],
                config: currentConfig
            };
            setCameras(prev => [newCamera, ...prev]);
        }

        setSimulationState('setup');
        setIsDemoActive(false); // Return to dashboard
    };

    const handleValidationEvent = (event: SimulationEvent) => {
        setEvents(prev => [event, ...prev]);
    };

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

    const handleTabChange = (tab: 'overview' | 'layout' | 'status' | 'users' | 'settings') => {
        setActiveTab(tab);
        if (tab !== 'overview') {
            setIsDemoActive(false);
            setActiveEventCameraId(null);
        }
    };

    const handleDeleteCamera = (cameraId: string) => {
        setCameras(prev => prev.filter(c => c.id !== cameraId));
    };

    // Render Content based on current state
    const renderContent = () => {
        if (currentScreen === 'splash') {
            return <SplashScreen onFinish={handleSplashFinish} />;
        }

        if (currentScreen === 'login') {
            return <LoginScreen onLogin={handleLogin} />;
        }

        // Main App content with Bottom Nav
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    {/* Main (Overview/Home) Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="h-full flex flex-col">
                            {activeEventCameraId ? (
                                // Events Screen View
                                <EventsScreen
                                    camera={cameras.find(c => c.id === activeEventCameraId) || cameras[0]}
                                    onBack={handleBackFromEvents}
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
                                                <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-[#0D9488] animate-pulse" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">AI Analyzing Video...</h2>
                                                <p className="text-gray-500 text-sm mt-2">LifeGuardian AI is detecting events and potential risks.</p>
                                            </div>
                                        </div>
                                    ) : simulationState === 'setup' ? (
                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <DemoSetup onStart={handleStartSimulation} />
                                            {/* Show events below setup if any exist (optional, maybe remove for cleaner UI) */}
                                        </div>
                                    ) : (
                                        currentConfig && (
                                            <SimulationRunning
                                                config={currentConfig}
                                                onStop={handleStopSimulation}
                                                onEventAdded={handleValidationEvent}
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
                                />
                            )}
                        </div>
                    )}

                    {/* Placeholders for other tabs */}
                    {(activeTab === 'status' || activeTab === 'layout' || activeTab === 'users' || activeTab === 'settings') && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 font-bold p-6 text-center">
                            <span className="text-4xl mb-4">
                                {activeTab === 'status' ? '🛡️' : '🚧'}
                            </span>
                            <p className="text-gray-900 font-bold mb-2 capitalize">{activeTab} Feature</p>
                            <p className="text-xs">Coming Soon</p>
                        </div>
                    )}
                </div>

                {/* Navigation Bar */}
                <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
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
