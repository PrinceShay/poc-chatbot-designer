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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Link,
  Package,
  Calendar,
  DollarSign,
  Image,
  Palette,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import { saveContentItems, getContentItems } from "@/lib/appwrite";

// Block-Typen Definition
const BLOCK_TYPES = {
  PRODUCT: {
    id: "product",
    name: "Produkt",
    icon: Package,
    color: "bg-blue-500",
    fields: [
      { id: "title", label: "Titel", type: "text", required: true },
      { id: "description", label: "Beschreibung", type: "textarea" },
      { id: "category", label: "Kategorie", type: "text" },
      { id: "sku", label: "Artikelnummer", type: "text" },
    ],
  },
  VARIANT: {
    id: "variant",
    name: "Variante",
    icon: Palette,
    color: "bg-green-500",
    fields: [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "color", label: "Farbe", type: "text" },
      { id: "size", label: "Größe", type: "text" },
      { id: "material", label: "Material", type: "text" },
    ],
  },
  PRICE: {
    id: "price",
    name: "Preis",
    icon: DollarSign,
    color: "bg-yellow-500",
    fields: [
      { id: "amount", label: "Betrag", type: "number", required: true },
      {
        id: "currency",
        label: "Währung",
        type: "select",
        options: ["EUR", "USD", "CHF"],
      },
      {
        id: "type",
        label: "Typ",
        type: "select",
        options: ["Einmalig", "Monatlich", "Jährlich"],
      },
    ],
  },
  IMAGE: {
    id: "image",
    name: "Bild",
    icon: Image,
    color: "bg-purple-500",
    fields: [
      { id: "url", label: "Bild-URL", type: "text", required: true },
      { id: "alt", label: "Alt-Text", type: "text" },
      { id: "caption", label: "Beschriftung", type: "text" },
    ],
  },
  APPOINTMENT: {
    id: "appointment",
    name: "Termin",
    icon: Calendar,
    color: "bg-orange-500",
    fields: [
      { id: "title", label: "Titel", type: "text", required: true },
      { id: "description", label: "Beschreibung", type: "textarea" },
      { id: "duration", label: "Dauer (Minuten)", type: "number" },
    ],
  },
  LOCATION: {
    id: "location",
    name: "Ort",
    icon: MapPin,
    color: "bg-red-500",
    fields: [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "address", label: "Adresse", type: "textarea" },
      { id: "city", label: "Stadt", type: "text" },
      { id: "zip", label: "PLZ", type: "text" },
    ],
  },
  CONTACT: {
    id: "contact",
    name: "Kontakt",
    icon: User,
    color: "bg-indigo-500",
    fields: [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "email", label: "E-Mail", type: "email" },
      { id: "phone", label: "Telefon", type: "tel" },
    ],
  },
  TIME: {
    id: "time",
    name: "Zeit",
    icon: Clock,
    color: "bg-teal-500",
    fields: [
      { id: "date", label: "Datum", type: "date", required: true },
      { id: "time", label: "Uhrzeit", type: "time" },
      { id: "timezone", label: "Zeitzone", type: "text" },
    ],
  },
};

interface Block {
  id: string;
  type: string;
  data: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface Connection {
  id: string;
  from: string;
  to: string;
  type: string;
}

export default function ContentBuilderPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Lade gespeicherte Daten beim Start
  useEffect(() => {
    loadContentItems();
  }, []);

