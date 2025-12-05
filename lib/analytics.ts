import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";

export interface DailyStat {
    date: string;
    conversations: number;
    messages: number;
}

export interface SentimentStats {
    positive: number;
    neutral: number;
    negative: number;
}

export interface AnalyticsSummary {
    totalConversations: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
    sentiment: SentimentStats;
    dailyStats: DailyStat[];
}

export async function getAnalyticsData(
    chatbotId: string,
    startDate: Date,
    endDate: Date
): Promise<AnalyticsSummary> {
    try {
        const sessionsRef = collection(db, "chat_sessions");
        const q = query(
            sessionsRef,
            where("chatbotId", "==", chatbotId),
            where("createdAt", ">=", startDate.toISOString()),
            where("createdAt", "<=", endDate.toISOString()),
            orderBy("createdAt", "asc")
        );

        const querySnapshot = await getDocs(q);

        let totalConversations = 0;
        let totalMessages = 0;
        const sentiment: SentimentStats = { positive: 0, neutral: 0, negative: 0 };
        const dailyMap = new Map<string, DailyStat>();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            totalConversations++;

            const messageCount = data.messages ? data.messages.length : 0;
            totalMessages += messageCount;

            // Sentiment Analysis (Simple aggregation based on stored sentiment if available)
            // Assuming we might store sentiment on the session or messages. 
            // For now, let's look at the last message's sentiment or a session-level sentiment field if it existed.
            // Since we don't have session-level sentiment yet, we'll aggregate from messages if they have it.
            if (data.messages) {
                data.messages.forEach((msg: any) => {
                    if (msg.sentiment) {
                        const s = msg.sentiment.toLowerCase();
                        if (s === 'positive') sentiment.positive++;
                        else if (s === 'negative') sentiment.negative++;
                        else sentiment.neutral++;
                    }
                });
            }

            // Daily Stats
            const date = new Date(data.createdAt).toLocaleDateString("en-CA"); // YYYY-MM-DD
            if (!dailyMap.has(date)) {
                dailyMap.set(date, { date, conversations: 0, messages: 0 });
            }
            const stat = dailyMap.get(date)!;
            stat.conversations++;
            stat.messages += messageCount;
        });

        // Fill in missing days with 0
        const stats: DailyStat[] = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toLocaleDateString("en-CA");
            if (dailyMap.has(dateStr)) {
                stats.push(dailyMap.get(dateStr)!);
            } else {
                stats.push({ date: dateStr, conversations: 0, messages: 0 });
            }
        }

        return {
            totalConversations,
            totalMessages,
            averageMessagesPerConversation: totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0,
            sentiment,
            dailyStats: stats
        };

    } catch (error) {
        console.error("Error fetching analytics:", error);
        throw error;
    }
}
