import { NextRequest, NextResponse } from 'next/server';
import { saveChatbot, getAllChatbots } from '@/lib/appwrite';
import { ChatbotConfig } from '@/types/chatbot';

export async function POST(request: NextRequest) {
    try {
        const chatbot: ChatbotConfig = await request.json();

        const result = await saveChatbot(chatbot);

        if (result.success) {
            return NextResponse.json(chatbot, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            });
        } else {
            return NextResponse.json(
                { error: 'Fehler beim Speichern' },
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
    } catch {
        return NextResponse.json(
            { error: 'Ungültige Anfrage' },
            {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            }
        );
    }
}

// GET Handler für alle Chatbots
export async function GET() {
    try {
        const chatbots = await getAllChatbots();

        return NextResponse.json({ chatbots }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error) {
        console.error('Fehler beim Laden aller Chatbots:', error);
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