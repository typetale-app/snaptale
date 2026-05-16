import React, { useEffect, useRef } from "react";
import { EditorProvider } from "./context/EditorContext";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorCanvas } from "./components/EditorCanvas";

interface ImageEditorProps {
  imageUrl: string;
}

import { CropToolbar } from "./components/CropToolbar";
import { FilterToolbar } from "./components/FilterToolbar";
import { TextToolbar } from "./components/TextToolbar";
import { BottomToolbarWithNav, type ToolbarPage } from "./components/BottomToolbar";
import { useEditor } from "./context/EditorContext";
import {
  RotateCw,
  FlipHorizontal2,
  FlipVertical2,
  ImageIcon,
  Shapes,
  SunMedium,
  Contrast,
  Palette,
} from "lucide-react";

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
  return <BottomToolbarWithNav visible={visible} pages={pages} />;
};

const SymbolsToolbar: React.FC<{ visible: boolean }> = ({ visible }) => {
  const pages: ToolbarPage[] = [
    {
      id: "main",
      label: "Symbols",
      content: (
        <div className="flex items-center gap-3 w-full">
          <span className="text-zinc-500 text-xs">
            Symbols & stickers coming soon
          </span>
        </div>
      ),
    },
  ];
  return <BottomToolbarWithNav visible={visible} pages={pages} />;
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
    <div className="flex flex-col items-center w-full h-full bg-[#222222] absolute inset-0 text-white">
      <div className="w-full flex justify-center py-4 z-10">
        <EditorToolbar />
      </div>

      <div className="flex-1 w-full flex items-center justify-center overflow-hidden relative">
        <EditorCanvas />
      </div>

      {/* Unified animated bottom toolbars for each tool */}
      <CropToolbar visible={activeTool === "crop"} />
      <TextToolbar visible={activeTool === "text"} />
      <FilterToolbar visible={activeTool === "filter"} />
      <RotateToolbar visible={activeTool === "rotate"} />
      <SymbolsToolbar visible={activeTool === "symbols"} />

      {/* Fallback help text when nothing has a toolbar */}
      {activeTool === null && (
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
