# LifeGuardian

LifeGuardian is a web-based prototype application for AI-powered office syndrome monitoring and event detection. It simulates video analysis to detect posture events like sitting too long, falling, or laying down.

## 🛠️ Tech Stack & Environment

This project is built using modern web technologies. Please ensure your development environment meets the following requirements:

### Core Technologies
- **Runtime**: [Node.js](https://nodejs.org/) (Version **v18.0.0** or higher is recommended)
- **Package Manager**: [npm](https://www.npmjs.com/) (Version 9.0.0+)
- **Framework**: [React](https://react.dev/) (v18.2)
- **Build Tool**: [Vite](https://vitejs.dev/) (v5.1)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (v5.0+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v3.4) + Vanilla CSS

### Key Dependencies
- `lucide-react`: For icons.
- `recharts`: For statistical charts.
- `@mediapipe/tasks-vision`: For AI Pose Detection.

---

## 🚀 Getting Started

Follow these steps to set up the project locally for development.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lifeguardian
```

### 2. Install Dependencies
Install the required packages using npm:
```bash
npm install
```

### 3. Run Development Server
Start the local development server:
```bash
npm run dev
```
After running this command, open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 🏗️ Building for Production

To create a production-ready build:

```bash
npm run build
```
This will generate a `dist` folder containing the compiled static assets. You can preview the production build locally using:
```bash
npm run preview
```

---

## 📂 Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # React components
│   ├── auth/       # Login/Authentication screens
│   ├── dashboard/  # Main dashboard and camera cards
│   ├── layout/     # Shared layout (BottomNav, etc.)
│   ├── simulation/ # Stickman viewer and simulation logic
│   ├── notification/ # Notification screen and logic
│   ├── DemoSetup.tsx      # Video upload & config screen
│   ├── SimulationRunning.tsx # Main simulation player (with AI)
│   └── ...
├── services/       # AI & Logic Services (PoseDetectionService.ts)
├── App.tsx         # Main application entry & routing logic
├── main.tsx        # React DOM entry point
└── types.ts        # TypeScript definitions
```

## 💡 Notes for Developers

- **AI Pose Detection**: We use Google's MediaPipe for real-time pose detection in `src/services/PoseDetectionService.ts`. It runs client-side in the browser.
- **Notification System**: Notifications represent the application state. They are managed globally in `App.tsx` and can be accessed from any screen via the Bell icon.
- **Video Upload**: Video upload logic uses `URL.createObjectURL` for local preview. It does not upload files to a server in this prototype.
- **Group Management**: Simple role-based invite system (Mocked) is located in `src/components/group`.

---

## 🇹🇭 สำหรับนักพัฒนา (Thai Summary)

**สิ่งที่ต้องมี (Prerequisites):**
*   **Node.js**: แนะนำเวอร์ชัน 18 ขึ้นไป
*   **Editor**: VS Code (แนะนำติดตั้ง Extension: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense)

**วิธีเริ่มโปรเจกต์:**
1.  ติดตั้ง dependencies: `npm install`
2.  รันเซิร์ฟเวอร์ทดสอบ: `npm run dev`
3.  เปิดเว็บเบราว์เซอร์ไปที่ลิงก์ที่แสดงใน Terminal (ปกติคือ `http://localhost:5173`)

> **ปล.** สำหรับคนที่จะพัฒนาต่อ ให้ทำ **Branch แยก** (`git checkout -b feature/your-feature-name`) ก่อนทำการ Commit/Push นะครับ
