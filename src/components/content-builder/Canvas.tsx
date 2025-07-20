'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
    DragOverlay,
    useDroppable
} from '@dnd-kit/core';
import { Block } from './Block';
import { Connection } from './Connection';
import { BlockSidebar } from './BlockSidebar';
import { BlockData, Connection as ConnectionType, Position, CanvasState, BlockType } from '@/types/content-builder';
import { getBlockTemplate } from '@/data/block-templates';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Save, Download } from 'lucide-react';

interface CanvasProps {
    state: CanvasState;
    onStateChange: (state: CanvasState) => void;
}

function DroppableCanvas({
    children,
    isDraggingOver,
    onMouseDown,
    onClick,
    onMouseMove,
    onWheel,
    style,
    className
}: {
    children: React.ReactNode;
    isDraggingOver: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onWheel: (e: React.WheelEvent) => void;
    style: React.CSSProperties;
    className: string;
}) {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });

    return (
        <div
            ref={setNodeRef}
            className={className}
            onMouseDown={onMouseDown}
            onClick={onClick}
            onMouseMove={onMouseMove}
            onWheel={onWheel}
            style={style}
        >
            {children}
        </div>
    );
}

export function Canvas({ state, onStateChange }: CanvasProps) {
    const [draggedBlock, setDraggedBlock] = useState<BlockData | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);
    const isPanning = useRef(false);
    const lastPanPoint = useRef<Position>({ x: 0, y: 0 });
    const [isDraggingConnection, setIsDraggingConnection] = useState(false);

    // Connection state is now in CanvasState
    const isConnecting = !!state.connectingFrom;
    const connectingFrom = state.connectingFrom;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        console.log('DragStart:', {
            activeId: active.id,
            activeType: active.data.current?.type
        });

        if (active.data.current?.type === 'block-template') {
            const template = active.data.current.template;
            const newBlock: BlockData = {
                id: `block_${Date.now()}`,
                type: template.type,
                position: { x: 100, y: 100 }, // Will be updated on drop
                title: template.name,
                fields: [...template.defaultFields],
                connections: [],
                group: template.group
            };
            console.log('Created dragged block:', newBlock);
            setDraggedBlock(newBlock);
        } else if (active.data.current?.type === 'block') {
            // Block is being dragged on canvas
            console.log('Block drag started:', active.data.current.block);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        console.log('DragOver:', {
            activeId: active.id,
            overId: over?.id,
            overData: over?.data
        });

        if (active.data.current?.type === 'block-template' && over?.id === 'canvas') {
            setIsDraggingOver(true);

            // Update block position based on mouse position
            if (draggedBlock && canvasRef.current && event.activatorEvent instanceof MouseEvent) {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = (event.activatorEvent.clientX - rect.left - state.pan.x) / state.zoom;
                const y = (event.activatorEvent.clientY - rect.top - state.pan.y) / state.zoom;

                setDraggedBlock({
                    ...draggedBlock,
                    position: { x: Math.max(0, x), y: Math.max(0, y) }
                });
            }
        } else {
            setIsDraggingOver(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        console.log('DragEnd:', {
            activeType: active.data.current?.type,
            overId: over?.id,
            hasDraggedBlock: !!draggedBlock
        });

        if (active.data.current?.type === 'block-template' && over?.id === 'canvas' && draggedBlock) {
            console.log('Adding block to canvas:', draggedBlock);

            // Calculate correct position based on mouse position
            let finalPosition = draggedBlock.position;
            if (canvasRef.current && event.activatorEvent instanceof MouseEvent) {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = (event.activatorEvent.clientX - rect.left - state.pan.x) / state.zoom;
                const y = (event.activatorEvent.clientY - rect.top - state.pan.y) / state.zoom;
                // Center the block on the mouse position
                finalPosition = {
                    x: Math.max(0, x - 128), // Half of block width (256px)
                    y: Math.max(0, y - 50)   // Half of block height (100px)
                };
            }

            // Add the new block to the canvas with correct position
            const newBlock = { ...draggedBlock, position: finalPosition };
            const newState = {
                ...state,
                blocks: [...state.blocks, newBlock]
            };
            onStateChange(newState);
        } else if (active.data.current?.type === 'block' && over?.id === 'canvas') {
            // Block was moved on canvas
            const block = active.data.current.block;
            const delta = event.delta;

            const updatedBlocks = state.blocks.map(b =>
                b.id === block.id
                    ? {
                        ...b, position: {
                            x: b.position.x + delta.x / state.zoom,
                            y: b.position.y + delta.y / state.zoom
                        }
                    }
                    : b
            );

            onStateChange({
                ...state,
                blocks: updatedBlocks
            });
        }

        setDraggedBlock(null);
        setIsDraggingOver(false);
    };

    const handleBlockSelect = (blockId: string) => {
        onStateChange({
            ...state,
            selectedBlockId: blockId,
            selectedConnectionId: null
        });
    };

    const handleBlockUpdate = (blockId: string, updates: Partial<BlockData>) => {
        const updatedBlocks = state.blocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
        );
        onStateChange({
            ...state,
            blocks: updatedBlocks
        });
    };

    const handleBlockDelete = (blockId: string) => {
        const updatedBlocks = state.blocks.filter(block => block.id !== blockId);
        const updatedConnections = state.connections.filter(
            conn => conn.sourceBlockId !== blockId && conn.targetBlockId !== blockId
        );
        onStateChange({
            ...state,
            blocks: updatedBlocks,
            connections: updatedConnections,
            selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId
        });
    };

    const handleConnectionStart = (blockId: string, portId: string) => {
        // Get the port position for preview
        const block = state.blocks.find(b => b.id === blockId);
        if (!block) return;

        // Parse connector ID to get type and side
        const parts = portId.split('_');
        if (parts.length < 2) return;

        const type = parts[0] as 'input' | 'output';
        const side = parts[1];

        // Only allow starting connections from output ports
        if (type !== 'output') return;

        // Calculate port position based on side
        const blockWidth = block.type === 'output' ? 80 : 256;
        const blockHeight = block.type === 'output' ? 80 : 200;
        const offset = 16;
        let portPosition: Position;

        switch (side) {
            case 'top':
                portPosition = { x: block.position.x + blockWidth / 2, y: block.position.y - offset };
                break;
            case 'bottom':
                portPosition = { x: block.position.x + blockWidth / 2, y: block.position.y + blockHeight + offset };
                break;
            case 'left':
                portPosition = { x: block.position.x - offset, y: block.position.y + blockHeight / 2 };
                break;
            case 'right':
                portPosition = { x: block.position.x + blockWidth + offset, y: block.position.y + blockHeight / 2 };
                break;
            default:
                portPosition = { x: block.position.x + blockWidth / 2, y: block.position.y + blockHeight / 2 };
        }

        setIsDraggingConnection(true);

        onStateChange({
            ...state,
            connectingFrom: {
                blockId,
                portId,
                mousePosition: portPosition
            }
        });
    };

    const handleConnectionEnd = (blockId: string, portId: string) => {
        if (connectingFrom && connectingFrom.blockId !== blockId) {
            // Parse connector IDs
            const sourceParts = connectingFrom.portId.split('_');
            const targetParts = portId.split('_');

            if (sourceParts.length < 2 || targetParts.length < 2) {
                onStateChange({ ...state, connectingFrom: undefined });
                return;
            }

            const sourceType = sourceParts[0];
            const targetType = targetParts[0];

            // Check if it's a valid connection (output to input)
            if (sourceType === 'output' && targetType === 'input') {
                const sourceBlock = state.blocks.find(b => b.id === connectingFrom.blockId);
                const targetBlock = state.blocks.find(b => b.id === blockId);

                if (sourceBlock && targetBlock) {
                    // For now, allow all output to input connections
                    const newConnection: ConnectionType = {
                        id: `connection_${Date.now()}`,
                        sourceBlockId: connectingFrom.blockId,
                        targetBlockId: blockId,
                        sourcePort: connectingFrom.portId,
                        targetPort: portId
                    };

                    onStateChange({
                        ...state,
                        connections: [...state.connections, newConnection],
                        connectingFrom: undefined
                    });

                    setIsDraggingConnection(false);

                    // Give feedback to user
                    alert(`✅ Verbindung erstellt!\n${sourceBlock.title || sourceBlock.type} → ${targetBlock.title || targetBlock.type}`);

                    console.log('Connection created:', newConnection);
                    return;
                }
            }
        }

        // Cancel connection if not valid
        setIsDraggingConnection(false);
        onStateChange({
            ...state,
            connectingFrom: undefined
        });
    };

    const handleConnectionSelect = (connectionId: string) => {
        onStateChange({
            ...state,
            selectedConnectionId: connectionId,
            selectedBlockId: null
        });
    };

    const handleConnectionDelete = (connectionId: string) => {
        const updatedConnections = state.connections.filter(conn => conn.id !== connectionId);
        onStateChange({
            ...state,
            connections: updatedConnections,
            selectedConnectionId: state.selectedConnectionId === connectionId ? null : state.selectedConnectionId
        });
    };

    const handleZoom = (delta: number) => {
        const newZoom = Math.max(0.1, Math.min(3, state.zoom + delta));
        onStateChange({
            ...state,
            zoom: newZoom
        });
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            handleZoom(delta);
            return;
        }

        // Also handle regular wheel for zoom without modifier
        if (e.deltaY !== 0) {
            e.preventDefault();
            e.stopPropagation();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            handleZoom(delta);
        }
    };

    const handlePanStart = (e: React.MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle click or Alt+Left click
            isPanning.current = true;
            lastPanPoint.current = { x: e.clientX, y: e.clientY };
            e.preventDefault();
        }
    };

    const handlePanMove = useCallback((e: MouseEvent) => {
        if (isPanning.current) {
            const deltaX = e.clientX - lastPanPoint.current.x;
            const deltaY = e.clientY - lastPanPoint.current.y;

            onStateChange({
                ...state,
                pan: {
                    x: state.pan.x + deltaX,
                    y: state.pan.y + deltaY
                }
            });

            lastPanPoint.current = { x: e.clientX, y: e.clientY };
        }
    }, [state, onStateChange]);

    const handlePanEnd = () => {
        isPanning.current = false;
    };

    React.useEffect(() => {
        document.addEventListener('mousemove', handlePanMove);
        document.addEventListener('mouseup', handlePanEnd);

        return () => {
            document.removeEventListener('mousemove', handlePanMove);
            document.removeEventListener('mouseup', handlePanEnd);
        };
    }, [handlePanMove]);

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Only deselect if clicking directly on canvas, not on blocks
        if (e.target === e.currentTarget) {
            onStateChange({
                ...state,
                selectedBlockId: null,
                selectedConnectionId: null,
                connectingFrom: undefined // Cancel connection on canvas click
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isConnecting && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - state.pan.x) / state.zoom;
            const y = (e.clientY - rect.top - state.pan.y) / state.zoom;
            setMousePosition({ x, y });

            // Update the connectingFrom mouse position for live preview
            if (state.connectingFrom) {
                onStateChange({
                    ...state,
                    connectingFrom: {
                        ...state.connectingFrom,
                        mousePosition: { x, y }
                    }
                });
            }
        }
    };

    const handleReset = () => {
        onStateChange({
            ...state,
            pan: { x: 0, y: 0 },
            zoom: 1
        });
    };

    const handleSave = () => {
        // Save to localStorage for now
        localStorage.setItem('content-builder-state', JSON.stringify(state));
        alert('Canvas gespeichert!');
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(state, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'content-builder-export.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-screen">
                <BlockSidebar />

                <div className="flex-1 flex flex-col">
                    {/* Toolbar */}
                    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleZoom(0.1)}
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleZoom(-0.1)}
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-gray-600 ml-2">
                                {Math.round(state.zoom * 100)}%
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleReset}
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleSave}
                            >
                                <Save className="h-4 w-4 mr-1" />
                                Speichern
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleExport}
                            >
                                <Download className="h-4 w-4 mr-1" />
                                Exportieren
                            </Button>
                        </div>
                    </div>

                    {/* Canvas */}
                    <DroppableCanvas
                        isDraggingOver={isDraggingOver}
                        onMouseDown={handlePanStart}
                        onClick={handleCanvasClick}
                        onMouseMove={handleMouseMove}
                        onWheel={handleWheel}
                        className={`flex-1 bg-gray-50 relative overflow-hidden cursor-grab active:cursor-grabbing ${isDraggingOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                            }`}
                        style={{
                            backgroundImage: `
                radial-gradient(circle, #e5e7eb 1px, transparent 1px)
              `,
                            backgroundSize: `${20 * state.zoom}px ${20 * state.zoom}px`,
                            touchAction: 'none'
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`,
                                transformOrigin: '0 0'
                            }}
                        >
                            {/* Connections */}
                            <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                                {state.connections.map(connection => {
                                    const sourceBlock = state.blocks.find(b => b.id === connection.sourceBlockId);
                                    const targetBlock = state.blocks.find(b => b.id === connection.targetBlockId);

                                    if (!sourceBlock || !targetBlock) return null;

                                    return (
                                        <Connection
                                            key={connection.id}
                                            connection={connection}
                                            sourceBlock={sourceBlock}
                                            targetBlock={targetBlock}
                                            isSelected={state.selectedConnectionId === connection.id}
                                            onSelect={handleConnectionSelect}
                                            onDelete={handleConnectionDelete}
                                        />
                                    );
                                })}

                                {/* Live connection preview */}
                                {isConnecting && connectingFrom && (
                                    <Connection
                                        connection={{
                                            id: 'preview',
                                            sourceBlockId: connectingFrom.blockId,
                                            targetBlockId: 'preview',
                                            sourcePort: connectingFrom.portId,
                                            targetPort: 'preview'
                                        }}
                                        sourceBlock={state.blocks.find(b => b.id === connectingFrom.blockId)!}
                                        targetBlock={{ id: 'preview', position: mousePosition } as BlockData}
                                        isSelected={false}
                                        onSelect={() => { }}
                                        onDelete={() => { }}
                                        preview={{
                                            from: connectingFrom.mousePosition,
                                            to: mousePosition
                                        }}
                                    />
                                )}
                            </svg>

                            {/* Blocks */}
                            {state.blocks.map(block => (
                                <Block
                                    key={block.id}
                                    block={block}
                                    isSelected={state.selectedBlockId === block.id}
                                    onSelect={handleBlockSelect}
                                    onUpdate={handleBlockUpdate}
                                    onDelete={handleBlockDelete}
                                    onConnectionStart={handleConnectionStart}
                                    onConnectionEnd={handleConnectionEnd}
                                    isConnecting={isConnecting}
                                    connectingFrom={connectingFrom || undefined}
                                    allBlocks={state.blocks}
                                />
                            ))}
                        </div>
                    </DroppableCanvas>

                    <DragOverlay>
                        {draggedBlock && (
                            <div className="opacity-50">
                                <Block
                                    block={draggedBlock}
                                    isSelected={false}
                                    onSelect={() => { }}
                                    onUpdate={() => { }}
                                    onDelete={() => { }}
                                    onConnectionStart={() => { }}
                                    onConnectionEnd={() => { }}
                                    isConnecting={false}
                                    allBlocks={state.blocks}
                                />
                            </div>
                        )}
                    </DragOverlay>
                </div>
            </div>
        </DndContext>
    );
} 