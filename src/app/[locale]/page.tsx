'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import ChatbotDesigner from '@/components/ChatbotDesigner';
import { ChatbotConfig } from '@/types/chatbot';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LanguageSelector from '@/components/LanguageSelector';

function HomeContent() {
  const t = useTranslations('HomePage');
  const [editChatbot, setEditChatbot] = useState<ChatbotConfig & { documentId?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

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
        console.error('Chatbot nicht gefunden');
        setEditChatbot(null);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Chatbots:', error);
      setEditChatbot(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Nach dem Speichern zur Saved-Seite weiterleiten
    window.location.href = '/saved';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Lade Chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {editChatbot ? t('editTitle', { name: editChatbot.name }) : t('title')}
            </h1>
            <div className="flex gap-2 items-center">
              <Link href="/saved">
                <Button variant="outline">
                  {t('savedBots')}
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">
                  {t('about')}
                </Button>
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <ChatbotDesigner onSave={handleSave} editChatbot={editChatbot || undefined} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-gray-600">
          <p>Chatbot Designer MVP - Erstelle und verwalte deine Chatbot-Designs</p>
          <p className="text-sm mt-2">
            Das generierte Script lädt automatisch das Design über die Chatbot-ID
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Lade...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
