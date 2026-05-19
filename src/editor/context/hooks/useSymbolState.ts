import { useState, useCallback } from "react";
import type { SymbolConfig, StageSize } from "../EditorContext";

export const useSymbolState = (stageSize: StageSize) => {
  const [symbols, setSymbols] = useState<SymbolConfig[]>([]);
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);

  const addSymbol = useCallback(
    (
      payload:
        | { type: "emoji"; emoji: string }
        | { type: "shape"; shapeType: "rect" | "circle" | "triangle" | "star" | "arrow" | "line" }
    ): string => {
      const id = `symbol-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      
      const baseProps = {
        id,
        type: payload.type,
        x: stageSize.width / 2 - 40,
        y: stageSize.height / 2 - 40,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        keepRatio: true,
      };

      let newSymbol: SymbolConfig;

      if (payload.type === "emoji") {
        newSymbol = {
          ...baseProps,
          emoji: payload.emoji,
          fontSize: 80,
        };
      } else {
        newSymbol = {
          ...baseProps,
          shapeType: payload.shapeType,
          width: 80,
          height: 80,
          fill: "#ffffff",
        };
      }

      setSymbols((prev) => [...prev, newSymbol]);
      setSelectedSymbolId(id);
      return id;
    },
    [stageSize]
  );

  const updateSymbol = useCallback((id: string, updates: Partial<SymbolConfig>) => {
    setSymbols((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSymbol = useCallback((id: string) => {
    setSymbols((prev) => prev.filter((s) => s.id !== id));
    setSelectedSymbolId((prev) => (prev === id ? null : prev));
  }, []);

  const clearAllSymbols = useCallback(() => {
    setSymbols([]);
    setSelectedSymbolId(null);
  }, []);

  return {
    symbols,
    selectedSymbolId,
    setSelectedSymbolId,
    addSymbol,
    updateSymbol,
    deleteSymbol,
    clearAllSymbols,
  };
};
