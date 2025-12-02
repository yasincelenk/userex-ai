import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        const { sessionId, chatbotId, content } = await req.json();

        if (!sessionId || !chatbotId || !content) {
            return new Response("Missing required fields", { status: 400 });
        }

        console.log(`Admin Message: Sending to ${sessionId} for bot ${chatbotId}`);

        // 1. Save to Firestore (This updates Web Widget automatically via onSnapshot)
        const sessionRef = doc(db, "chat_sessions", sessionId);

        await updateDoc(sessionRef, {
            messages: arrayUnion({
                id: Date.now().toString(),
                role: "assistant", // Or "agent" if we want to distinguish
                content: content,
                createdAt: new Date().toISOString(),
                isHuman: true // Flag to indicate human reply
            })
        });

        // 2. Check if Telegram and Dispatch
        if (sessionId.startsWith("telegram-")) {
            // Extract Chat ID (Format: telegram-{chatbotId}-{chatId})
            const parts = sessionId.split("-");
            // parts[0] = "telegram"
            // parts[1] = chatbotId
            // parts[2] = chatId (but chatId might be negative or large, so let's be careful)

            // Safer extraction: Remove "telegram-" and chatbotId + "-"
            const prefix = `telegram-${chatbotId}-`;
            const chatId = sessionId.substring(prefix.length);

            if (chatId) {
                // Get Bot Token
                const chatbotRef = doc(db, "chatbots", chatbotId);
                const chatbotSnap = await getDoc(chatbotRef);

                if (chatbotSnap.exists()) {
                    const data = chatbotSnap.data();
                    const botToken = data.integrations?.telegram?.botToken;

                    if (botToken) {
                        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: content
                            })
                        });
                        console.log("Admin Message: Sent to Telegram");
                    } else {
                        console.warn("Admin Message: No Telegram token found");
                    }
                }
            }
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error("Admin Message Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
