'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ChatbotDesigner from '@/components/ChatbotDesigner';
import { ChatbotConfig } from '@/types/chatbot';
import Link from 'next/link';

export default function Home() {
  const [savedChatbots, setSavedChatbots] = useState<ChatbotConfig[]>([]);

  const handleSaveChatbot = (config: ChatbotConfig) => {
    setSavedChatbots(prev => [...prev, config]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Chatbot Designer</h1>
            <div className="flex gap-2">
              <Link href="/saved">
                <Button variant="outline">
                  Gespeicherte Chatbots
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.open('/demo', '_blank')}
              >
                Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <ChatbotDesigner onSave={handleSaveChatbot} />
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
