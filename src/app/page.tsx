'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ChatbotDesigner from '@/components/ChatbotDesigner';
import SavedChatbots from '@/components/SavedChatbots';
import AppwriteConfig from '@/components/AppwriteConfig';
import { ChatbotConfig } from '@/types/chatbot';

export default function Home() {
  const [savedChatbots, setSavedChatbots] = useState<ChatbotConfig[]>([]);
  const [activeTab, setActiveTab] = useState<'designer' | 'saved'>('designer');

  const handleSaveChatbot = (config: ChatbotConfig) => {
    setSavedChatbots(prev => [...prev, config]);
    setActiveTab('saved');
  };

  const handleDeleteChatbot = (id: string) => {
    setSavedChatbots(prev => prev.filter(chatbot => chatbot.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Chatbot Designer</h1>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'designer' ? 'default' : 'outline'}
                onClick={() => setActiveTab('designer')}
              >
                Designer
              </Button>
              <Button
                variant={activeTab === 'saved' ? 'default' : 'outline'}
                onClick={() => setActiveTab('saved')}
              >
                Gespeicherte Chatbots ({savedChatbots.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('/demo', '_blank')}
              >
                Demo
              </Button>
              <AppwriteConfig />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === 'designer' ? (
          <ChatbotDesigner onSave={handleSaveChatbot} />
        ) : (
          <SavedChatbots 
            chatbots={savedChatbots} 
            onDelete={handleDeleteChatbot} 
          />
        )}
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
