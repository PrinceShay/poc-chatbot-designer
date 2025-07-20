export interface Position {
    x: number;
    y: number;
}

export interface BlockData {
    id: string;
    type: BlockType;
    position: Position;
    title: string;
    fields: Field[];
    connections: Connection[];
    group: string;
}

export interface Field {
    id: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'image' | 'boolean';
    value: string | number | boolean;
    options?: string[]; // Für select fields
    required?: boolean;
}

export interface Connection {
    id: string;
    sourceBlockId: string;
    targetBlockId: string;
    sourcePort: string;
    targetPort: string;
}

export interface BlockGroup {
    id: string;
    name: string;
    blocks: BlockTemplate[];
    color: string;
}

export interface BlockTemplate {
    id: string;
    name: string;
    type: BlockType;
    icon: string;
    defaultFields: Field[];
    group: string;
    connectionPoints: ConnectionPoint[];
}

export interface ConnectionPoint {
    id: string;
    name: string;
    type: 'input' | 'output';
    position: 'top' | 'bottom' | 'left' | 'right';
    compatibleTypes: BlockType[];
    fieldId?: string; // Links to specific field
    dataType?: 'text' | 'number' | 'boolean' | 'image' | 'array' | 'object'; // Type of data this port handles
}

export type BlockType =
    | 'product'
    | 'variant'
    | 'price'
    | 'image'
    | 'description'
    | 'color'
    | 'specification'
    | 'appointment'
    | 'date'
    | 'time'
    | 'location'
    | 'provider'
    | 'calendly'
    | 'contact'
    | 'lead'
    | 'category'
    | 'tag'
    | 'output';

export interface CanvasState {
    blocks: BlockData[];
    connections: Connection[];
    zoom: number;
    pan: Position;
    selectedBlockId: string | null;
    selectedConnectionId: string | null;
    connectingFrom?: {
        blockId: string;
        portId: string;
        mousePosition: Position;
    };
}

export interface DragItem {
    type: 'block' | 'connection';
    id: string;
    blockType?: BlockType;
    sourceBlockId?: string;
    sourcePort?: string;
} 