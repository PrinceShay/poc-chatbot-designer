'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ChatbotConfig } from '@/types/chatbot';
import Link from 'next/link';

export default function SavedChatbotsPage() {
  const [chatbots, setChatbots] = useState<(ChatbotConfig & { documentId?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  // Lade alle Chatbots aus Appwrite beim Mount
  useEffect(() => {
    const loadChatbots = async () => {
      try {
        const response = await fetch('/api/chatbot');
        if (response.ok) {
          const data = await response.json();
          console.log('Geladene Chatbots:', data);
          setChatbots(data.chatbots || []);
        } else {
          console.error('Fehler beim Laden:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Chatbots:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatbots();
  }, []);

  const generateScript = (chatbotId: string) => {
    // Verwende die aktuelle Domain für das Script
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `<script src="${baseUrl}/chatbot.js" data-chatbot-id="${chatbotId}"></script>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = async (chatbotId: string) => {
    try {
      const response = await fetch(`/api/chatbot/${chatbotId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Chatbot aus der lokalen Liste entfernen
        setChatbots(prev => prev.filter(c => c.id !== chatbotId));
      } else {
        alert('Fehler beim Löschen des Chatbots');
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen des Chatbots');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gespeicherte Chatbots</h1>
              <p className="text-gray-600 mt-2">Verwalte deine erstellten Chatbot-Designs</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                ← Zurück zum Designer
              </Button>
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Lade Chatbots...</p>
          </div>
        ) : chatbots.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Noch keine Chatbots gespeichert</h3>
              <p className="text-gray-600 mb-6">Erstelle deinen ersten Chatbot im Designer und speichere ihn hier.</p>
              <Link href="/">
                <Button>
                  Chatbot erstellen
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((chatbot) => (
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
                    onClick={() => handleDelete(chatbot.id)}
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 