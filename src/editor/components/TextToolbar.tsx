import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftRight,
  ArrowUpDown,
  Blend,
  Bold,
  ChevronDown,
  ChevronRight,
  Droplet,
  Italic,
  Layers,
  MoveHorizontal,
  Plus,
  Settings2,
  Trash2,
  Underline,
} from "lucide-react";
import React from "react";
import { useEditor, type TextConfig } from "../context/EditorContext";
import {
  BottomToolbar,
  useToolbarNav,
  type ToolbarPage,
} from "./BottomToolbar";
import { EditorSlider } from "./EditorSlider";

const FONT_FAMILIES = [
  "Inter",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Impact",
];

const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#1e1e1e",
  "#6b7280",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

/* ─── Compact numeric input ─── */
const NumericInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: string;
}> = ({ value, onChange, min, max, step = 1, width = "w-14" }) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    min={min}
    max={max}
    step={step}
    className={`${width} h-8 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-transparent focus:border-white/20 rounded-xl px-2 py-1 text-xs text-white/90 text-center focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
  />
);

/* ─── Icon toggle button ─── */
const ToggleBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ active, onClick, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${active
      ? "bg-white text-black shadow-sm"
      : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
  >
    {children}
  </button>
);

/* ─── Sub-option button (navigates to sub-page) ─── */
const SubOptionBtn: React.FC<{
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  pageId: string;
}> = ({ label, icon, active, pageId }) => {
  const { navigateTo } = useToolbarNav();
  return (
    <button
      onClick={() => navigateTo(pageId)}
      className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl transition-all text-xs ${active
        ? "bg-white text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        : "text-white/60 hover:text-white hover:bg-white/10"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <ChevronRight size={11} className="text-white/40 ml-0.5" />
    </button>
  );
};

/* ─── Unified Advance Slider ─── */
const AdvanceSlider: React.FC<{
  icon: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  onReset: () => void;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  title: string;
  width?: string;
}> = ({ icon, value, onChange, onReset, min, max, step, displayValue, title, width = "w-28" }) => (
  <div
    className={`flex items-center gap-2.5 ${width} group select-none cursor-pointer shrink-0`}
    onDoubleClick={onReset}
    title={`${title} (Double-click to reset)`}
  >
    <div className="text-white/40 group-hover:text-white transition-colors shrink-0">
      {icon}
    </div>
    <EditorSlider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="flex-1 h-1 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5"
    />
    <span className="text-[10px] font-semibold tabular-nums text-white/50 w-7 text-right shrink-0">
      {displayValue}
    </span>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Main Page Content
   ═══════════════════════════════════════════════════════════ */
const TextMainContent: React.FC = () => {
  const { texts, selectedTextId, addText, updateText, deleteText } =
    useEditor();
  const selectedText = texts.find((t) => t.id === selectedTextId);

  const update = (updates: Partial<TextConfig>) => {
    if (selectedTextId) updateText(selectedTextId, updates);
  };

  const toggleFontStyle = (style: "bold" | "italic") => {
    if (!selectedText) return;
    const current = selectedText.fontStyle;
    const hasBold = current.includes("bold");
    const hasItalic = current.includes("italic");
    let newBold = style === "bold" ? !hasBold : hasBold;
    let newItalic = style === "italic" ? !hasItalic : hasItalic;
    let result = "normal";
    if (newBold && newItalic) result = "bold italic";
    else if (newBold) result = "bold";
    else if (newItalic) result = "italic";
    update({ fontStyle: result });
  };

  if (!selectedText) {
    return (
      <div className="flex items-center justify-between w-full px-2 gap-4">
        <span className="text-sm text-white/50">
          Select a text layer or add new text to begin editing
        </span>
        <button
          onClick={() => addText()}
          className="flex items-center gap-2 px-3 h-8 bg-white text-black text-xs font-medium rounded-xl transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
        >
          <Plus size={14} />
          <span>Add Text</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-5">
        {/* Add new */}
        <button
          onClick={() => addText()}
          title="Add new text"
          className="w-8 h-8 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center shrink-0"
        >
          <Plus size={16} />
        </button>

        <div className="w-px h-4 bg-white/10" />

        {/* Typography Group */}
        <div className="flex items-center gap-2">
          <Select
            value={selectedText.fontFamily}
            onValueChange={(val) => update({ fontFamily: val })}
          >
            <SelectTrigger size="sm" className="min-w-28 h-8 bg-white/5 hover:bg-white/10 text-white border-transparent focus:border-white/10 rounded-xl text-xs gap-1">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent className="bg-[#18181A] border-white/10 text-white">
              {FONT_FAMILIES.map((f) => (
                <SelectItem key={f} value={f} className="text-xs hover:bg-white/10 text-white cursor-pointer">
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <NumericInput
            value={selectedText.fontSize}
            onChange={(v) => update({ fontSize: Math.max(1, v) })}
            min={1}
            max={500}
            width="w-12"
          />

          <div className="flex items-center bg-white/5 rounded-xl p-0.5 ml-1 border border-white/5 shadow-inner">
            <ToggleBtn
              active={selectedText.fontStyle.includes("bold")}
              onClick={() => toggleFontStyle("bold")}
              title="Bold"
            >
              <Bold size={13} />
            </ToggleBtn>
            <ToggleBtn
              active={selectedText.fontStyle.includes("italic")}
              onClick={() => toggleFontStyle("italic")}
              title="Italic"
            >
              <Italic size={13} />
            </ToggleBtn>
            <ToggleBtn
              active={selectedText.textDecoration === "underline"}
              onClick={() =>
                update({
                  textDecoration:
                    selectedText.textDecoration === "underline"
                      ? ""
                      : "underline",
                })
              }
              title="Underline"
            >
              <Underline size={13} />
            </ToggleBtn>
          </div>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Color Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              title="Text Color"
              className="flex items-center gap-2 h-8 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs"
            >
              <div
                className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: selectedText.fill }}
              />
              <span className="font-medium">Color</span>
              <ChevronDown size={12} className="text-white/40 ml-0.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#18181A]/95 border-white/10 text-white p-3 rounded-2xl w-48 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-white/60 tracking-wide">Presets</span>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => update({ fill: c })}
                    className={`w-5 h-5 rounded-full transition-all duration-100 relative ${selectedText.fill.toLowerCase() === c.toLowerCase()
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#18181A] scale-110 border-none shadow-sm"
                      : "hover:scale-110 border border-white/10"
                      }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/60 tracking-wide">Custom</span>
                <input
                  type="color"
                  value={selectedText.fill}
                  onChange={(e) => update({ fill: e.target.value })}
                  className="w-6 h-6 rounded-full cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-white/20 hover:scale-110 transition-transform shadow-sm"
                  title="Custom Color"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-4 bg-white/10" />

        {/* Advance Tools Link */}
        <SubOptionBtn
          label="Advance"
          icon={<Settings2 size={13} />}
          pageId="advance"
        />
      </div>

      {/* Delete */}
      <button
        onClick={() => deleteText(selectedText.id)}
        title="Delete text"
        className="w-8 h-8 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Advance Sub-Page Content
   ═══════════════════════════════════════════════════════════ */
const TextAdvanceContent: React.FC = () => {
  const { texts, selectedTextId, updateText } = useEditor();
  const selectedText = texts.find((t) => t.id === selectedTextId);

  if (!selectedText) return null;

  const update = (updates: Partial<TextConfig>) => {
    if (selectedTextId) updateText(selectedTextId, updates);
  };

  return (
    <div className="flex items-center gap-5 py-1 px-1 w-full animate-fade-in overflow-x-auto no-scrollbar scroll-smooth pr-4">
      {/* Group 1: Typography (Left Section) */}
      <div className="flex items-center gap-5 shrink-0">
        <AdvanceSlider
          icon={<Blend size={14} />}
          value={selectedText.opacity}
          onChange={(v) => update({ opacity: v })}
          onReset={() => update({ opacity: 1 })}
          min={0}
          max={1}
          step={0.01}
          displayValue={`${Math.round(selectedText.opacity * 100)}%`}
          title="Opacity"
          width="w-28"
        />

        <AdvanceSlider
          icon={<MoveHorizontal size={14} />}
          value={selectedText.letterSpacing}
          onChange={(v) => update({ letterSpacing: v })}
          onReset={() => update({ letterSpacing: 0 })}
          min={-5}
          max={20}
          step={0.5}
          displayValue={`${selectedText.letterSpacing}px`}
          title="Letter Spacing"
          width="w-28"
        />
      </div>

      {/* Vertical Separator */}
      <div className="w-px h-5 bg-white/10 shrink-0 self-center mx-1" />

      {/* Group 2: Shadow Settings (Right Section) */}
      <div className="flex items-center gap-5 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              update({ shadowEnabled: !selectedText.shadowEnabled })
            }
            title="Toggle Shadow"
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl transition-all duration-200 text-xs font-semibold ${selectedText.shadowEnabled
              ? "bg-white text-black shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
          >
            <Layers size={13} />
            <span>Shadow</span>
          </button>

          <input
            type="color"
            value={selectedText.shadowColor}
            onChange={(e) => update({ shadowColor: e.target.value })}
            className="w-5 h-5 rounded-full cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-white/20 hover:scale-110 transition-transform shadow-sm"
            title="Shadow Color"
          />
        </div>

        {/* Shadow Sliders: only interactive when shadow is enabled */}
        <div className={`flex items-center gap-5 transition-all duration-200 ${selectedText.shadowEnabled ? "opacity-100" : "opacity-35 pointer-events-none"
          }`}>
          <AdvanceSlider
            icon={<Droplet size={13} />}
            value={selectedText.shadowBlur}
            onChange={(v) => update({ shadowBlur: v })}
            onReset={() => update({ shadowBlur: 0 })}
            min={0}
            max={50}
            step={1}
            displayValue={`${selectedText.shadowBlur}px`}
            title="Shadow Blur"
            width="w-28"
          />

          <AdvanceSlider
            icon={<ArrowLeftRight size={13} />}
            value={selectedText.shadowOffsetX}
            onChange={(v) => update({ shadowOffsetX: v })}
            onReset={() => update({ shadowOffsetX: 0 })}
            min={-50}
            max={50}
            step={1}
            displayValue={`${selectedText.shadowOffsetX}px`}
            title="Shadow X Offset"
            width="w-28"
          />

          <AdvanceSlider
            icon={<ArrowUpDown size={13} />}
            value={selectedText.shadowOffsetY}
            onChange={(v) => update({ shadowOffsetY: v })}
            onReset={() => update({ shadowOffsetY: 0 })}
            min={-50}
            max={50}
            step={1}
            displayValue={`${selectedText.shadowOffsetY}px`}
            title="Shadow Y Offset"
            width="w-28"
          />
        </div>
      </div>
    </div>
  );
};

export const TextToolbar: React.FC<{ visible: boolean }> = ({ visible }) => {
  const pages: ToolbarPage[] = [
    { id: "main", label: "Text", content: <TextMainContent /> },
    { id: "advance", label: "Advance", content: <TextAdvanceContent /> },
  ];

  return <BottomToolbar visible={visible} pages={pages} />;
};
