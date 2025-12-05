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
                    const telegramConfig = data.integrations?.telegram;

                    if (telegramConfig?.connected && telegramConfig?.botToken) {
                        await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: content
                            })
                        });
                        console.log("Admin Message: Sent to Telegram");
                    } else {
                        console.warn("Admin Message: No Telegram token found or not connected");
                    }
                }
            }
        } else if (sessionId.startsWith("whatsapp-")) {
            // WhatsApp Logic
            const parts = sessionId.split("-");
            // parts[0] = "whatsapp"
            // parts[1] = chatbotId
            // parts[2] = phoneNumber
            const phoneNumber = parts[2];

            if (phoneNumber) {
                const chatbotRef = doc(db, "chatbots", chatbotId);
                const chatbotSnap = await getDoc(chatbotRef);

                if (chatbotSnap.exists()) {
                    const waConfig = chatbotSnap.data().integrations?.whatsapp;
                    if (waConfig?.connected && waConfig?.phoneNumberId && waConfig?.accessToken) {
                        await fetch(`https://graph.facebook.com/v17.0/${waConfig.phoneNumberId}/messages`, {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${waConfig.accessToken}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                messaging_product: "whatsapp",
                                to: phoneNumber,
                                text: { body: content }
                            })
                        });
                        console.log("Admin Message: Sent to WhatsApp");
                    } else {
                        console.warn("Admin Message: WhatsApp not configured or connected for this chatbot");
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
