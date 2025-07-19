"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  User,
  Bot,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  status: "waiting" | "active" | "resolved";
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

export default function LiveChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      userId: "user-1",
      userName: "Max Mustermann",
      status: "active",
      messages: [
        {
          id: "1",
          role: "user",
          content: "Hallo, ich brauche Hilfe bei meiner Bestellung",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
          id: "2",
          role: "agent",
          content:
            "Guten Tag! Gerne helfe ich Ihnen weiter. Können Sie mir Ihre Bestellnummer nennen?",
          timestamp: new Date(Date.now() - 1000 * 60 * 3),
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      lastActivity: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "2",
      userId: "user-2",
      userName: "Anna Schmidt",
      status: "waiting",
      messages: [
        {
          id: "3",
          role: "user",
          content: "Ich habe eine Frage zu den Versandkosten",
          timestamp: new Date(Date.now() - 1000 * 60 * 2),
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 2),
      lastActivity: new Date(Date.now() - 1000 * 60 * 2),
    },
  ]);

  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    sessions[0]
  );
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!selectedSession || !newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      role: "agent",
      content: newMessage,
      timestamp: new Date(),
    };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === selectedSession.id
          ? {
              ...session,
              messages: [...session.messages, message],
              lastActivity: new Date(),
            }
          : session
      )
    );

    setSelectedSession((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, message],
            lastActivity: new Date(),
          }
        : null
    );

    setNewMessage("");
  };

  const handleResolveSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, status: "resolved" as const }
          : session
      )
    );

    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Wartend
          </Badge>
        );
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Aktiv
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Gelöst
          </Badge>
        );
      default:
        return null;
    }
  };

  const activeSessions = sessions.filter((s) => s.status !== "resolved");

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Live Chat</h1>
        <p className="text-gray-600">Verwalte Live Chat Sessions</p>
      </div>

      <div className="flex-1 flex">
        {/* Sessions List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Aktive Sessions</h3>
            <p className="text-sm text-gray-500">
              {activeSessions.length} offen
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedSession?.id === session.id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm">
                      {session.userName}
                    </span>
                  </div>
                  {getStatusBadge(session.status)}
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {session.messages[
                    session.messages.length - 1
                  ]?.content.substring(0, 50)}
                  ...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {session.lastActivity.toLocaleTimeString()}
                  </span>
                  {session.status === "active" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolveSession(session.id);
                      }}
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium">
                        {selectedSession.userName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Session #{selectedSession.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedSession.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveSession(selectedSession.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Lösen
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === "user" ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Schreibe eine Nachricht..."
                    className="flex-1 resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Keine Session ausgewählt
                </h3>
                <p className="text-gray-500">
                  Wähle eine Session aus der Liste aus, um zu chatten
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
