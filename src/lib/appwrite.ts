import { Client, Databases, ID, Query } from "appwrite";
import { ChatbotConfig } from "@/types/chatbot";

// Appwrite Konfiguration aus Umgebungsvariablen
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID");

const databases = new Databases(client);

// Konfiguration
const DATABASE_ID = "686e31d30004f08e891e";
const COLLECTION_ID = "686e31e2000587fb6636";

// Neue Collections für das erweiterte System
const SYSTEM_SETTINGS_COLLECTION = "system_settings";
const CONTENT_ITEMS_COLLECTION = "content_items";
const LIVE_CHAT_SESSIONS_COLLECTION = "live_chat_sessions";

// Appwrite Client initialisieren (für dynamische Konfiguration)
export function initAppwrite(projectId?: string, endpoint?: string) {
  if (projectId) {
    client.setProject(projectId);
  }
  if (endpoint) {
    client.setEndpoint(endpoint);
  }
}

// ===== BESTEHENDE CHATBOT FUNKTIONEN =====

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
    console.error("Fehler beim Speichern:", error);
    return { success: false, error };
  }
}

// Chatbot anhand ID laden
export async function getChatbot(id: string) {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      // Filter nach der ID - korrekte Appwrite-Syntax
      Query.equal("id", id),
    ]);

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
    console.error("Appwrite: Fehler beim Laden:", error);
    return null;
  }
}

// Alle Chatbots laden
export async function getAllChatbots() {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);

    return result.documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      design: JSON.parse(doc.design),
      documentId: doc.$id, // Speichere die interne Appwrite-ID
    })) as (ChatbotConfig & { documentId?: string })[];
  } catch (error) {
    console.error("Fehler beim Laden aller Chatbots:", error);
    return [];
  }
}

// Chatbot aktualisieren
export async function updateChatbot(
  chatbotId: string,
  chatbotData: ChatbotConfig
) {
  try {
    // Erst den Chatbot finden, um die documentId zu bekommen
    const existingChatbot = await getChatbot(chatbotId);

    if (!existingChatbot || !existingChatbot.documentId) {
      return { success: false, error: "Chatbot nicht gefunden" };
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
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Appwrite: Fehler beim Aktualisieren:", error);
    return { success: false, error };
  }
}

// Chatbot anhand benutzerdefinierter ID löschen
export async function deleteChatbotById(chatbotId: string) {
  try {
    // Erst den Chatbot finden, um die documentId zu bekommen
    const chatbot = await getChatbot(chatbotId);

    if (!chatbot || !chatbot.documentId) {
      return {
        success: false,
        error: "Chatbot nicht gefunden oder kann nicht gelöscht werden",
      };
    }

    // Jetzt das Dokument mit der internen ID löschen
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      chatbot.documentId
    );

    return { success: true };
  } catch (error) {
    console.error("Appwrite: Fehler beim Löschen:", error);
    return { success: false, error };
  }
}

// Chatbot löschen (mit documentId - für direkte Löschung)
export async function deleteChatbot(documentId: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    return { success: false, error };
  }
}

// ===== NEUE SYSTEM FUNKTIONEN =====

// System-Einstellungen speichern
export async function saveSystemSettings(settings: {
  systemPrompt?: string;
  selectedPersona?: string;
  customPersonas?: any[];
  enableLiveChat: boolean;
  autoEscalate: boolean;
  escalationThreshold: number;
  maxResponseTime: number;
  openaiApiKey?: string;
}) {
  try {
    const client = new Client()
      .setEndpoint(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
          "https://cloud.appwrite.io/v1"
      )
      .setProject(
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID"
      );

    const databases = new Databases(client);

    // Prüfe ob bereits Einstellungen existieren
    let existingSettings;
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        "system_settings"
      );
      existingSettings = response.documents[0];
    } catch (error) {
      // Keine existierenden Einstellungen gefunden
    }

    const settingsData = {
      systemPrompt: settings.systemPrompt || "",
      selectedPersona: settings.selectedPersona || "sales",
      customPersonas: settings.customPersonas || [],
      enableLiveChat: settings.enableLiveChat,
      autoEscalate: settings.autoEscalate,
      escalationThreshold: settings.escalationThreshold,
      maxResponseTime: settings.maxResponseTime,
      openaiApiKey: settings.openaiApiKey || "",
      updatedAt: new Date().toISOString(),
    };

    if (existingSettings) {
      // Update existierende Einstellungen
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        "system_settings",
        existingSettings.$id,
        settingsData
      );
    } else {
      // Erstelle neue Einstellungen
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        "system_settings",
        ID.unique(),
        {
          ...settingsData,
          createdAt: new Date().toISOString(),
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Speichern der System-Einstellungen:", error);
    return { success: false, error };
  }
}

