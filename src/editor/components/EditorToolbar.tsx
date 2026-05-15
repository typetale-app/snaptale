import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, Crop, Image as ImageIcon, Type, Shapes, RotateCw, Check } from 'lucide-react';
import { useEditor, type ToolType } from '../context/EditorContext';
import useImage from 'use-image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TOOLS: { id: ToolType; icon: React.ElementType; title: string }[] = [
    { id: 'crop', icon: Crop, title: 'Crop Tool' },
    { id: 'filter', icon: ImageIcon, title: 'Filter Tool' },
    { id: 'rotate', icon: RotateCw, title: 'Rotate Tool' },
    { id: 'text', icon: Type, title: 'Add Text' },
    { id: 'symbols', icon: Shapes, title: 'Add Symbols' },
];

export const EditorToolbar: React.FC = () => {
    const { setZoom, setStagePos, activeTool, setActiveTool, crop, baseScale, imageUrl, zoom } = useEditor();
    const [img] = useImage(imageUrl, 'anonymous');

    const handleZoom = (factor: number) => {
        if (factor === 0) {
            setZoom(1);
            setStagePos({ x: 0, y: 0 });
            return;
        }
        setZoom((prev: number) => Math.max(0.5, Math.min(prev * factor, 10)));
    };

    const handleExport = () => {
        if (!img) return;

        let exportConfig = {
            x: 0, y: 0, width: img.width, height: img.height
        };

        if (activeTool === 'crop') {
            exportConfig = {
                x: crop.x / baseScale,
                y: crop.y / baseScale,
                width: crop.width / baseScale,
                height: crop.height / baseScale,
            };
        }

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

            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm">
            {/* Tool Selection */}
            {TOOLS.map(({ id, icon: Icon, title }) => (
                <Button
                    key={id}
                    variant={activeTool === id ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveTool(id)}
                    title={title}
                >
                    <Icon size={18} className={cn(activeTool !== id && "text-primary")} />
                </Button>
            ))}

            <div className="w-px h-6 bg-zinc-800 mx-1" />

            {/* View Controls */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleZoom(1.2)}
                title="Zoom In"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
                <ZoomIn size={18} />
            </Button>
            <span className='bg-zinc-800 px-3 py-1.5 rounded-md text-zinc-300 text-sm font-medium'>
                {(zoom * 100).toFixed(0)}%
            </span>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleZoom(0.8)}
                title="Zoom Out"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
                <ZoomOut size={18} />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleZoom(0)}
                title="Reset View"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
                <RotateCcw size={18} />
            </Button>

            <div className="w-px h-6 bg-zinc-800 mx-1" />

            {/* Action */}
            <Button onClick={handleExport} variant={"secondary"}>
                <Download size={16} />
                Export
            </Button>

            <Button onClick={handleExport} variant={"default"} title='Apply changes'>
                <Check size={16} />
            </Button>
        </div>
    );
};
