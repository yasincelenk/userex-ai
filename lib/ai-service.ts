import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { INDUSTRY_CONFIG } from "@/lib/industry-config";

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
    streamResponse: boolean = true,
    userContext?: { url: string, title: string, desc: string },
    isVoice?: boolean,
    language?: string
) {
    try {
        console.log("AI Service: Generating response", { chatbotId, sessionId, messageCount: messages.length, isVoice });
        const lastMessage = messages[messages.length - 1];

        // 1. Get Chatbot Config & Shopper Settings
        const chatbotRef = doc(db, "chatbots", chatbotId);
        const chatbotSnap = await getDoc(chatbotRef);
        const chatbotData = chatbotSnap.exists() ? chatbotSnap.data() : null;
        const shopperConfig = chatbotData?.shopperConfig;
        const isShopperEnabled = chatbotData?.enablePersonalShopper === true;
        const industry = (chatbotData?.industry || 'ecommerce') as keyof typeof INDUSTRY_CONFIG;
        const industryConfig = INDUSTRY_CONFIG[industry] || INDUSTRY_CONFIG['ecommerce'];

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
        let systemPrompt = `You are a helpful AI assistant for ${chatbotId}. ${industryConfig.systemPrompt}`;

        if (isShopperEnabled && shopperConfig) {
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

        // Add language instruction if language is specified
        if (language && language !== 'auto') {
            const languageNames: Record<string, string> = {
                'en': 'English',
                'tr': 'Turkish',
                'de': 'German',
                'es': 'Spanish'
            };
            const langName = languageNames[language] || 'English';
            systemPrompt += `\n\nIMPORTANT: Respond in ${langName} language. All your responses should be in ${langName}.`;
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

        if (userContext) {
            systemPrompt += `
    CURRENT USER CONTEXT:
    The user is currently browsing this page:
    URL: ${userContext.url}
    Title: ${userContext.title}
    Description: ${userContext.desc}
    
    Use this information to provide more relevant answers. If the user asks "how much is this?", refer to the product on the current page if applicable.
            `;
        }

        if (isVoice) {
            systemPrompt += `
    VOICE MODE ACTIVATED:
    The user is speaking to you via a Voice Interface (Speech-to-Text).
    1. Reply as if you are having a conversation. 
    2. Do NOT say "I am a text-based AI" or "I cannot hear you". You ARE hearing them through transcription.
    3. Acknowledge that you heard them.
    4. Keep your responses slightly shorter and more conversational (spoken style).
    5. Avoid long lists or complex formatting (like markdown tables) unless necessary, as it will be read aloud.
            `;
        }

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
            console.log("AI Service: Requesting Atomic OpenAI Completion...");
            const start = Date.now();
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                stream: false,
                messages: fullMessages,
            });
            console.log(`AI Service: OpenAI Atomic received in ${Date.now() - start}ms`);

            const content = response.choices[0].message.content || "";

            // Save to Firestore if not streaming
            if (sessionId) {
                // User message is saved by route.ts parallel call. Only save assistant response.
                console.log("AI Service: Saving atomic response to Firestore...");
                const dbStart = Date.now();
                await saveMessageToSession(sessionId, chatbotId, { role: "assistant", content });
                console.log(`AI Service: Firestore save took ${Date.now() - dbStart}ms`);
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
