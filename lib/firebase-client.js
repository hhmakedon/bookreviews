import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_WEB_CONFIG } from "@/lib/site-config";

const app = getApps().length ? getApp() : initializeApp(FIREBASE_WEB_CONFIG);

export const firebaseApp = app;
export const auth = getAuth(app);
export const db = getFirestore(app);

