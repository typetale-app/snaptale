import React from "react";
import { Download, Crop, Type, Shapes, Check, Sparkles } from "lucide-react";
import { useEditor, type ToolType } from "../context/EditorContext";
import useImage from "use-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TOOLS: { id: ToolType; icon: React.ElementType; title: string }[] = [
  { id: "crop", icon: Crop, title: "Crop Tool" },
  { id: "filter", icon: Sparkles, title: "Filter Tool" },
  { id: "text", icon: Type, title: "Add Text" },
  { id: "symbols", icon: Shapes, title: "Add Symbols" },
];

export const EditorToolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    crop,
    baseScale,
    imageUrl,
    setZoom,
    setStagePos,
    setImageRotation,
    setImageScaleX,
    setImageScaleY,
    setFilters,
    clearAllTexts,
    setCrop,
    imageSize,
  } = useEditor();
  const [img] = useImage(imageUrl, "anonymous");

  const handleReset = () => {
    // Reset view
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
    // Reset transforms
    setImageRotation(0);
    setImageScaleX(1);
    setImageScaleY(1);
    // Reset filters
    setFilters({ preset: "none", brightness: 0, contrast: 0, saturation: 0, blur: 0 });
    // Reset text & symbols
    clearAllTexts();
    // Reset crop
    if (imageSize.width > 0 && imageSize.height > 0) {
      setCrop({
        x: imageSize.width * 0.1,
        y: imageSize.height * 0.1,
        width: imageSize.width * 0.8,
        height: imageSize.height * 0.8,
      });
    }
  };

  const handleExport = () => {
    if (!img) return;

    let exportConfig = {
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    };

    if (activeTool === "crop") {
      exportConfig = {
        x: crop.x / baseScale,
        y: crop.y / baseScale,
        width: crop.width / baseScale,
        height: crop.height / baseScale,
      };
    }

    const tempStage = document.createElement("canvas");
    tempStage.width = exportConfig.width;
    tempStage.height = exportConfig.height;
    const ctx = tempStage.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        img,
        exportConfig.x,
        exportConfig.y,
        exportConfig.width,
        exportConfig.height,
        0,
        0,
        exportConfig.width,
        exportConfig.height,
      );
      const dataUrl = tempStage.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = "edited-image.png";
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
          variant={activeTool === id ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTool(id)}
          title={title}
        >
          <Icon size={18} className={cn(activeTool !== id && "text-primary")} />
        </Button>
      ))}

      <div className="w-px h-6 bg-zinc-800 mx-1" />

      {/* Actions */}
      <Button onClick={handleReset} variant="ghost" className="text-zinc-400 hover:text-white" title="Reset all changes">
        Reset
      </Button>

      <Button onClick={handleExport} variant="secondary">
        <Download size={16} />
        Export
      </Button>

      <Button onClick={handleExport} variant={"default"} title="Apply changes">
        <Check size={16} />
      </Button>
    </div>
  );
};
