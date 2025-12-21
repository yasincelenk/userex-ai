import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore"

// POST: Create a new appointment
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {
            chatbotId,
            customerName,
            customerEmail,
            customerPhone,
            date,
            time,
            type,
            notes,
            sessionId
        } = body

        if (!chatbotId || !customerEmail || !date || !time) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const appointmentData = {
            chatbotId,
            customerName,
            customerEmail,
            customerPhone: customerPhone || "",
            date, // Format: YYYY-MM-DD
            time, // Format: HH:mm
            type: type || "Consultation",
            notes: notes || "",
            sessionId: sessionId || "",
            status: "pending",
            createdAt: Timestamp.now()
        }

        const docRef = await addDoc(collection(db, "appointments"), appointmentData)

        return NextResponse.json({
            success: true,
            appointmentId: docRef.id
        }, { status: 201 })

    } catch (error: any) {
        console.error("Error creating appointment:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// GET: List appointments for a chatbot/tenant
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const chatbotId = searchParams.get("chatbotId")

        if (!chatbotId) {
            return NextResponse.json({ error: "chatbotId is required" }, { status: 400 })
        }

        const q = query(
            collection(db, "appointments"),
            where("chatbotId", "==", chatbotId),
            orderBy("createdAt", "desc")
        )

        const querySnapshot = await getDocs(q)
        const appointments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString()
        }))

        return NextResponse.json({ appointments }, { status: 200 })

    } catch (error: any) {
        console.error("Error fetching appointments:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
