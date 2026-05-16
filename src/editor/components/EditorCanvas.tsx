import React, { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { useEditor } from '../context/EditorContext';
import { ImageLayer } from './ImageLayer';
import { CropTool } from '../tools/CropTool';
import { TextTool } from '../tools/TextTool';
import { SymbolsTool } from '../tools/SymbolsTool';

export const EditorCanvas: React.FC = () => {
    const { stageSize, zoom, setZoom, stagePos, setStagePos, setSelectedTextId, activeTool, setSelectedSymbolId } = useEditor();
    const stageRef = useRef<Konva.Stage>(null);

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = zoom;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stagePos.x) / oldScale,
            y: (pointer.y - stagePos.y) / oldScale,
        };

        const speed = 1.03;
        const newScale = e.evt.deltaY > 0 ? oldScale / speed : oldScale * speed;

        // Limit zoom range
        const finalScale = Math.max(0.5, Math.min(newScale, 10));

        setZoom(finalScale);
        setStagePos({
            x: pointer.x - mousePointTo.x * finalScale,
            y: pointer.y - mousePointTo.y * finalScale,
        });
    };

    // Deselect text when clicking on empty stage area
    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (e.target === e.target.getStage()) {
            setSelectedTextId(null);
            if (activeTool === 'symbols') setSelectedSymbolId(null);
        }
    };


    return (
        <div className="relative group overflow-hidden w-full h-full flex items-center justify-center">
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onWheel={handleWheel}
                onClick={handleStageClick}
                onTap={handleStageClick}
                ref={stageRef}
            >
                <Layer>
                    <ImageLayer />
                    <CropTool />
                    <TextTool />
                    <SymbolsTool />
                </Layer>
            </Stage>
        </div>
    );
};
