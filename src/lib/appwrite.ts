import { Client, Databases, ID, Query } from 'appwrite';
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
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                // Filter nach der ID - korrekte Appwrite-Syntax
                Query.equal("id", id)
            ]
        );

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            return {
                id: doc.id,
                name: doc.name,
                design: JSON.parse(doc.design),
                documentId: doc.$id, // Speichere die interne Appwrite-ID
            } as ChatbotConfig & { documentId?: string };
        }

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
            documentId: doc.$id, // Speichere die interne Appwrite-ID
        })) as (ChatbotConfig & { documentId?: string })[];
    } catch (error) {
        console.error('Fehler beim Laden aller Chatbots:', error);
        return [];
    }
}

// Chatbot aktualisieren
export async function updateChatbot(chatbotId: string, chatbotData: any) {
    try {
        // Erst den Chatbot finden, um die documentId zu bekommen
        const existingChatbot = await getChatbot(chatbotId);

        if (!existingChatbot || !existingChatbot.documentId) {
            return { success: false, error: 'Chatbot nicht gefunden' };
        }

        // Chatbot in Appwrite aktualisieren
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            existingChatbot.documentId,
            {
                id: chatbotData.id,
                name: chatbotData.name,
                design: JSON.stringify(chatbotData.design),
                template: chatbotData.template || '',
                updated_at: new Date().toISOString(),
            }
        );

        return { success: true };
    } catch (error) {
        console.error('Appwrite: Fehler beim Aktualisieren:', error);
        return { success: false, error };
    }
}

// Chatbot anhand benutzerdefinierter ID löschen
export async function deleteChatbotById(chatbotId: string) {
    try {
        // Erst den Chatbot finden, um die documentId zu bekommen
        const chatbot = await getChatbot(chatbotId);

        if (!chatbot || !chatbot.documentId) {
            return { success: false, error: 'Chatbot nicht gefunden oder kann nicht gelöscht werden' };
        }

        // Jetzt das Dokument mit der internen ID löschen
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID,
            chatbot.documentId
        );

        return { success: true };
    } catch (error) {
        console.error('Appwrite: Fehler beim Löschen:', error);
        return { success: false, error };
    }
}

// Chatbot löschen (mit documentId - für direkte Löschung)
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