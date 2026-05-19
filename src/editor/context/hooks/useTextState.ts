import { useState, useCallback } from "react";
import type { TextConfig, StageSize } from "../EditorContext";

export const useTextState = (stageSize: StageSize) => {
  const [texts, setTexts] = useState<TextConfig[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const addText = useCallback(
    (overrides?: Partial<TextConfig>): string => {
      const id = `text-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newText: TextConfig = {
        id,
        text: "Your text",
        x: stageSize.width / 2 - 60,
        y: stageSize.height / 2 - 20,
        fontSize: 32,
        fontFamily: "Inter",
        fontStyle: "normal",
        textDecoration: "",
        fill: "#ffffff",
        align: "left",
        opacity: 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        shadowEnabled: false,
        shadowColor: "#000000",
        shadowBlur: 4,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        letterSpacing: 0,
        ...overrides,
      };
      setTexts((prev) => [...prev, newText]);
      setSelectedTextId(id);
      return id;
    },
    [stageSize]
  );

  const updateText = useCallback((id: string, updates: Partial<TextConfig>) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteText = useCallback((id: string) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
    setSelectedTextId((prev) => (prev === id ? null : prev));
  }, []);

  const clearAllTexts = useCallback(() => {
    setTexts([]);
    setSelectedTextId(null);
  }, []);

  return {
    texts,
    selectedTextId,
    setSelectedTextId,
    addText,
    updateText,
    deleteText,
    clearAllTexts,
  };
};
