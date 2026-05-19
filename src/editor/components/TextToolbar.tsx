import React from "react";
import {
  Plus,
  Bold,
  Italic,
  Underline,
  Trash2,
  ChevronDown,
  ChevronRight,
  MoveHorizontal,
  Blend,
  Layers,
  Settings2,
} from "lucide-react";
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
    className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
      active
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
      className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl transition-all text-xs ${
        active
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
    <div className="text-white/40 group-hover:text-white/80 transition-colors">
      {icon}
    </div>
    <EditorSlider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-14 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5"
    />
  </div>
);

/* ─── Slider with text label ─── */
const LabelSlider: React.FC<{
  label: string;
  title: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}> = ({ label, title, value, onChange, min, max, step }) => (
  <div className="flex items-center gap-2 group" title={title}>
    <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider group-hover:text-white/80 transition-colors">
      {label}
    </span>
    <EditorSlider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-14 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5"
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
          <div className="relative">
            <select
              value={selectedText.fontFamily}
              onChange={(e) => update({ fontFamily: e.target.value })}
              className="appearance-none h-8 bg-white/5 hover:bg-white/10 rounded-xl pl-2 pr-6 text-xs font-medium text-white/90 focus:outline-none transition-colors cursor-pointer min-w-[100px]"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>

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

        {/* Color Group */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex items-center justify-center">
            <input
              type="color"
              value={selectedText.fill}
              onChange={(e) => update({ fill: e.target.value })}
              className="w-5 h-5 rounded-full cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-white/20 hover:scale-110 transition-transform shadow-sm"
              title="Custom Color"
            />
          </div>
          <div className="w-px h-3 bg-white/10 mx-0.5" />
          <div className="flex gap-1 items-center">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => update({ fill: c })}
                className={`w-4 h-4 rounded-full transition-all duration-100 ${
                  selectedText.fill.toLowerCase() === c.toLowerCase()
                    ? "ring-1 ring-white ring-offset-2 ring-offset-[#18181A] scale-110 border-none shadow-sm"
                    : "hover:scale-110 border border-white/10"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

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
    <div className="flex items-center gap-5 w-full overflow-x-auto no-scrollbar scroll-smooth pr-4">
      {/* Opacity & Spacing */}
      <div className="flex items-center gap-4 shrink-0">
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
      </div>

      <div className="w-px h-4 bg-white/10 shrink-0" />

      {/* Shadow Toggle & Settings */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <ToggleBtn
            active={selectedText.shadowEnabled}
            onClick={() =>
              update({ shadowEnabled: !selectedText.shadowEnabled })
            }
            title="Toggle Shadow"
          >
            <Layers size={13} />
          </ToggleBtn>

          <input
            type="color"
            value={selectedText.shadowColor}
            onChange={(e) => update({ shadowColor: e.target.value })}
            className="w-5 h-5 rounded-full cursor-pointer bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-white/20 hover:scale-110 transition-transform shadow-sm"
            title="Shadow Color"
          />
        </div>

        <LabelSlider
          label="Blur"
          title="Shadow Blur"
          value={selectedText.shadowBlur}
          onChange={(v) => update({ shadowBlur: v })}
          min={0}
          max={50}
          step={1}
        />

        <LabelSlider
          label="X"
          title="X Offset"
          value={selectedText.shadowOffsetX}
          onChange={(v) => update({ shadowOffsetX: v })}
          min={-50}
          max={50}
          step={1}
        />

        <LabelSlider
          label="Y"
          title="Y Offset"
          value={selectedText.shadowOffsetY}
          onChange={(v) => update({ shadowOffsetY: v })}
          min={-50}
          max={50}
          step={1}
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
    { id: "advance", label: "Advance", content: <TextAdvanceContent /> },
  ];

  return <BottomToolbar visible={visible} pages={pages} />;
};
