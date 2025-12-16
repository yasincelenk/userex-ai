import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";

// Pricing per 1M tokens (USD)
const PRICING = {
    "gpt-3.5-turbo": { input: 0.50, output: 1.50 },
    "gpt-4o": { input: 5.00, output: 15.00 },
    "gpt-4-turbo": { input: 10.00, output: 30.00 },
    "gemini-1.5-pro": { input: 3.50, output: 10.50 }, // Approx
    "default": { input: 1.00, output: 2.00 }
};

export async function trackAiUsage(
    chatbotId: string,
    inputTokens: number,
    outputTokens: number,
    model: string = "gpt-3.5-turbo"
) {
    try {
        const modelPrice = PRICING[model as keyof typeof PRICING] || PRICING["default"];

        const inputCost = (inputTokens / 1_000_000) * modelPrice.input;
        const outputCost = (outputTokens / 1_000_000) * modelPrice.output;
        const totalCost = inputCost + outputCost;

        const statsRef = doc(db, "system_stats", "ai_usage");

        // Ensure doc exists
        // (Optimistic update or check-then-set pattern)
        // For high ease, we assume it might exist, if not we create it.
        // updateDoc fails if not exists, setDoc with merge is safer but 'increment' works best with updateDoc usually?
        // Actually setDoc({..}, {merge: true}) with increment works fine.

        await setDoc(statsRef, {
            totalInputTokens: increment(inputTokens),
            totalOutputTokens: increment(outputTokens),
            totalCost: increment(totalCost),
            totalApiCalls: increment(1),
            lastUpdated: new Date().toISOString()
        }, { merge: true });

        console.log(`[UsageTracker] Tracked ${inputTokens}in/${outputTokens}out ($${totalCost.toFixed(6)}) for ${model}`);

    } catch (error) {
        console.error("[UsageTracker] Failed to track usage:", error);
        // Non-blocking error, we don't want to fail the chat flow
    }
}
