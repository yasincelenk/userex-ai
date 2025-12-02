import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        const { userId, botToken } = await req.json();

        if (!userId || !botToken) {
            return new Response(JSON.stringify({ error: "Missing userId or botToken" }), { status: 400 });
        }

        // 1. Verify Token and Get Bot Info from Telegram
        const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
        const telegramData = await telegramResponse.json();

        if (!telegramData.ok) {
            return new Response(JSON.stringify({ error: "Invalid Bot Token" }), { status: 400 });
        }

        const botName = telegramData.result.username;

        // 2. Set Webhook
        // Construct the webhook URL based on the request origin or a configured base URL
        // For local development, this needs to be a public URL (e.g., ngrok). 
        // In production, it's the deployed domain.
        const origin = new URL(req.url).origin;
        const webhookUrl = `${origin}/api/integrations/telegram/webhook?chatbotId=${userId}`;

        const setWebhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`);
        const setWebhookData = await setWebhookResponse.json();

        if (!setWebhookData.ok) {
            return new Response(JSON.stringify({ error: "Failed to set webhook", details: setWebhookData }), { status: 500 });
        }

        // 3. Save to Firestore
        const chatbotRef = doc(db, "chatbots", userId);

        // We use setDoc with merge: true to ensure we don't overwrite other fields
        // But here we want to update a nested field. 
        // Firestore updateDoc with dot notation is best for nested fields.

        await updateDoc(chatbotRef, {
            "integrations.telegram": {
                connected: true,
                botToken: botToken,
                botName: botName,
                botId: telegramData.result.id,
                connectedAt: new Date().toISOString()
            }
        }).catch(async (err) => {
            // If document doesn't exist, create it (fallback)
            if (err.code === 'not-found') {
                await setDoc(chatbotRef, {
                    integrations: {
                        telegram: {
                            connected: true,
                            botToken: botToken,
                            botName: botName,
                            botId: telegramData.result.id,
                            connectedAt: new Date().toISOString()
                        }
                    }
                }, { merge: true });
            } else {
                throw err;
            }
        });

        return new Response(JSON.stringify({ success: true, botName }), { status: 200 });

    } catch (error) {
        console.error("Telegram Connect Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: String(error) }), { status: 500 });
    }
}
