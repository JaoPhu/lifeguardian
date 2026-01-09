import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnJqiDAaIahNtQCKACQIiKvlDH4HhNYDA",
    authDomain: "lifeguardian-app.firebaseapp.com",
    projectId: "lifeguardian-app",
    storageBucket: "lifeguardian-app.firebasestorage.app",
    messagingSenderId: "292872685738",
    appId: "1:292872685738:web:9b08023ca11a4b10d6a8d3",
    measurementId: "G-MVSK24CGDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
