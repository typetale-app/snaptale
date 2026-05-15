import React, { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { useEditor } from '../context/EditorContext';
import { ImageLayer } from './ImageLayer';
import { CropTool } from '../tools/CropTool';

export const EditorCanvas: React.FC = () => {
    const { stageSize, zoom, setZoom, stagePos, setStagePos } = useEditor();
    const stageRef = useRef<Konva.Stage>(null);

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const speed = 1.1;
        const newScale = e.evt.deltaY > 0 ? oldScale / speed : oldScale * speed;

        // Limit zoom range
        const finalScale = Math.max(0.5, Math.min(newScale, 10));

        setZoom(finalScale);
        setStagePos({
            x: pointer.x - mousePointTo.x * finalScale,
            y: pointer.y - mousePointTo.y * finalScale,
        });
    };

    // Center stage when zoomed out
    useEffect(() => {
        if (zoom <= 1) {
            setStagePos({
                x: (stageSize.width * (1 - zoom)) / 2,
                y: (stageSize.height * (1 - zoom)) / 2,
            });
        }
    }, [zoom, stageSize, setStagePos]);

    return (
        <div className="relative group overflow-hidden w-full h-full flex items-center justify-center">
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                scaleX={zoom}
                scaleY={zoom}
                x={stagePos.x}
                y={stagePos.y}
                onWheel={handleWheel}
                ref={stageRef}
                draggable={zoom > 1}
                onDragEnd={(e) => {
                    if (e.target === e.currentTarget) {
                        setStagePos({ x: e.target.x(), y: e.target.y() });
                    }
                }}
            >
                <Layer>
                    <ImageLayer />
                    <CropTool />
                    {/* Add other tools here based on activeTool context state later */}
                </Layer>
            </Stage>
        </div>
    );
};
