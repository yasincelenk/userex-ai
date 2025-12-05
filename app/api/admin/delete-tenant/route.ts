import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Use the main app's db instance (initialized in lib/firebase)
import { doc, deleteDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        // Verify authorization
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 });
        }

        const { userId, callerRole } = await req.json();

        // Check if caller is SUPER_ADMIN
        if (callerRole !== 'SUPER_ADMIN') {
            console.log("Delete Tenant API: Unauthorized - Not SUPER_ADMIN");
            return NextResponse.json({ error: "Unauthorized - SUPER_ADMIN role required" }, { status: 403 });
        }

        // 1. Delete User Document
        await deleteDoc(doc(db, "users", userId));

        // 2. Delete Chatbot Settings
        await deleteDoc(doc(db, "chatbots", userId));

        // 3. Delete Knowledge Docs (Batch delete)
        const knowledgeQuery = query(collection(db, "knowledge_docs"), where("chatbotId", "==", userId));
        const knowledgeSnapshot = await getDocs(knowledgeQuery);

        // Firestore batch limit is 500. If more, we need multiple batches.
        // For simplicity, we'll assume < 500 for now or loop.
        const batch = writeBatch(db);
        knowledgeSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // 4. Delete Chat Sessions (Batch delete)
        const sessionsQuery = query(collection(db, "chat_sessions"), where("chatbotId", "==", userId));
        const sessionsSnapshot = await getDocs(sessionsQuery);

        sessionsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        // Note: We cannot delete the Auth user from here without Admin SDK.
        // The user will remain in Auth but have no data and cannot log in effectively (or we can block them via isActive check on login).

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error deleting tenant:", error);
        return NextResponse.json({ error: error.message || "Failed to delete tenant" }, { status: 500 });
    }
}
