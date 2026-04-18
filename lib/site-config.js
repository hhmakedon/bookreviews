export const AUTHORIZED_USERNAME = "Makedon";
export const AUTHORIZED_EMAIL = "makedon@bookreviews.local";

export const FIREBASE_WEB_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC-vstLOtOQCm77i4lw-lfcgO2T5SrDrg0",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bookreview-13f32.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bookreview-13f32",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bookreview-13f32.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "267974588411",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:267974588411:web:0873424856a51a51ac7d5e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-RHBJQ2DD96",
};

