import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Image, Rect, Transformer, Group } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface ImageCropperProps {
    imageUrl: string;
}

interface CropConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface StageSize {
    width: number;
    height: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl }) => {
    const [img] = useImage(imageUrl, 'anonymous');

    // Basic stage and image state
    const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });
    const [baseScale, setBaseScale] = useState<number>(1);

    // Zoom and Pan state
    const [zoom, setZoom] = useState<number>(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    // Crop box state
    const [crop, setCrop] = useState<CropConfig>({
        x: 50,
        y: 50,
        width: 200,
        height: 200,
    });

    // Refs for Konva nodes
    const stageRef = useRef<Konva.Stage>(null);
    const cropRef = useRef<Konva.Rect>(null);
    const trRef = useRef<Konva.Transformer>(null);

    // Initialize image and stage size
    useEffect(() => {
        if (img) {
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.7;

            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

            setBaseScale(ratio);
            const w = img.width * ratio;
            const h = img.height * ratio;
            setStageSize({ width: w, height: h });

            // Center crop box initially
            setCrop({
                x: w * 0.1,
                y: h * 0.1,
                width: w * 0.8,
                height: h * 0.8,
            });
        }
    }, [img]);

    // Attach transformer to the crop box
    useEffect(() => {
        if (trRef.current && cropRef.current) {
            trRef.current.nodes([cropRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [img]);

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

    const handleZoom = (factor: number) => {
        if (factor === 0) {
            setZoom(1);
            setStagePos({ x: 0, y: 0 });
            return;
        }
        setZoom(prev => Math.max(0.5, Math.min(prev * factor, 10)));
    };

    // Center stage when zoomed out
    useEffect(() => {
        if (zoom <= 1) {
            setStagePos({
                x: (stageSize.width * (1 - zoom)) / 2,
                y: (stageSize.height * (1 - zoom)) / 2,
            });
        }
    }, [zoom, stageSize]);

    const handleExport = () => {
        if (!cropRef.current || !img) return;

        // Calculate coordinates relative to original image pixels
        const exportConfig = {
            x: crop.x / baseScale,
            y: crop.y / baseScale,
            width: crop.width / baseScale,
            height: crop.height / baseScale,
        };

        // Create a temporary stage for high-res export
        const tempStage = document.createElement('canvas');
        tempStage.width = exportConfig.width;
        tempStage.height = exportConfig.height;
        const ctx = tempStage.getContext('2d');

        if (ctx) {
            ctx.drawImage(
                img,
                exportConfig.x, exportConfig.y, exportConfig.width, exportConfig.height,
                0, 0, exportConfig.width, exportConfig.height
            );
            const dataUrl = tempStage.toDataURL('image/png');
            console.log("High-Res Export:", dataUrl);

            // Trigger download for UX
            const link = document.createElement('a');
            link.download = 'cropped-image.png';
            link.href = dataUrl;
            link.click();
        }
    };

    if (!img) return (
        <div className="flex items-center justify-center h-64 text-white animate-pulse">
            Loading editor assets...
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-6 p-8">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                <button
                    onClick={() => handleZoom(1.2)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Zoom In"
                >
                    <ZoomIn size={20} />
                </button>
                <button
                    onClick={() => handleZoom(0.8)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Zoom Out"
                >
                    <ZoomOut size={20} />
                </button>
                <button
                    onClick={() => handleZoom(0)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Reset View"
                >
                    <RotateCcw size={20} />
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    <Download size={18} />
                    Export
                </button>
            </div>

            {/* Canvas Area */}
            <div className="relative group overflow-hidden bg-black shadow-inner">
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
                        {/* Background Image (darkened) */}
                        <Group>
                            <Image
                                image={img}
                                width={stageSize.width}
                                height={stageSize.height}
                                opacity={0.4}
                            />
                        </Group>

                        {/* Crop Preview (clipped high-brightness image) */}
                        <Group clipFunc={(ctx) => {
                            ctx.rect(crop.x, crop.y, crop.width, crop.height);
                        }}>
                            <Image
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
                            strokeWidth={2 / zoom} // Keep stroke thin even when zoomed
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
                            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'left-center', 'right-center']}
                            anchorSize={8}
                            anchorCornerRadius={2}
                            anchorFill="#ffffff"
                            anchorStroke="#3b82f6"
                            borderStroke="#3b82f6"
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
                    </Layer>
                </Stage>

                {/* Visual indicator for zoom level */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-zinc-400 pointer-events-none border border-white/5">
                    {Math.round(zoom * 100)}%
                </div>
            </div>

            <p className="text-zinc-500 text-sm">
                Use wheel to zoom • Drag background to pan • Drag handles to crop
            </p>
        </div>
    );
};

export default ImageCropper;