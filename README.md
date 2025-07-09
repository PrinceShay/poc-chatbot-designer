# Chatbot Designer MVP

Ein Proof of Concept für einen Chatbot-Designer, der individuelle Chatbot-Designs erstellt und ein Standard-Script generiert, das die Design-Daten über eine Chatbot-ID lädt.

## Features

### 🎨 Chatbot Designer
- **Visueller Designer**: Erstelle Chatbots mit individuellen Designs
- **Live-Vorschau**: Sieh Änderungen in Echtzeit
- **Design-Optionen**:
  - Farben (Primär, Sekundär, Hintergrund, Text, Border)
  - Größe (Breite & Höhe)
  - Position (4 Ecken)
  - Border Radius
  - Schriftart
  - Schatten

### 📦 Standard-Script System
- **Einheitliches Script**: `chatbot.js` lädt Design-Daten über API
- **Chatbot-ID basiert**: Jeder Chatbot hat eine eindeutige ID
- **Automatisches Laden**: Script lädt Design-Daten automatisch
- **Flexibel**: Ein Script für alle Chatbots

### 💾 Datenverwaltung
- **MVP**: JSON-Datei für Design-Speicherung
- **Produktions-Ready**: Vorbereitet für Appwrite-Datenbank
- **API-Endpoint**: `/api/chatbot/[id]` für Design-Abruf

## Technologie-Stack

- **Frontend**: Next.js 15 mit TypeScript
- **UI**: Shadcn/ui Komponenten
- **Styling**: Tailwind CSS
- **Daten**: JSON (MVP) → Appwrite (Produktion)

## Installation & Start

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist unter `http://localhost:3000` verfügbar.

## Verwendung

### 1. Chatbot erstellen
1. Gehe zum **Designer** Tab
2. Konfiguriere Farben, Größe, Position etc.
3. Klicke **"Design speichern"**

### 2. Script generieren
1. Klicke **"Script generieren"** im Designer
2. Kopiere das generierte Script
3. Füge es in deine HTML-Seite ein

### 3. Chatbot testen
1. Gehe zur **Demo** Seite (`/demo`)
2. Teste die vordefinierten Chatbots
3. Sieh wie das Script funktioniert

## Script Integration

### Standard-Script
```html
<script src="/chatbot.js" data-chatbot-id="YOUR_CHATBOT_ID"></script>
```

### Beispiel HTML-Seite
```html
<!DOCTYPE html>
<html>
<head>
    <title>Meine Seite</title>
</head>
<body>
    <h1>Willkommen</h1>
    <p>Hier ist mein Chatbot:</p>
    
    <script src="/chatbot.js" data-chatbot-id="chatbot-1"></script>
</body>
</html>
```

## API-Endpoints

### GET `/api/chatbot/[id]`
Lädt Chatbot-Design-Daten anhand der ID.

**Response:**
```json
{
  "id": "chatbot-1",
  "name": "Modern Blue Chatbot",
  "design": {
    "colors": {
      "primary": "#3b82f6",
      "secondary": "#1e40af",
      "background": "#ffffff",
      "text": "#1f2937",
      "border": "#e5e7eb"
    },
    "size": {
      "width": "400px",
      "height": "600px"
    },
    "borderRadius": "12px",
    "position": "bottom-right",
    "fontFamily": "Inter, sans-serif",
    "shadow": "0 10px 25px rgba(0, 0, 0, 0.1)"
  }
}
```

## Projektstruktur

```
src/
├── app/
│   ├── api/chatbot/[id]/route.ts    # API-Endpoint
│   ├── demo/page.tsx                # Demo-Seite
│   ├── layout.tsx                   # Layout
│   └── page.tsx                     # Hauptseite
├── components/
│   ├── ui/                          # Shadcn Komponenten
│   ├── ChatbotDesigner.tsx          # Designer Komponente
│   └── SavedChatbots.tsx            # Gespeicherte Chatbots
├── data/
│   └── chatbot-designs.json         # Design-Daten (MVP)
├── types/
│   └── chatbot.ts                   # TypeScript Typen
└── lib/
    └── utils.ts                     # Utility Funktionen

public/
└── chatbot.js                       # Standard-Chatbot-Script
```

## Nächste Schritte (Produktion)

### 1. Datenbank Integration
- Appwrite-Datenbank einrichten
- API-Endpoints für CRUD-Operationen
- Authentifizierung hinzufügen

### 2. Erweiterte Features
- Chatbot-Templates
- Export/Import von Designs
- Erweiterte Chat-Funktionalität
- Analytics & Tracking

### 3. Deployment
- Vercel/Netlify Deployment
- CDN für Script-Distribution
- Performance-Optimierung

## Demo

Besuche `/demo` um die vordefinierten Chatbots zu testen:
- **chatbot-1**: Modern Blue Design
- **chatbot-2**: Dark Theme
- **chatbot-3**: Minimalist Design

## Lizenz

MIT License
