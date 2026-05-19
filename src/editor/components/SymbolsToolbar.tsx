import React, { useState } from "react";
import { BottomToolbar, type ToolbarPage } from "./BottomToolbar";
import { useEditor } from "../context/EditorContext";
import { EditorSlider } from "./EditorSlider";
import {
  Trash2,
  Blend,
  SmilePlus,
  Square,
  Circle as CircleIcon,
  Triangle,
  Star as StarIcon,
  Lock,
  Unlock,
  ArrowRight,
  Minus,
} from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

/* ─── Main Content ─── */
const SymbolsMainContent: React.FC<{
  showPicker: boolean;
  setShowPicker: (s: boolean) => void;
}> = ({ showPicker, setShowPicker }) => {
  const {
    symbols,
    selectedSymbolId,
    setSelectedSymbolId,
    addSymbol,
    deleteSymbol,
    updateSymbol,
  } = useEditor();
  const selectedSymbol = symbols.find((s) => s.id === selectedSymbolId);

  // ── Selected symbol options ──
  if (selectedSymbol) {
    const isShape = selectedSymbol.type === "shape";

    return (
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedSymbolId(null)}
            className="text-[11px] font-medium text-white/70 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors uppercase tracking-wider shrink-0"
          >
            ← Back
          </button>

          <div className="w-px h-4 bg-white/10" />

          <div className="flex items-center gap-2 group" title="Opacity">
            <Blend
              size={13}
              className="text-white/40 group-hover:text-white/80 transition-colors"
            />
            <EditorSlider
              min={0}
              max={1}
              step={0.01}
              value={selectedSymbol.opacity}
              onChange={(val) =>
                updateSymbol(selectedSymbol.id, {
                  opacity: val,
                })
              }
              className="w-16 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5"
            />
          </div>

          {isShape && (
            <>
              <div className="w-px h-4 bg-white/10" />

              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full overflow-hidden border border-white/20 relative cursor-pointer"
                  title="Fill Color"
                >
                  <input
                    type="color"
                    value={selectedSymbol.fill || "#ffffff"}
                    onChange={(e) =>
                      updateSymbol(selectedSymbol.id, { fill: e.target.value })
                    }
                    className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer"
                  />
                </div>
                <div
                  className="w-5 h-5 rounded-full overflow-hidden border-2 border-white/40 relative cursor-pointer flex items-center justify-center"
                  title="Border Color"
                >
                  <div
                    className="w-full h-full pointer-events-none absolute inset-0"
                    style={{
                      backgroundColor: selectedSymbol.stroke || "transparent",
                    }}
                  />
                  <input
                    type="color"
                    value={selectedSymbol.stroke || "#000000"}
                    onChange={(e) =>
                      updateSymbol(selectedSymbol.id, {
                        stroke: e.target.value,
                      })
                    }
                    className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              <div
                className="flex items-center gap-1.5 group"
                title="Border Width"
              >
                <CircleIcon size={11} className="text-white/40" />
                <EditorSlider
                  min={0}
                  max={40}
                  step={1}
                  value={selectedSymbol.strokeWidth || 0}
                  onChange={(val) =>
                    updateSymbol(selectedSymbol.id, {
                      strokeWidth: val,
                    })
                  }
                  className="w-12 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5"
                />
              </div>
            </>
          )}

          <div className="w-px h-4 bg-white/10" />

          <button
            onClick={() =>
              updateSymbol(selectedSymbol.id, {
                keepRatio: !selectedSymbol.keepRatio,
              })
            }
            title={
              selectedSymbol.keepRatio
                ? "Unlock Aspect Ratio"
                : "Lock Aspect Ratio"
            }
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
              selectedSymbol.keepRatio
                ? "bg-white/20 text-white"
                : "text-white/40 hover:bg-white/10 hover:text-white"
            }`}
          >
            {selectedSymbol.keepRatio ? (
              <Lock size={12} />
            ) : (
              <Unlock size={12} />
            )}
          </button>
        </div>

        <button
          onClick={() => deleteSymbol(selectedSymbol.id)}
          title="Delete Sticker/Shape"
          className="w-8 h-8 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  }

  // ── Choose Sticker / Add Shape View ──
  return (
    <div className="w-full flex items-center justify-center py-1 gap-4">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`flex items-center gap-2 px-4 h-9 font-medium text-sm rounded-xl transition-all shadow-sm ${
            showPicker
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          <SmilePlus size={16} />
          <span>{showPicker ? "Close Picker" : "Stickers"}</span>
        </button>
      </div>

      <div className="w-px h-5 bg-white/10" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => addSymbol({ type: "shape", shapeType: "rect" })}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all hover:scale-110"
          title="Add Square"
        >
          <Square size={18} fill="currentColor" />
        </button>
        <button
          onClick={() => addSymbol({ type: "shape", shapeType: "circle" })}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all hover:scale-110"
          title="Add Circle"
        >
          <CircleIcon size={18} fill="currentColor" />
        </button>
        <button
          onClick={() => addSymbol({ type: "shape", shapeType: "triangle" })}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all hover:scale-110"
          title="Add Triangle"
        >
          <Triangle size={18} fill="currentColor" />
        </button>
        <button
          onClick={() => addSymbol({ type: "shape", shapeType: "star" })}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all hover:scale-110"
          title="Add Star"
        >
          <StarIcon size={18} fill="currentColor" />
        </button>
        <button
          onClick={() => addSymbol({ type: "shape", shapeType: "arrow" })}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all hover:scale-110"
          title="Add Arrow"
        >
          <ArrowRight size={18} />
        </button>
        <button
          onClick={() => addSymbol({ type: "shape", shapeType: "line" })}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-all hover:scale-110"
          title="Add Line"
        >
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
};

export const SymbolsToolbar: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { addSymbol } = useEditor();
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    addSymbol({ type: "emoji", emoji: emojiData.emoji });
    setShowPicker(false);
  };

  const pages: ToolbarPage[] = [
    {
      id: "main",
      label: "Stickers",
      content: (
        <SymbolsMainContent
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      ),
    },
  ];

  return (
    <>
      <BottomToolbar visible={visible} pages={pages} />

      {visible && showPicker && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={onEmojiClick}
            lazyLoadEmojis={true}
            searchPlaceHolder="Search stickers..."
            autoFocusSearch={false}
            skinTonesDisabled
          />
        </div>
      )}
    </>
  );
};
