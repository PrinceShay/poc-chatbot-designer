'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChatbotDesign, ChatbotConfig } from '@/types/chatbot';

interface ChatbotDesignerProps {
  onSave: (config: ChatbotConfig) => void;
}

export default function ChatbotDesigner({ onSave }: ChatbotDesignerProps) {
  const [design, setDesign] = useState<ChatbotDesign>({
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb'
    },
    size: {
      width: '400px',
      height: '600px'
    },
    borderRadius: '12px',
    position: 'bottom-right',
    fontFamily: 'Inter, sans-serif',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  });

  const [name, setName] = useState('Mein Chatbot');
  const [generatedScript, setGeneratedScript] = useState('');

  const updateDesign = (updates: Partial<ChatbotDesign>) => {
    setDesign(prev => ({ ...prev, ...updates }));
  };

  const updateColors = (updates: Partial<ChatbotDesign['colors']>) => {
    setDesign(prev => ({
      ...prev,
      colors: { ...prev.colors, ...updates }
    }));
  };

  const updateSize = (updates: Partial<ChatbotDesign['size']>) => {
    setDesign(prev => ({
      ...prev,
      size: { ...prev.size, ...updates }
    }));
  };

  const generateScript = () => {
    const script = `<script src="/chatbot.js" data-chatbot-id="YOUR_CHATBOT_ID"></script>`;
    setGeneratedScript(script);
  };

  const handleSave = () => {
    const config: ChatbotConfig = {
      id: `chatbot-${Date.now()}`,
      name,
      design
    };
    onSave(config);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Chatbot Designer</h1>
        <p className="text-gray-600">Erstelle deinen eigenen Chatbot mit individuellem Design</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Designer Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Grundlagen</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Chatbot Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mein Chatbot"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Farben</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="primary">Primärfarbe</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={design.colors.primary}
                    onChange={(e) => updateColors({ primary: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={design.colors.primary}
                    onChange={(e) => updateColors({ primary: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary">Sekundärfarbe</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={design.colors.secondary}
                    onChange={(e) => updateColors({ secondary: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={design.colors.secondary}
                    onChange={(e) => updateColors({ secondary: e.target.value })}
                    placeholder="#1e40af"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="background">Hintergrundfarbe</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={design.colors.background}
                    onChange={(e) => updateColors({ background: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={design.colors.background}
                    onChange={(e) => updateColors({ background: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="text">Textfarbe</Label>
                <div className="flex gap-2">
                  <Input
                    id="text"
                    type="color"
                    value={design.colors.text}
                    onChange={(e) => updateColors({ text: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={design.colors.text}
                    onChange={(e) => updateColors({ text: e.target.value })}
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Größe & Position</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="width">Breite</Label>
                <Input
                  id="width"
                  value={design.size.width}
                  onChange={(e) => updateSize({ width: e.target.value })}
                  placeholder="400px"
                />
              </div>

              <div>
                <Label htmlFor="height">Höhe</Label>
                <Input
                  id="height"
                  value={design.size.height}
                  onChange={(e) => updateSize({ height: e.target.value })}
                  placeholder="600px"
                />
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Select
                  value={design.position}
                  onValueChange={(value: string) => updateDesign({ position: value as ChatbotDesign['position'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Unten rechts</SelectItem>
                    <SelectItem value="bottom-left">Unten links</SelectItem>
                    <SelectItem value="top-right">Oben rechts</SelectItem>
                    <SelectItem value="top-left">Oben links</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Input
                  id="borderRadius"
                  value={design.borderRadius}
                  onChange={(e) => updateDesign({ borderRadius: e.target.value })}
                  placeholder="12px"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Schriftart & Schatten</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fontFamily">Schriftart</Label>
                <Select
                  value={design.fontFamily}
                  onValueChange={(value: string) => updateDesign({ fontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                    <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                    <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="shadow">Schatten</Label>
                <Input
                  id="shadow"
                  value={design.shadow}
                  onChange={(e) => updateDesign({ shadow: e.target.value })}
                  placeholder="0 10px 25px rgba(0, 0, 0, 0.1)"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1">
              Design speichern
            </Button>
            <Button onClick={generateScript} variant="outline" className="flex-1">
              Script generieren
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Vorschau</h2>
            
            <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] relative">
              {/* Chatbot Preview */}
              <div
                className="absolute"
                style={{
                  [design.position.includes('right') ? 'right' : 'left']: '20px',
                  [design.position.includes('bottom') ? 'bottom' : 'top']: '20px',
                  width: design.size.width,
                  height: design.size.height,
                  backgroundColor: design.colors.background,
                  border: `1px solid ${design.colors.border}`,
                  borderRadius: design.borderRadius,
                  boxShadow: design.shadow,
                  fontFamily: design.fontFamily,
                  color: design.colors.text,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div
                  className="p-4 font-bold flex justify-between items-center"
                  style={{ backgroundColor: design.colors.primary, color: 'white' }}
                >
                  <span>{name}</span>
                  <span>×</span>
                </div>
                
                {/* Chat Area */}
                <div className="flex-1 p-4 bg-gray-100">
                  <div className="space-y-2">
                    <div
                      className="p-3 rounded-lg max-w-[80%]"
                      style={{ backgroundColor: design.colors.border }}
                    >
                      Hallo! Wie kann ich dir helfen?
                    </div>
                    <div
                      className="p-3 rounded-lg max-w-[80%] ml-auto"
                      style={{ backgroundColor: design.colors.primary, color: 'white' }}
                    >
                      Hallo! Ich habe eine Frage.
                    </div>
                  </div>
                </div>
                
                {/* Input Area */}
                <div
                  className="p-4 border-t flex gap-2"
                  style={{ borderColor: design.colors.border }}
                >
                  <input
                    type="text"
                    placeholder="Nachricht eingeben..."
                    className="flex-1 px-3 py-2 border rounded-full outline-none"
                    style={{
                      borderColor: design.colors.border,
                      backgroundColor: design.colors.background,
                      color: design.colors.text
                    }}
                  />
                  <button
                    className="px-4 py-2 rounded-full font-bold"
                    style={{
                      backgroundColor: design.colors.primary,
                      color: 'white'
                    }}
                  >
                    Senden
                  </button>
                </div>
              </div>
            </div>
          </div>

          {generatedScript && (
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Generiertes Script</h2>
              <Textarea
                value={generatedScript}
                readOnly
                className="font-mono text-sm"
                rows={3}
              />
              <p className="text-sm text-gray-600 mt-2">
                Kopiere diesen Code in deine HTML-Seite, um den Chatbot einzubinden.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 