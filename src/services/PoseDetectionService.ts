import {
    PoseLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

// Types
export interface PoseLandmark {
    x: number;
    y: number;
    z: number;
    visibility: number;
}

export class PoseDetectionService {
    private poseLandmarker: PoseLandmarker | null = null;
    private runningMode: "IMAGE" | "VIDEO" = "VIDEO";

    // Initialize the model
    async initialize() {
        if (this.poseLandmarker) return; // Already initialized

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                delegate: "GPU"
            },
            runningMode: this.runningMode,
            numPoses: 1
        });

        console.log("PoseLandmarker initialized!");
    }

    // Detect landmarks for a video frame
    detectForVideo(video: HTMLVideoElement, startTimeMs: number) {
        if (!this.poseLandmarker) return null;

        const result = this.poseLandmarker.detectForVideo(video, startTimeMs);
        return result.landmarks[0] ?? null; // Return first person detected or null
    }

    // --- LOGIC: Fall Detection ---
    // Simple heuristic: 
    // 1. Nose Y vs Hip Y. Normal standing: Nose Y (0.1) < Hip Y (0.5).
    // 2. Fallen: Nose Y approx same as Hip Y (within threshold).
    // 3. Or Velocity (but simple static check first for proto).
    isFalling(landmarks: PoseLandmark[]): boolean {
        if (!landmarks || landmarks.length < 33) return false;

        const nose = landmarks[0];
        // const leftHip = landmarks[23];
        // const rightHip = landmarks[24];
        const leftAnkle = landmarks[27];
        const rightAnkle = landmarks[28];

        // Average Hip Y
        // const hipY = (leftHip.y + rightHip.y) / 2;
        const ankleY = (leftAnkle.y + rightAnkle.y) / 2;

        // Check 1: Verticality. 
        // If Abs(NoseY - HipY) is small, body is horizontal.
        // const verticalDist = Math.abs(nose.y - hipY);

        // Threshold: If vertical distance is less than 0.2 (scale 0-1), likely horizontal
        // Normal standing vertical dist is usually > 0.3 or 0.4
        // const isHorizontal = verticalDist < 0.2; // Unused

        // Check 2: Height Level
        // If Hip Y is close to Ankle Y (crumpled on floor)? 
        // Or if Nose Y is high (number is large, closer to 1.0)
        // Let's rely on "Horizontal" + "Low center of mass"

        // Refined Logic for "Lying Down / Fall":
        // Angle between Shoulder-Hip and vertical axis? 
        // Simplest: Height/Width ratio of bounding box?
        // Let's use the Nose-Ankle Y difference.

        const heightDiff = Math.abs(nose.y - ankleY);

        // If height is small < 0.3?
        if (heightDiff < 0.35) {
            return true;
        }

        return false;
    }
}

export const poseDetectionService = new PoseDetectionService();
