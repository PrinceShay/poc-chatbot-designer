"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Database,
  Key,
  Save,
  TestTube,
  Users,
  MessageSquare,
} from "lucide-react";
import {
  saveSystemSettings,
  getSystemSettings,
  initAppwrite,
} from "@/lib/appwrite";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appwriteEndpoint: "",
    appwriteProjectId: "",
    appwriteApiKey: "",
    openaiApiKey: "",
    systemPrompt:
      "Du bist ein hilfreicher Assistent. Antworte immer auf Deutsch.",
    enableLiveChat: true,
    autoEscalate: true,
    escalationThreshold: 3,
    maxResponseTime: 30,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // Lade gespeicherte Einstellungen beim Start
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getSystemSettings();
      if (savedSettings) {
        setSettings((prev) => ({
          ...prev,
          systemPrompt: savedSettings.systemPrompt,
          enableLiveChat: savedSettings.enableLiveChat,
          autoEscalate: savedSettings.autoEscalate,
          escalationThreshold: savedSettings.escalationThreshold,
          maxResponseTime: savedSettings.maxResponseTime,
          openaiApiKey: savedSettings.openaiApiKey || "",
        }));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Einstellungen:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus("idle");

    try {
      // Appwrite initialisieren falls neue Konfiguration
      if (settings.appwriteEndpoint && settings.appwriteProjectId) {
        initAppwrite(settings.appwriteProjectId, settings.appwriteEndpoint);
      }

      const result = await saveSystemSettings({
        systemPrompt: settings.systemPrompt,
        enableLiveChat: settings.enableLiveChat,
        autoEscalate: settings.autoEscalate,
        escalationThreshold: settings.escalationThreshold,
        maxResponseTime: settings.maxResponseTime,
        openaiApiKey: settings.openaiApiKey,
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
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      if (settings.appwriteEndpoint && settings.appwriteProjectId) {
        initAppwrite(settings.appwriteProjectId, settings.appwriteEndpoint);
        // Teste die Verbindung durch Laden der Einstellungen
        await getSystemSettings();
        alert("Verbindung erfolgreich!");
      } else {
        alert("Bitte fülle alle Appwrite-Felder aus.");
      }
    } catch (error) {
      console.error("Verbindungstest fehlgeschlagen:", error);
      alert("Verbindung fehlgeschlagen. Überprüfe deine Einstellungen.");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Einstellungen</h1>
        <p className="text-gray-600">Konfiguriere dein Chatbot-System</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl space-y-6">
          {/* Appwrite Konfiguration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Appwrite Konfiguration
              </CardTitle>
              <CardDescription>
                Konfiguriere die Verbindung zu deiner Appwrite Datenbank
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endpoint">Appwrite Endpoint</Label>
                  <Input
                    id="endpoint"
                    value={settings.appwriteEndpoint}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        appwriteEndpoint: e.target.value,
                      }))
                    }
                    placeholder="https://your-appwrite-endpoint.com"
                  />
                </div>
                <div>
                  <Label htmlFor="project-id">Project ID</Label>
                  <Input
                    id="project-id"
                    value={settings.appwriteProjectId}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        appwriteProjectId: e.target.value,
                      }))
                    }
                    placeholder="your-project-id"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={settings.appwriteApiKey}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      appwriteApiKey: e.target.value,
                    }))
                  }
                  placeholder="your-api-key"
                />
              </div>
              <Button onClick={handleTestConnection} variant="outline">
                <TestTube className="h-4 w-4 mr-2" />
                Verbindung testen
              </Button>
            </CardContent>
          </Card>

          {/* OpenAI Konfiguration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                OpenAI Konfiguration
              </CardTitle>
              <CardDescription>
                Konfiguriere deine OpenAI API für den Chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      openaiApiKey: e.target.value,
                    }))
                  }
                  placeholder="sk-..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Chatbot Einstellungen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chatbot Einstellungen
              </CardTitle>
              <CardDescription>
                Konfiguriere das Verhalten deines Chatbots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="system-prompt">Standard System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={settings.systemPrompt}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      systemPrompt: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Definiere das Standard-Verhalten deines Chatbots..."
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="live-chat">Live Chat aktivieren</Label>
                    <p className="text-sm text-gray-500">
                      Ermöglicht es Benutzern, mit einem menschlichen Agenten zu
                      sprechen
                    </p>
                  </div>
                  <Switch
                    id="live-chat"
                    checked={settings.enableLiveChat}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        enableLiveChat: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-escalate">
                      Automatische Eskalation
                    </Label>
                    <p className="text-sm text-gray-500">
                      Automatisch zu Live Chat wechseln, wenn der Bot nicht
                      weiter weiß
                    </p>
                  </div>
                  <Switch
                    id="auto-escalate"
                    checked={settings.autoEscalate}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        autoEscalate: checked,
                      }))
                    }
                  />
                </div>
              </div>

              {settings.autoEscalate && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="threshold">Eskalations-Schwelle</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={settings.escalationThreshold}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          escalationThreshold: parseInt(e.target.value),
                        }))
                      }
                      placeholder="3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Anzahl der Versuche, bevor eskaliert wird
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="response-time">
                      Max. Antwortzeit (Sekunden)
                    </Label>
                    <Input
                      id="response-time"
                      type="number"
                      value={settings.maxResponseTime}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          maxResponseTime: parseInt(e.target.value),
                        }))
                      }
                      placeholder="30"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Speichern Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Speichere..." : "Einstellungen speichern"}
            </Button>
          </div>

          {/* Status Meldung */}
          {saveStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">
                Einstellungen erfolgreich gespeichert!
              </p>
            </div>
          )}
          {saveStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">
                Fehler beim Speichern der Einstellungen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
