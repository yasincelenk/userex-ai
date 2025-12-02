import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { chatbotId, name, email, phone, source } = body;

        if (!chatbotId) {
            return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
        }

        if (!name && !email && !phone) {
            return NextResponse.json({ error: "At least one contact field is required" }, { status: 400 });
        }

        const docRef = await addDoc(collection(db, "leads"), {
            chatbotId,
            name: name || "Anonymous",
            email: email || "",
            phone: phone || "",
            source: source || "Pre-chat Form",
            createdAt: serverTimestamp()
        });

        return NextResponse.json({ success: true, id: docRef.id });

    } catch (error: any) {
        console.error("Error saving lead:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const chatbotId = searchParams.get("chatbotId");

        if (!chatbotId) {
            return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
        }

        const q = query(
            collection(db, "leads"),
            where("chatbotId", "==", chatbotId)
        );

        const querySnapshot = await getDocs(q);
        const leads = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() // Convert Timestamp to Date
        })).sort((a: any, b: any) => b.createdAt - a.createdAt); // Sort in memory

        return NextResponse.json({ leads });

    } catch (error: any) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
