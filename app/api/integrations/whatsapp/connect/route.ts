import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        const { chatbotId, phoneNumberId, accessToken, verifyToken } = await req.json();

        if (!chatbotId || !phoneNumberId || !accessToken || !verifyToken) {
            return new Response("Missing required fields", { status: 400 });
        }

        const chatbotRef = doc(db, "chatbots", chatbotId);

        // Verify chatbot exists
        const chatbotSnap = await getDoc(chatbotRef);
        if (!chatbotSnap.exists()) {
            return new Response("Chatbot not found", { status: 404 });
        }

        // Save WhatsApp config
        await setDoc(chatbotRef, {
            integrations: {
                whatsapp: {
                    connected: true,
                    phoneNumberId,
                    accessToken,
                    verifyToken,
                    connectedAt: new Date().toISOString()
                }
            }
        }, { merge: true });

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error("WhatsApp Connect Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
