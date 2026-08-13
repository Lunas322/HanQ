import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY 환경변수가 비어 있습니다.");
}

const app = getApps().length
  ? getApp()
  : initializeApp({ credential: cert(JSON.parse(serviceAccountKey)) });

export const adminAuth = getAuth(app);
