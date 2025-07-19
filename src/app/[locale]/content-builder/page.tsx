"use client";

import { useState, useEffect, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Brain,
  ShoppingCart,
  MessageSquare,
  Settings,
} from "lucide-react";
import { saveContentItems, getContentItems } from "@/lib/appwrite";

// GSAP Import mit Error Handling
let useGSAP: any = null;
let Draggable: any = null;

try {
  const gsapReact = require("@gsap/react");
  const gsap = require("gsap");
  const gsapDraggable = require("gsap/Draggable");

  useGSAP = gsapReact.useGSAP;
  Draggable = gsapDraggable.Draggable;

  // GSAP Plugins registrieren
  if (typeof window !== "undefined") {
    gsap.registerPlugin(Draggable);
  }
} catch (error) {
  console.warn("GSAP konnte nicht geladen werden:", error);
}

// Block-Typen Definition mit Gruppierung
const BLOCK_GROUPS = [
  {
    name: "E-Commerce",
    icon: ShoppingCart,
    color: "bg-blue-500",
    blocks: [
      {
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
      {
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
      {
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
      {
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
    ],
  },
  {
    name: "Termine",
    icon: Calendar,
    color: "bg-orange-500",
    blocks: [
      {
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
      {
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
      {
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
      {
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
    ],
  },
];

// Zentrales Eingangsobjekt
const CENTRAL_OBJECT = {
  id: "central",
  name: "Chat Brain",
  icon: Brain,
  color: "bg-gray-600",
  description: "Zentraler Verbindungspunkt für alle Daten",
};

interface Block {
  id: string;
  type: string;
  group: string;
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggableRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // GSAP Draggable initialisieren - nur wenn GSAP verfügbar ist
  if (useGSAP && Draggable) {
    useGSAP(
      () => {
        if (blocks.length > 0 && canvasRef.current) {
          // Neue Draggables erstellen - GSAP kümmert sich automatisch um Cleanup
          blocks.forEach((block) => {
            const element = draggableRefs.current.get(block.id);
            if (element) {
              try {
                Draggable.create(element, {
                  type: "x,y",
                  bounds: canvasRef.current,
                  onDrag: function () {
                    const x = this.x;
                    const y = this.y;

                    setBlocks((prev) =>
                      prev.map((b) =>
                        b.id === block.id ? { ...b, position: { x, y } } : b
                      )
                    );
                  },
                  onDragEnd: function () {
                    // Optional: Speichern nach Drag
                  },
                });
              } catch (error) {
                console.warn("Fehler beim Erstellen des Draggable:", error);
              }
            }
          });
        }
      },
      { dependencies: [blocks.length], scope: canvasRef }
    );
  }

  // Lade gespeicherte Daten beim Start
  useEffect(() => {
    loadContentItems();
    // Füge zentrales Objekt hinzu, falls es nicht existiert
    if (!blocks.find((b) => b.id === "central")) {
      setBlocks((prev) => [
        ...prev,
        {
          id: "central",
          type: "central",
          group: "central",
          data: {},
          position: { x: 400, y: 300 },
          connections: [],
        },
      ]);
    }
  }, []);

  const loadContentItems = async () => {
    try {
      const items = await getContentItems();
      if (items && items.length > 0) {
        const loadedBlocks = items.map((item: any) => ({
          id: item.id,
          type: item.type,
          group: item.group || "e-commerce",
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
        group: block.group,
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

  const addBlock = (groupName: string, blockType: string) => {
    const group = BLOCK_GROUPS.find((g) => g.name === groupName);
    const blockConfig = group?.blocks.find((b) => b.id === blockType);

    if (!blockConfig) return;

    const newBlock: Block = {
      id: `${blockType}-${Date.now()}`,
      type: blockType,
      group: groupName,
      data: {},
      position: { x: 200 + Math.random() * 400, y: 200 + Math.random() * 400 },
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
    if (blockId === "central") return; // Zentrales Objekt kann nicht gelöscht werden

    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
    setConnections((prev) =>
      prev.filter((conn) => conn.from !== blockId && conn.to !== blockId)
    );
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
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
    const isCentral = block.id === "central";
    const isSelected = selectedBlock?.id === block.id;

    if (isCentral) {
      const Icon = CENTRAL_OBJECT.icon;
      return (
        <div
          key={block.id}
          ref={(el) => {
            if (el) draggableRefs.current.set(block.id, el);
          }}
          className={`absolute cursor-move p-6 rounded-lg border-2 shadow-lg ${
            isSelected
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }`}
          style={{
            left: block.position.x,
            top: block.position.y,
            transform: "translate(-50%, -50%)",
            minWidth: "200px",
          }}
          onClick={() => setSelectedBlock(block)}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 rounded ${CENTRAL_OBJECT.color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{CENTRAL_OBJECT.name}</div>
              <div className="text-sm text-gray-600">
                {CENTRAL_OBJECT.description}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                // Hier könnte man Verbindungen zum zentralen Objekt erstellen
              }}
            >
              <Link className="h-4 w-4 mr-2" />
              Verbinden
            </Button>
          </div>
        </div>
      );
    }

    // Normale Blöcke
    const group = BLOCK_GROUPS.find((g) => g.name === block.group);
    const blockConfig = group?.blocks.find((b) => b.id === block.type);

    if (!blockConfig) return null;

    const Icon = blockConfig.icon;

    return (
      <div
        key={block.id}
        ref={(el) => {
          if (el) draggableRefs.current.set(block.id, el);
        }}
        className={`absolute cursor-move p-4 rounded-lg border-2 shadow-lg min-w-[200px] ${
          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        style={{
          left: block.position.x,
          top: block.position.y,
          transform: "translate(-50%, -50%)",
        }}
        onClick={() => setSelectedBlock(block)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded ${blockConfig.color}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-sm">{blockConfig.name}</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                createConnection(block.id, "central");
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
          {blockConfig.fields.map((field) => (
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
        {/* Sidebar mit Block-Gruppen */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Block-Gruppen</h3>
            <div className="space-y-6">
              {BLOCK_GROUPS.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.name} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded ${group.color}`}>
                        <GroupIcon className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-medium text-gray-900">
                        {group.name}
                      </h4>
                    </div>
                    <div className="space-y-2 pl-4">
                      {group.blocks.map((blockConfig) => {
                        const Icon = blockConfig.icon;
                        return (
                          <Button
                            key={blockConfig.id}
                            variant="outline"
                            className="w-full justify-start h-auto p-3"
                            onClick={() => addBlock(group.name, blockConfig.id)}
                          >
                            <div
                              className={`p-2 rounded mr-3 ${blockConfig.color}`}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">
                                {blockConfig.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {blockConfig.fields.length} Felder
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
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
                <li>• Wähle eine Block-Gruppe</li>
                <li>• Klicke auf Blöcke zum Hinzufügen</li>
                <li>• Ziehe Blöcke mit der Maus</li>
                <li>• Verbinde mit dem Link-Button</li>
                <li>• Alle Blöcke verbinden mit dem Chat Brain</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hauptarbeitsbereich */}
        <div
          ref={canvasRef}
          className="flex-1 relative bg-gray-50 overflow-hidden"
        >
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
                  {selectedBlock.id === "central" ? (
                    <>
                      <div className={`p-2 rounded ${CENTRAL_OBJECT.color}`}>
                        <CENTRAL_OBJECT.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{CENTRAL_OBJECT.name}</span>
                    </>
                  ) : (
                    (() => {
                      const group = BLOCK_GROUPS.find(
                        (g) => g.name === selectedBlock.group
                      );
                      const blockConfig = group?.blocks.find(
                        (b) => b.id === selectedBlock.type
                      );
                      if (blockConfig) {
                        const Icon = blockConfig.icon;
                        return (
                          <>
                            <div className={`p-2 rounded ${blockConfig.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium">
                              {blockConfig.name}
                            </span>
                          </>
                        );
                      }
                      return null;
                    })()
                  )}
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
                            {connectedBlock?.id === "central"
                              ? "Chat Brain"
                              : connectedBlock?.data.title ||
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
