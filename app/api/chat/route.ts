import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { generateAIResponse, saveMessageToSession, analyzeSentiment } from "@/lib/ai-service";
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

        // Save user message before generating response
        const lastMessage = messages[messages.length - 1];
        if (sessionId && lastMessage.role === "user") {
            const sentiment = await analyzeSentiment(lastMessage.content);
            await saveMessageToSession(sessionId, chatbotId, {
                ...lastMessage,
                role: "user",
                sentiment
            });
        }

        // Generate AI response using streamText
        const result = await generateAIResponse(chatbotId, messages, sessionId, true);

        if (result.isStream) {
            // For streaming responses, we need to use the new ai SDK approach
            // The generateAIResponse returns an OpenAI stream, we need to convert it
            const stream = result.response;

            // Create a readable stream from the OpenAI response
            const encoder = new TextEncoder();
            let fullContent = '';

            const readableStream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of stream as any) {
                            const content = chunk.choices?.[0]?.delta?.content || '';
                            if (content) {
                                fullContent += content;
                                controller.enqueue(encoder.encode(content));
                            }
                        }

                        // Save assistant response after stream completes
                        if (sessionId && fullContent) {
                            await saveMessageToSession(sessionId, chatbotId, {
                                role: "assistant",
                                content: fullContent
                            });
                        }

                        controller.close();
                    } catch (error) {
                        controller.error(error);
                    }
                }
            });

            return new Response(readableStream, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Transfer-Encoding': 'chunked',
                },
            });
        } else {
            return new Response(JSON.stringify({ content: result.content }), { status: 200 });
        }

    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }), { status: 500 });
    }
}
