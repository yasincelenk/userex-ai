import * as admin from 'firebase-admin';

let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

try {
    if (!admin.apps.length) {
        if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ai-assistant-22f53',
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
                storageBucket: 'ai-assistant-22f53.firebasestorage.app',
            });
        }
    }


    if (admin.apps.length) {
        adminAuth = admin.auth();
        adminDb = admin.firestore();
        adminStorage = admin.storage();
    }
} catch (error) {
    console.error("Firebase Admin initialization failed:", error);
}

export { adminAuth, adminDb, adminStorage };