  const loadContentItems = async () => {
    try {
      const items = await getContentItems();
      if (items && items.length > 0) {
        // Konvertiere gespeicherte Items zu Blocks
        const loadedBlocks = items.map((item: any) => ({
          id: item.id,
          type: item.type,
          data: item.data || {},
          position: item.position || { x: 100, y: 100 },
          connections: item.connections || [],
        }));
        setBlocks(loadedBlocks);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Content Items:", error);
    }
  };

  const saveContentItemsToAppwrite = async () => {
    try {
      const items = blocks.map((block) => ({
        id: block.id,
        type: block.type,
        data: block.data,
        position: block.position,
        connections: block.connections,
      }));

      await saveContentItems(items);
      alert("Content erfolgreich gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern!");
    }
  };

  const addBlock = (type: string) => {
    const blockType = BLOCK_TYPES[type as keyof typeof BLOCK_TYPES];
    if (!blockType) return;

    const newBlock: Block = {
      id: `${type}-${Date.now()}`,
      type,
      data: {},
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      connections: [],
    };

    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlock(newBlock);
  };

  const updateBlockData = (blockId: string, field: string, value: any) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, data: { ...block.data, [field]: value } }
          : block
      )
    );
  };

  const deleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
    setConnections((prev) =>
      prev.filter((conn) => conn.from !== blockId && conn.to !== blockId)
    );
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const startConnection = (blockId: string) => {
    setDraggedBlock(blockId);
    setIsDragging(true);
  };

  const createConnection = (fromBlockId: string, toBlockId: string) => {
    if (fromBlockId === toBlockId) return;

    const connectionId = `conn-${Date.now()}`;
    const newConnection: Connection = {
      id: connectionId,
      from: fromBlockId,
      to: toBlockId,
      type: "default",
    };

    setConnections((prev) => [...prev, newConnection]);

    // Update block connections
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === fromBlockId) {
          return {
            ...block,
            connections: [...block.connections, connectionId],
          };
        }
        if (block.id === toBlockId) {
          return {
            ...block,
            connections: [...block.connections, connectionId],
          };
        }
        return block;
      })
    );
  };

  const renderBlock = (block: Block) => {
    const blockType = BLOCK_TYPES[block.type as keyof typeof BLOCK_TYPES];
    if (!blockType) return null;

    const Icon = blockType.icon;
    const isSelected = selectedBlock?.id === block.id;

    return (
      <div
        key={block.id}
        className={`absolute cursor-move p-4 rounded-lg border-2 shadow-lg min-w-[200px] ${
          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        style={{
          left: block.position.x,
          top: block.position.y,
          transform: "translate(-50%, -50%)",
        }}
        onClick={() => setSelectedBlock(block)}
        onMouseDown={(e) => {
          if (e.button === 0) {
            // Left click
            const rect = e.currentTarget.getBoundingClientRect();
            setDragOffset({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded ${blockType.color}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-sm">{blockType.name}</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                startConnection(block.id);
              }}
              className="h-6 w-6 p-0"
            >
              <Link className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
              className="h-6 w-6 p-0 text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {blockType.fields.map((field) => (
            <div key={field.id}>
              <Label className="text-xs font-medium">{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  value={block.data[field.id] || ""}
                  onChange={(e) =>
                    updateBlockData(block.id, field.id, e.target.value)
                  }
                  placeholder={field.label}
                  className="text-xs h-16"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : field.type === "select" ? (
                <Select
                  value={block.data[field.id] || ""}
                  onValueChange={(value) =>
                    updateBlockData(block.id, field.id, value)
                  }
                >
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue placeholder={field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {(field as any).options?.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  value={block.data[field.id] || ""}
                  onChange={(e) =>
                    updateBlockData(block.id, field.id, e.target.value)
                  }
                  placeholder={field.label}
                  className="text-xs h-8"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Content Builder
        </h1>
        <p className="text-gray-600">
          Erstelle deine Datenbank mit Drag & Drop Blöcken
        </p>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar mit Block-Typen */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Block-Typen</h3>
            <div className="space-y-2">
              {Object.entries(BLOCK_TYPES).map(([key, blockType]) => {
                const Icon = blockType.icon;
                return (
                  <Button
                    key={key}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => addBlock(key)}
                  >
                    <div className={`p-2 rounded mr-3 ${blockType.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{blockType.name}</div>
                      <div className="text-xs text-gray-500">
                        {blockType.fields.length} Felder
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={saveContentItemsToAppwrite} className="w-full">
              Speichern
            </Button>

            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Anleitung:</p>
              <ul className="space-y-1 text-xs">
                <li>• Ziehe Blöcke auf die Arbeitsfläche</li>
                <li>• Verbinde Blöcke mit dem Link-Button</li>
                <li>• Fülle die Felder aus</li>
                <li>• Speichere deine Konfiguration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hauptarbeitsbereich */}
        <div className="flex-1 relative bg-gray-50 overflow-hidden">
          <div className="absolute inset-0">
            {/* Grid-Hintergrund */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Blöcke */}
            {blocks.map(renderBlock)}

            {/* Verbindungen */}
            <svg className="absolute inset-0 pointer-events-none">
              {connections.map((connection) => {
                const fromBlock = blocks.find((b) => b.id === connection.from);
                const toBlock = blocks.find((b) => b.id === connection.to);

                if (!fromBlock || !toBlock) return null;

                const fromX = fromBlock.position.x;
                const fromY = fromBlock.position.y;
                const toX = toBlock.position.x;
                const toY = toBlock.position.y;

                return (
                  <line
                    key={connection.id}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
            </svg>

            {/* Pfeil-Marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedBlock && (
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Eigenschaften</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBlock(null)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Block-Typ</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`p-2 rounded ${
                      BLOCK_TYPES[
                        selectedBlock.type as keyof typeof BLOCK_TYPES
                      ]?.color
                    }`}
                  >
                    {(() => {
                      const blockType =
                        BLOCK_TYPES[
                          selectedBlock.type as keyof typeof BLOCK_TYPES
                        ];
                      if (blockType?.icon) {
                        const Icon = blockType.icon;
                        return <Icon className="h-4 w-4 text-white" />;
                      }
                      return null;
                    })()}
                  </div>
                  <span className="font-medium">
                    {
                      BLOCK_TYPES[
                        selectedBlock.type as keyof typeof BLOCK_TYPES
                      ]?.name
                    }
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Verbindungen</Label>
                <div className="mt-1 space-y-1">
                  {selectedBlock.connections.length === 0 ? (
                    <p className="text-sm text-gray-500">Keine Verbindungen</p>
                  ) : (
                    selectedBlock.connections.map((connId) => {
                      const connection = connections.find(
                        (c) => c.id === connId
                      );
                      if (!connection) return null;

                      const connectedBlock = blocks.find(
                        (b) =>
                          b.id ===
                          (connection.from === selectedBlock.id
                            ? connection.to
                            : connection.from)
                      );

                      return (
                        <div
                          key={connId}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Link className="h-3 w-3 text-blue-500" />
                          <span>
                            {connectedBlock?.data.title ||
                              connectedBlock?.data.name ||
                              connectedBlock?.type}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Position</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    type="number"
                    value={Math.round(selectedBlock.position.x)}
                    onChange={(e) => {
                      const newBlocks = blocks.map((b) =>
                        b.id === selectedBlock.id
                          ? {
                              ...b,
                              position: {
                                ...b.position,
                                x: parseInt(e.target.value) || 0,
                              },
                            }
                          : b
                      );
                      setBlocks(newBlocks);
                    }}
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    value={Math.round(selectedBlock.position.y)}
                    onChange={(e) => {
                      const newBlocks = blocks.map((b) =>
                        b.id === selectedBlock.id
                          ? {
                              ...b,
                              position: {
                                ...b.position,
                                y: parseInt(e.target.value) || 0,
                              },
                            }
                          : b
                      );
                      setBlocks(newBlocks);
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
