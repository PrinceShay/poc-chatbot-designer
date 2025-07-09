'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AppwriteConfig() {
  const [projectId, setProjectId] = useState(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');
  const [endpoint, setEndpoint] = useState(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConfigure = async () => {
    if (!projectId.trim()) {
      alert('Bitte gib eine Project ID ein');
      return;
    }

    setIsConfiguring(true);
    
    try {
      const response = await fetch('/api/appwrite/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, endpoint }),
      });

      if (response.ok) {
        setIsConfigured(true);
        alert('Appwrite erfolgreich konfiguriert!');
      } else {
        alert('Fehler bei der Konfiguration');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler bei der Konfiguration');
    } finally {
      setIsConfiguring(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Appwrite konfigurieren
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appwrite Konfiguration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Deine Appwrite Project ID"
            />
          </div>
          
          <div>
            <Label htmlFor="endpoint">Endpoint (optional)</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://fra.cloud.appwrite.io/v1"
            />
          </div>
          
          <Button 
            onClick={handleConfigure} 
            disabled={isConfiguring || !projectId.trim()}
            className="w-full"
          >
            {isConfiguring ? 'Konfiguriere...' : 'Konfigurieren'}
          </Button>
          
          {isConfigured && (
            <div className="text-sm text-green-600">
              ✅ Appwrite ist konfiguriert
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p><strong>Schritte zur Einrichtung:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Gehe zu <a href="https://cloud.appwrite.io" target="_blank" rel="noopener" className="text-blue-600 underline">cloud.appwrite.io</a></li>
              <li>Erstelle ein neues Projekt</li>
              <li>Kopiere die Project ID</li>
              <li>Erstelle eine Datenbank namens "chatbot_designer"</li>
              <li>Erstelle eine Collection namens "chatbots"</li>
              <li>Füge die Attribute hinzu: id (string), name (string), design (string), created_at (string)</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 