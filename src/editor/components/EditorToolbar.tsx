import { Button } from "@/components/ui/button";
import { Check, Crop, Download, Shapes, Sparkles, Type } from "lucide-react";
import React from "react";
import { useEditor, type ToolType } from "../context/EditorContext";
import { useExport } from "../hooks/useExport";
import { useReset } from "../hooks/useReset";

const TOOLS: { id: ToolType; icon: React.ElementType; title: string }[] = [
  { id: "crop", icon: Crop, title: "Crop Tool" },
  { id: "filter", icon: Sparkles, title: "Filter Tool" },
  { id: "text", icon: Type, title: "Add Text" },
  { id: "symbols", icon: Shapes, title: "Add Symbols" },
];

export const EditorToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditor();
  const { handleExport } = useExport();
  const { handleReset } = useReset();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#18181A]/85 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Tool Selection */}
      {TOOLS.map(({ id, icon: Icon, title }) => (
        <Button
          key={id}
          variant={activeTool === id ? "studio-active" : "studio"}
          size="studio-icon"
          onClick={() => setActiveTool(activeTool === id ? null : id)}
          title={title}
        >
          <Icon size={18} />
        </Button>
      ))}

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Actions */}
      <Button
        onClick={handleReset}
        variant="studio-ghost"
        size="studio"
        title="Reset all changes"
      >
        Reset
      </Button>

      {activeTool === null ? (
        <Button
          onClick={handleExport}
          variant="studio-primary"
          title="Export edited image"
          className="w-25"
        >
          <Download size={14} />
          Export
        </Button>
      ) : (
        <Button
          onClick={() => setActiveTool(null)}
          variant="studio-primary"
          size="studio-icon"
          className="animate-fade-in"
          title="Done / Apply changes"
        >
          <Check size={16} />
        </Button>
      )}
    </div>
  );
};


