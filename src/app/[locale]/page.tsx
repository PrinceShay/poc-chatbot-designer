"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Palette,
  Users,
  Settings,
  MessageSquare,
  ArrowRight,
  Activity,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Chatbot Designer",
    description: "Erstelle Chatbot-Designs mit visuellen Einstellungen",
    icon: Bot,
    href: "/chatbot-designer",
    color: "text-blue-600",
  },
  {
    title: "KI-Chatbot",
    description: "Konfiguriere KI-Chatbot mit System-Prompt",
    icon: Sparkles,
    href: "/ai-chatbot",
    color: "text-purple-600",
  },
  {
    title: "Content Builder",
    description: "Erstelle dein Drag & Drop Dashboard",
    icon: Palette,
    href: "/content-builder",
    color: "text-green-600",
  },
  {
    title: "Live Chat",
    description: "Verwalte Live Chat Sessions",
    icon: Users,
    href: "/live-chat",
    color: "text-orange-600",
  },
  {
    title: "Einstellungen",
    description: "Konfiguriere dein System",
    icon: Settings,
    href: "/settings",
    color: "text-gray-600",
  },
];

const stats = [
  { label: "Aktive Sessions", value: "3", icon: Activity },
  { label: "Gesendete Nachrichten", value: "127", icon: MessageSquare },
  { label: "Dashboard Items", value: "12", icon: Palette },
  { label: "System Status", value: "Online", icon: Bot },
];

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Willkommen bei deinem Chatbot-System</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <stat.icon className="h-8 w-8 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={feature.href}>
                    <Button className="w-full">
                      Öffnen
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Schnellstart</CardTitle>
              <CardDescription>
                Beginne mit der Konfiguration deines Chatbot-Systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/chatbot-designer">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <Bot className="h-6 w-6" />
                    <span>1. Chatbot Design erstellen</span>
                  </Button>
                </Link>
                <Link href="/ai-chatbot">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <Sparkles className="h-6 w-6" />
                    <span>2. KI-Chatbot konfigurieren</span>
                  </Button>
                </Link>
                <Link href="/content-builder">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <Palette className="h-6 w-6" />
                    <span>3. Dashboard erstellen</span>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col gap-2"
                  >
                    <Settings className="h-6 w-6" />
                    <span>4. Einstellungen</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
