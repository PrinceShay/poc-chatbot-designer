import { BlockGroup, BlockType } from '@/types/content-builder';

export const blockGroups: BlockGroup[] = [
    {
        id: 'ecommerce',
        name: 'E-Commerce',
        color: '#3B82F6',
        blocks: [
            {
                id: 'product',
                name: 'Produkt',
                type: 'product',
                icon: '📦',
                group: 'ecommerce',
                defaultFields: [
                    { id: 'title', name: 'Titel', type: 'text', value: '', required: true },
                    { id: 'sku', name: 'SKU', type: 'text', value: '' },
                    { id: 'category', name: 'Kategorie', type: 'text', value: '' },
                    { id: 'brand', name: 'Marke', type: 'text', value: '' },
                    { id: 'active', name: 'Aktiv', type: 'boolean', value: true }
                ],
                connectionPoints: [
                    { id: 'product_in', name: 'Produkt Eingang', type: 'input', position: 'left', compatibleTypes: ['category', 'tag', 'image', 'description', 'price', 'variant', 'color', 'specification'], dataType: 'object' },
                    { id: 'product_out', name: 'Produkt Ausgang', type: 'output', position: 'right', compatibleTypes: ['image', 'description', 'price', 'variant', 'color', 'specification'], dataType: 'object' }
                ]
            },
            {
                id: 'variant',
                name: 'Variante',
                type: 'variant',
                icon: '🔄',
                group: 'ecommerce',
                defaultFields: [
                    { id: 'title', name: 'Titel', type: 'text', value: '', required: true },
                    { id: 'sku', name: 'SKU', type: 'text', value: '' },
                    { id: 'active', name: 'Aktiv', type: 'boolean', value: true }
                ],
                connectionPoints: [
                    { id: 'product_in', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'], dataType: 'object' },
                    { id: 'variant_out', name: 'Variante', type: 'output', position: 'right', compatibleTypes: ['price', 'color', 'product'], dataType: 'object' }
                ]
            },
            {
                id: 'price',
                name: 'Preis',
                type: 'price',
                icon: '💰',
                group: 'ecommerce',
                defaultFields: [
                    { id: 'amount', name: 'Betrag', type: 'number', value: 0, required: true },
                    { id: 'currency', name: 'Währung', type: 'select', value: 'EUR', options: ['EUR', 'USD', 'CHF'] },
                    { id: 'discount', name: 'Rabatt (%)', type: 'number', value: 0 },
                    { id: 'compareAt', name: 'Vergleichspreis', type: 'number', value: 0 }
                ],
                connectionPoints: [
                    { id: 'product_in', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'], dataType: 'object' },
                    { id: 'variant_in', name: 'Variante', type: 'input', position: 'left', compatibleTypes: ['variant'], dataType: 'object' },
                    { id: 'price_out', name: 'Preis', type: 'output', position: 'right', compatibleTypes: ['output', 'product'], dataType: 'object' }
                ]
            },
            {
                id: 'image',
                name: 'Bild',
                type: 'image',
                icon: '🖼️',
                group: 'ecommerce',
                defaultFields: [
                    { id: 'url', name: 'URL', type: 'text', value: '', required: true },
                    { id: 'alt', name: 'Alt-Text', type: 'text', value: '' },
                    { id: 'caption', name: 'Beschriftung', type: 'text', value: '' }
                ],
                connectionPoints: [
                    { id: 'product_in', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'], dataType: 'object' },
                    { id: 'image_out', name: 'Bild', type: 'output', position: 'right', compatibleTypes: ['output', 'product'], dataType: 'object' }
                ]
            },
            {
                id: 'description',
                name: 'Beschreibung',
                type: 'description',
                icon: '📝',
                group: 'ecommerce',
                defaultFields: [
                    { id: 'content', name: 'Inhalt', type: 'text', value: '', required: true },
                    { id: 'short', name: 'Kurzbeschreibung', type: 'text', value: '' }
                ],
                connectionPoints: [
                    { id: 'product_in', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'], dataType: 'object' },
                    { id: 'description_out', name: 'Beschreibung', type: 'output', position: 'right', compatibleTypes: ['output', 'product'], dataType: 'object' }
                ]
            },
            {
                id: 'color',
                name: 'Farbe',
                type: 'color',
                icon: '🎨',
                group: 'ecommerce',
                defaultFields: [
                    { id: 'name', name: 'Name', type: 'text', value: '', required: true },
                    { id: 'hex', name: 'Hex-Code', type: 'text', value: '#000000' },
                    { id: 'available', name: 'Verfügbar', type: 'boolean', value: true }
                ],
                connectionPoints: [
                    { id: 'variant', name: 'Variante', type: 'input', position: 'left', compatibleTypes: ['variant'] }
                ]
            },
            {
                id: 'specification',
                name: 'Spezifikation',
                type: 'specification',
                icon: '⚙️',
                group: 'ecommerce',
                defaultFields: [
                    { id: 'name', name: 'Name', type: 'text', value: '', required: true },
                    { id: 'value', name: 'Wert', type: 'text', value: '', required: true },
                    { id: 'unit', name: 'Einheit', type: 'text', value: '' }
                ],
                connectionPoints: [
                    { id: 'product', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'] },
                    { id: 'variant', name: 'Variante', type: 'input', position: 'left', compatibleTypes: ['variant'] }
                ]
            }
        ]
    },
    {
        id: 'appointment',
        name: 'Termin',
        color: '#10B981',
        blocks: [
            {
                id: 'appointment',
                name: 'Termin',
                type: 'appointment',
                icon: '📅',
                group: 'appointment',
                defaultFields: [
                    { id: 'title', name: 'Titel', type: 'text', value: '', required: true },
                    { id: 'duration', name: 'Dauer (Min)', type: 'number', value: 60 },
                    { id: 'active', name: 'Aktiv', type: 'boolean', value: true }
                ],
                connectionPoints: [
                    { id: 'date', name: 'Datum', type: 'output', position: 'bottom', compatibleTypes: ['date'] },
                    { id: 'time', name: 'Zeit', type: 'output', position: 'bottom', compatibleTypes: ['time'] },
                    { id: 'location', name: 'Ort', type: 'output', position: 'right', compatibleTypes: ['location'] },
                    { id: 'provider', name: 'Anbieter', type: 'output', position: 'right', compatibleTypes: ['provider', 'calendly'] }
                ]
            },
            {
                id: 'date',
                name: 'Datum',
                type: 'date',
                icon: '📆',
                group: 'appointment',
                defaultFields: [
                    { id: 'question', name: 'Frage', type: 'text', value: 'Wann soll der Termin stattfinden?', required: true },
                    { id: 'minDate', name: 'Min. Datum', type: 'text', value: 'today' },
                    { id: 'maxDate', name: 'Max. Datum', type: 'text', value: '+1year' }
                ],
                connectionPoints: [
                    { id: 'appointment', name: 'Termin', type: 'input', position: 'top', compatibleTypes: ['appointment'] }
                ]
            },
            {
                id: 'time',
                name: 'Zeit',
                type: 'time',
                icon: '🕐',
                group: 'appointment',
                defaultFields: [
                    { id: 'question', name: 'Frage', type: 'text', value: 'Zu welcher Uhrzeit?', required: true },
                    { id: 'startTime', name: 'Startzeit', type: 'text', value: '09:00' },
                    { id: 'endTime', name: 'Endzeit', type: 'text', value: '17:00' },
                    { id: 'interval', name: 'Intervall (Min)', type: 'number', value: 30 }
                ],
                connectionPoints: [
                    { id: 'appointment', name: 'Termin', type: 'input', position: 'top', compatibleTypes: ['appointment'] }
                ]
            },
            {
                id: 'location',
                name: 'Ort',
                type: 'location',
                icon: '📍',
                group: 'appointment',
                defaultFields: [
                    { id: 'question', name: 'Frage', type: 'text', value: 'Wo soll der Termin stattfinden?', required: true },
                    { id: 'options', name: 'Optionen', type: 'text', value: 'Beim Kunden,Bei uns im Büro,Online' },
                    { id: 'address', name: 'Adresse', type: 'text', value: '' }
                ],
                connectionPoints: [
                    { id: 'appointment', name: 'Termin', type: 'input', position: 'left', compatibleTypes: ['appointment'] }
                ]
            },
            {
                id: 'calendly',
                name: 'Calendly',
                type: 'calendly',
                icon: '📋',
                group: 'appointment',
                defaultFields: [
                    { id: 'url', name: 'Calendly URL', type: 'text', value: '', required: true },
                    { id: 'eventType', name: 'Event Type', type: 'text', value: '' }
                ],
                connectionPoints: [
                    { id: 'appointment', name: 'Termin', type: 'input', position: 'left', compatibleTypes: ['appointment'] }
                ]
            },
            {
                id: 'provider',
                name: 'Anbieter',
                type: 'provider',
                icon: '👤',
                group: 'appointment',
                defaultFields: [
                    { id: 'name', name: 'Name', type: 'text', value: '', required: true },
                    { id: 'email', name: 'E-Mail', type: 'text', value: '' },
                    { id: 'phone', name: 'Telefon', type: 'text', value: '' }
                ],
                connectionPoints: [
                    { id: 'appointment', name: 'Termin', type: 'input', position: 'left', compatibleTypes: ['appointment'] }
                ]
            }
        ]
    },
    {
        id: 'marketing',
        name: 'Marketing',
        color: '#F59E0B',
        blocks: [
            {
                id: 'lead',
                name: 'Lead',
                type: 'lead',
                icon: '🎯',
                group: 'marketing',
                defaultFields: [
                    { id: 'name', name: 'Name', type: 'text', value: '', required: true },
                    { id: 'email', name: 'E-Mail', type: 'text', value: '', required: true },
                    { id: 'phone', name: 'Telefon', type: 'text', value: '' },
                    { id: 'source', name: 'Quelle', type: 'text', value: 'Chatbot' }
                ],
                connectionPoints: [
                    { id: 'product', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'] },
                    { id: 'appointment', name: 'Termin', type: 'input', position: 'left', compatibleTypes: ['appointment'] }
                ]
            },
            {
                id: 'contact',
                name: 'Kontakt',
                type: 'contact',
                icon: '📞',
                group: 'marketing',
                defaultFields: [
                    { id: 'name', name: 'Name', type: 'text', value: '', required: true },
                    { id: 'email', name: 'E-Mail', type: 'text', value: '', required: true },
                    { id: 'phone', name: 'Telefon', type: 'text', value: '' },
                    { id: 'message', name: 'Nachricht', type: 'text', value: '' }
                ],
                connectionPoints: [
                    { id: 'product', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'] },
                    { id: 'appointment', name: 'Termin', type: 'input', position: 'left', compatibleTypes: ['appointment'] }
                ]
            },
            {
                id: 'category',
                name: 'Kategorie',
                type: 'category',
                icon: '📂',
                group: 'marketing',
                defaultFields: [
                    { id: 'name', name: 'Name', type: 'text', value: '', required: true },
                    { id: 'description', name: 'Beschreibung', type: 'text', value: '' }
                ],
                connectionPoints: [
                    { id: 'product', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'] }
                ]
            },
            {
                id: 'tag',
                name: 'Tag',
                type: 'tag',
                icon: '🏷️',
                group: 'marketing',
                defaultFields: [
                    { id: 'name', name: 'Name', type: 'text', value: '', required: true },
                    { id: 'color', name: 'Farbe', type: 'text', value: '#3B82F6' }
                ],
                connectionPoints: [
                    { id: 'product', name: 'Produkt', type: 'input', position: 'left', compatibleTypes: ['product'] },
                    { id: 'variant', name: 'Variante', type: 'input', position: 'left', compatibleTypes: ['variant'] }
                ]
            }
        ]
    },
    {
        id: 'output',
        name: 'Ausgabe',
        color: '#EF4444',
        blocks: [
            {
                id: 'output',
                name: 'Chatbot Output',
                type: 'output',
                icon: '🤖',
                group: 'output',
                defaultFields: [],
                connectionPoints: [
                    { id: 'input', name: 'Eingang', type: 'input', position: 'top', compatibleTypes: ['product', 'variant', 'price', 'image', 'description', 'color', 'specification', 'appointment', 'date', 'time', 'location', 'provider', 'calendly', 'contact', 'lead', 'category', 'tag'] }
                ]
            }
        ]
    }
];

export const getBlockTemplate = (type: BlockType) => {
    for (const group of blockGroups) {
        const block = group.blocks.find(b => b.type === type);
        if (block) return block;
    }
    return null;
};

export const getBlockGroup = (groupId: string) => {
    return blockGroups.find(group => group.id === groupId);
}; 