import { Client, Databases, ID } from 'appwrite';
import { ChatbotConfig } from '@/types/chatbot';

// Appwrite Konfiguration aus Umgebungsvariablen
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID');

const databases = new Databases(client);

// Konfiguration
const DATABASE_ID = '686e31d30004f08e891e';
const COLLECTION_ID = '686e31e2000587fb6636';

// Appwrite Client initialisieren (für dynamische Konfiguration)
export function initAppwrite(projectId?: string, endpoint?: string) {
    if (projectId) {
        client.setProject(projectId);
    }
    if (endpoint) {
        client.setEndpoint(endpoint);
    }
}

// Chatbot speichern
export async function saveChatbot(chatbot: ChatbotConfig) {
    try {
        const result = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                id: chatbot.id,
                name: chatbot.name,
                design: JSON.stringify(chatbot.design),
                created_at: new Date().toISOString(),
            }
        );

        return { success: true, data: result };
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        return { success: false, error };
    }
}

// Chatbot anhand ID laden
export async function getChatbot(id: string) {
    try {
        console.log('Appwrite: Suche Chatbot mit ID:', id);
        console.log('Appwrite: Database ID:', DATABASE_ID);
        console.log('Appwrite: Collection ID:', COLLECTION_ID);

        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                // Filter nach der ID
                `id=${id}`
            ]
        );

        console.log('Appwrite: Gefundene Dokumente:', result.documents.length);
        console.log('Appwrite: Alle Dokumente:', result.documents);

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            console.log('Appwrite: Gefundenes Dokument:', doc);
            return {
                id: doc.id,
                name: doc.name,
                design: JSON.parse(doc.design),
            } as ChatbotConfig;
        }

        console.log('Appwrite: Kein Chatbot gefunden');
        return null;
    } catch (error) {
        console.error('Appwrite: Fehler beim Laden:', error);
        return null;
    }
}

// Alle Chatbots laden
export async function getAllChatbots() {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID
        );

        return result.documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            design: JSON.parse(doc.design),
        })) as ChatbotConfig[];
    } catch (error) {
        console.error('Fehler beim Laden aller Chatbots:', error);
        return [];
    }
}

// Chatbot löschen
export async function deleteChatbot(documentId: string) {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID,
            documentId
        );

        return { success: true };
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        return { success: false, error };
    }
} 