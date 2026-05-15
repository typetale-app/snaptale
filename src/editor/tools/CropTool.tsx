import React, { useRef, useEffect } from 'react';
import { Group, Rect, Transformer, Path } from 'react-konva';
import Konva from 'konva';
import { useEditor } from '../context/EditorContext';

export const CropTool: React.FC = () => {
    const { stageSize, crop, setCrop, activeTool } = useEditor();

    const cropRef = useRef<Konva.Rect>(null);
    const trRef = useRef<Konva.Transformer>(null);

    // Attach transformer to the crop box
    useEffect(() => {
        if (activeTool === 'crop' && trRef.current && cropRef.current) {
            trRef.current.nodes([cropRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [activeTool]);

    if (activeTool !== 'crop') return null;

    return (
        <Group>
            {/* Darkened Overlay with a Hole */}
            <Path
                data={`M 0 0 L ${stageSize.width} 0 L ${stageSize.width} ${stageSize.height} L 0 ${stageSize.height} Z M ${crop.x} ${crop.y} L ${crop.x} ${crop.y + crop.height} L ${crop.x + crop.width} ${crop.y + crop.height} L ${crop.x + crop.width} ${crop.y} Z`}
                fill="black"
                opacity={0.6}
                fillRule="evenodd"
                listening={false}
            />

            {/* The Crop Rectangle (invisible but draggable/transformable) */}
            <Rect
                ref={cropRef}
                x={crop.x}
                y={crop.y}
                width={crop.width}
                height={crop.height}
                stroke="#ffffff"
                strokeWidth={1} // Keep stroke thin even when zoomed
                draggable={false}
                listening={false}
                onDragMove={(e) => {
                    const node = e.target;
                    const imageGroup = node.getStage()?.findOne('.image-group');
                    const imageRect = imageGroup?.getClientRect();

                    if (imageRect) {
                        // Convert absolute imageRect back to stage coordinates if stage was scaled (stage isn't scaled now, so it's direct)
                        // Intersection of imageRect and stageSize
                        const minX = Math.max(0, imageRect.x);
                        const minY = Math.max(0, imageRect.y);
                        const maxX = Math.min(stageSize.width, imageRect.x + imageRect.width);
                        const maxY = Math.min(stageSize.height, imageRect.y + imageRect.height);

                        const x = Math.max(minX, Math.min(node.x(), maxX - node.width()));
                        const y = Math.max(minY, Math.min(node.y(), maxY - node.height()));
                        node.position({ x, y });
                        setCrop(prev => ({ ...prev, x, y }));
                    } else {
                        const x = Math.max(0, Math.min(node.x(), stageSize.width - node.width()));
                        const y = Math.max(0, Math.min(node.y(), stageSize.height - node.height()));
                        node.position({ x, y });
                        setCrop(prev => ({ ...prev, x, y }));
                    }
                }}
                onTransform={(e) => {
                    const node = cropRef.current;
                    if (!node) return;

                    // Bake scale into width/height
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.setAttrs({
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY),
                        scaleX: 1,
                        scaleY: 1
                    });

                    setCrop({
                        x: node.x(),
                        y: node.y(),
                        width: node.width(),
                        height: node.height(),
                    });
                }}
            />

            {/* Transformer Handles */}
            <Transformer
                ref={trRef}
                rotateEnabled={false}
                keepRatio={false}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                anchorSize={14}
                anchorCornerRadius={10}
                anchorFill="#ffffff"
                anchorStroke="#ffffff"
                anchorStrokeWidth={0}
                borderStroke="#ffffff"
                borderStrokeWidth={1}
                boundBoxFunc={(oldBox, newBox) => {
                    const stage = trRef.current?.getStage();
                    const imageRect = stage?.findOne('.image-group')?.getClientRect();
                    if (!imageRect) return oldBox;

                    // Intersection of imageRect and stageSize
                    const minX = Math.max(0, imageRect.x);
                    const minY = Math.max(0, imageRect.y);
                    const maxX = Math.min(stageSize.width, imageRect.x + imageRect.width);
                    const maxY = Math.min(stageSize.height, imageRect.y + imageRect.height);

                    let { x, y, width, height, rotation } = newBox;

                    if (x < minX) {
                        width -= (minX - x);
                        x = minX;
                    }
                    if (y < minY) {
                        height -= (minY - y);
                        y = minY;
                    }
                    if (x + width > maxX) {
                        width = maxX - x;
                    }
                    if (y + height > maxY) {
                        height = maxY - y;
                    }

                    if (width < 10 || height < 10) {
                        return oldBox;
                    }
                    
                    return { x, y, width, height, rotation };
                }}
            />
        </Group>
    );
};
