import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { chatbotId, name, email, phone, source, customFields } = body;

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
            customFields: customFields || {},
            createdAt: serverTimestamp()
        });

        // Send email notification if enabled
        try {
            const chatbotRef = doc(db, "chatbots", chatbotId);
            const chatbotSnap = await getDoc(chatbotRef);

            if (chatbotSnap.exists()) {
                const settings = chatbotSnap.data();

                if (settings.enableLeadNotifications && settings.leadNotificationEmail) {
                    const transporter = nodemailer.createTransport({
                        host: process.env.SMTP_HOST,
                        port: parseInt(process.env.SMTP_PORT || '587'),
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS,
                        },
                    });

                    // Format custom fields for email
                    const customFieldsText = customFields && Object.keys(customFields).length > 0
                        ? Object.entries(customFields).map(([key, value]) => `${key}: ${value}`).join('\n')
                        : '';

                    const customFieldsHtml = customFields && Object.keys(customFields).length > 0
                        ? Object.entries(customFields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')
                        : '';

                    const mailOptions = {
                        from: process.env.SMTP_USER,
                        to: settings.leadNotificationEmail,
                        subject: `🎯 Yeni Lead: ${name || email || 'Anonim'}`,
                        text: `
Yeni bir lead chatbot'unuz aracılığıyla geldi!

Ad: ${name || 'Belirtilmedi'}
Email: ${email || 'Belirtilmedi'}
Telefon: ${phone || 'Belirtilmedi'}
Kaynak: ${source || 'Pre-chat Form'}
${customFieldsText ? '\nEk Bilgiler:\n' + customFieldsText : ''}

Leadlerinizi yönetmek için paneli ziyaret edin.
                        `.trim(),
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #6366f1;">🎯 Yeni Lead Bildirimi</h2>
                                <p>Chatbot'unuz aracılığıyla yeni bir lead geldi!</p>
                                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
                                    <p><strong>Ad:</strong> ${name || 'Belirtilmedi'}</p>
                                    <p><strong>Email:</strong> ${email || 'Belirtilmedi'}</p>
                                    <p><strong>Telefon:</strong> ${phone || 'Belirtilmedi'}</p>
                                    <p><strong>Kaynak:</strong> ${source || 'Pre-chat Form'}</p>
                                    ${customFieldsHtml}
                                </div>
                                <p style="color: #64748b; font-size: 14px;">
                                    Leadlerinizi yönetmek için <a href="https://userex.com.tr/console/chatbot/leads" style="color: #6366f1;">paneli ziyaret edin</a>.
                                </p>
                            </div>
                        `
                    };

                    await transporter.sendMail(mailOptions);
                }
            }
        } catch (emailError) {
            // Don't fail the request if email fails - just log it
            console.error("Failed to send lead notification email:", emailError);
        }

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
