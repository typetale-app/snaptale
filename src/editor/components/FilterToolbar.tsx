import React from "react";
import { SlidersHorizontal, Image as ImageIcon, RotateCcw, Sun, Contrast, Palette, Eye } from "lucide-react";
import { useEditor } from "../context/EditorContext";
import {
  BottomToolbar,
  useToolbarNav,
  type ToolbarPage,
} from "./BottomToolbar";
import { cn } from "@/lib/utils";
import { EditorSlider } from "./EditorSlider";
import { ScrollArea } from "../../components/ui/scroll-area";

const PRESETS = [
  { id: "none", label: "Normal" },
  { id: "grayscale", label: "B&W" },
  { id: "sepia", label: "Sepia" },
  { id: "invert", label: "Invert" },
  { id: "pixelate", label: "Pixelate" },
  { id: "noise", label: "Noise" },
  { id: "clarendon", label: "Clarendon" },
  { id: "gingham", label: "Gingham" },
  { id: "juno", label: "Juno" },
  { id: "lark", label: "Lark" },
  { id: "valencia", label: "Valencia" },
  { id: "ludwig", label: "Ludwig" },
  { id: "lofi", label: "Lo-Fi" },
  { id: "sierra", label: "Sierra" },
];

/* ─── Main Filters Page ─── */
const FilterMainContent: React.FC = () => {
  const { filters, setFilters } = useEditor();
  const { navigateTo } = useToolbarNav();

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Preset Buttons */}
      <ScrollArea
        orientation="horizontal"
        className="max-w-90 py-1 mr-2"
        onWheel={(e) => {
          const viewport = e.currentTarget.querySelector('[data-slot="scroll-area-viewport"]');
          if (viewport) {
            viewport.scrollLeft += e.deltaY;
          }
        }}
      >
        <div className="flex items-center gap-1.5 pr-4">
          {PRESETS.map((preset) => {
            const isActive = filters.preset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() =>
                  setFilters((f) => ({ ...f, preset: preset.id }))
                }
                className={cn(
                  "px-3 h-8 rounded-xl text-xs font-medium transition-all shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
                  isActive
                    ? "bg-white text-black shadow-none"
                    : "text-white/70 hover:text-white hover:bg-white/10 bg-white/5"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="w-px h-4 bg-white/10" />

      {/* Navigate to Adjust sub-page */}
      <button
        onClick={() => navigateTo("adjust")}
        className="flex items-center gap-1.5 h-8 px-2.5 ml-1 rounded-xl transition-all text-xs text-white/70 hover:text-white hover:bg-white/10"
      >
        <SlidersHorizontal size={13} />
        <span className="font-medium">Adjust</span>
      </button>

      <div className="w-px h-4 bg-white/10 mx-1" />

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
        className="w-8 h-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
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
    { id: "brightness", label: "Brightness", min: -1, max: 1, step: 0.05, value: filters.brightness, icon: Sun },
    { id: "contrast", label: "Contrast", min: -100, max: 100, step: 1, value: filters.contrast, icon: Contrast },
    { id: "saturation", label: "Saturation", min: -2, max: 2, step: 0.1, value: filters.saturation, icon: Palette },
    { id: "blur", label: "Blur", min: 0, max: 20, step: 1, value: filters.blur, icon: Eye },
  ] as const;

  return (
    <div className="flex items-center gap-4 py-2 px-1 w-full">
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-115">
        {sliders.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 w-full group select-none cursor-pointer"
            onDoubleClick={() => updateFilter(s.id, 0)}
            title="Double-click to reset"
          >
            <s.icon size={15} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
            
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider group-hover:text-white/80 transition-colors">
                  {s.label}
                </span>
                <span className="text-[10px] font-semibold tabular-nums text-white/70">
                  {s.id === 'blur' ? s.value : Math.round(s.value * (s.id === 'brightness' ? 100 : 1))}
                </span>
              </div>
              <EditorSlider
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={(val) => updateFilter(s.id, val)}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-px h-10 bg-white/10 self-stretch shrink-0 mx-1" />

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
        title="Reset All Adjustments"
        className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all shrink-0 self-center"
      >
        <RotateCcw size={15} />
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

  return <BottomToolbar visible={visible} pages={pages} />;
};
