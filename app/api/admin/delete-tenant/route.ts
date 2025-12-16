import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        // Verify authorization
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 });
        }

        // Check if Admin SDK is initialized
        if (!adminAuth || !adminDb) {
            console.warn("Firebase Admin SDK not initialized. Environment variables missing?");
            return NextResponse.json({
                error: "Server misconfigured",
                code: "ADMIN_SDK_MISSING"
            }, { status: 503 });
        }

        const idToken = authHeader.split('Bearer ')[1];

        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(idToken);
        } catch (error) {
            console.error("Token verification failed:", error);
            return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
        }

        // Verify Caller is SUPER_ADMIN
        // We can get the user role from custom claims or by fetching the user doc
        // Fetching user doc is safer if custom claims aren't strictly managed
        const callerDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        const callerData = callerDoc.data();

        if (callerData?.role !== 'SUPER_ADMIN') {
            console.log("Delete Tenant API: Unauthorized - App-level role check failed");
            return NextResponse.json({ error: "Unauthorized - SUPER_ADMIN role required" }, { status: 403 });
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        // Prevent deleting yourself
        if (userId === decodedToken.uid) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        // 1. Delete Auth User
        try {
            await adminAuth.deleteUser(userId);
            console.log(`Successfully deleted user ${userId} from Auth`);
        } catch (error: any) {
            // Include error code or message if user not found, but continue to clean up data
            if (error.code === 'auth/user-not-found') {
                console.log(`User ${userId} not found in Auth, proceeding to delete data.`);
            } else {
                console.error("Error deleting auth user:", error);
                // We might want to stop here or verify? 
                // Let's continue to ensure data cleanup happens even if Auth fails (e.g. partial previous delete)
            }
        }

        // 2. Recursive Delete Firestore Data
        // Ideally use a recursive delete function if available or manual batching
        // Since we know the collections, we can target them directly

        const batch = adminDb.batch();

        // Delete User Data
        const userRef = adminDb.collection("users").doc(userId);
        batch.delete(userRef);

        // Delete Chatbot Settings
        const chatbotRef = adminDb.collection("chatbots").doc(userId);
        batch.delete(chatbotRef);

        // Commit single document deletes first
        await batch.commit();

        // Batch delete collections (Chat Sessions, Knowledge Docs, etc.)
        // Note: For large collections, this should be done in chunks or using firebase-tools
        // Assuming strictly < 500 items for now for a simple tenant

        const deleteCollection = async (collectionName: string, queryField: string) => {
            // adminDb is verified at the top of the handler
            const q = adminDb!.collection(collectionName).where(queryField, "==", userId);
            const snapshot = await q.get();

            if (snapshot.empty) return;

            const batch = adminDb!.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        };

        await deleteCollection("knowledge_docs", "chatbotId");
        await deleteCollection("chat_sessions", "chatbotId");
        // Add other collections if they exist (e.g. leads, usage logs)

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error deleting tenant:", error);
        return NextResponse.json({ error: error.message || "Failed to delete tenant" }, { status: 500 });
    }
}
