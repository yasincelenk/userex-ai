import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateAIResponse } from "@/lib/ai-service";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const chatbotId = searchParams.get("chatbotId");

        if (!chatbotId) {
            return NextResponse.json({ error: "Missing chatbotId" }, { status: 400 });
        }

        // Read raw body for signature verification
        const rawBody = await req.text();
        const body = JSON.parse(rawBody);

        // 1. Handle URL Verification (Challenge)
        if (body.type === "url_verification") {
            return NextResponse.json({ challenge: body.challenge });
        }

        // 2. Fetch Chatbot Settings (Token & Secret)
        const docRef = doc(db, "chatbots", chatbotId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
        }

        const settings = docSnap.data();
        const slackConfig = settings.integrations?.slack;

        if (!slackConfig || !slackConfig.connected) {
            return NextResponse.json({ error: "Slack not connected" }, { status: 400 });
        }

        // 3. Verify Request Signature
        const signature = req.headers.get("x-slack-signature");
        const timestamp = req.headers.get("x-slack-request-timestamp");

        if (!signature || !timestamp) {
            return NextResponse.json({ error: "Missing signature headers" }, { status: 401 });
        }

        // Prevent replay attacks (5 minutes tolerance)
        const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
        if (parseInt(timestamp) < fiveMinutesAgo) {
            return NextResponse.json({ error: "Request too old" }, { status: 401 });
        }

        const sigBasestring = `v0:${timestamp}:${rawBody}`;
        const mySignature = "v0=" + crypto.createHmac("sha256", slackConfig.signingSecret)
            .update(sigBasestring)
            .digest("hex");

        if (!crypto.timingSafeEqual(Buffer.from(mySignature), Buffer.from(signature))) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        // 4. Handle Events
        // We only care about 'event_callback'
        if (body.type === "event_callback") {
            const event = body.event;

            // Ignore bot messages to prevent loops
            if (event.bot_id || event.subtype === "bot_message") {
                return NextResponse.json({ ok: true });
            }

            // Handle App Mentions or Direct Messages
            if (event.type === "app_mention" || (event.type === "message" && event.channel_type === "im")) {

                // Process asynchronously to avoid timeout
                (async () => {
                    try {
                        const userMessage = event.text.replace(/<@[^>]+>/g, "").trim(); // Remove bot mention

                        // Get AI Response
                        const result = await generateAIResponse(
                            chatbotId,
                            [{ role: "user", content: userMessage }],
                            undefined,
                            false // non-streaming for Slack
                        );

                        const aiResponse = typeof result === 'object' && 'content' in result ? result.content : "";

                        // Reply to Slack
                        await fetch("https://slack.com/api/chat.postMessage", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${slackConfig.botToken}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                channel: event.channel,
                                text: aiResponse,
                                thread_ts: event.thread_ts || event.ts // Reply in thread if it's a thread, or start one
                            })
                        });

                    } catch (err) {
                        console.error("Error processing Slack message:", err);
                    }
                })();
            }
        }

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error("Error handling Slack webhook:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
