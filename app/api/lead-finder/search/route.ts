import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { keyword, location } = await req.json()

        if (!keyword || !location) {
            return NextResponse.json(
                { error: "Keyword and location are required" },
                { status: 400 }
            )
        }

        const query = `${keyword} in ${location}`
        const apiKey = process.env.SERPER_API_KEY

        // If no API key is configured, return mock data for demonstration
        if (!apiKey) {
            console.log("No SERPER_API_KEY found. Returning mock data.")

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            const mockLeads = [
                {
                    title: `${keyword} Expert Solutions`,
                    address: `123 Main St, ${location}`,
                    phoneNumber: "+1 234 567 8900",
                    website: "https://example.com",
                    rating: 4.8,
                    reviews: 124,
                    category: keyword
                },
                {
                    title: `Premium ${keyword} Services`,
                    address: `456 High St, ${location}`,
                    phoneNumber: "+1 987 654 3210",
                    website: "https://example.org",
                    rating: 4.5,
                    reviews: 89,
                    category: keyword
                },
                {
                    title: `Global ${keyword} Group`,
                    address: `789 Park Ave, ${location}`,
                    phoneNumber: "+1 555 123 4567",
                    website: "https://example.net",
                    rating: 4.2,
                    reviews: 56,
                    category: keyword
                },
                {
                    title: `${location} ${keyword} Center`,
                    address: `101 City Rd, ${location}`,
                    phoneNumber: "+1 444 555 6666",
                    website: "https://example.io",
                    rating: 4.9,
                    reviews: 210,
                    category: keyword
                },
                {
                    title: `Elite ${keyword} Partners`,
                    address: `202 Business Park, ${location}`,
                    phoneNumber: "+1 777 888 9999",
                    website: "https://example.co",
                    rating: 3.9,
                    reviews: 34,
                    category: keyword
                }
            ]

            return NextResponse.json({ leads: mockLeads })
        }

        // Real API Call to Serper.dev
        const response = await fetch("https://google.serper.dev/places", {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: query,
                gl: "tr", // Optional: set region to Turkey or make dynamic
                hl: "tr"  // Optional: set language to Turkish or make dynamic
            })
        })

        if (!response.ok) {
            throw new Error(`Serper API error: ${response.statusText}`)
        }

        const data = await response.json()

        // Transform Serper data to our Lead format
        const leads = data.places?.map((place: any) => ({
            title: place.title,
            address: place.address,
            phoneNumber: place.phoneNumber,
            website: place.website,
            rating: place.rating,
            reviews: place.userRatingCount,
            category: place.category
        })) || []

        return NextResponse.json({ leads })

    } catch (error) {
        console.error("Lead Finder API Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch leads" },
            { status: 500 }
        )
    }
}
