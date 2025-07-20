'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@/components/content-builder/Canvas';
import { CanvasState } from '@/types/content-builder';
import { getBlockTemplate } from '@/data/block-templates';

const initialState: CanvasState = {
  blocks: [],
  connections: [],
  zoom: 1,
  pan: { x: 0, y: 0 },
  selectedBlockId: null,
  selectedConnectionId: null
};

export default function ContentBuilderPage() {
  const [state, setState] = useState<CanvasState>(initialState);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('content-builder-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    } else {
      // Create default output block in center
      const outputTemplate = getBlockTemplate('output');
      if (outputTemplate) {
        const outputBlock = {
          id: 'output_center',
          type: 'output' as const,
          position: { x: 400, y: 300 },
          title: 'Chatbot Output',
          fields: [...outputTemplate.defaultFields],
          connections: [],
          group: 'output'
        };
        setState({
          ...initialState,
          blocks: [outputBlock]
        });
      }
    }
  }, []);

  const handleStateChange = (newState: CanvasState) => {
    setState(newState);
  };

  return (
    <div className="h-screen w-full">
      <Canvas state={state} onStateChange={handleStateChange} />
    </div>
  );
}
