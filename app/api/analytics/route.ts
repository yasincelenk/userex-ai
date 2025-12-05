import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/analytics";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const chatbotId = searchParams.get("chatbotId");
        const startDateStr = searchParams.get("startDate");
        const endDateStr = searchParams.get("endDate");

        if (!chatbotId) {
            return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
        }

        const startDate = startDateStr ? new Date(startDateStr) : new Date(new Date().setDate(new Date().getDate() - 7));
        const endDate = endDateStr ? new Date(endDateStr) : new Date();

        const data = await getAnalyticsData(chatbotId, startDate, endDate);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
