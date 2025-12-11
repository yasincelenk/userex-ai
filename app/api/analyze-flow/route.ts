import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, events } = body;

        console.log('Received Flow Analysis Request:');
        console.log('URL:', url);
        console.log('Events:', events.length);

        // Save to a temporary file for the frontend to read
        const tempFilePath = path.join(process.cwd(), 'public', 'temp_flow_data.json');
        fs.writeFileSync(tempFilePath, JSON.stringify(body, null, 2));

        return NextResponse.json({
            success: true,
            message: 'Flow analysis started',
            flowId: 'latest'
        });

    } catch (error) {
        console.error('Error processing flow analysis:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process flow' },
            { status: 500 }
        );
    }
}

export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
