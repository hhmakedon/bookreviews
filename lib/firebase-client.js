import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_WEB_CONFIG, isFirebaseWebConfigReady } from "@/lib/site-config";

function getFirebaseApp() {
  if (!isFirebaseWebConfigReady()) {
    throw new Error("Firebase web configuration is missing.");
  }

  return getApps().length ? getApp() : initializeApp(FIREBASE_WEB_CONFIG);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb() {
  return getFirestore(getFirebaseApp());
}
