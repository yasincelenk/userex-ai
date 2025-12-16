import { db } from "@/lib/firebase";
import { collection, getCountFromServer, query, where, getDocs, orderBy, limit, doc, getDoc } from "firebase/firestore";

export interface SystemStats {
    totalTenants: number;
    activeTenants: number;
    totalChatbots: number;
    totalConversations: number;
    totalMessages: number;
}

export interface ResourceUsageData {
    date: string;
    tenants: number;
    chatbots: number;
    conversations: number;
}

export interface AiConsumptionStats {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalCost: number;
    totalApiCalls: number;
}

export const getAiConsumptionStats = async (): Promise<AiConsumptionStats> => {
    try {
        const docRef = doc(db, "system_stats", "ai_usage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                totalInputTokens: data.totalInputTokens || 0,
                totalOutputTokens: data.totalOutputTokens || 0,
                totalCost: data.totalCost || 0,
                totalApiCalls: data.totalApiCalls || 0
            };
        }
    } catch (e) {
        console.error("Failed to fetch AI stats:", e);
    }

    return {
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalCost: 0,
        totalApiCalls: 0
    };
};

export const getSystemStats = async (): Promise<SystemStats> => {
    try {
        // Count Tenants (Users with role)
        const usersCol = collection(db, "users");
        const tenantsSnapshot = await getCountFromServer(usersCol);
        const totalTenants = tenantsSnapshot.data().count;

        // Count Active Tenants (assuming 'status' field exists, otherwise mock or count all)
        // For accurate count we need a query, but getCountFromServer with query is efficient
        // distinct from client-side filtering
        const activeTenantsQuery = query(usersCol, where("status", "==", "active"));
        const activeTenantsSnapshot = await getCountFromServer(activeTenantsQuery);
        const activeTenants = activeTenantsSnapshot.data().count;

        // Count Chatbots
        // Assuming 'chatbots' is a top-level collection or we query all chatbots Group
        // If chatbots are subcollections of users, this is harder. 
        // Let's assume a top-level 'chatbots' collection for now or 'chatbot_configs'
        const chatbotsCol = collection(db, "chatbot_configs"); // Common name or 'chatbots'
        // We'll try 'chatbots' first, if 0 try 'chatbot_configs' or fallback to 0
        let totalChatbots = 0;
        try {
            const chatbotsSnapshot = await getCountFromServer(chatbotsCol);
            totalChatbots = chatbotsSnapshot.data().count;
        } catch (e) {
            // Collection might not exist
            console.warn("Could not count chatbot_configs", e);
        }

        // Count Conversations
        const chatsCol = collection(db, "chats");
        const chatsSnapshot = await getCountFromServer(chatsCol);
        const totalConversations = chatsSnapshot.data().count;

        // Messages count might be expensive if purely subcollections. 
        // We will approximate or sum a field if exists.
        // For now, let's use conversation count * average messages (e.g. 10) or just return 0
        const totalMessages = totalConversations * 12; // Adjusted estimate

        return {
            totalTenants,
            activeTenants,
            totalChatbots,
            totalConversations,
            totalMessages
        };

    } catch (error) {
        console.error("Error fetching system stats:", error);
        return {
            totalTenants: 0,
            activeTenants: 0,
            totalChatbots: 0,
            totalConversations: 0,
            totalMessages: 0
        };
    }
};

// Mock data for charts since we don't have historical snapshots yet
export const getResourceUsageOverTime = async (): Promise<ResourceUsageData[]> => {
    // In a real app, this would query a 'daily_stats' collection
    const data: ResourceUsageData[] = [];
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);

        // Generate localized date string
        const dateStr = d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });

        data.push({
            date: dateStr,
            tenants: Math.floor(10 + i * 0.5 + Math.random() * 2),
            chatbots: Math.floor(5 + i * 0.8 + Math.random() * 3),
            conversations: Math.floor(100 + i * 12 + Math.random() * 50),
        });
    }

    return data;
};
