"use client";

import { useState, useEffect, Suspense } from "react";
import ChatbotDesigner from "@/components/ChatbotDesigner";
import { ChatbotConfig } from "@/types/chatbot";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function ChatbotDesignerContent() {
  const t = useTranslations("HomePage");
  const [editChatbot, setEditChatbot] = useState<
    (ChatbotConfig & { documentId?: string }) | null
  >(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    if (editId) {
      loadChatbotForEdit(editId);
    }
  }, [editId]);

  const loadChatbotForEdit = async (chatbotId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chatbot/${chatbotId}`);
      if (response.ok) {
        const chatbot = await response.json();
        setEditChatbot(chatbot);
      } else {
        console.error("Chatbot nicht gefunden");
        setEditChatbot(null);
      }
    } catch (error) {
      console.error("Fehler beim Laden des Chatbots:", error);
      setEditChatbot(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Nach dem Speichern zur Saved-Seite weiterleiten
    window.location.href = "/saved";
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Lade Chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {editChatbot
            ? t("editTitle", { name: editChatbot.name })
            : "Chatbot Designer"}
        </h1>
        <p className="text-gray-600">
          Erstelle deinen eigenen Chatbot mit individuellem Design
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <ChatbotDesigner
          onSave={handleSave}
          editChatbot={editChatbot || undefined}
        />
      </div>
    </div>
  );
}

export default function ChatbotDesignerPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Lade...</p>
          </div>
        </div>
      }
    >
      <ChatbotDesignerContent />
    </Suspense>
  );
}
