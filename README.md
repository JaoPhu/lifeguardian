# LifeGuardian

LifeGuardian is a web-based prototype application for AI-powered office syndrome monitoring and event detection. It uses computer vision to analyze postures and detect critical events such as falling, long-term sitting, or laying down to ensure workplace safety and health.

## 🛠️ Tech Stack & Languages

This project is built using a modern full-stack web approach, primarily focusing on clear AI integration within a mobile-native web experience.

### Languages Used
- **TypeScript (TSX/TS)**: Used for 100% of the application logic and UI components to ensure type safety and robust development.
- **HTML5/CSS3**: Utilized via Tailwind CSS for high-performance, responsive styling and layout.
- **JavaScript**: Underlying engine for AI processing and browser-based video analysis.

### Core Technologies
- **Runtime**: [Node.js](https://nodejs.org/) (Version **v18.0.0** or higher)
- **Framework**: [React](https://react.dev/) (v18.2) + [Vite](https://vitejs.dev/)
- **AI Engine**: [MediaPipe Pose Landmarker](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker) (Client-side GPU/CPU)
- **Package Manager**: [npm](https://www.npmjs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally for development.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lifeguardian
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🏗️ Building for Production
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure
```
src/
├── assets/         # Static assets
├── components/     # React / TSX components (UI/UX)
│   ├── auth/       # Login/Register
│   ├── dashboard/  # Main view
│   ├── stats/      # Analytics & Charts
│   ├── simulation/ # Pose detection & 3D visualization
│   └── ...
├── services/       # AI Services (PoseDetectionService.ts)
├── contexts/       # Global State (UserContext)
├── App.tsx         # Main Routing & History
└── types.ts        # TypeScript Definitions
```

## 💡 Key Features Implemented
- **AI Pose Detection**: Real-time processing of video frames using Google's MediaPipe.
- **Infinite Looping Pickers**: Premium "wheel-style" selectors for Time and Speed configuration.
- **Dynamic Dashboard**: Interactive camera cards with real-time status and thumbnails.
- **Statistics & History**: Detailed analysis of user activity and critical events.
- **Navigation History**: Persistent back-button history across all screens.

---

## 🇹🇭 สำหรับนักพัฒนา (Thai Summary)

**LifeGuardian คืออะไร?**
โปรเจกต์นี้เป็นตัวต้นแบบ (Prototype) ระบบตรวจจับท่าทางและอาการออฟฟิศซินโดรมด้วย AI ผ่านเว็บเบราว์เซอร์ โดยเน้นความง่ายในการใช้งานและประสิทธิภาพสูง

**ภาษาและเทคโนโลยี:**
*   **TypeScript (React/TSX)**: ใช้เป็นภาษาหลักในการเขียน UI และ Logic ทั้งหมด
*   **MediaPipe**: ใช้สำหรับตรวจจับจุดบนร่างกาย (Pose Detection) แบบ Real-time
*   **Tailwind CSS**: ใช้สำหรับงานดีไซน์ที่เน้นความพรีเมียมและรองรับหน้าจอมือถือ

**วิธีเริ่มโปรเจกต์:**
1.  `npm install`
2.  `npm run dev`
3.  เปิดลิงก์บน Browser

> **สถานะปัจจุบัน**: กำลังอยู่ในขั้นตอนการปรับจูน AI (Smoothing) และเพิ่มรายละเอียดในบันทึกเหตุการณ์ (Recent Events Description)
