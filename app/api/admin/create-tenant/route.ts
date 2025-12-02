import { NextResponse } from "next/server";
import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut, setPersistence, inMemoryPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// We need a separate Firebase App instance to create a user without logging out the current admin
// This is a workaround since we don't have Firebase Admin SDK set up on the server (which requires service account)
// We will initialize a secondary app with the same config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function POST(req: Request) {
    let secondaryApp;
    try {
        const { email, password, firstName, lastName, companyName, companyWebsite } = await req.json();

        if (!email || !password) {
            console.log("Create Tenant API: Missing email or password");
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        console.log("Create Tenant API: Attempting to create user", email);

        // Initialize secondary app with a unique name
        const appName = `secondary-${Date.now()}`;
        // Check if app with this name already exists (unlikely with timestamp but good practice)
        const existingApp = getApps().find(app => app.name === appName);
        secondaryApp = existingApp || initializeApp(firebaseConfig, appName);

        const secondaryAuth = getAuth(secondaryApp);
        // Important: Set persistence to NONE/MEMORY because we are on the server
        await setPersistence(secondaryAuth, inMemoryPersistence);

        const secondaryDb = getFirestore(secondaryApp);

        // Create user
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(secondaryDb, "users", user.uid), {
            email: user.email,
            firstName: firstName || "",
            lastName: lastName || "",
            companyName: companyName || "",
            companyWebsite: companyWebsite || "",
            role: "TENANT_ADMIN",
            createdAt: new Date().toISOString(),
            isActive: true
        });

        // Sign out from secondary app immediately
        await signOut(secondaryAuth);

        return NextResponse.json({ success: true, userId: user.uid });

    } catch (error: any) {
        console.error("Error creating tenant:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);

        if (error.code === 'auth/email-already-in-use') {
            return NextResponse.json({
                error: "Bu e-posta adresi zaten kullanımda. (Not: Daha önce silinen kullanıcıların kayıtları Auth sisteminde kalmış olabilir. Lütfen farklı bir e-posta adresi kullanın.)"
            }, { status: 409 });
        }

        return NextResponse.json({ error: error.message || "Failed to create tenant" }, { status: 500 });
    } finally {
        // Cleanup secondary app
        if (secondaryApp) {
            await deleteApp(secondaryApp);
        }
    }
}
