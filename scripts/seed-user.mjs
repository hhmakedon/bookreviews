import nextEnv from "@next/env";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const email = process.env.AUTHORIZED_EMAIL || "makedon@bookreviews.local";
const password = process.env.SEED_USER_PASSWORD || "iamsocool1";
const displayName = process.env.AUTHORIZED_USERNAME || "Makedon";

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin credentials. Fill in .env.local before seeding the auth user.");
  process.exit(1);
}

const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

const auth = getAuth(app);

try {
  const existingUser = await auth.getUserByEmail(email);

  await auth.updateUser(existingUser.uid, {
    email,
    password,
    displayName,
  });

  console.log(`Updated Firebase Auth user for ${displayName} (${email}).`);
} catch (error) {
  if (error?.code === "auth/configuration-not-found") {
    console.error(
      "Firebase Authentication is not enabled for this project yet. In Firebase Console, open Authentication, click Get started, and enable the Email/Password provider before running this command again.",
    );
    process.exit(1);
  }

  if (error?.code !== "auth/user-not-found") {
    throw error;
  }

  const createdUser = await auth.createUser({
    email,
    password,
    displayName,
  });

  console.log(`Created Firebase Auth user ${displayName} with uid ${createdUser.uid}.`);
}
