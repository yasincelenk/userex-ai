
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { testRunService } from '@/lib/services/test-run-service';

// Helper to update run with analysis
async function saveAnalysis(runId: string, analysis: any) {
    if (runId) {
        await testRunService.updateRun(runId, { aiCritique: analysis });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { runId, screenshot, domContext, status } = body;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ success: false, error: 'Gemini API Key missing' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use Flash for speed/cost, or Pro for deeper reasoning. Flash is good for quick UI checks.
        // Let's stick to Pro Vision if available or Flash. "gemini-1.5-flash" is great for this.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert UI/UX Auditor.
        I am providing a screenshot of a web page state after an automated test execution.
        Test Status: ${status}
        
        Task: Analyze the UI for usability, visual design, and potential errors.
        
        Return a JSON object with:
        1. "score": 0-100 rating of the visible UI quality.
        2. "summary": One sentence summary of the visual state.
        3. "suggestions": 3 actionable bullet points to improve the design or fix the error (if failed).
        
        RETURN JSON ONLY.
        `;

        // Prepare image part
        // Assuming screenshot is base64 data URL: "data:image/jpeg;base64,..."
        const base64Data = screenshot.split(',')[1];

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();

        // Clean and Parse
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        // Async save to DB (don't block response too long if possible, but Next.js serverless might kill it)
        // Better to await it.
        if (runId) {
            await saveAnalysis(runId, analysis);
        }

        return NextResponse.json({ success: true, analysis });

    } catch (error) {
        console.error('Error analyzing result:', error);
        return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 });
    }
}
