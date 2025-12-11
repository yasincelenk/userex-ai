
import { NextResponse } from 'next/server';
import { testRunService } from '@/lib/services/test-run-service';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic Validation
        if (!body.url || !body.status || !body.steps) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const runId = await testRunService.createRun(body);
        return NextResponse.json({ success: true, id: runId });

    } catch (error) {
        console.error('Error saving run:', error);
        return NextResponse.json({ success: false, error: 'Failed to save run' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const runs = await testRunService.getRecentRuns();
        return NextResponse.json({ success: true, runs });
    } catch (error) {
        console.error('Error fetching runs:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch runs' }, { status: 500 });
    }
}
