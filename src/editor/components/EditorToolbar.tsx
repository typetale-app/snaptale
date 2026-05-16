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
    <div className="flex items-center gap-2 px-3 py-2 bg-[#18181A]/85 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Tool Selection */}
      {TOOLS.map(({ id, icon: Icon, title }) => (
        <Button
          key={id}
          variant="ghost"
          size="icon"
          onClick={() => setActiveTool(id)}
          title={title}
          className={cn(
            "w-9 h-9 rounded-xl transition-all duration-200",
            activeTool === id
              ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          <Icon size={18} />
        </Button>
      ))}

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Actions */}
      <Button
        onClick={handleReset}
        variant="ghost"
        className="h-9 px-3 text-xs font-medium rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
        title="Reset all changes"
      >
        Reset
      </Button>

      <Button
        onClick={handleExport}
        variant="ghost"
        className="h-9 px-3 gap-2 text-xs font-medium rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
      >
        <Download size={14} />
        Export
      </Button>
      
      <Button onClick={handleExport} variant="ghost" className="h-9 w-9 p-0 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" title="Apply changes">
        <Check size={16} />
      </Button>
    </div>
  );
};
