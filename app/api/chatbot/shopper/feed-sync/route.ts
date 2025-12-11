
import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { db } from '@/lib/firebase'; // Ensure you have firebase admin or client configured for server
// Note: Client SDK in route handlers is OK but Admin SDK is better for bulk ops. 
// Assuming we use the existing 'db' export which is likely Client SDK based on previous context.
import { collection, addDoc, query, where, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';

// Allow long timeout for feed processing
export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { feedUrl, chatbotId } = body;

        if (!feedUrl) {
            return NextResponse.json({ success: false, error: "Feed URL is required" }, { status: 400 });
        }

        console.log(`[FeedSync] Starting sync for: ${feedUrl}`);

        // 1. Fetch XML Feed
        let xmlData = '';
        try {
            const response = await fetch(feedUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                    'Accept': 'application/xml, text/xml, */*;q=0.1'
                }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            xmlData = await response.text();
        } catch (fetchError: any) {
            return NextResponse.json({ success: false, error: `Failed to fetch feed: ${fetchError.message}` }, { status: 500 });
        }

        // 2. Parse XML
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });
        const jsonObj = parser.parse(xmlData);

        // 3. Normalize Data (Handle differnet feed structures like Google Merchant, Facebook, etc.)
        let products = [];
        // Common paths: rss.channel.item, root.items.item, products.product
        if (jsonObj.rss?.channel?.item) {
            products = Array.isArray(jsonObj.rss.channel.item) ? jsonObj.rss.channel.item : [jsonObj.rss.channel.item];
        } else if (jsonObj.feed?.entry) {
            products = Array.isArray(jsonObj.feed.entry) ? jsonObj.feed.entry : [jsonObj.feed.entry];
        } else if (jsonObj.products?.product) {
            products = Array.isArray(jsonObj.products.product) ? jsonObj.products.product : [jsonObj.products.product];
        } else {
            // Fallback: try to find the first array in the object
            const findArray = (obj: any): any[] => {
                for (const key in obj) {
                    if (Array.isArray(obj[key]) && obj[key].length > 0) return obj[key];
                    if (typeof obj[key] === 'object') {
                        const res = findArray(obj[key]);
                        if (res.length > 0) return res;
                    }
                }
                return [];
            }
            products = findArray(jsonObj);
        }

        if (!products.length) {
            return NextResponse.json({ success: false, error: "No products found in XML structure" }, { status: 400 });
        }

        console.log(`[FeedSync] Found ${products.length} items`);

        // 4. Batch Processing (Upsert)
        // Note: Firestore batch limit is 500. We need to chunk.
        const batchSize = 450;
        const chunks = [];

        let processedCount = 0;
        let batch = writeBatch(db);
        let currentBatchCount = 0;

        // Fetch existing products to avoid duplicates or to update them
        // For simplicity and speed in this v1, we might just look up by a unique ID (like SKU or g:id)
        // Optimally: user.uid + product.id as composite key. 
        // We need auth context or chatbotId.

        // This is a simplified "Add Only" or "Overwrite" logic for now.
        // A full "Sync" requires reading existing DB or using logic to key by 'sku'.

        for (const item of products) {
            // Field Mapping (Google Merchant / General)
            const pName = item['g:title'] || item.title || item.name || "Unknown Product";
            const pPriceFull = item['g:price'] || item.price || "0";
            // cleanup price: "123.45 USD" -> 123.45
            const pPrice = parseFloat(String(pPriceFull).replace(/[^0-9.]/g, '')) || 0;
            const pCurrency = String(pPriceFull).replace(/[0-9.,\s]/g, '') || "TRY"; // Default or extract

            const pImage = item['g:image_link'] || item.image_link || item.listing_images?.image?.[0] || item.image || "";
            const pDesc = item['g:description'] || item.description || "";
            const pSku = item['g:id'] || item.id || item.sku || `gen-${Math.random().toString(36).substr(2, 9)}`;

            if (!pName) continue;

            // We will create a new doc reference
            const newDocRef = doc(collection(db, "products")); // Auto-ID

            // TODO: In a real sync, we should query: where("sku", "==", pSku).
            // For this implementation, we simply ADD them as new imports for the user to review.
            // Or better: store "feedId" and "sku".

            const productData = {
                name: pName,
                price: pPrice,
                currency: pCurrency,
                description: pDesc.slice(0, 500), // Limit desc
                imageUrl: pImage,
                sku: String(pSku),
                stock: 10,
                inStock: true,
                source: 'xml-feed',
                feedUrl: feedUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            batch.set(newDocRef, productData);
            currentBatchCount++;
            processedCount++;

            if (currentBatchCount >= batchSize) {
                await batch.commit();
                batch = writeBatch(db);
                currentBatchCount = 0;
            }
        }

        if (currentBatchCount > 0) {
            await batch.commit();
        }

        return NextResponse.json({ success: true, count: processedCount });

    } catch (error: any) {
        console.error("[FeedSync] Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
