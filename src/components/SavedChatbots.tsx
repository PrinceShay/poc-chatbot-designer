'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ChatbotConfig } from '@/types/chatbot';

interface SavedChatbotsProps {
  chatbots: ChatbotConfig[];
  onDelete: (id: string) => void;
}

export default function SavedChatbots({ chatbots, onDelete }: SavedChatbotsProps) {
  const [allChatbots, setAllChatbots] = useState<ChatbotConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Lade alle Chatbots aus Appwrite beim Mount
  useEffect(() => {
    const loadChatbots = async () => {
      try {
        const response = await fetch('/api/chatbot');
        if (response.ok) {
          const data = await response.json();
          setAllChatbots(data.chatbots || []);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Chatbots:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatbots();
  }, []);

  // Kombiniere lokale und gespeicherte Chatbots
  const combinedChatbots = [...chatbots, ...allChatbots];

  const generateScript = (chatbotId: string) => {
    // Verwende die aktuelle Domain für das Script
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `<script src="${baseUrl}/chatbot.js" data-chatbot-id="${chatbotId}"></script>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Gespeicherte Chatbots</h2>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Lade Chatbots...</p>
        </div>
      ) : combinedChatbots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Noch keine Chatbots gespeichert.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedChatbots.map((chatbot) => (
            <div
              key={chatbot.id}
              className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{chatbot.name}</h3>
                <span className="text-xs text-gray-500">ID: {chatbot.id}</span>
              </div>
              
              {/* Mini Preview */}
              <div className="mb-4 p-3 border rounded bg-gray-50">
                <div
                  className="w-full h-20 rounded border"
                  style={{
                    backgroundColor: chatbot.design.colors.background,
                    borderColor: chatbot.design.colors.border,
                    borderRadius: chatbot.design.borderRadius
                  }}
                >
                  <div
                    className="h-6 rounded-t flex items-center px-2 text-xs font-bold"
                    style={{
                      backgroundColor: chatbot.design.colors.primary,
                      color: 'white'
                    }}
                  >
                    {chatbot.name}
                  </div>
                  <div className="p-2">
                    <div
                      className="w-3/4 h-2 rounded mb-1"
                      style={{ backgroundColor: chatbot.design.colors.border }}
                    />
                    <div
                      className="w-1/2 h-2 rounded ml-auto"
                      style={{ backgroundColor: chatbot.design.colors.primary }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>Position: {chatbot.design.position}</div>
                <div>Größe: {chatbot.design.size.width} × {chatbot.design.size.height}</div>
                <div>Schriftart: {chatbot.design.fontFamily.split(',')[0]}</div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Script anzeigen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Script für {chatbot.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        value={generateScript(chatbot.id)}
                        readOnly
                        className="font-mono text-sm"
                        rows={3}
                      />
                      <Button
                        onClick={() => copyToClipboard(generateScript(chatbot.id))}
                        className="w-full"
                      >
                        In Zwischenablage kopieren
                      </Button>
                      <div className="text-sm text-gray-600">
                        <p>Füge diesen Code in deine HTML-Seite ein:</p>
                        <p className="mt-2">
                          <strong>Beispiel:</strong>
                        </p>
                        <pre className="bg-gray-100 p-2 rounded text-xs mt-1">
{`<!DOCTYPE html>
<html>
<head>
    <title>Meine Seite</title>
</head>
<body>
    <h1>Willkommen</h1>
    <p>Hier ist mein Chatbot:</p>
    
    ${generateScript(chatbot.id)}
</body>
</html>`}
                        </pre>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(chatbot.id)}
                >
                  Löschen
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 