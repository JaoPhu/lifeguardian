export interface VideoConfig {
  id: string;
  cameraName: string;
  startTime: string; // HH:MM
  speed: number;
  date: string;
  eventType?: 'sitting' | 'laying' | 'falling';
  videoUrl?: string;
}

export interface SimulationEvent {
  id: string;
  type: 'sitting' | 'laying' | 'falling';
  timestamp: string; // HH:MM format
  snapshotUrl: string; // Placeholder URL
  isCritical: boolean;
}

export interface UserGroup {
  uid: string;
  ownerId: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'active';
}

export interface Camera {
  id: string;
  name: string;
  source: 'demo' | 'camera' | 'user'; // 'user' for group shared
  status: 'online' | 'offline' | 'processing'; // added processing if needed
  lastEventTime?: string;
  events: SimulationEvent[];
  previewUrl?: string; // For dashboard card background
  config?: VideoConfig;
}
