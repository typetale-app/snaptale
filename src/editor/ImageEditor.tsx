import React, { useEffect, useRef } from "react";
import { EditorCanvas } from "./components/EditorCanvas";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorProvider } from "./context/EditorContext";

interface ImageEditorProps {
  imageUrl: string;
}

import {
  FlipHorizontal2,
  FlipVertical2,
  RotateCw
} from "lucide-react";
import { BottomToolbar, type ToolbarPage } from "./components/BottomToolbar";
import { CropToolbar } from "./components/CropToolbar";
import { FilterToolbar } from "./components/FilterToolbar";
import { SymbolsToolbar } from "./components/SymbolsToolbar";
import { TextToolbar } from "./components/TextToolbar";
import { useEditor } from "./context/EditorContext";

/* ─── Placeholder toolbars for tools that don't have full implementations yet ─── */



const RotateToolbar: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { imageRotation, setImageRotation, imageScaleX, setImageScaleX, imageScaleY, setImageScaleY } = useEditor();

  const pages: ToolbarPage[] = [
    {
      id: "main",
      label: "Transform",
      content: (
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => setImageRotation((r: number) => r + 90)}
            title="Rotate 90° CW"
            className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
          >
            <RotateCw size={14} />
          </button>

          <div className="w-px h-5 bg-zinc-800" />

          <button
            onClick={() => setImageScaleX((s: number) => s * -1)}
            title="Flip Horizontal"
            className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
          >
            <FlipHorizontal2 size={14} />
          </button>
          <button
            onClick={() => setImageScaleY((s: number) => s * -1)}
            title="Flip Vertical"
            className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
          >
            <FlipVertical2 size={14} />
          </button>

          <div className="w-px h-5 bg-zinc-800" />

          <span className="text-zinc-500 text-xs tabular-nums">
            {imageRotation % 360}°
          </span>
        </div>
      ),
    },
  ];
  return <BottomToolbar visible={visible} pages={pages} />;
};



/* ─── Main Content ─── */

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
    <div className="relative w-full h-full overflow-hidden text-white bg-zinc-900/70">
      {/* Canvas takes full dimensions */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <EditorCanvas />
      </div>

      {/* Floating Top Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-fit">
        <EditorToolbar />
      </div>

      {/* Floating Bottom Toolbars / Guides */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-fit flex flex-col items-center">
        <CropToolbar visible={activeTool === "crop"} />
        <TextToolbar visible={activeTool === "text"} />
        <FilterToolbar visible={activeTool === "filter"} />
        <RotateToolbar visible={activeTool === "rotate"} />
        <SymbolsToolbar visible={activeTool === "symbols"} />

        {/* Fallback help text when nothing has a toolbar */}
        {activeTool === null && (
          <div className="px-4 py-2 bg-zinc-900/60 backdrop-blur-md rounded-full border border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] animate-fade-in">
            <p className="text-zinc-400 text-xs tracking-wide select-none">
              Use wheel to zoom • Drag background to pan • Select tools to edit
            </p>
          </div>
        )}
      </div>
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

