
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

        // Generate Event based on Config - DYNAMIC TIMESTAMPS
        // We calculate the timestamp relative to the Start Time + Offset
        // Offset = 45 seconds * Speed (Simulated time passed) is confusing for static analysis.
        // Instead, let's say the event happens at 00:45 of the VIDEO.
        // The display logic in EventsScreen should probably use the Absolute Date if possible,
        // or just the relative video time.
        // However, the user complaint is about sync.
        // Let's generate a full ISO timestamp that matches: StartTime + (45s * Speed).

        try {
            const [hours, minutes] = config.startTime.split(':').map(Number);
            const [year, month, day] = config.date.split('-').map(Number);
            const startDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

            // Event happens at 45 seconds into the video
            // Wait, previous logic: 1 Real Sec = Speed Minutes.
            // So 1 Video Sec (Real) = Speed Minutes.
            // 45 Video Sec = 45 * Speed Minutes.
            const simMinutesPassed = 45 * config.speed;

            const eventDate = new Date(startDate.getTime() + simMinutesPassed * 60 * 1000);

            // Format HH:mm for simple display, or use full string if needed
            const eventTimeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            // We also need the Date for full context properly?
            // The Event interface just has `timestamp: string`.
            // Currently it seems to hold HH:mm.
            // If the UI combines valid date, it might duplicate.
            // Let's provide the generated time string which will match the simulation clock when it reaches 0:45 video time.
            const finalTimestamp = eventTimeStr;

            const eventId = crypto.randomUUID();

            if (config.eventType === 'sitting') {
                summary = "จากการวิเคราะห์คลิวิดีโอ ระบบตรวจพบการนั่งทำงานต่อเนื่องเป็นเวลานาน (Prolonged Sitting) ซึ่งมีความเสี่ยงต่ออาการออฟฟิศซินโดรม แนะนำให้มีการแจ้งเตือนเพื่อขยับร่างกาย";
                events.push({
                    id: eventId,
                    type: 'sitting',
                    timestamp: finalTimestamp,
                    snapshotUrl: '',
                    isCritical: false
                });
            } else if (config.eventType === 'falling') {
                summary = "ระบบ AI ตรวจพบเหตุการณ์ผิดปกติ: การล้ม (Fall Detection) ที่ช่วงเวลา " + finalTimestamp + " ของวิดีโอ ซึ่งเป็นเหตุการณ์วิกฤต (Critical Event) ระบบได้ทำการบันทึกภาพเหตุการณ์และแจ้งเตือนทันที";
                events.push({
                    id: eventId,
                    type: 'falling',
                    timestamp: finalTimestamp,
                    snapshotUrl: '',
                    isCritical: true
                });
            } else if (config.eventType === 'laying') {
                summary = "ระบบตรวจพบการนอนราบ (Laying Down) ซึ่งอาจเป็นการพักผ่อนปกติหรือเหตุฉุกเฉินทางสุขภาพ ระบบจะเฝ้าระวังระยะเวลาการนอนหากนานเกินกำหนด";
                events.push({
                    id: eventId,
                    type: 'laying',
                    timestamp: finalTimestamp,
                    snapshotUrl: '',
                    isCritical: false
                });
            }
        } catch (e) {
            console.error("Error generating timestamp", e);
        }

        return {
            summary,
            events // Return the events with properly synced timestamps
        };
    }
};
