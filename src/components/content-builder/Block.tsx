'use client';

import React, { useState, useRef } from 'react';
import { BlockData, Field, ConnectionPoint } from '@/types/content-builder';
import { getBlockTemplate } from '@/data/block-templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Edit, X, Plus } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

interface BlockProps {
    block: BlockData;
    isSelected: boolean;
    onSelect: (blockId: string) => void;
    onUpdate: (blockId: string, updates: Partial<BlockData>) => void;
    onDelete: (blockId: string) => void;
    onConnectionStart: (blockId: string, portId: string) => void;
    onConnectionEnd: (blockId: string, portId: string) => void;
    isConnecting: boolean;
    connectingFrom?: { blockId: string; portId: string };
    allBlocks: BlockData[];
}

export function Block({
    block,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    onConnectionStart,
    onConnectionEnd,
    isConnecting,
    connectingFrom,
    allBlocks
}: BlockProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredConnector, setHoveredConnector] = useState<string | null>(null);
    const [showConnectors, setShowConnectors] = useState(false);
    const blockRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Make blocks draggable - but disable during connection mode
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: block.id,
        data: {
            type: 'block',
            block
        },
        disabled: isConnecting // Disable block drag when connecting
    });

    const template = getBlockTemplate(block.type);

    const style = {
        position: 'absolute' as const,
        left: block.position.x,
        top: block.position.y,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    // Generate connectors for all sides
    const generateConnectors = () => {
        const connectors: Array<{
            id: string;
            type: 'input' | 'output';
            side: string;
            position: { x: number; y: number };
        }> = [];

        if (!template?.connectionPoints) return connectors;

        // Get all input and output ports
        const inputPorts = template.connectionPoints.filter(port => port.type === 'input');
        const outputPorts = template.connectionPoints.filter(port => port.type === 'output');



        const sides = ['top', 'bottom', 'left', 'right'];

        sides.forEach(side => {
            // Create input connectors (green) if block can receive data
            if (inputPorts.length > 0) {
                connectors.push({
                    id: `input_${side}`,
                    type: 'input',
                    side,
                    position: getConnectorPosition(side, 'input')
                });
            }

            // Create output connectors (blue) if block can send data
            if (outputPorts.length > 0) {
                connectors.push({
                    id: `output_${side}`,
                    type: 'output',
                    side,
                    position: getConnectorPosition(side, 'output')
                });
            }
        });


        return connectors;


    };

    const getConnectorPosition = (side: string, type: 'input' | 'output') => {
        const blockWidth = block.type === 'output' ? 80 : 256;
        const blockHeight = block.type === 'output' ? 80 : 200;
        const offset = 16;
        const connectorSpacing = 12; // Abstand zwischen IN und OUT Connectors

        switch (side) {
            case 'top':
                if (type === 'input') {
                    return { x: blockWidth / 2 - connectorSpacing, y: -offset };
                } else {
                    return { x: blockWidth / 2 + connectorSpacing, y: -offset };
                }
            case 'bottom':
                if (type === 'input') {
                    return { x: blockWidth / 2 - connectorSpacing, y: blockHeight + offset };
                } else {
                    return { x: blockWidth / 2 + connectorSpacing, y: blockHeight + offset };
                }
            case 'left':
                if (type === 'input') {
                    return { x: -offset, y: blockHeight / 2 - connectorSpacing };
                } else {
                    return { x: -offset, y: blockHeight / 2 + connectorSpacing };
                }
            case 'right':
                if (type === 'input') {
                    return { x: blockWidth + offset, y: blockHeight / 2 - connectorSpacing };
                } else {
                    return { x: blockWidth + offset, y: blockHeight / 2 + connectorSpacing };
                }
            default:
                return { x: 0, y: 0 };
        }
    };

    const renderConnectors = () => {
        // Show connectors on hover with delay
        if (!showConnectors) return null;

        const connectors = generateConnectors();

        return connectors.map(connector => {
            // Filter connectors when connecting
            if (isConnecting && connectingFrom) {
                const connectingType = connectingFrom.portId.split('_')[0]; // 'input' or 'output'

                // If we're connecting from this block, don't show any connectors
                if (connectingFrom.blockId === block.id) {
                    return null;
                }

                // If connecting from OUTPUT, only show INPUT connectors
                if (connectingType === 'output' && connector.type !== 'input') {
                    return null;
                }

                // If connecting from INPUT, only show OUTPUT connectors
                if (connectingType === 'input' && connector.type !== 'output') {
                    return null;
                }
            }

            return (
                <div
                    key={connector.id}
                    className={`absolute w-4 h-4 rounded-full border-2 cursor-pointer transition-all hover:scale-125 z-10 ${connector.type === 'output' ? 'bg-blue-500 border-blue-500' : 'bg-green-500 border-green-500'
                        } hover:shadow-md ${isConnecting && connector.type === 'input' ? 'ring-2 ring-green-300 ring-opacity-50' : ''
                        }`}
                    style={{
                        left: connector.position.x - 8,
                        top: connector.position.y - 8,
                        opacity: hoveredConnector === connector.id ? 1 : 0.5,
                        transform: isConnecting && connector.type === 'input' ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%)'
                    }}
                    onMouseEnter={() => setHoveredConnector(connector.id)}
                    onMouseLeave={() => setHoveredConnector(null)}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (connector.type === 'output') {
                            onConnectionStart(block.id, connector.id);
                        }
                    }}
                    onMouseUp={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (connector.type === 'input' && isConnecting) {
                            onConnectionEnd(block.id, connector.id);
                        }
                    }}
                    title={`${connector.type === 'output' ? 'Output' : 'Input'} (${connector.side})`}
                />
            );
        }).filter(Boolean);
    };

    const handleFieldChange = (fieldId: string, value: string | number | boolean) => {
        const updatedFields = block.fields.map(field =>
            field.id === fieldId ? { ...field, value } : field
        );
        onUpdate(block.id, { fields: updatedFields });
    };

    const addField = () => {
        const newField: Field = {
            id: `field_${Date.now()}`,
            name: 'Neues Feld',
            type: 'text',
            value: ''
        };
        onUpdate(block.id, { fields: [...block.fields, newField] });
    };

    const removeField = (fieldId: string) => {
        const updatedFields = block.fields.filter(field => field.id !== fieldId);
        onUpdate(block.id, { fields: updatedFields });
    };

    const canConnect = (port: ConnectionPoint) => {
        if (!connectingFrom) return false;
        if (connectingFrom.blockId === block.id) return false;

        // Get the source block template
        const sourceBlock = allBlocks.find((b: BlockData) => b.id === connectingFrom.blockId);
        if (!sourceBlock) return false;

        const sourceTemplate = getBlockTemplate(sourceBlock.type);
        const targetTemplate = getBlockTemplate(block.type);

        if (!sourceTemplate || !targetTemplate) return false;

        // Check if the target port is compatible with the source block type
        return port.compatibleTypes.includes(sourceBlock.type);
    };

    const renderField = (field: Field) => {
        const isEditing = editingField === field.id;

        if (isEditing) {
            return (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                    <Input
                        value={field.name}
                        onChange={(e) => {
                            const updatedFields = block.fields.map(f =>
                                f.id === field.id ? { ...f, name: e.target.value } : f
                            );
                            onUpdate(block.id, { fields: updatedFields });
                        }}
                        className="flex-1"
                    />
                    <Select
                        value={field.type}
                        onValueChange={(value: any) => {
                            const updatedFields = block.fields.map(f =>
                                f.id === field.id ? { ...f, type: value } : f
                            );
                            onUpdate(block.id, { fields: updatedFields });
                        }}
                    >
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Zahl</SelectItem>
                            <SelectItem value="select">Auswahl</SelectItem>
                            <SelectItem value="boolean">Ja/Nein</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingField(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            );
        }

        return (
            <div key={field.id} className="flex items-center gap-2 mb-2">
                <Label className="text-xs font-medium min-w-0 flex-1">
                    {field.name}
                </Label>
                <div className="flex-1">
                    {field.type === 'text' && (
                        <Input
                            value={field.value as string}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="h-6 text-xs"
                            placeholder={field.name}
                        />
                    )}
                    {field.type === 'number' && (
                        <Input
                            type="number"
                            value={field.value as number}
                            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
                            className="h-6 text-xs"
                        />
                    )}
                    {field.type === 'select' && (
                        <Select
                            value={field.value as string}
                            onValueChange={(value) => handleFieldChange(field.id, value)}
                        >
                            <SelectTrigger className="h-6 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {field.type === 'boolean' && (
                        <Switch
                            checked={field.value as boolean}
                            onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                        />
                    )}
                </div>

                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField(field.id)}
                    className="h-6 w-6 p-0"
                >
                    <Edit className="h-3 w-3" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeField(field.id)}
                    className="h-6 w-6 p-0 text-red-500"
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        );
    };



    // Special rendering for output block
    if (block.type === 'output') {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                onMouseEnter={() => {
                    setIsHovered(true);
                    setShowConnectors(true);
                    // Clear any existing timeout
                    if (hideTimeoutRef.current) {
                        clearTimeout(hideTimeoutRef.current);
                    }
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setHoveredConnector(null);
                    // Delay hiding connectors
                    hideTimeoutRef.current = setTimeout(() => {
                        setShowConnectors(false);
                    }, 500); // 500ms delay
                }}
                onMouseDown={(e) => {
                    // Only select if not dragging
                    if (!transform) {
                        e.stopPropagation();
                        onSelect(block.id);
                    }
                }}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move"
                >
                    <Card className={`w-20 h-20 p-4 flex items-center justify-center relative ${isSelected ? 'shadow-lg' : 'shadow-md'}`}>
                        <span className="text-3xl">{template?.icon}</span>

                        {/* Output block content */}
                    </Card>
                </div>

                {/* Hover-based connectors for output block */}
                {renderConnectors()}
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onMouseEnter={() => {
                setIsHovered(true);
                setShowConnectors(true);
                // Clear any existing timeout
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current);
                }
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setHoveredConnector(null);
                // Delay hiding connectors
                hideTimeoutRef.current = setTimeout(() => {
                    setShowConnectors(false);
                }, 500); // 500ms delay
            }}
            onMouseDown={(e) => {
                // Only select if not dragging
                if (!transform) {
                    e.stopPropagation();
                    onSelect(block.id);
                }
            }}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-move"
            >
                <Card className={`w-64 p-3 ${isSelected ? 'shadow-lg' : 'shadow-md'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{template?.icon}</span>
                            <div className="flex-1">
                                {isEditing ? (
                                    <Input
                                        value={block.title}
                                        onChange={(e) => onUpdate(block.id, { title: e.target.value })}
                                        className="h-6 text-sm font-medium"
                                        onBlur={() => setIsEditing(false)}
                                        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                                        autoFocus
                                    />
                                ) : (
                                    <div
                                        className="text-sm font-medium cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        {block.title || template?.name}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsEditing(!isEditing)}
                                className="h-6 w-6 p-0"
                            >
                                <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDelete(block.id)}
                                className="h-6 w-6 p-0 text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {block.fields.map(renderField)}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={addField}
                            className="w-full h-6 text-xs"
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Feld hinzufügen
                        </Button>
                    </div>


                </Card>
            </div>

            {/* Hover-based connectors */}
            {renderConnectors()}
        </div>
    );
} 