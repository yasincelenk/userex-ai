import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        const { sessionId, isPaused } = await req.json();

        if (!sessionId || typeof isPaused !== 'boolean') {
            return new Response("Missing required fields", { status: 400 });
        }

        const sessionRef = doc(db, "chat_sessions", sessionId);

        // Verify session exists
        const sessionSnap = await getDoc(sessionRef);
        if (!sessionSnap.exists()) {
            return new Response("Session not found", { status: 404 });
        }

        await updateDoc(sessionRef, {
            isPaused: isPaused
        });

        return new Response(JSON.stringify({ success: true, isPaused }), { status: 200 });

    } catch (error) {
        console.error("Toggle Pause Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
