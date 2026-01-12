
import { VideoConfig, SimulationEvent } from '../types';

interface AiAnalysisResult {
    summary: string;
    events: SimulationEvent[];
}

export const AiAnalysisService = {
    /**
     * Simulates AI video analysis.
     * In a real app, this would upload the file to a Python backend with PyTorch/TensorFlow.
     * Here, we mock the latency and generate realistic "detected" events.
     */
    analyzeVideo: async (config: VideoConfig): Promise<AiAnalysisResult> => {
        // Simulate processing delay (2-3 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));

        const events: SimulationEvent[] = [];
        let summary = "";

        // Generate Event based on Config
        // We will place the event relatively early in the video for demo purposes
        const eventTime = "00:45"; // Fixed time for demo consistency or could be random
        const eventId = crypto.randomUUID();

        if (config.eventType === 'sitting') {
            summary = "จากการวิเคราะห์คลิวิดีโอ ระบบตรวจพบการนั่งทำงานต่อเนื่องเป็นเวลานาน (Prolonged Sitting) ซึ่งมีความเสี่ยงต่ออาการออฟฟิศซินโดรม แนะนำให้มีการแจ้งเตือนเพื่อขยับร่างกาย";
            events.push({
                id: eventId,
                type: 'sitting',
                timestamp: eventTime,
                snapshotUrl: '',
                isCritical: false
            });
        } else if (config.eventType === 'falling') {
            summary = "ระบบ AI ตรวจพบเหตุการณ์ผิดปกติ: การล้ม (Fall Detection) ที่ช่วงเวลา 00:45 ของวิดีโอ ซึ่งเป็นเหตุการณ์วิกฤต (Critical Event) ระบบได้ทำการบันทึกภาพเหตุการณ์และแจ้งเตือนทันที";
            events.push({
                id: eventId,
                type: 'falling',
                timestamp: eventTime,
                snapshotUrl: '',
                isCritical: true
            });
        } else if (config.eventType === 'laying') {
            summary = "ระบบตรวจพบการนอนราบ (Laying Down) ซึ่งอาจเป็นการพักผ่อนปกติหรือเหตุฉุกเฉินทางสุขภาพ ระบบจะเฝ้าระวังระยะเวลาการนอนหากนานเกินกำหนด";
            events.push({
                id: eventId,
                type: 'laying',
                timestamp: eventTime,
                snapshotUrl: '',
                isCritical: false
            });
        }

        // Add some random minor "movement" or "activity" events if needed,
        // but for this demo, focusing on the main event is cleaner.

        return {
            summary,
            events: []
        };
    }
};
