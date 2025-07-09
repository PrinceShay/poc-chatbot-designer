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
        console.log('Suche Chatbot mit ID:', id);

        // Erst versuchen, aus Appwrite zu laden
        let chatbot = await getChatbot(id);
        console.log('Appwrite Ergebnis:', chatbot);

        // Falls nicht in Appwrite, aus JSON-Datei laden (Fallback)
        if (!chatbot) {
            console.log('Nicht in Appwrite gefunden, versuche JSON...');
            const designs = chatbotDesigns as ChatbotDesigns;
            chatbot = designs.chatbots[id];
            console.log('JSON Ergebnis:', chatbot);
        }

        if (!chatbot) {
            console.log('Chatbot nirgendwo gefunden');
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

        // Hier könntest du eine Löschfunktion implementieren
        // Für jetzt geben wir nur eine Erfolgsmeldung zurück
        console.log('Chatbot löschen:', id);

        return NextResponse.json({ success: true }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch {
        return NextResponse.json(
            { error: 'Fehler beim Löschen' },
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