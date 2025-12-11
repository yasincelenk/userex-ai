import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';

// Allow longer timeout for full generation & scraping
export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
        }

        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
            console.error("[Scraper] Missing FIRECRAWL_API_KEY");
            return NextResponse.json({ success: false, error: "Missing Firecrawl API Key. Please add it to your .env file." }, { status: 500 });
        }

        console.log(`[Scraper] Starting Firecrawl for: ${url} `);

        // 1. Initialize Firecrawl
        const app = new FirecrawlApp({ apiKey: apiKey });

        // 2. Scrape URL
        try {
            const scrapeResponse = await app.scrapeUrl(url, {
                formats: ['markdown'],
            });

            if (!scrapeResponse.success) {
                console.error(`[Scraper] Firecrawl Failed: `, scrapeResponse.error);
                throw new Error(`Firecrawl failed: ${scrapeResponse.error} `);
            }

            const markdownContent = scrapeResponse.markdown || "";
            console.log(`[Scraper] Firecrawl fetched ${markdownContent.length} chars`);

            // Limit content for token budget (GPT-4o has 128k context, so we can be generous)
            // 150,000 chars is roughly 30-40k tokens, well within limits.
            const cleanContent = markdownContent.slice(0, 150000);

            // 3. AI Extraction
            const prompt = `
            You are a Product Data Extractor.
            Analyze the submitted markdown content from an e - commerce webpage(${url}).
            Identify individual products listed on the page.

    Extract:
- Name(Title)
    - Price(Numeric only)
    - Currency(e.g.USD, TRY)
    - Description(Short summary)
    - Image URL(Main product image - prefer absolute URLs)
            
            Ensure you extract ALL valid products found in the text.
            
            Marketdown Content:
            ${cleanContent}
`;

            const result = await generateObject({
                model: openai('gpt-4o'),
                schema: z.object({
                    products: z.array(z.object({
                        name: z.string(),
                        price: z.number(),
                        currency: z.string(),
                        description: z.string().optional(),
                        imageUrl: z.string().nullable(),
                    })).describe("List of products found on the page"),
                }),
                prompt: prompt,
            });

            return NextResponse.json({ success: true, products: result.object.products });

        } catch (scrapeError: any) {
            console.error("[Scraper] Scrape Error:", scrapeError);
            return NextResponse.json({ success: false, error: `Scraping failed: ${scrapeError.message} ` }, { status: 500 });
        }

    } catch (error: any) {
        console.error("[Scraper] Unexpected error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
