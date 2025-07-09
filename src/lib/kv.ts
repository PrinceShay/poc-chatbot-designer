import { kv } from '@vercel/kv';
import { ChatbotConfig } from '@/types/chatbot';

export async function saveChatbot(chatbot: ChatbotConfig) {
    try {
        await kv.set(`chatbot:${chatbot.id}`, chatbot);
        return { success: true };
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        return { success: false, error };
    }
}

export async function getChatbot(id: string) {
    try {
        const chatbot = await kv.get(`chatbot:${id}`);
        return chatbot;
    } catch (error) {
        console.error('Fehler beim Laden:', error);
        return null;
    }
}

export async function getAllChatbots() {
    try {
        const keys = await kv.keys('chatbot:*');
        const chatbots = await Promise.all(
            keys.map(async (key) => {
                const chatbot = await kv.get(key);
                return chatbot;
            })
        );
        return chatbots.filter(Boolean);
    } catch (error) {
        console.error('Fehler beim Laden aller Chatbots:', error);
        return [];
    }
}

export async function deleteChatbot(id: string) {
    try {
        await kv.del(`chatbot:${id}`);
        return { success: true };
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        return { success: false, error };
    }
} 