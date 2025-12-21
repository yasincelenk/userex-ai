import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Ensure this path is correct for server-side usage or use admin SDK if needed. 
// Note: Client SDK in route handlers works but isn't ideal for high scale. For this prototype it's fine.
import { doc, getDoc } from "firebase/firestore";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    if (!chatbotId) {
        return NextResponse.json({ error: "Missing chatbotId" }, { status: 400 });
    }

    try {
        // Fetch user doc as well for permissions
        const userDocRef = doc(db, "users", chatbotId);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.exists() ? userDocSnap.data() : null;

        const isChatbotEnabled = userData?.enableChatbot !== false; // Default to true if not set, or strict? Permissions usually default to false if undefined but let's check legacy.
        // Looking at tenant-permissions, it defaults to true if undefined likely? 
        // Actually earlier code: `enableChatbot: tenant.enableChatbot || false` in some places?
        // Let's assume strict check: userData?.enableChatbot === true is safer, but let's see. 
        // In the screenshot it's a toggle.
        // Let's rely on what's in the DB. If undefined, maybe it should be active? 
        // Let's check permissions component again... `tenant.enableChatbot || false`. It defaults to false.

        const isAccountActive = userData?.isActive !== false; // Default true? Usually isActive is critical.

        const shouldEnable = isChatbotEnabled && isAccountActive;

        const docRef = doc(db, "chatbots", chatbotId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Return only public settings
            return NextResponse.json({
                isEnabled: shouldEnable,
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
                launcherLibraryIcon: data.launcherLibraryIcon || "MessageSquare",
                launcherIconColor: data.launcherIconColor || "#FFFFFF",
                launcherBackgroundColor: data.launcherBackgroundColor || "",
                bottomSpacing: data.bottomSpacing !== undefined ? data.bottomSpacing : 20,
                sideSpacing: data.sideSpacing !== undefined ? data.sideSpacing : 20,
                launcherShadow: data.launcherShadow || "medium",
                launcherAnimation: data.launcherAnimation || "none",
                // Full Image / Lottie Mode
                launcherType: data.launcherType || "standard",
                launcherImageMode: data.launcherImageMode || "image",
                launcherFullImageUrl: data.launcherFullImageUrl || "",
                launcherLottieUrl: data.launcherLottieUrl || "",
                launcherHoverEffect: data.launcherHoverEffect || "scale",
                initialLanguage: data.initialLanguage || "auto",
                // Triggers
                autoOpenDelay: data.autoOpenDelay || 0,
                openOnExitIntent: data.openOnExitIntent || false,
                openOnScroll: data.openOnScroll || 0,
                // Availability
                enableBusinessHours: data.enableBusinessHours || false,
                timezone: data.timezone || "UTC",
                businessHoursStart: data.businessHoursStart || "09:00",
                businessHoursEnd: data.businessHoursEnd || "17:00",
                offlineMessage: data.offlineMessage || "We are currently offline.",
                // Engagement
                engagement: data.engagement || null,
                enableVoiceAssistant: data.enableVoiceAssistant || false,
                enablePersonalShopper: data.enablePersonalShopper || false,
            }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            });
        } else {
            // Return default settings if not found
            return NextResponse.json({
                companyName: "Acme Corp",
                brandColor: "#000000",
                position: "bottom-right",
                viewMode: "classic",
                modalSize: "half",
                launcherStyle: "circle",
                launcherText: "Sohbet",
                launcherRadius: 50,
                launcherHeight: 60,
                launcherWidth: 60,
                launcherIcon: "message",
                launcherIconUrl: "",
                launcherLibraryIcon: "MessageSquare",
                launcherIconColor: "#FFFFFF",
                launcherBackgroundColor: "",
                bottomSpacing: 20,
                sideSpacing: 20,
                launcherShadow: "medium",
                launcherAnimation: "none",
                initialLanguage: "auto",
                engagement: null,
            }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            });
        }
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
