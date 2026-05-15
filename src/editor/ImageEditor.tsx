import React from 'react';
import { EditorProvider } from './context/EditorContext';
import { EditorToolbar } from './components/EditorToolbar';
import { EditorCanvas } from './components/EditorCanvas';

interface ImageEditorProps {
    imageUrl: string;
}

export const ImageEditorContent: React.FC = () => {
    return (
        <div className="flex flex-col items-center gap-6 p-8">
            <EditorToolbar />
            <EditorCanvas />
            <p className="text-zinc-500 text-sm">
                Use wheel to zoom • Drag background to pan • Select tools to edit
            </p>
        </div>
    );
};

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl }) => {
    return (
        <EditorProvider imageUrl={imageUrl}>
            <ImageEditorContent />
        </EditorProvider>
    );
};

export default ImageEditor;
