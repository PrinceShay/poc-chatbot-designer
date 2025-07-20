'use client';

import React from 'react';
import { Connection as ConnectionType, BlockData, Position } from '@/types/content-builder';

interface ConnectionProps {
    connection: ConnectionType;
    sourceBlock: BlockData;
    targetBlock: BlockData;
    isSelected: boolean;
    onSelect: (connectionId: string) => void;
    onDelete: (connectionId: string) => void;
    preview?: {
        from: Position;
        to: Position;
    };
}

export function Connection({
    connection,
    sourceBlock,
    targetBlock,
    isSelected,
    onSelect,
    onDelete,
    preview
}: ConnectionProps) {
    const getConnectionPath = (from: Position, to: Position) => {
        // Simple straight line for now
        return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    };

    const getPortPosition = (block: BlockData, portId: string): Position => {
        const blockWidth = block.type === 'output' ? 80 : 256;
        const blockHeight = block.type === 'output' ? 80 : 200;
        const offset = 16;

        const baseX = block.position.x;
        const baseY = block.position.y;

        // Parse connector ID to get type and side
        const parts = portId.split('_');
        if (parts.length >= 2) {
            const type = parts[0] as 'input' | 'output';
            const side = parts[1];



            const connectorSpacing = 12; // Abstand zwischen IN und OUT Connectors

            switch (side) {
                case 'top':
                    if (type === 'input') {
                        return { x: baseX + blockWidth / 2 - connectorSpacing, y: baseY - offset };
                    } else {
                        return { x: baseX + blockWidth / 2 + connectorSpacing, y: baseY - offset };
                    }
                case 'bottom':
                    if (type === 'input') {
                        return { x: baseX + blockWidth / 2 - connectorSpacing, y: baseY + blockHeight + offset };
                    } else {
                        return { x: baseX + blockWidth / 2 + connectorSpacing, y: baseY + blockHeight + offset };
                    }
                case 'left':
                    if (type === 'input') {
                        return { x: baseX - offset, y: baseY + blockHeight / 2 - connectorSpacing };
                    } else {
                        return { x: baseX - offset, y: baseY + blockHeight / 2 + connectorSpacing };
                    }
                case 'right':
                    if (type === 'input') {
                        return { x: baseX + blockWidth + offset, y: baseY + blockHeight / 2 - connectorSpacing };
                    } else {
                        return { x: baseX + blockWidth + offset, y: baseY + blockHeight / 2 + connectorSpacing };
                    }
                default:
                    return { x: baseX + blockWidth / 2, y: baseY + blockHeight / 2 };
            }
        }

        // Fallback
        return { x: baseX + blockWidth / 2, y: baseY + blockHeight / 2 };
    };

    const fromPos = getPortPosition(sourceBlock, connection.sourcePort);
    const toPos = getPortPosition(targetBlock, connection.targetPort);



    const path = preview
        ? getConnectionPath(preview.from, preview.to)
        : getConnectionPath(fromPos, toPos);

    return (
        <g>
            {/* Connection line */}
            <path
                d={path}
                stroke={isSelected ? '#3B82F6' : '#6B7280'}
                strokeWidth={isSelected ? 3 : 2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer hover:stroke-blue-500 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(connection.id);
                }}
            />

            {/* Connection points */}
            <circle
                cx={fromPos.x}
                cy={fromPos.y}
                r={4}
                fill={isSelected ? '#3B82F6' : '#6B7280'}
                className="cursor-pointer hover:fill-blue-500 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(connection.id);
                }}
            />
            <circle
                cx={toPos.x}
                cy={toPos.y}
                r={4}
                fill={isSelected ? '#3B82F6' : '#6B7280'}
                className="cursor-pointer hover:fill-blue-500 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(connection.id);
                }}
            />

            {/* Delete button for selected connections */}
            {isSelected && (
                <g>
                    <circle
                        cx={(fromPos.x + toPos.x) / 2}
                        cy={(fromPos.y + toPos.y) / 2}
                        r={12}
                        fill="#EF4444"
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(connection.id);
                        }}
                    />
                    <text
                        x={(fromPos.x + toPos.x) / 2}
                        y={(fromPos.y + toPos.y) / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        className="cursor-pointer select-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(connection.id);
                        }}
                    >
                        ×
                    </text>
                </g>
            )}
        </g>
    );
} 