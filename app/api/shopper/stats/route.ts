import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const chatbotId = searchParams.get("chatbotId");

        if (!chatbotId) {
            return NextResponse.json({ error: "Missing chatbotId" }, { status: 400 });
        }

        // Fetch all products for this chatbot
        const q = query(
            collection(db, "products"),
            where("chatbotId", "==", chatbotId)
        );

        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        // Calculate stats
        const totalProducts = products.length;
        const inStock = products.filter(p => p.inStock).length;
        const outOfStock = totalProducts - inStock;

        // Calculate approximate inventory value (sum of prices)
        // Note: This assumes price is a number. If it's a string, we might need parsing.
        // Assuming simple currency handling (ignoring currency mismatch for now or assuming single currency)
        const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

        // Get recent products (client-side sort since we fetched all, or we could do a separate query)
        // Since we already fetched all for stats, sorting here is fine for small catalogs.
        // For large catalogs, we should do a separate limited query.
        // Let's do a separate query for recent products to be safe and scalable-ish.

        const recentQuery = query(
            collection(db, "products"),
            where("chatbotId", "==", chatbotId),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        const recentSnapshot = await getDocs(recentQuery);
        const recentProducts = recentSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            currency: doc.data().currency,
            inStock: doc.data().inStock,
            createdAt: doc.data().createdAt
        }));

        return NextResponse.json({
            stats: {
                totalProducts,
                inStock,
                outOfStock,
                totalValue
            },
            recentProducts
        });

    } catch (error) {
        console.error("Error fetching shopper stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
