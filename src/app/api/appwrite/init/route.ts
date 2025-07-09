import { NextRequest, NextResponse } from 'next/server';
import { initAppwrite } from '@/lib/appwrite';

export async function POST(request: NextRequest) {
    try {
        const { projectId, endpoint } = await request.json();

        // Verwende Umgebungsvariablen als Fallback
        const finalProjectId = projectId || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const finalEndpoint = endpoint || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

        if (!finalProjectId) {
            return NextResponse.json(
                { error: 'Project ID ist erforderlich' },
                { status: 400 }
            );
        }

        initAppwrite(finalProjectId, finalEndpoint);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Fehler bei der Initialisierung' },
            { status: 500 }
        );
    }
} 