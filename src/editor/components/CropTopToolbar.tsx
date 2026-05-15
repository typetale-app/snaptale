import React from 'react';
import { RotateCcw, FlipHorizontal, Square } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

export const CropTopToolbar = () => {
    const { setImageRotation, setImageScaleX } = useEditor();

    return (
        <div className="flex items-center justify-center gap-8 py-6 text-zinc-300 w-full">
            <button 
                onClick={() => setImageRotation(prev => prev - 90)}
                className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium"
            >
                <RotateCcw size={18} />
                Rotate left
            </button>
            <button 
                onClick={() => setImageScaleX(prev => prev * -1)}
                className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium"
            >
                <FlipHorizontal size={18} />
                Flip horizontal
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium">
                <Square size={18} />
                Crop shape
            </button>
        </div>
    );
};
