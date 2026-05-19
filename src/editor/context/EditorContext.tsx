import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Konva from "konva";

export type ToolType =
  | "crop"
  | "filter"
  | "adjust"
  | "rotate"
  | "text"
  | "symbols"
  | null;

export interface CropConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextConfig {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontStyle: string; // 'normal' | 'bold' | 'italic' | 'bold italic'
  textDecoration: string; // '' | 'underline'
  fill: string;
  align: string; // 'left' | 'center' | 'right'
  opacity: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  letterSpacing: number;
}

export interface SymbolConfig {
  id: string;
  type: "emoji" | "shape";
  shapeType?: "rect" | "circle" | "triangle" | "star" | "arrow" | "line";
  emoji?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  keepRatio: boolean;
}

export interface FilterConfig {
  preset: string; // 'none', 'grayscale', 'sepia', 'vintage', 'warm', 'cool'
  brightness: number; // -1 to 1
  contrast: number; // -100 to 100
  saturation: number; // -1 to 1 (using HSL)
  blur: number; // 0 to 40
}

export interface StageSize {
  width: number;
  height: number;
}

interface EditorState {
  imageUrl: string;
  stageSize: StageSize;
  setStageSize: (size: StageSize) => void;
  // The image's display dimensions (stays constant across crop commits)
  imageSize: StageSize;
  setImageSize: (size: StageSize) => void;
  baseScale: number;
  setBaseScale: (scale: number) => void;

  // Viewport
  zoom: number;
  setZoom: (zoom: number | ((z: number) => number)) => void;
  stagePos: { x: number; y: number };
  setStagePos: (pos: { x: number; y: number }) => void;

  // Tools
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;

  // Crop Tool State
  crop: CropConfig;
  setCrop: (crop: CropConfig | ((c: CropConfig) => CropConfig)) => void;

  // Image Transforms
  imageRotation: number;
  setImageRotation: (rot: number | ((r: number) => number)) => void;
  imageScaleX: number;
  setImageScaleX: (sx: number | ((s: number) => number)) => void;
  imageScaleY: number;
  setImageScaleY: React.Dispatch<React.SetStateAction<number>>;

  filters: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;

  // Text Tool State
  texts: TextConfig[];
  selectedTextId: string | null;
  setSelectedTextId: (id: string | null) => void;
  addText: (text?: Partial<TextConfig>) => string;
  updateText: (id: string, updates: Partial<TextConfig>) => void;
  deleteText: (id: string) => void;
  clearAllTexts: () => void;

  // Symbols Tool State
  symbols: SymbolConfig[];
  selectedSymbolId: string | null;
  setSelectedSymbolId: (id: string | null) => void;
  addSymbol: (
    payload: { type: "emoji"; emoji: string } | { type: "shape"; shapeType: "rect" | "circle" | "triangle" | "star" | "arrow" | "line" }
  ) => string;
  updateSymbol: (id: string, updates: Partial<SymbolConfig>) => void;
  deleteSymbol: (id: string) => void;
  clearAllSymbols: () => void;

  /**
   * Commits the current crop: resizes the Stage canvas to the crop rect and
   * shifts stagePos so the crop's top-left aligns with canvas (0, 0).
   * Saves the crop-mode viewport so it can be restored later.
   */
  applyCrop: () => void;

  /**
   * Restores the viewport to the crop-mode view (before the last applyCrop).
   */
  restoreCropView: () => void;

  /**
   * Ref to the Konva Stage component.
   */
  stageRef: React.RefObject<Konva.Stage | null>;
}

const EditorContext = createContext<EditorState | undefined>(undefined);

export const EditorProvider: React.FC<{
  imageUrl: string;
  children: ReactNode;
}> = ({ imageUrl, children }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState<StageSize>({
    width: 0,
    height: 0,
  });
  const [imageSize, setImageSize] = useState<StageSize>({
    width: 0,
    height: 0,
  });
  const [baseScale, setBaseScale] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(0.8);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<ToolType>("crop");
  const [crop, setCrop] = useState<CropConfig>({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });

  const [imageRotation, setImageRotation] = useState<number>(0);
  const [imageScaleX, setImageScaleX] = useState<number>(1);
  const [imageScaleY, setImageScaleY] = useState<number>(1);

  // Filters state
  const [filters, setFilters] = useState<FilterConfig>({
    preset: "none",
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
  });

  const [texts, setTexts] = useState<TextConfig[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // Symbols tool state
  const [symbols, setSymbols] = useState<SymbolConfig[]>([]);
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);

  const addText = useCallback((overrides?: Partial<TextConfig>): string => {
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
  }, [stageSize]);

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

  // Saved crop-mode viewport so we can restore it when re-entering crop.
  const savedCropViewRef = useRef<{
    stageSize: StageSize;
    stagePos: { x: number; y: number };
    zoom: number;
    crop: CropConfig;
  } | null>(null);

  // Keep a ref to stagePos so applyCrop always reads the latest value
  // without needing it as a useCallback dependency (which would re-create
  // the function on every pan, causing the trigger effect to re-run).
  const stagePosRef = useRef(stagePos);
  const zoomRef = useRef(zoom);
  const stageSizeRef = useRef(stageSize);
  useEffect(() => { stagePosRef.current = stagePos; }, [stagePos]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { stageSizeRef.current = stageSize; }, [stageSize]);

  const applyCrop = useCallback(() => {
    setCrop((currentCrop) => {
      const pos = stagePosRef.current;
      const currentZoom = zoomRef.current;
      const currentStageSize = stageSizeRef.current;

      // Save the current crop-mode viewport so we can restore it.
      savedCropViewRef.current = {
        stageSize: currentStageSize,
        stagePos: pos,
        zoom: currentZoom,
        crop: currentCrop,
      };

      // Resize the Konva Stage canvas to exactly the crop dimensions.
      setStageSize({ width: currentCrop.width, height: currentCrop.height });

      // Shift stagePos so the crop's top-left corner becomes the new (0, 0).
      setStagePos({ x: pos.x - currentCrop.x, y: pos.y - currentCrop.y });

      // Reset crop to cover the new (resized) stage. The original crop is
      // already saved in savedCropViewRef for restoreCropView to use.
      return { x: 0, y: 0, width: currentCrop.width, height: currentCrop.height };
    });
  }, [setStageSize, setStagePos]);

  const restoreCropView = useCallback(() => {
    const saved = savedCropViewRef.current;
    if (!saved) return;

    setStageSize(saved.stageSize);
    setStagePos(saved.stagePos);
    setZoom(saved.zoom);
    setCrop(saved.crop);
  }, [setStageSize, setStagePos, setZoom]);

  const value: EditorState = {
    imageUrl,
    stageSize,
    setStageSize,
    imageSize,
    setImageSize,
    baseScale,
    setBaseScale,
    zoom,
    setZoom,
    stagePos,
    setStagePos,
    activeTool,
    setActiveTool,
    crop,
    setCrop,
    imageRotation,
    setImageRotation,
    imageScaleX,
    setImageScaleX,
    imageScaleY,
    setImageScaleY,
    filters,
    setFilters,
    texts,
    selectedTextId,
    setSelectedTextId,
    addText,
    updateText,
    deleteText,
    clearAllTexts,
    symbols,
    selectedSymbolId,
    setSelectedSymbolId,
    addSymbol,
    updateSymbol,
    deleteSymbol,
    clearAllSymbols,
    applyCrop,
    restoreCropView,
    stageRef,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
