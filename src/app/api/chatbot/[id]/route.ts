import { NextRequest, NextResponse } from 'next/server';
import chatbotDesigns from '@/data/chatbot-designs.json';
import { ChatbotDesigns } from '@/types/chatbot';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const designs = chatbotDesigns as ChatbotDesigns;

        const chatbot = designs.chatbots[id];

        if (!chatbot) {
            return NextResponse.json(
                { error: 'Chatbot nicht gefunden' },
                { status: 404 }
            );
        }

        return NextResponse.json(chatbot);
    } catch {
        return NextResponse.json(
            { error: 'Interner Server-Fehler' },
            { status: 500 }
        );
    }
} 