import React from "react";
import {
  Plus,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  ChevronDown,
  ChevronRight,
  MoveHorizontal,
  Blend,
  Layers,
} from "lucide-react";
import { useEditor, type TextConfig } from "../context/EditorContext";
import {
  BottomToolbarWithNav,
  useToolbarNav,
  type ToolbarPage,
} from "./BottomToolbar";

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
    className={`${width} h-8 bg-zinc-800/40 hover:bg-zinc-800/80 focus:bg-zinc-800/80 border border-transparent focus:border-violet-500/50 rounded-md px-2 py-1 text-xs text-zinc-200 text-center focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
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
    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150 ${
      active
        ? "bg-violet-600/20 text-violet-400"
        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
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
      className={`flex items-center gap-1.5 h-8 px-2.5 rounded-md transition-all text-xs ${
        active
          ? "bg-violet-600/20 text-violet-400"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <ChevronRight size={11} className="text-zinc-600 ml-0.5" />
    </button>
  );
};

/* ─── Slider with icon ─── */
const IconSlider: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}> = ({ icon, title, value, onChange, min, max, step }) => (
  <div className="flex items-center gap-2 group" title={title}>
    <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
      {icon}
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-14 h-1 bg-zinc-800 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:rounded-full"
    />
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
      <div className="flex items-center justify-between w-full px-2">
        <span className="text-sm text-zinc-500">
          Select a text layer or add new text to begin editing
        </span>
        <button
          onClick={() => addText()}
          className="flex items-center gap-2 px-3 h-8 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-md transition-colors"
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
          className="w-8 h-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center shrink-0"
        >
          <Plus size={16} />
        </button>

        <div className="w-px h-5 bg-zinc-800" />

        {/* Typography Group */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedText.fontFamily}
              onChange={(e) => update({ fontFamily: e.target.value })}
              className="appearance-none h-8 bg-transparent hover:bg-zinc-800/40 rounded-md pl-2 pr-6 text-xs font-medium text-zinc-200 focus:outline-none transition-colors cursor-pointer min-w-[100px]"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
          </div>

          <NumericInput
            value={selectedText.fontSize}
            onChange={(v) => update({ fontSize: Math.max(1, v) })}
            min={1}
            max={500}
            width="w-12"
          />

          <div className="flex items-center bg-zinc-800/30 rounded-md p-0.5 ml-1">
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

        <div className="w-px h-5 bg-zinc-800" />

        {/* Alignment */}
        <div className="flex items-center bg-zinc-800/30 rounded-md p-0.5">
          {(
            [
              ["left", AlignLeft],
              ["center", AlignCenter],
              ["right", AlignRight],
            ] as const
          ).map(([align, Icon]) => (
            <ToggleBtn
              key={align}
              active={selectedText.align === align}
              onClick={() => update({ align })}
              title={`Align ${align}`}
            >
              <Icon size={13} />
            </ToggleBtn>
          ))}
        </div>

        <div className="w-px h-5 bg-zinc-800" />

        {/* Color Group */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex items-center justify-center">
            <input
              type="color"
              value={selectedText.fill}
              onChange={(e) => update({ fill: e.target.value })}
              className="w-5 h-5 rounded-full cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-zinc-700/50 hover:scale-110 transition-transform"
              title="Custom Color"
            />
          </div>
          <div className="w-px h-3 bg-zinc-800 mx-0.5" />
          <div className="flex gap-1 items-center">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => update({ fill: c })}
                className={`w-4 h-4 rounded-full transition-all duration-100 ${
                  selectedText.fill.toLowerCase() === c.toLowerCase()
                    ? "ring-1 ring-violet-400 ring-offset-2 ring-offset-[#1a1a1a] scale-110 border-none"
                    : "hover:scale-110 border border-zinc-700/40"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-zinc-800" />

        {/* Effects */}
        <div className="flex items-center gap-3">
          <IconSlider
            icon={<Blend size={13} />}
            title="Opacity"
            value={selectedText.opacity}
            onChange={(v) => update({ opacity: v })}
            min={0}
            max={1}
            step={0.01}
          />
          <IconSlider
            icon={<MoveHorizontal size={13} />}
            title="Letter Spacing"
            value={selectedText.letterSpacing}
            onChange={(v) => update({ letterSpacing: v })}
            min={-5}
            max={20}
            step={0.5}
          />

          {/* Shadow sub-option link */}
          <SubOptionBtn
            label="Shadow"
            icon={<Layers size={13} />}
            active={selectedText.shadowEnabled}
            pageId="shadow"
          />
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => deleteText(selectedText.id)}
        title="Delete text"
        className="w-8 h-8 rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Shadow Sub-Page Content
   ═══════════════════════════════════════════════════════════ */
const TextShadowContent: React.FC = () => {
  const { texts, selectedTextId, updateText } = useEditor();
  const selectedText = texts.find((t) => t.id === selectedTextId);

  if (!selectedText) return null;

  const update = (updates: Partial<TextConfig>) => {
    if (selectedTextId) updateText(selectedTextId, updates);
  };

  return (
    <div className="flex items-center gap-5 w-full">
      {/* Enable/Disable toggle */}
      <ToggleBtn
        active={selectedText.shadowEnabled}
        onClick={() =>
          update({ shadowEnabled: !selectedText.shadowEnabled })
        }
        title="Toggle Shadow"
      >
        <Layers size={13} />
      </ToggleBtn>

      <div className="w-px h-5 bg-zinc-800" />

      {/* Shadow Color */}
      <div className="flex items-center gap-2" title="Shadow Color">
        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
          Color
        </span>
        <input
          type="color"
          value={selectedText.shadowColor}
          onChange={(e) => update({ shadowColor: e.target.value })}
          className="w-5 h-5 rounded-full cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-zinc-600 hover:scale-110 transition-transform"
        />
      </div>

      <div className="w-px h-5 bg-zinc-800" />

      {/* Shadow Blur */}
      <div className="flex items-center gap-2" title="Shadow Blur">
        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
          Blur
        </span>
        <NumericInput
          value={selectedText.shadowBlur}
          onChange={(v) => update({ shadowBlur: Math.max(0, v) })}
          min={0}
          max={50}
          width="w-12"
        />
      </div>

      <div className="w-px h-5 bg-zinc-800" />

      {/* Shadow Offsets */}
      <div className="flex items-center gap-2" title="X Offset">
        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
          X
        </span>
        <NumericInput
          value={selectedText.shadowOffsetX}
          onChange={(v) => update({ shadowOffsetX: v })}
          min={-50}
          max={50}
          width="w-12"
        />
      </div>

      <div className="flex items-center gap-2" title="Y Offset">
        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
          Y
        </span>
        <NumericInput
          value={selectedText.shadowOffsetY}
          onChange={(v) => update({ shadowOffsetY: v })}
          min={-50}
          max={50}
          width="w-12"
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Exported TextToolbar
   ═══════════════════════════════════════════════════════════ */
export const TextToolbar: React.FC<{ visible: boolean }> = ({ visible }) => {
  const pages: ToolbarPage[] = [
    { id: "main", label: "Text", content: <TextMainContent /> },
    { id: "shadow", label: "Drop Shadow", content: <TextShadowContent /> },
  ];

  return <BottomToolbarWithNav visible={visible} pages={pages} />;
};
