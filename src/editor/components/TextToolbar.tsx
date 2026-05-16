import React, { useState } from "react";
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
  Type,
} from "lucide-react";
import { useEditor, type TextConfig } from "../context/EditorContext";

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

/* ─── Tiny reusable field label ─── */
const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 select-none">
    {children}
  </span>
);

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
    className={`${width} bg-zinc-800/80 border border-zinc-700/50 rounded-md px-2 py-1 text-xs text-zinc-200 text-center focus:outline-none focus:border-violet-500/60 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
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
    className={`p-1.5 rounded-md transition-all duration-150 ${
      active
        ? "bg-violet-600/90 text-white shadow-sm shadow-violet-600/20"
        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60"
    }`}
  >
    {children}
  </button>
);

export const TextToolbar: React.FC = () => {
  const { texts, selectedTextId, addText, updateText, deleteText, stageSize } =
    useEditor();

  const selectedText = texts.find((t) => t.id === selectedTextId);
  const [showShadow, setShowShadow] = useState(false);

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

  // Sync showShadow with selectedText
  React.useEffect(() => {
    if (selectedText) setShowShadow(selectedText.shadowEnabled);
  }, [selectedText?.id, selectedText?.shadowEnabled]);

  /* ─── No selection state ─── */
  if (!selectedText) {
    return (
      <div className="w-full bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800/80">
        <div className="flex items-center justify-center py-4 gap-3">
          <button
            onClick={() => addText()}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-violet-600/20"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Text
          </button>
          <span className="text-zinc-500 text-xs">
            or select existing text on canvas
          </span>
        </div>
      </div>
    );
  }

  /* ─── Selected text controls ─── */
  return (
    <div className="w-full bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-5 py-3">
        {/* ─── Top row: Add + Typography + Alignment + Color + Effects + Delete ─── */}
        <div className="flex items-center gap-4">
          {/* Add new */}
          <button
            onClick={() => addText()}
            title="Add new text"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 flex items-center justify-center"
          >
            <Plus size={18} />
          </button>

          <div className="w-px h-7 bg-zinc-800" />

          {/* Typography Group */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5 justify-center">
              <FieldLabel>Font</FieldLabel>
              <div className="relative">
                <select
                  value={selectedText.fontFamily}
                  onChange={(e) => update({ fontFamily: e.target.value })}
                  className="appearance-none bg-zinc-800/80 border border-zinc-700/50 rounded-md pl-2.5 pr-7 py-1 text-xs text-zinc-200 focus:outline-none focus:border-violet-500/60 transition-colors cursor-pointer w-32"
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
            </div>

            <div className="flex flex-col gap-0.5 justify-center">
              <FieldLabel>Size</FieldLabel>
              <NumericInput
                value={selectedText.fontSize}
                onChange={(v) => update({ fontSize: Math.max(1, v) })}
                min={1}
                max={500}
                width="w-14"
              />
            </div>

            <div className="flex flex-col gap-0.5 justify-center">
              <FieldLabel>Style</FieldLabel>
              <div className="flex items-center gap-0.5">
                <ToggleBtn
                  active={selectedText.fontStyle.includes("bold")}
                  onClick={() => toggleFontStyle("bold")}
                  title="Bold"
                >
                  <Bold size={14} />
                </ToggleBtn>
                <ToggleBtn
                  active={selectedText.fontStyle.includes("italic")}
                  onClick={() => toggleFontStyle("italic")}
                  title="Italic"
                >
                  <Italic size={14} />
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
                  <Underline size={14} />
                </ToggleBtn>
              </div>
            </div>
          </div>

          <div className="w-px h-7 bg-zinc-800" />

          {/* Alignment Group */}
          <div className="flex flex-col gap-0.5 justify-center">
            <FieldLabel>Align</FieldLabel>
            <div className="flex items-center gap-0.5">
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
                  <Icon size={14} />
                </ToggleBtn>
              ))}
            </div>
          </div>

          <div className="w-px h-7 bg-zinc-800" />

          {/* Color Group */}
          <div className="flex flex-col gap-0.5 justify-center">
            <FieldLabel>Color</FieldLabel>
            <div className="flex items-center gap-1.5 mt-[3px]">
              <div className="relative flex items-center justify-center">
                <input
                  type="color"
                  value={selectedText.fill}
                  onChange={(e) => update({ fill: e.target.value })}
                  className="w-6 h-6 rounded border border-zinc-600 cursor-pointer bg-zinc-800 p-0 [&::-webkit-color-swatch-wrapper]:p-px [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0"
                  title="Custom Color"
                />
              </div>
              <div className="w-px h-4 bg-zinc-700/50 mx-0.5" />
              <div className="flex gap-[3px] items-center">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => update({ fill: c })}
                    className={`w-[18px] h-[18px] rounded-[4px] transition-all duration-100 ${
                      selectedText.fill.toLowerCase() === c.toLowerCase()
                        ? "ring-1.5 ring-violet-400 ring-offset-1 ring-offset-zinc-900 scale-110 border-none"
                        : "hover:scale-110 border border-zinc-700/40"
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Effects Group (Opacity, Spacing, Shadow Toggle) */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-0.5 justify-center">
              <FieldLabel>Opacity</FieldLabel>
              <div className="flex items-center gap-1.5 h-7">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={selectedText.opacity}
                  onChange={(e) => update({ opacity: Number(e.target.value) })}
                  className="w-16 h-1 accent-violet-500 cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3"
                />
                <span className="text-[11px] text-zinc-400 w-7 text-right tabular-nums">
                  {Math.round(selectedText.opacity * 100)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 justify-center">
              <FieldLabel>Spacing</FieldLabel>
              <div className="flex items-center gap-1.5 h-7">
                <input
                  type="range"
                  min={-5}
                  max={20}
                  step={0.5}
                  value={selectedText.letterSpacing}
                  onChange={(e) =>
                    update({ letterSpacing: Number(e.target.value) })
                  }
                  className="w-16 h-1 accent-violet-500 cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3"
                />
                <span className="text-[11px] text-zinc-400 w-5 text-right tabular-nums">
                  {selectedText.letterSpacing}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 justify-center pl-2">
              <FieldLabel>Shadow</FieldLabel>
              <div className="flex items-center h-7">
                <label className="flex items-center cursor-pointer select-none group">
                  <div
                    className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all ${
                      showShadow
                        ? "bg-violet-600 border-violet-500"
                        : "bg-zinc-800 border-zinc-600 group-hover:border-zinc-500"
                    }`}
                    onClick={() => {
                      const next = !showShadow;
                      setShowShadow(next);
                      update({ shadowEnabled: next });
                    }}
                  >
                    {showShadow && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 8 8"
                        fill="none"
                        className="text-white"
                      >
                        <path
                          d="M1 4L3 6L7 2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="w-px h-7 bg-zinc-800 ml-2" />

          {/* Delete */}
          <button
            onClick={() => deleteText(selectedText.id)}
            title="Delete text"
            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-colors shrink-0 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* ─── Bottom row: Shadow Settings (Only visible if Shadow is ON) ─── */}
        {showShadow && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800/60 pl-14">
            <div className="flex items-center gap-1.5">
              <FieldLabel>Color</FieldLabel>
              <input
                type="color"
                value={selectedText.shadowColor}
                onChange={(e) => update({ shadowColor: e.target.value })}
                className="w-6 h-6 rounded border border-zinc-600 cursor-pointer bg-zinc-800 p-0 [&::-webkit-color-swatch-wrapper]:p-px [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0"
                title="Shadow color"
              />
            </div>

            <div className="flex items-center gap-1.5 ml-4">
              <FieldLabel>Blur</FieldLabel>
              <NumericInput
                value={selectedText.shadowBlur}
                onChange={(v) => update({ shadowBlur: Math.max(0, v) })}
                min={0}
                max={50}
                width="w-12"
              />
            </div>

            <div className="flex items-center gap-1.5 ml-2">
              <FieldLabel>Offset X</FieldLabel>
              <NumericInput
                value={selectedText.shadowOffsetX}
                onChange={(v) => update({ shadowOffsetX: v })}
                min={-50}
                max={50}
                width="w-12"
              />
            </div>

            <div className="flex items-center gap-1.5 ml-2">
              <FieldLabel>Offset Y</FieldLabel>
              <NumericInput
                value={selectedText.shadowOffsetY}
                onChange={(v) => update({ shadowOffsetY: v })}
                min={-50}
                max={50}
                width="w-12"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
