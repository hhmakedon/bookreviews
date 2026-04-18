function isPlaceholderValue(value) {
  if (!value) {
    return true;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return true;
  }

  return (
    normalizedValue.startsWith("your_") ||
    normalizedValue.startsWith("PASTE_") ||
    normalizedValue.includes("YOUR_") ||
    normalizedValue.includes("your project") ||
    normalizedValue.includes("your_firebase")
  );
}

const adminConfigMap = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

export function getAuthorizedUsername() {
  return process.env.AUTHORIZED_USERNAME?.trim() || "Makedon";
}

export function getAuthorizedEmail() {
  return process.env.AUTHORIZED_EMAIL?.trim() || "makedon@bookreviews.local";
}

export function getFirebaseWebApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "";

  if (isPlaceholderValue(apiKey)) {
    return "";
  }

  return apiKey;
}

export function hasFirebaseAdminConfig() {
  return Object.values(adminConfigMap).every((value) => !isPlaceholderValue(value));
}

export function isFirebaseConfigured() {
  return Boolean(getFirebaseWebApiKey()) && hasFirebaseAdminConfig();
}

export function getMissingFirebaseConfig() {
  const missingItems = [];

  if (!getFirebaseWebApiKey()) {
    missingItems.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  }

  for (const [name, value] of Object.entries(adminConfigMap)) {
    if (isPlaceholderValue(value)) {
      missingItems.push(name);
    }
  }

  return missingItems;
}

export function getFirebaseAdminCredentials() {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}
