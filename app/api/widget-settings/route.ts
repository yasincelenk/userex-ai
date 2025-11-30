import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Ensure this path is correct for server-side usage or use admin SDK if needed. 
// Note: Client SDK in route handlers works but isn't ideal for high scale. For this prototype it's fine.
import { doc, getDoc } from "firebase/firestore";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    if (!chatbotId) {
        return NextResponse.json({ error: "Missing chatbotId" }, { status: 400 });
    }

    try {
        const docRef = doc(db, "chatbots", chatbotId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Return only public settings
            return NextResponse.json({
                companyName: data.companyName || "Acme Corp",
                brandColor: data.brandColor || "#000000",
                position: data.position || "bottom-right", // 'bottom-right' | 'bottom-left'
                viewMode: data.viewMode || "classic", // 'classic' | 'wide'
                modalSize: data.modalSize || "half", // 'half' | 'full'
                launcherStyle: data.launcherStyle || "circle",
                launcherText: data.launcherText || "Chat",
                launcherRadius: data.launcherRadius !== undefined ? data.launcherRadius : 50,
                launcherHeight: data.launcherHeight || 60,
                launcherWidth: data.launcherWidth || 60,
                launcherIcon: data.launcherIcon || "message",
                launcherIconUrl: data.launcherIconUrl || "",
            });
        } else {
            return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
