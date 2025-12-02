import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { generateAIResponse } from "@/lib/ai-service";

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const chatbotId = url.searchParams.get("chatbotId");
        const update = await req.json();

        if (!chatbotId) {
            console.error("Telegram Webhook: Missing chatbotId");
            return new Response("Missing chatbotId", { status: 400 });
        }

        // Check if it's a message
        if (!update.message || !update.message.text) {
            return new Response("OK", { status: 200 }); // Ignore non-text messages
        }

        const chatId = update.message.chat.id;
        const text = update.message.text;
        const userId = update.message.from.id; // Telegram User ID

        console.log(`Telegram Webhook: Received message from ${userId} for chatbot ${chatbotId}: ${text}`);

        // 1. Get Chatbot Settings (to get the Token)
        const chatbotRef = doc(db, "chatbots", chatbotId);
        const chatbotSnap = await getDoc(chatbotRef);

        if (!chatbotSnap.exists()) {
            console.error("Telegram Webhook: Chatbot not found");
            return new Response("Chatbot not found", { status: 404 });
        }

        const data = chatbotSnap.data();
        const telegramConfig = data.integrations?.telegram;

        if (!telegramConfig || !telegramConfig.connected || !telegramConfig.botToken) {
            console.error("Telegram Webhook: Telegram not connected for this chatbot");
            return new Response("Telegram not connected", { status: 400 });
        }

        const botToken = telegramConfig.botToken;

        // 2. Generate AI Response
        // We use the Telegram Chat ID as the Session ID to maintain context per user
        const sessionId = `telegram-${chatbotId}-${chatId}`;

        // Fetch previous context if needed, but for now we'll just pass the current message
        // Ideally, we should fetch the last few messages from Firestore for this session
        // But generateAIResponse handles saving to session, so we just need to pass the current message
        // and let it build context from Pinecone + System Prompt.
        // NOTE: For a true conversational experience, we should pass history to generateAIResponse.
        // For this MVP, we'll rely on RAG context.

        // Check if session is paused
        const sessionRef = doc(db, "chat_sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);
        let isPaused = false;
        let history: any[] = [];

        if (sessionSnap.exists()) {
            const sessionData = sessionSnap.data();
            isPaused = sessionData.isPaused || false;
            // Get last 6 messages
            history = sessionData.messages.slice(-6).map((m: any) => ({
                role: m.role,
                content: m.content
            }));
        }

        // Save user message first (important for history)
        if (!sessionSnap.exists()) {
            await setDoc(sessionRef, {
                chatbotId,
                createdAt: new Date().toISOString(),
                messages: [],
                isPaused: false
            });
        }

        await updateDoc(sessionRef, {
            messages: arrayUnion({
                id: Date.now().toString(),
                role: "user",
                content: text,
                createdAt: new Date().toISOString()
            })
        });

        if (isPaused) {
            console.log(`Telegram Webhook: Session ${sessionId} is paused. Skipping AI reply.`);
            return new Response("OK (Paused)", { status: 200 });
        }

        const messages = [
            ...history,
            { role: "user", content: text }
        ];

        // Send "Typing..." action
        await fetch(`https://api.telegram.org/bot${botToken}/sendChatAction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                action: "typing"
            })
        });

        const aiResult = await generateAIResponse(chatbotId, messages as any, sessionId, false);
        const replyText = aiResult.content;

        // 3. Send Reply to Telegram
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: replyText
            })
        });

        return new Response("OK", { status: 200 });

    } catch (error) {
        console.error("Telegram Webhook Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
