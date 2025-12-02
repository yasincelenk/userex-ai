import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

export interface AIMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export async function generateAIResponse(
    chatbotId: string,
    messages: AIMessage[],
    sessionId?: string,
    streamResponse: boolean = true
) {
    try {
        console.log("AI Service: Generating response", { chatbotId, sessionId, messageCount: messages.length });
        const lastMessage = messages[messages.length - 1];

        // 1. Get Context from Pinecone
        const index = pc.index("chatbot-knowledge");

        console.log("AI Service: Creating embedding...");
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: lastMessage.content,
        });

        const embedding = embeddingResponse.data[0].embedding;

        console.log("AI Service: Querying Pinecone...");
        const queryResponse = await index.query({
            vector: embedding,
            topK: 3,
            includeMetadata: true,
            filter: {
                chatbotId: chatbotId
            }
        });

        const context = queryResponse.matches
            .map((match) => match.metadata?.text)
            .join("\n\n");

        // 2. Prepare System Prompt
        const systemPrompt = `You are a helpful AI assistant for ${chatbotId}.
    
    Context from knowledge base:
    ${context}
    
    If the answer is not in the context, use your general knowledge but mention that you are not 100% sure if it applies to this specific company.
    Always be polite and professional.

    IMPORTANT: If the user provides their contact information (Name, Surname, Company, Phone, Email) in response to your request, politely thank them and confirm that a customer representative will reach out to them soon.
    `;

        const fullMessages = [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
        ] as any[];

        // 3. Call OpenAI
        console.log("AI Service: Calling OpenAI...");

        if (streamResponse) {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                stream: true,
                messages: fullMessages,
            });
            return { response, isStream: true, context };
        } else {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                stream: false,
                messages: fullMessages,
            });
            const content = response.choices[0].message.content || "";

            // Save to Firestore if not streaming (streaming saves are handled by the caller or a callback)
            if (sessionId) {
                await saveMessageToSession(sessionId, chatbotId, lastMessage);
                await saveMessageToSession(sessionId, chatbotId, { role: "assistant", content });
            }

            return { content, isStream: false, context };
        }

    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
}

export async function saveMessageToSession(sessionId: string, chatbotId: string, message: { role: string, content: string, id?: string }) {
    const sessionRef = doc(db, "chat_sessions", sessionId);
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
            id: message.id || Date.now().toString(),
            role: message.role,
            content: message.content,
            createdAt: new Date().toISOString()
        })
    });
}
