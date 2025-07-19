"use client";

import { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  Settings,
  Save,
  User,
  Briefcase,
  Heart,
  Crown,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { saveSystemSettings, getSystemSettings } from "@/lib/appwrite";

// Vordefinierte Personas
const PREDEFINED_PERSONAS = {
  SALES: {
    id: "sales",
    name: "Verkäufer",
    icon: Briefcase,
    color: "bg-blue-500",
    description:
      "Professioneller Verkäufer, der Kunden berät und zum Kauf motiviert",
    prompt:
      "Du bist ein professioneller Verkäufer mit jahrelanger Erfahrung. Du bist freundlich, kompetent und hilfst Kunden dabei, die perfekte Lösung für ihre Bedürfnisse zu finden. Du stellst gezielte Fragen, um die Anforderungen zu verstehen, und präsentierst passende Produkte oder Dienstleistungen. Du bist überzeugend, aber nicht aufdringlich.",
  },
  FRIENDLY: {
    id: "friendly",
    name: "Kollege",
    icon: Heart,
    color: "bg-green-500",
    description: "Freundlicher Kollege, der wie ein guter Freund berät",
    prompt:
      "Du bist ein freundlicher Kollege oder guter Freund, der dem Kunden auf Augenhöhe begegnet. Du bist locker, sympathisch und sprichst in einer entspannten, alltäglichen Sprache. Du gibst ehrliche Ratschläge und teilst deine Erfahrungen. Du bist nicht nur ein Verkäufer, sondern jemand, der wirklich helfen möchte.",
  },
  PROFESSIONAL: {
    id: "professional",
    name: "Professionell",
    icon: Crown,
    color: "bg-purple-500",
    description: "Hochprofessioneller Berater mit Expertise",
    prompt:
      "Du bist ein hochprofessioneller Berater mit umfassender Expertise in deinem Bereich. Du kommunizierst klar, strukturiert und kompetent. Du gibst fundierte Ratschläge basierend auf deinem Fachwissen und stellst sicher, dass der Kunde alle wichtigen Informationen erhält. Du bist zuverlässig und vertrauenswürdig.",
  },
  ELEGANT: {
    id: "elegant",
    name: "Vornehm",
    icon: Crown,
    color: "bg-gray-600",
    description: "Vornehmer Berater für Premium-Kunden",
    prompt:
      "Du bist ein vornehmer, kultivierter Berater, der Premium-Kunden auf höchstem Niveau betreut. Du sprichst in einer gehobenen, aber verständlichen Sprache. Du zeigst Wertschätzung für den Kunden und bietest exklusive, maßgeschneiderte Lösungen. Du bist diskret und respektvoll.",
  },
};

interface CustomPersona {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export default function AIChatbotPage() {
  const [selectedPersona, setSelectedPersona] = useState("sales");
  const [customPersonas, setCustomPersonas] = useState<CustomPersona[]>([]);
  const [isLiveChatEnabled, setIsLiveChatEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [showCustomPersonaForm, setShowCustomPersonaForm] = useState(false);
  const [newPersona, setNewPersona] = useState({
    name: "",
    description: "",
    prompt: "",
  });

  // Lade gespeicherte Einstellungen beim Start
  useEffect(() => {
    loadSystemSettings();
  }, []);

  const loadSystemSettings = async () => {
    try {
      const settings = await getSystemSettings();
      if (settings) {
        setSelectedPersona(settings.selectedPersona || "sales");
        setCustomPersonas(settings.customPersonas || []);
        setIsLiveChatEnabled(settings.enableLiveChat || false);
      }
    } catch (error) {
      console.error("Fehler beim Laden der System-Einstellungen:", error);
    }
  };

  const getCurrentPersonaPrompt = () => {
    if (selectedPersona.startsWith("custom-")) {
      const customPersona = customPersonas.find(
        (p) => p.id === selectedPersona
      );
      return customPersona?.prompt || PREDEFINED_PERSONAS.SALES.prompt;
    }
    return (
      PREDEFINED_PERSONAS[selectedPersona as keyof typeof PREDEFINED_PERSONAS]
        ?.prompt || PREDEFINED_PERSONAS.SALES.prompt
    );
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "system",
          role: "system",
          content: getCurrentPersonaPrompt(),
        },
      ],
    });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const result = await saveSystemSettings({
        selectedPersona,
        customPersonas,
        enableLiveChat: isLiveChatEnabled,
        autoEscalate: true,
        escalationThreshold: 3,
        maxResponseTime: 30,
      });

      if (result.success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const addCustomPersona = () => {
    if (!newPersona.name || !newPersona.prompt) return;

    const customPersona: CustomPersona = {
      id: `custom-${Date.now()}`,
      name: newPersona.name,
      description: newPersona.description,
      prompt: newPersona.prompt,
    };

    setCustomPersonas((prev) => [...prev, customPersona]);
    setSelectedPersona(customPersona.id);
    setNewPersona({ name: "", description: "", prompt: "" });
    setShowCustomPersonaForm(false);
  };

  const deleteCustomPersona = (personaId: string) => {
    setCustomPersonas((prev) => prev.filter((p) => p.id !== personaId));
    if (selectedPersona === personaId) {
      setSelectedPersona("sales");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">KI-Chatbot</h1>
        <p className="text-gray-600">
          Konfiguriere die Persönlichkeit deines Chatbots
        </p>
      </div>

      <div className="flex-1 flex">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 bg-white px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat Test</TabsTrigger>
              <TabsTrigger value="settings">Konfiguration</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col p-6">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat Test
                </CardTitle>
                <CardDescription>
                  Teste deinen Chatbot mit der aktuellen Persönlichkeit
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.slice(1).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          Denke nach...
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Schreibe eine Nachricht..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-6">
            <div className="space-y-6">
              {/* Persona Auswahl */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Chatbot Persönlichkeit
                  </CardTitle>
                  <CardDescription>
                    Wähle eine vordefinierte Persönlichkeit oder erstelle deine
                    eigene
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vordefinierte Personas */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Vordefinierte Persönlichkeiten
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(PREDEFINED_PERSONAS).map(
                        ([key, persona]) => {
                          const Icon = persona.icon;
                          const isSelected = selectedPersona === key;

                          return (
                            <div
                              key={key}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedPersona(key)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded ${persona.color}`}>
                                  <Icon className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {persona.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {persona.description}
                                  </div>
                                </div>
                                {isSelected && (
                                  <Badge variant="secondary">Aktiv</Badge>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Eigene Personas */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">
                        Eigene Persönlichkeiten
                      </Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCustomPersonaForm(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Neue erstellen
                      </Button>
                    </div>

                    {customPersonas.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Noch keine eigenen Persönlichkeiten erstellt
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {customPersonas.map((persona) => (
                          <div
                            key={persona.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selectedPersona === persona.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedPersona(persona.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">
                                  {persona.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {persona.description}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {selectedPersona === persona.id && (
                                  <Badge variant="secondary">Aktiv</Badge>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCustomPersona(persona.id);
                                  }}
                                  className="text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Neue Persona Form */}
                  {showCustomPersonaForm && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Neue Persönlichkeit erstellen
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="persona-name">Name</Label>
                          <Input
                            id="persona-name"
                            value={newPersona.name}
                            onChange={(e) =>
                              setNewPersona((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="z.B. Technischer Berater"
                          />
                        </div>
                        <div>
                          <Label htmlFor="persona-description">
                            Beschreibung
                          </Label>
                          <Input
                            id="persona-description"
                            value={newPersona.description}
                            onChange={(e) =>
                              setNewPersona((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Kurze Beschreibung der Persönlichkeit"
                          />
                        </div>
                        <div>
                          <Label htmlFor="persona-prompt">
                            Verhalten beschreiben
                          </Label>
                          <Textarea
                            id="persona-prompt"
                            value={newPersona.prompt}
                            onChange={(e) =>
                              setNewPersona((prev) => ({
                                ...prev,
                                prompt: e.target.value,
                              }))
                            }
                            placeholder="Beschreibe, wie sich der Chatbot verhalten soll..."
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={addCustomPersona}
                            disabled={!newPersona.name || !newPersona.prompt}
                          >
                            Erstellen
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowCustomPersonaForm(false)}
                          >
                            Abbrechen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Live Chat Einstellungen */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Chat Einstellungen</CardTitle>
                  <CardDescription>
                    Konfiguriere das Live Chat System für menschliche
                    Unterstützung
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="live-chat"
                      checked={isLiveChatEnabled}
                      onCheckedChange={setIsLiveChatEnabled}
                    />
                    <Label htmlFor="live-chat">Live Chat aktivieren</Label>
                  </div>
                  {isLiveChatEnabled && (
                    <p className="text-sm text-gray-600 mt-2">
                      Wenn der Chatbot nicht weiter weiß, wird automatisch ein
                      Live Chat Agent angeboten.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Speichern Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Speichere..." : "Einstellungen speichern"}
                </Button>
              </div>

              {/* Status Meldung */}
              {saveStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-800 text-sm">
                    Einstellungen erfolgreich gespeichert!
                  </p>
                </div>
              )}
              {saveStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">
                    Fehler beim Speichern der Einstellungen.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
