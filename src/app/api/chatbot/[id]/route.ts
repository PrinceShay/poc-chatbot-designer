import { NextRequest, NextResponse } from 'next/server';
import { getChatbot, deleteChatbotById } from '@/lib/appwrite';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('Suche Chatbot mit ID:', id);

        // Lade aus Appwrite
        const chatbot = await getChatbot(id);
        console.log('Appwrite Ergebnis:', chatbot);

        if (!chatbot) {
            console.log('Chatbot nicht gefunden');
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

        console.log('Chatbot gefunden:', chatbot);
        return NextResponse.json(chatbot, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error) {
        console.error('Fehler beim Laden des Chatbots:', error);
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

// DELETE Handler für das Löschen von Chatbots
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('API: Lösche Chatbot mit ID:', id);

        // Chatbot aus Appwrite löschen
        const result = await deleteChatbotById(id);

        if (!result.success) {
            console.log('API: Fehler beim Löschen:', result.error);
            return NextResponse.json(
                { error: result.error || 'Fehler beim Löschen' },
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

        console.log('API: Chatbot erfolgreich gelöscht');
        return NextResponse.json({ success: true, message: 'Chatbot erfolgreich gelöscht' }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error) {
        console.error('API: Fehler beim Löschen:', error);
        return NextResponse.json(
            { error: 'Interner Server-Fehler beim Löschen' },
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