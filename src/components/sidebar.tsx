"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Palette,
  Users,
  Settings,
  Bot,
  Sparkles,
} from "lucide-react";

const navigation = [
  {
    name: "Chatbot Designer",
    href: "/chatbot-designer",
    icon: Bot,
    description: "Visueller Designer für Chatbot-Designs",
  },
  {
    name: "KI-Chatbot",
    href: "/ai-chatbot",
    icon: Sparkles,
    description: "KI-Chatbot mit System-Prompt",
  },
  {
    name: "Content Builder",
    href: "/content-builder",
    icon: Palette,
    description: "Drag & Drop Dashboard",
  },
  {
    name: "Live Chat",
    href: "/live-chat",
    icon: Users,
    description: "Live Support System",
  },
  {
    name: "Einstellungen",
    href: "/settings",
    icon: Settings,
    description: "System konfigurieren",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">Chatbot</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-blue-700"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
