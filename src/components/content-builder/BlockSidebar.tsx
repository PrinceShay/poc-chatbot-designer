'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { blockGroups } from '@/data/block-templates';
import { BlockTemplate } from '@/types/content-builder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DraggableBlockProps {
    block: BlockTemplate;
}

function DraggableBlock({ block }: DraggableBlockProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `template-${block.id}`,
        data: {
            type: 'block-template',
            blockType: block.type,
            template: block
        }
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`p-2 border rounded cursor-grab hover:bg-gray-50 transition-colors ${isDragging ? 'opacity-50' : ''
                }`}
        >
            <div className="flex items-center gap-2">
                <span className="text-lg">{block.icon}</span>
                <span className="text-sm font-medium">{block.name}</span>
            </div>
        </div>
    );
}

interface BlockGroupProps {
    group: typeof blockGroups[0];
}

function BlockGroup({ group }: BlockGroupProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="mb-4">
            <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                    />
                    <span className="font-medium">{group.name}</span>
                </div>
                {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
            </Button>

            {isExpanded && (
                <div className="ml-4 space-y-2 mt-2">
                    {group.blocks.map((block) => (
                        <DraggableBlock key={block.id} block={block} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function BlockSidebar() {
    return (
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Blöcke</h2>
                <p className="text-sm text-gray-600">
                    Ziehe Blöcke auf das Canvas, um deinen Chatbot zu erstellen.
                </p>
            </div>

            <div className="space-y-2">
                {blockGroups.map((group) => (
                    <BlockGroup key={group.id} group={group} />
                ))}
            </div>
        </div>
    );
} 