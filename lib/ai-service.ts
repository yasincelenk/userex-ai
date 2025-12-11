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

        // 1. Get Chatbot Config & Shopper Settings
        const chatbotRef = doc(db, "chatbots", chatbotId);
        const chatbotSnap = await getDoc(chatbotRef);
        const chatbotData = chatbotSnap.exists() ? chatbotSnap.data() : null;
        const shopperConfig = chatbotData?.shopperConfig;

        // 2. Get Context from Pinecone
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
            topK: 5, // Increased to get more potential products
            includeMetadata: true,
            filter: {
                chatbotId: chatbotId
            }
        });

        const context = queryResponse.matches
            .map((match) => match.metadata?.text)
            .join("\n\n");

        // 3. Prepare System Prompt
        let systemPrompt = `You are a helpful AI assistant for ${chatbotId}.`;

        if (shopperConfig) {
            const tone = shopperConfig.salesTone || "friendly";
            const strategy = shopperConfig.recommendationStrategy || "best_match";

            systemPrompt += `\n\nYou are an AI Personal Shopper. Your goal is to help customers find the best products for their needs.
            
            Tone: ${tone}
            Recommendation Strategy: ${strategy}
            
            When recommending products, use the information provided in the context below. 
            If you recommend a product, mention its name, price, and why it fits the user's request.
            If the product has a URL, provide it.
            `;
        }

        systemPrompt += `
    
    Context from knowledge base and product catalog:
    ${context}
    `;

        const strictMode = shopperConfig?.strictMode || false;

        if (strictMode) {
            systemPrompt += `
    STRICTLY FOLLOW THESE RULES:
    1. You are a specialized assistant for this specific company.
    2. Answer ONLY questions related to the company, its products, services, or the provided context.
    3. If a user asks about general topics (e.g., "Who won the World Cup?", "Write a poem", "What is 2+2?"), politely REFUSE to answer. Say something like: "I am restricted to answering questions only about our products and services."
    4. Do not use your general knowledge to answer questions unrelated to the business context.
            `;
        } else {
            systemPrompt += `
    If the answer is not in the context, use your general knowledge but mention that you are not 100% sure if it applies to this specific company.
    Always be polite and professional.
    You are allowed to be creative (e.g., writing poems or stories) if the user asks, but try to keep it related to the company's products if possible.
            `;
        }

        systemPrompt += `
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

export async function analyzeSentiment(text: string): Promise<"Positive" | "Neutral" | "Negative"> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Classify the sentiment of the following text as exactly one of these words: Positive, Neutral, Negative." },
                { role: "user", content: text }
            ],
            temperature: 0,
            max_tokens: 10
        });
        const sentiment = response.choices[0].message.content?.trim() || "Neutral";
        if (["Positive", "Neutral", "Negative"].includes(sentiment)) {
            return sentiment as any;
        }
        return "Neutral";
    } catch (error) {
        console.error("Sentiment Analysis Error:", error);
        return "Neutral";
    }
}

export async function saveMessageToSession(
    sessionId: string,
    chatbotId: string,
    message: { role: string, content: string, id?: string, sentiment?: string }
) {
    const sessionRef = doc(db, "chat_sessions", sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
        await setDoc(sessionRef, {
            chatbotId,
            createdAt: new Date().toISOString(),
            messages: []
        });
    }

    const messageData: any = {
        id: message.id || Date.now().toString(),
        role: message.role,
        content: message.content,
        createdAt: new Date().toISOString()
    };

    if (message.sentiment) {
        messageData.sentiment = message.sentiment;
    }

    await updateDoc(sessionRef, {
        messages: arrayUnion(messageData)
    });
}
