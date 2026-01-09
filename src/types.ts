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

export type UserRole = 'Owner' | 'Admin' | 'Viewer';

export interface GroupMember {
  id: string;
  name: string;
  role: UserRole; // Replaces 'priority'
  title: string; // e.g. "Daughter (Anna)", "Doctor Somchai"
  avatarSeed: string; // For consistency in UI
  isCurrentUser?: boolean;
}

export interface UserGroup {
  id: string; // Group ID (e.g., Invite Code)
  members: GroupMember[];
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

export interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  isNew?: boolean;
}
