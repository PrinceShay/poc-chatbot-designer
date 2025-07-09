import { NextRequest, NextResponse } from 'next/server';
import { getChatbot } from '@/lib/appwrite';
import chatbotDesigns from '@/data/chatbot-designs.json';
import { ChatbotDesigns } from '@/types/chatbot';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Erst versuchen, aus Appwrite zu laden
        let chatbot = await getChatbot(id);

        // Falls nicht in Appwrite, aus JSON-Datei laden (Fallback)
        if (!chatbot) {
            const designs = chatbotDesigns as ChatbotDesigns;
            chatbot = designs.chatbots[id];
        }

        if (!chatbot) {
            return NextResponse.json(
                { error: 'Chatbot nicht gefunden' },
                {
                    status: 404,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    }
                }
            );
        }

        return NextResponse.json(chatbot, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch {
        return NextResponse.json(
            { error: 'Interner Server-Fehler' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            }
        );
    }
}

// OPTIONS Handler für CORS Preflight Requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
} 