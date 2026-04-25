// /config/firebase.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

const app = initializeApp({
    credential: cert(serviceAccount),
});

console.log("🔥 Firebase Admin initialized for:", serviceAccount.project_id);

export const db = getFirestore(app);
export const auth = getAuth(app);