'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatbotDesign, ChatbotConfig } from '@/types/chatbot';
import { chatbotTemplates } from '@/data/chatbot-templates';

interface ChatbotDesignerProps {
  onSave?: (config: ChatbotConfig) => void;
  editChatbot?: ChatbotConfig & { documentId?: string };
}

export default function ChatbotDesigner({ onSave, editChatbot }: ChatbotDesignerProps) {
  const [design, setDesign] = useState<ChatbotDesign>(editChatbot?.design || {
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb',
      accent: '#60a5fa',
      hover: '#2563eb',
      success: '#10b981',
      error: '#ef4444'
    },
    size: {
      width: '400px',
      height: '600px',
      minWidth: '300px',
      maxWidth: '500px',
      minHeight: '400px',
      maxHeight: '800px'
    },
    borderRadius: '12px',
    position: 'bottom-right',
    fontFamily: 'Inter, sans-serif',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    animation: {
      enabled: true,
      type: 'slide',
      duration: 300,
      easing: 'ease-out'
    },
    behavior: {
      welcomeMessage: 'Hallo! Wie kann ich Ihnen heute helfen?',
      autoOpen: false,
      autoOpenDelay: 3000,
      showTypingIndicator: true,
      typingSpeed: 50,
      closeOnOutsideClick: true,
      rememberPosition: true
    },
    opacity: 1,
    borderStyle: 'solid',
    borderWidth: '1px',
    zIndex: 1000
  });

  const [name, setName] = useState(editChatbot?.name || 'Mein Chatbot');
  const [generatedScript, setGeneratedScript] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(editChatbot?.template || '');
  const chatbotId = editChatbot?.id || `chatbot-${Date.now()}`;

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

  const updateAnimation = (updates: Partial<ChatbotDesign['animation']>) => {
    setDesign(prev => ({
      ...prev,
      animation: { ...prev.animation, ...updates }
    }));
  };

  const updateBehavior = (updates: Partial<ChatbotDesign['behavior']>) => {
    setDesign(prev => ({
      ...prev,
      behavior: { ...prev.behavior, ...updates }
    }));
  };

  const applyTemplate = (templateId: string) => {
    const template = chatbotTemplates.find(t => t.id === templateId);
    if (template) {
      setDesign(template.design);
      setName(template.name);
      setSelectedTemplate(templateId);
    }
  };

  const generateScript = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const script = `<script src="${baseUrl}/chatbot.js" data-chatbot-id="${chatbotId}"></script>`;
    setGeneratedScript(script);
  };

  const handleSave = async () => {
    const config: ChatbotConfig = {
      id: chatbotId,
      name,
      design,
      template: selectedTemplate
    };
    
    try {
      const method = editChatbot ? 'PUT' : 'POST';
      const url = editChatbot ? `/api/chatbot/${chatbotId}` : '/api/chatbot';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        onSave?.(config);
        alert(editChatbot ? 'Chatbot erfolgreich aktualisiert!' : 'Chatbot erfolgreich gespeichert!');
        // Generiere automatisch das Script mit der gespeicherten ID
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const script = `<script src="${baseUrl}/chatbot.js" data-chatbot-id="${config.id}"></script>`;
        setGeneratedScript(script);
      } else {
        alert('Fehler beim Speichern des Chatbots.');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern des Chatbots.');
    }
  };

  const getAnimationStyle = () => {
    if (!design.animation.enabled) return {};
    
    const duration = design.animation.duration;
    const easing = design.animation.easing;
    
    switch (design.animation.type) {
      case 'fade':
        return {
          animation: `fadeIn ${duration}ms ${easing}`,
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: design.opacity }
          }
        };
      case 'slide':
        return {
          animation: `slideIn ${duration}ms ${easing}`,
          '@keyframes slideIn': {
            from: { transform: 'translateY(100%)' },
            to: { transform: 'translateY(0)' }
          }
        };
      case 'bounce':
        return {
          animation: `bounceIn ${duration}ms ${easing}`,
          '@keyframes bounceIn': {
            '0%': { transform: 'scale(0.3)', opacity: 0 },
            '50%': { transform: 'scale(1.05)' },
            '70%': { transform: 'scale(0.9)' },
            '100%': { transform: 'scale(1)', opacity: design.opacity }
          }
        };
      default:
        return {};
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Chatbot Designer</h1>
        <p className="text-gray-600">Erstelle deinen eigenen Chatbot mit individuellem Design</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Designer Panel */}
        <div className="xl:col-span-2 space-y-6">
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basics">Grundlagen</TabsTrigger>
              <TabsTrigger value="colors">Farben</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
              <TabsTrigger value="behavior">Verhalten</TabsTrigger>
              <TabsTrigger value="templates">Vorlagen</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grundlagen</CardTitle>
                  <CardDescription>Basis-Einstellungen für deinen Chatbot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Chatbot Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mein Chatbot"
                    />
                  </div>
                  
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
                        <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                        <SelectItem value="Nunito, sans-serif">Nunito</SelectItem>
                        <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
                        <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="zIndex">Z-Index</Label>
                    <Input
                      id="zIndex"
                      type="number"
                      value={design.zIndex}
                      onChange={(e) => updateDesign({ zIndex: parseInt(e.target.value) })}
                      placeholder="1000"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Farben</CardTitle>
                  <CardDescription>Definiere das Farbschema deines Chatbots</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    primary: 'Primärfarbe',
                    secondary: 'Sekundärfarbe',
                    background: 'Hintergrundfarbe',
                    text: 'Textfarbe',
                    border: 'Rahmenfarbe',
                    accent: 'Akzentfarbe',
                    hover: 'Hover-Farbe',
                    success: 'Erfolgsfarbe',
                    error: 'Fehlerfarbe'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <Label htmlFor={key}>{label}</Label>
                      <div className="flex gap-2">
                        <Input
                          id={key}
                          type="color"
                          value={design.colors[key as keyof typeof design.colors]}
                          onChange={(e) => updateColors({ [key]: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={design.colors[key as keyof typeof design.colors]}
                          onChange={(e) => updateColors({ [key]: e.target.value })}
                          placeholder={`#${key}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Layout & Größe</CardTitle>
                  <CardDescription>Größe, Position und Rahmen-Einstellungen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minWidth">Min. Breite</Label>
                      <Input
                        id="minWidth"
                        value={design.size.minWidth || ''}
                        onChange={(e) => updateSize({ minWidth: e.target.value })}
                        placeholder="300px"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxWidth">Max. Breite</Label>
                      <Input
                        id="maxWidth"
                        value={design.size.maxWidth || ''}
                        onChange={(e) => updateSize({ maxWidth: e.target.value })}
                        placeholder="500px"
                      />
                    </div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="borderRadius">Border Radius</Label>
                      <Input
                        id="borderRadius"
                        value={design.borderRadius}
                        onChange={(e) => updateDesign({ borderRadius: e.target.value })}
                        placeholder="12px"
                      />
                    </div>
                    <div>
                      <Label htmlFor="borderWidth">Border Breite</Label>
                      <Input
                        id="borderWidth"
                        value={design.borderWidth}
                        onChange={(e) => updateDesign({ borderWidth: e.target.value })}
                        placeholder="1px"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="borderStyle">Border Stil</Label>
                    <Select
                      value={design.borderStyle}
                      onValueChange={(value: string) => updateDesign({ borderStyle: value as ChatbotDesign['borderStyle'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                        <SelectItem value="none">None</SelectItem>
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

                  <div>
                    <Label htmlFor="opacity">Transparenz</Label>
                    <Slider
                      value={[design.opacity]}
                      onValueChange={([value]) => updateDesign({ opacity: value })}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500 mt-1">{Math.round(design.opacity * 100)}%</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="animation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Animationen</CardTitle>
                  <CardDescription>Definiere Animationen und Übergänge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="animation-enabled"
                      checked={design.animation.enabled}
                      onCheckedChange={(checked: boolean) => updateAnimation({ enabled: checked })}
                    />
                    <Label htmlFor="animation-enabled">Animationen aktivieren</Label>
                  </div>

                  {design.animation.enabled && (
                    <>
                      <div>
                        <Label htmlFor="animation-type">Animationstyp</Label>
                        <Select
                          value={design.animation.type}
                          onValueChange={(value: string) => updateAnimation({ type: value as ChatbotDesign['animation']['type'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fade">Fade</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                            <SelectItem value="bounce">Bounce</SelectItem>
                            <SelectItem value="none">Keine</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="animation-duration">Dauer (ms)</Label>
                        <Input
                          id="animation-duration"
                          type="number"
                          value={design.animation.duration}
                          onChange={(e) => updateAnimation({ duration: parseInt(e.target.value) })}
                          placeholder="300"
                        />
                      </div>

                      <div>
                        <Label htmlFor="animation-easing">Easing</Label>
                        <Select
                          value={design.animation.easing}
                          onValueChange={(value: string) => updateAnimation({ easing: value as ChatbotDesign['animation']['easing'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ease">Ease</SelectItem>
                            <SelectItem value="ease-in">Ease In</SelectItem>
                            <SelectItem value="ease-out">Ease Out</SelectItem>
                            <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                            <SelectItem value="linear">Linear</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verhalten</CardTitle>
                  <CardDescription>Definiere das Verhalten deines Chatbots</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="welcomeMessage">Willkommensnachricht</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={design.behavior.welcomeMessage}
                      onChange={(e) => updateBehavior({ welcomeMessage: e.target.value })}
                      placeholder="Hallo! Wie kann ich Ihnen helfen?"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoOpen"
                      checked={design.behavior.autoOpen}
                      onCheckedChange={(checked: boolean) => updateBehavior({ autoOpen: checked })}
                    />
                    <Label htmlFor="autoOpen">Automatisch öffnen</Label>
                  </div>

                  {design.behavior.autoOpen && (
                    <div>
                      <Label htmlFor="autoOpenDelay">Verzögerung (ms)</Label>
                      <Input
                        id="autoOpenDelay"
                        type="number"
                        value={design.behavior.autoOpenDelay}
                        onChange={(e) => updateBehavior({ autoOpenDelay: parseInt(e.target.value) })}
                        placeholder="3000"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showTypingIndicator"
                      checked={design.behavior.showTypingIndicator}
                      onCheckedChange={(checked: boolean) => updateBehavior({ showTypingIndicator: checked })}
                    />
                    <Label htmlFor="showTypingIndicator">Typing-Indikator anzeigen</Label>
                  </div>

                  <div>
                    <Label htmlFor="typingSpeed">Typing-Geschwindigkeit (ms)</Label>
                    <Input
                      id="typingSpeed"
                      type="number"
                      value={design.behavior.typingSpeed}
                      onChange={(e) => updateBehavior({ typingSpeed: parseInt(e.target.value) })}
                      placeholder="50"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="closeOnOutsideClick"
                      checked={design.behavior.closeOnOutsideClick}
                      onCheckedChange={(checked: boolean) => updateBehavior({ closeOnOutsideClick: checked })}
                    />
                    <Label htmlFor="closeOnOutsideClick">Bei Klick außerhalb schließen</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="rememberPosition"
                      checked={design.behavior.rememberPosition}
                      onCheckedChange={(checked: boolean) => updateBehavior({ rememberPosition: checked })}
                    />
                    <Label htmlFor="rememberPosition">Position merken</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vorlagen</CardTitle>
                  <CardDescription>Wähle eine Vorlage als Ausgangspunkt</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chatbotTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => applyTemplate(template.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <Badge variant="secondary">{template.category}</Badge>
                          </div>
                          <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div
                            className="w-full h-20 rounded border"
                            style={{
                              background: template.design.colors.background,
                              borderColor: template.design.colors.border,
                              borderRadius: template.design.borderRadius
                            }}
                          >
                            <div
                              className="h-6 rounded-t flex items-center px-2 text-xs font-bold"
                              style={{
                                background: template.design.colors.primary,
                                color: 'white'
                              }}
                            >
                              {template.name}
                            </div>
                            <div className="p-2">
                              <div
                                className="w-3/4 h-2 rounded mb-1"
                                style={{ background: template.design.colors.border }}
                              />
                              <div
                                className="w-1/2 h-2 rounded ml-auto"
                                style={{ background: template.design.colors.primary }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
          <Card>
            <CardHeader>
              <CardTitle>Vorschau</CardTitle>
              <CardDescription>Live-Vorschau deines Chatbots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50">
                {/* Chatbot Preview */}
                <div
                  style={{
                    width: design.size.width,
                    height: design.size.height,
                    minWidth: design.size.minWidth,
                    maxWidth: design.size.maxWidth,
                    minHeight: design.size.minHeight,
                    maxHeight: design.size.maxHeight,
                    background: design.colors.background,
                    border: `${design.borderWidth} ${design.borderStyle} ${design.colors.border}`,
                    borderRadius: design.borderRadius,
                    boxShadow: design.shadow,
                    fontFamily: design.fontFamily,
                    color: design.colors.text,
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: design.opacity,
                    zIndex: design.zIndex,
                    ...getAnimationStyle()
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
                        {design.behavior.welcomeMessage}
                      </div>
                      <div
                        className="p-3 rounded-lg max-w-[80%] ml-auto"
                        style={{ backgroundColor: design.colors.primary, color: 'white' }}
                      >
                        Hallo! Ich habe eine Frage.
                      </div>
                      {design.behavior.showTypingIndicator && (
                        <div
                          className="p-3 rounded-lg max-w-[80%]"
                          style={{ backgroundColor: design.colors.border }}
                        >
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      )}
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
                      className="px-4 py-2 rounded-full font-bold transition-colors"
                      style={{
                        backgroundColor: design.colors.primary,
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = design.colors.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = design.colors.primary;
                      }}
                    >
                      Senden
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {generatedScript && (
            <Card>
              <CardHeader>
                <CardTitle>Generiertes Script</CardTitle>
                <CardDescription>Kopiere diesen Code in deine HTML-Seite</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={generatedScript}
                  readOnly
                  className="font-mono text-sm"
                  rows={3}
                />
                <Button
                  onClick={() => navigator.clipboard.writeText(generatedScript)}
                  className="w-full"
                >
                  In Zwischenablage kopieren
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 