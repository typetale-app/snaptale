import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type ToolType = 'crop' | 'filter' | 'adjust' | 'rotate' | 'text' | 'symbols' | null;

export interface CropConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface StageSize {
    width: number;
    height: number;
}

interface EditorState {
    imageUrl: string;
    stageSize: StageSize;
    setStageSize: (size: StageSize) => void;
    baseScale: number;
    setBaseScale: (scale: number) => void;
    
    // Viewport
    zoom: number;
    setZoom: (zoom: number | ((z: number) => number)) => void;
    stagePos: { x: number; y: number };
    setStagePos: (pos: { x: number; y: number }) => void;
    
    // Tools
    activeTool: ToolType;
    setActiveTool: (tool: ToolType) => void;
    
    // Crop Tool State
    crop: CropConfig;
    setCrop: (crop: CropConfig | ((c: CropConfig) => CropConfig)) => void;
}

const EditorContext = createContext<EditorState | undefined>(undefined);

export const EditorProvider: React.FC<{ imageUrl: string; children: ReactNode }> = ({ imageUrl, children }) => {
    const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });
    const [baseScale, setBaseScale] = useState<number>(1);
    const [zoom, setZoom] = useState<number>(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [activeTool, setActiveTool] = useState<ToolType>('crop');
    const [crop, setCrop] = useState<CropConfig>({ x: 50, y: 50, width: 200, height: 200 });

    const value: EditorState = {
        imageUrl,
        stageSize, setStageSize,
        baseScale, setBaseScale,
        zoom, setZoom,
        stagePos, setStagePos,
        activeTool, setActiveTool,
        crop, setCrop,
    };

    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
