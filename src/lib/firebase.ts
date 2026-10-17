import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// NEXT_PUBLIC_* values must be read as literal property accesses so Next can inline them.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Returns the Realtime Database, or null when the Firebase env vars are not set (the app then falls back to localStorage). */
export function getDb() {
  if (!config.apiKey || !config.databaseURL) return null;
  const app = getApps().length ? getApp() : initializeApp(config);
  return getDatabase(app);
}
