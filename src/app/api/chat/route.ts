import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getContentItems, getSystemSettings } from "@/lib/appwrite";

interface ContentItem {
  id: string;
  type: "product" | "appointment" | "provider";
  title: string;
  description?: string;
  price?: number;
  image?: string;
  calendarUrl?: string;
  providerName?: string;
  position: { x: number; y: number };
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Lade System-Einstellungen und Content Items
  let systemPrompt =
    "Du bist ein hilfreicher Assistent. Antworte immer auf Deutsch.";
  let contentItems: ContentItem[] = [];

  try {
    const settings = await getSystemSettings();
    if (settings) {
      systemPrompt = settings.systemPrompt;
    }

    contentItems = await getContentItems();
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
  }

  // Erweitere den System Prompt mit den Content Items
  let enhancedSystemPrompt = systemPrompt;

  if (contentItems.length > 0) {
    enhancedSystemPrompt +=
      "\n\nDu hast Zugriff auf folgende Informationen aus der Datenbank:\n";

    const products = contentItems.filter((item) => item.type === "product");
    const appointments = contentItems.filter(
      (item) => item.type === "appointment"
    );
    const providers = contentItems.filter((item) => item.type === "provider");

    if (products.length > 0) {
      enhancedSystemPrompt += "\nPRODUKTE:\n";
      products.forEach((product) => {
        enhancedSystemPrompt += `- ${product.title}`;
        if (product.description)
          enhancedSystemPrompt += `: ${product.description}`;
        if (product.price)
          enhancedSystemPrompt += ` (Preis: ${product.price}€)`;
        if (product.image) enhancedSystemPrompt += ` [Bild: ${product.image}]`;
        enhancedSystemPrompt += "\n";
      });
    }

    if (appointments.length > 0) {
      enhancedSystemPrompt += "\nTERMINVEREINBARUNGEN:\n";
      appointments.forEach((appointment) => {
        enhancedSystemPrompt += `- ${appointment.title}`;
        if (appointment.description)
          enhancedSystemPrompt += `: ${appointment.description}`;
        if (appointment.calendarUrl)
          enhancedSystemPrompt += ` [Kalender: ${appointment.calendarUrl}]`;
        enhancedSystemPrompt += "\n";
      });
    }

    if (providers.length > 0) {
      enhancedSystemPrompt += "\nANBIETER:\n";
      providers.forEach((provider) => {
        enhancedSystemPrompt += `- ${provider.title}`;
        if (provider.providerName)
          enhancedSystemPrompt += ` (${provider.providerName})`;
        if (provider.description)
          enhancedSystemPrompt += `: ${provider.description}`;
        enhancedSystemPrompt += "\n";
      });
    }

    enhancedSystemPrompt +=
      "\nVerwende diese Informationen, um präzise und hilfreiche Antworten zu geben.";
  }

  enhancedSystemPrompt +=
    "\n\nWenn du eine Frage nicht beantworten kannst oder unsicher bist, biete dem Benutzer an, mit einem menschlichen Agenten zu sprechen.";

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages,
    system: enhancedSystemPrompt,
  });

  return result.toDataStreamResponse();
}
