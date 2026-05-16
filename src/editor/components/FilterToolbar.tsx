import React from "react";
import { SlidersHorizontal, Image as ImageIcon, RotateCcw } from "lucide-react";
import { useEditor } from "../context/EditorContext";
import {
  BottomToolbarWithNav,
  useToolbarNav,
  type ToolbarPage,
} from "./BottomToolbar";
import { cn } from "@/lib/utils";

const PRESETS = [
  { id: "none", label: "Normal" },
  { id: "grayscale", label: "B&W" },
  { id: "sepia", label: "Sepia" },
];

/* ─── Main Filters Page ─── */
const FilterMainContent: React.FC = () => {
  const { filters, setFilters } = useEditor();
  const { navigateTo } = useToolbarNav();

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Preset Buttons */}
      <div className="flex items-center gap-1.5 mr-2">
        {PRESETS.map((preset) => {
          const isActive = filters.preset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() =>
                setFilters((f) => ({ ...f, preset: preset.id }))
              }
              className={cn(
                "px-3 h-8 rounded-md text-xs font-medium transition-all",
                isActive
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-5 bg-zinc-800" />

      {/* Navigate to Adjust sub-page */}
      <button
        onClick={() => navigateTo("adjust")}
        className="flex items-center gap-1.5 h-8 px-2.5 ml-1 rounded-md transition-all text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
      >
        <SlidersHorizontal size={13} />
        <span className="font-medium">Adjust</span>
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      {/* Global Reset Filters */}
      <button
        onClick={() =>
          setFilters({
            preset: "none",
            brightness: 0,
            contrast: 0,
            saturation: 0,
            blur: 0,
          })
        }
        title="Reset All Filters"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <RotateCcw size={13} />
      </button>
    </div>
  );
};

/* ─── Adjustments Sub-Page ─── */
const FilterAdjustContent: React.FC = () => {
  const { filters, setFilters } = useEditor();

  const updateFilter = (key: keyof typeof filters, value: number) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const sliders = [
    { id: "brightness", label: "Brightness", min: -1, max: 1, step: 0.05, value: filters.brightness },
    { id: "contrast", label: "Contrast", min: -100, max: 100, step: 1, value: filters.contrast },
    { id: "saturation", label: "Saturation", min: -2, max: 2, step: 0.1, value: filters.saturation },
    { id: "blur", label: "Blur", min: 0, max: 20, step: 1, value: filters.blur },
  ] as const;

  return (
    <div className="flex items-center gap-6 w-full px-2">
      {sliders.map((s) => (
        <div key={s.id} className="flex flex-col gap-1.5 w-24">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              {s.label}
            </span>
            <span className="text-[10px] tabular-nums text-zinc-500">
              {s.id === 'blur' ? s.value : Math.round(s.value * (s.id === 'brightness' ? 100 : 1))}
            </span>
          </div>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={s.value}
            onChange={(e) => updateFilter(s.id, Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
          />
        </div>
      ))}

      <div className="w-px h-5 bg-zinc-800 ml-2" />

      <button
        onClick={() =>
          setFilters((f) => ({
            ...f,
            brightness: 0,
            contrast: 0,
            saturation: 0,
            blur: 0,
          }))
        }
        title="Reset Adjustments"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <RotateCcw size={13} />
      </button>
    </div>
  );
};

/* ─── Exported FilterToolbar ─── */
export const FilterToolbar: React.FC<{ visible: boolean }> = ({ visible }) => {
  const pages: ToolbarPage[] = [
    { id: "main", label: "Filters", content: <FilterMainContent /> },
    { id: "adjust", label: "Adjustments", content: <FilterAdjustContent /> },
  ];

  return <BottomToolbarWithNav visible={visible} pages={pages} />;
};
