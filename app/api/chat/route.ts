import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

export async function POST(req: Request) {
    try {
        console.log("Chat API: Request received");
        const { messages, chatbotId, sessionId } = await req.json();
        console.log("Chat API: Parsed body", { chatbotId, sessionId, messageCount: messages.length });
        const lastMessage = messages[messages.length - 1];

        // 1. Get Context from Pinecone
        const index = pc.index("chatbot-knowledge"); // Replace with your actual index name if different

        console.log("Chat API: Creating embedding...");
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: lastMessage.content,
        });
        console.log("Chat API: Embedding created");

        const embedding = embeddingResponse.data[0].embedding;

        console.log("Chat API: Querying Pinecone...");
        const queryResponse = await index.query({
            vector: embedding,
            topK: 3,
            includeMetadata: true,
            filter: {
                chatbotId: chatbotId // Ensure we only search this chatbot's knowledge
            }
        });
        console.log("Chat API: Pinecone query complete", { matches: queryResponse.matches.length });

        const context = queryResponse.matches
            .map((match) => match.metadata?.text)
            .join("\n\n");

        // 2. Fetch Chatbot Settings (System Prompt / Persona)
        // Optional: You could fetch custom system prompt from Firestore here
        // For now, we'll use a default one + context

        const systemPrompt = `You are a helpful AI assistant for ${chatbotId}.
    
    Context from knowledge base:
    ${context}
    
    If the answer is not in the context, use your general knowledge but mention that you are not 100% sure if it applies to this specific company.
    Always be polite and professional.

    IMPORTANT: If the user provides their contact information (Name, Surname, Company, Phone, Email) in response to your request, politely thank them and confirm that a customer representative will reach out to them soon.
    `;

        // 3. Call OpenAI
        console.log("Chat API: Calling OpenAI Chat Completion...");
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Switched to gpt-3.5-turbo for faster response
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((m: any) => ({ role: m.role, content: m.content })),
            ],
        });
        console.log("Chat API: OpenAI response received, starting stream...");

        // 4. Stream Response & Save to Firestore
        const stream = OpenAIStream(response as any, {
            onStart: async () => {
                console.log("Chat API: Stream started");
                // Save user message
                if (sessionId) {
                    const sessionRef = doc(db, "chat_sessions", sessionId);
                    // Ensure session exists
                    const sessionSnap = await getDoc(sessionRef);
                    if (!sessionSnap.exists()) {
                        await setDoc(sessionRef, {
                            chatbotId,
                            createdAt: new Date().toISOString(),
                            messages: []
                        });
                    }

                    await updateDoc(sessionRef, {
                        messages: arrayUnion({
                            id: lastMessage.id || Date.now().toString(),
                            role: "user",
                            content: lastMessage.content,
                            createdAt: new Date().toISOString()
                        })
                    });
                }
            },
            onCompletion: async (completion) => {
                console.log("Chat API: Stream completed");
                // Save AI response
                if (sessionId) {
                    const sessionRef = doc(db, "chat_sessions", sessionId);
                    await updateDoc(sessionRef, {
                        messages: arrayUnion({
                            id: Date.now().toString(), // Generate a simple ID
                            role: "assistant",
                            content: completion,
                            createdAt: new Date().toISOString()
                        })
                    });
                }
            },
        });

        return new StreamingTextResponse(stream);

    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }), { status: 500 });
    }
}
