import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "Missing URL" }, { status: 400 });
        }

        console.log("Sitemap API: Fetching", url);

        const response = await fetch(url);
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch sitemap: " + response.statusText }, { status: response.status });
        }

        const xml = await response.text();
        const $ = cheerio.load(xml, { xmlMode: true });
        const urls: string[] = [];

        // Support standard sitemap <loc> tags
        $('loc').each((i, el) => {
            const loc = $(el).text().trim();
            if (loc) {
                urls.push(loc);
            }
        });

        // Dedup urls
        const uniqueUrls = Array.from(new Set(urls));

        console.log(`Sitemap API: Found ${uniqueUrls.length} URLs`);

        return NextResponse.json({ urls: uniqueUrls });

    } catch (error: any) {
        console.error("Sitemap error:", error);
        return NextResponse.json({ error: "Internal Error: " + error.message }, { status: 500 });
    }
}
