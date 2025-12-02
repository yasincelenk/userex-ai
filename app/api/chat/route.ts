import { OpenAIStream, StreamingTextResponse } from "ai";
import { generateAIResponse, saveMessageToSession } from "@/lib/ai-service";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        console.log("Chat API: Request received");
        const { messages, chatbotId, sessionId } = await req.json();

        // 0. Check if Session is Paused
        if (sessionId) {
            const sessionRef = doc(db, "chat_sessions", sessionId);
            const sessionSnap = await getDoc(sessionRef);
            if (sessionSnap.exists() && sessionSnap.data().isPaused) {
                console.log("Chat API: Session is paused, skipping AI generation");
                // Just save the user message
                await updateDoc(sessionRef, {
                    messages: arrayUnion({
                        id: messages[messages.length - 1].id || Date.now().toString(),
                        role: "user",
                        content: messages[messages.length - 1].content,
                        createdAt: new Date().toISOString()
                    })
                });
                return new Response(JSON.stringify({ content: "" }), { status: 200 });
            }
        }

        const result = await generateAIResponse(chatbotId, messages, sessionId, true);

        if (result.isStream) {
            const stream = OpenAIStream(result.response as any, {
                onStart: async () => {
                    // Save user message
                    const lastMessage = messages[messages.length - 1];
                    if (sessionId) {
                        await saveMessageToSession(sessionId, chatbotId, {
                            ...lastMessage,
                            role: "user"
                        });
                    }
                },
                onCompletion: async (completion) => {
                    // Save AI response
                    if (sessionId) {
                        await saveMessageToSession(sessionId, chatbotId, {
                            role: "assistant",
                            content: completion
                        });
                    }
                },
            });
            return new StreamingTextResponse(stream);
        } else {
            return new Response(JSON.stringify({ content: result.content }), { status: 200 });
        }

    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }), { status: 500 });
    }
}