// System-Einstellungen laden
export async function getSystemSettings() {
  try {
    const client = new Client()
      .setEndpoint(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
          "https://cloud.appwrite.io/v1"
      )
      .setProject(
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID"
      );

    const databases = new Databases(client);

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      "system_settings"
    );

    if (response.documents.length > 0) {
      const settings = response.documents[0];
      return {
        id: settings.$id,
        systemPrompt: settings.systemPrompt || "",
        selectedPersona: settings.selectedPersona || "sales",
        customPersonas: settings.customPersonas || [],
        enableLiveChat: settings.enableLiveChat || false,
        autoEscalate: settings.autoEscalate || true,
        escalationThreshold: settings.escalationThreshold || 3,
        maxResponseTime: settings.maxResponseTime || 30,
        openaiApiKey: settings.openaiApiKey || "",
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      };
    }

    return null;
  } catch (error) {
    console.error("Fehler beim Laden der System-Einstellungen:", error);
    return null;
  }
}

// Content Builder Items speichern
export async function saveContentItems(
  items: Array<{
    id: string;
    type: string;
    data: Record<string, any>;
    position: { x: number; y: number };
    connections: string[];
  }>
) {
  try {
    // Alle bestehenden Items löschen
    const existingItems = await databases.listDocuments(
      DATABASE_ID,
      CONTENT_ITEMS_COLLECTION
    );

    for (const item of existingItems.documents) {
      await databases.deleteDocument(
        DATABASE_ID,
        CONTENT_ITEMS_COLLECTION,
        item.$id
      );
    }

    // Neue Items speichern
    const results = [];
    for (const item of items) {
      const result = await databases.createDocument(
        DATABASE_ID,
        CONTENT_ITEMS_COLLECTION,
        ID.unique(),
        {
          ...item,
          position: JSON.stringify(item.position),
          data: JSON.stringify(item.data),
          created_at: new Date().toISOString(),
        }
      );
      results.push(result);
    }

    return { success: true, data: results };
  } catch (error) {
    console.error("Fehler beim Speichern der Content Items:", error);
    return { success: false, error };
  }
}

// Content Builder Items laden
export async function getContentItems() {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      CONTENT_ITEMS_COLLECTION
    );

    return result.documents.map((doc) => ({
      id: doc.id,
      type: doc.type,
      data: JSON.parse(doc.data || "{}"),
      position: JSON.parse(doc.position || '{"x": 100, "y": 100}'),
      connections: doc.connections || [],
      createdAt: doc.created_at,
    }));
  } catch (error) {
    console.error("Fehler beim Laden der Content Items:", error);
    return [];
  }
}

// Live Chat Session erstellen
export async function createLiveChatSession(session: {
  userId: string;
  userName: string;
  initialMessage: string;
}) {
  try {
    const result = await databases.createDocument(
      DATABASE_ID,
      LIVE_CHAT_SESSIONS_COLLECTION,
      ID.unique(),
      {
        userId: session.userId,
        userName: session.userName,
        status: "waiting",
        messages: JSON.stringify([
          {
            id: Date.now().toString(),
            role: "user",
            content: session.initialMessage,
            timestamp: new Date().toISOString(),
          },
        ]),
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      }
    );

    return { success: true, data: result };
  } catch (error) {
    console.error("Fehler beim Erstellen der Live Chat Session:", error);
    return { success: false, error };
  }
}

// Live Chat Session aktualisieren
export async function updateLiveChatSession(
  sessionId: string,
  updates: {
    status?: "waiting" | "active" | "resolved";
    messages?: Array<{
      id: string;
      role: "user" | "agent" | "system";
      content: string;
      timestamp: Date;
    }>;
  }
) {
  try {
    const updateData: any = {
      last_activity: new Date().toISOString(),
    };

    if (updates.status) {
      updateData.status = updates.status;
    }

    if (updates.messages) {
      updateData.messages = JSON.stringify(updates.messages);
    }

    await databases.updateDocument(
      DATABASE_ID,
      LIVE_CHAT_SESSIONS_COLLECTION,
      sessionId,
      updateData
    );

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Live Chat Session:", error);
    return { success: false, error };
  }
}

// Alle Live Chat Sessions laden
export async function getLiveChatSessions(
  status?: "waiting" | "active" | "resolved"
) {
  try {
    const queries = [];
    if (status) {
      queries.push(Query.equal("status", status));
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      LIVE_CHAT_SESSIONS_COLLECTION,
      queries
    );

    return result.documents.map((doc) => ({
      id: doc.$id,
      userId: doc.userId,
      userName: doc.userName,
      status: doc.status,
      messages: JSON.parse(doc.messages),
      createdAt: doc.created_at,
      lastActivity: doc.last_activity,
    }));
  } catch (error) {
    console.error("Fehler beim Laden der Live Chat Sessions:", error);
    return [];
  }
}

// Live Chat Session löschen
export async function deleteLiveChatSession(sessionId: string) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      LIVE_CHAT_SESSIONS_COLLECTION,
      sessionId
    );

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Löschen der Live Chat Session:", error);
    return { success: false, error };
  }
}
