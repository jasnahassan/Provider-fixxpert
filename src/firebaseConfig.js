import { initializeApp, getApps } from 'firebase/app';

// 🔥 Your Firebase Config (Get it from Firebase Console)
const firebaseConfig = {

    apiKey: "AIzaSyBuXFoe4hljALW-ki2x3OYcxugEt4APs80",
    authDomain: "fix-xpert-82327.firebaseapp.com", // Constructed manually
    projectId: "fix-xpert-82327",
    storageBucket: "fix-xpert-82327.firebasestorage.app",
    messagingSenderId: "92131315671", // Use project_number as sender ID
    appId: "1:92131315671:android:34107df18cbf9b54410592"
};

// ✅ Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { app };
