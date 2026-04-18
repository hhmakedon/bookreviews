import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminCredentials, hasFirebaseAdminConfig } from "@/lib/config";

let firebaseAdminApp;

function getFirebaseAdminApp() {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  if (!hasFirebaseAdminConfig()) {
    throw new Error("Firebase Admin environment variables are missing.");
  }

  if (getApps().length > 0) {
    firebaseAdminApp = getApps()[0];
    return firebaseAdminApp;
  }

  firebaseAdminApp = initializeApp({
    credential: cert(getFirebaseAdminCredentials()),
  });

  return firebaseAdminApp;
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminFirestore() {
  return getFirestore(getFirebaseAdminApp());
}

