import React, { useRef, useEffect } from 'react';
import { Group, Rect, Transformer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { useEditor } from '../context/EditorContext';

export const CropTool: React.FC = () => {
    const { imageUrl, stageSize, crop, setCrop, zoom, activeTool } = useEditor();
    const [img] = useImage(imageUrl, 'anonymous');

    const cropRef = useRef<Konva.Rect>(null);
    const trRef = useRef<Konva.Transformer>(null);

    // Attach transformer to the crop box
    useEffect(() => {
        if (activeTool === 'crop' && trRef.current && cropRef.current) {
            trRef.current.nodes([cropRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [activeTool, img]); // Also depend on img load to ensure nodes are ready

    if (activeTool !== 'crop' || !img) return null;

    return (
        <Group>
            {/* Crop Preview (clipped high-brightness image) */}
            <Group clipFunc={(ctx) => {
                ctx.rect(crop.x, crop.y, crop.width, crop.height);
            }}>
                <KonvaImage
                    image={img}
                    width={stageSize.width}
                    height={stageSize.height}
                />
            </Group>

            {/* The Crop Rectangle (invisible but draggable/transformable) */}
            <Rect
                ref={cropRef}
                x={crop.x}
                y={crop.y}
                width={crop.width}
                height={crop.height}
                stroke="#3b82f6"
                strokeWidth={2} // Keep stroke thin even when zoomed
                draggable
                onDragMove={(e) => {
                    const node = e.target;
                    // Simple boundary enforcement
                    const x = Math.max(0, Math.min(node.x(), stageSize.width - node.width()));
                    const y = Math.max(0, Math.min(node.y(), stageSize.height - node.height()));
                    node.position({ x, y });
                    setCrop(prev => ({ ...prev, x, y }));
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
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center']}
                anchorSize={8}
                anchorCornerRadius={2}
                anchorFill="#ffffff"
                boundBoxFunc={(oldBox, newBox) => {
                    // Prevent going out of bounds
                    const isOutOfBounds =
                        newBox.x < 0 ||
                        newBox.y < 0 ||
                        newBox.x + newBox.width > stageSize.width ||
                        newBox.y + newBox.height > stageSize.height;

                    if (isOutOfBounds || newBox.width < 10 || newBox.height < 10) {
                        return oldBox;
                    }
                    return newBox;
                }}
            />
        </Group>
    );
};
