import React, { useEffect, useRef } from "react";
import { EditorProvider } from "./context/EditorContext";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorCanvas } from "./components/EditorCanvas";

interface ImageEditorProps {
  imageUrl: string;
}

import { CropTopToolbar } from "./components/CropTopToolbar";
import { CropBottomToolbar } from "./components/CropBottomToolbar";
import { TextToolbar } from "./components/TextToolbar";
import { useEditor } from "./context/EditorContext";

export const ImageEditorContent: React.FC = () => {
  const { activeTool, applyCrop, restoreCropView } = useEditor();

  // Handle transitions between crop and other tools.
  const prevToolRef = useRef(activeTool);
  useEffect(() => {
    const prev = prevToolRef.current;
    if (prev === "crop" && activeTool !== "crop") {
      // Leaving crop mode → show cropped result
      applyCrop();
    } else if (prev !== "crop" && activeTool === "crop") {
      // Re-entering crop mode → restore the crop-mode viewport
      restoreCropView();
    }
    prevToolRef.current = activeTool;
  }, [activeTool, applyCrop, restoreCropView]);

  return (
    <div className="flex flex-col items-center w-full h-full bg-[#222222] absolute inset-0 text-white">
      <div className="w-full flex justify-center py-4 z-10">
        <EditorToolbar />
      </div>

      {activeTool === "crop" && <CropTopToolbar />}

      <div className="flex-1 w-full flex items-center justify-center overflow-hidden relative">
        <EditorCanvas />
      </div>

      {activeTool === "crop" && <CropBottomToolbar />}
      {activeTool === "text" && <TextToolbar />}

      {activeTool !== "crop" && activeTool !== "text" && (
        <div className="py-6">
          <p className="text-zinc-500 text-sm">
            Use wheel to zoom • Drag background to pan • Select tools to edit
          </p>
        </div>
      )}
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
