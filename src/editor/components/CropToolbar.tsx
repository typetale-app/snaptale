import React from "react";
import {
  FlipHorizontal,
  RotateCcw,
  RotateCw,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcwSquare,
  RotateCwSquare,
} from "lucide-react";
import { useEditor } from "../context/EditorContext";
import ImageRotateIcon from "@/components/icons/image-rotate";
import {
  BottomToolbarWithNav,
  useToolbarNav,
  type ToolbarPage,
} from "./BottomToolbar";

/* ─── Sub-option button (navigates to a sub-page) ─── */
const SubOptionBtn: React.FC<{
  label: string;
  icon: React.ReactNode;
  pageId: string;
  detail?: string;
}> = ({ label, icon, pageId, detail }) => {
  const { navigateTo } = useToolbarNav();
  return (
    <button
      onClick={() => navigateTo(pageId)}
      className="flex items-center gap-1.5 h-8 px-2.5 rounded-md transition-all text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
    >
      {icon}
      <span className="font-medium">{label}</span>
      {detail && (
        <span className="text-zinc-600 tabular-nums text-[10px]">{detail}</span>
      )}
      <ChevronRight size={11} className="text-zinc-600 ml-0.5" />
    </button>
  );
};

/* ─── Main crop controls ─── */
const CropMainContent: React.FC = () => {
  const { imageRotation, setImageRotation, setImageScaleX, zoom } = useEditor();

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Rotate left 90° */}
      <button
        onClick={() => setImageRotation((prev: number) => prev - 90)}
        title="Rotate Left 90°"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <ImageRotateIcon />
      </button>

      {/* Flip horizontal */}
      <button
        onClick={() => setImageScaleX((prev: number) => prev * -1)}
        title="Flip Horizontal"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <FlipHorizontal size={14} />
      </button>

      <div className="w-px h-5 bg-zinc-800" />

      {/* Navigate to Straighten sub-page */}
      <SubOptionBtn
        label="Straighten"
        icon={<RotateCw size={13} />}
        pageId="angle"
        detail={`${imageRotation % 360}°`}
      />

      {/* Navigate to Zoom sub-page */}
      <SubOptionBtn
        label="Zoom"
        icon={<ZoomIn size={13} />}
        pageId="zoom"
        detail={`${(zoom * 100).toFixed(0)}%`}
      />
    </div>
  );
};

/* ─── Straighten Sub-Page ─── */
const CropAngleContent: React.FC = () => {
  const { imageRotation, setImageRotation } = useEditor();
  const angle = imageRotation % 360;

  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={() => setImageRotation((r: number) => r - 1)}
        title="Rotate Left"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <RotateCcwSquare size={14} />
      </button>

      <div className="flex-1 flex items-center gap-2">
        <input
          type="range"
          min={-45}
          max={45}
          step={1}
          value={angle}
          onChange={(e) => setImageRotation(Number(e.target.value))}
          className="flex-1 h-1 bg-zinc-800 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:rounded-full"
        />
        <span className="text-xs text-zinc-400 tabular-nums w-10 text-right">
          {angle}°
        </span>
      </div>

      <button
        onClick={() => setImageRotation((r: number) => r + 1)}
        title="Rotate Right"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <RotateCwSquare size={14} />
      </button>

      <div className="w-px h-5 bg-zinc-800" />

      <button
        onClick={() => setImageRotation(0)}
        title="Reset Angle"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <RotateCcw size={13} />
      </button>
    </div>
  );
};

/* ─── Zoom Sub-Page ─── */
const CropZoomContent: React.FC = () => {
  const { zoom, setZoom, setStagePos } = useEditor();

  const handleReset = () => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={() => setZoom((z: number) => Math.max(0.5, z * 0.8))}
        title="Zoom Out"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <ZoomOut size={14} />
      </button>

      <div className="flex-1 flex items-center gap-2">
        <input
          type="range"
          min={50}
          max={300}
          step={1}
          value={Math.round(zoom * 100)}
          onChange={(e) => setZoom(Number(e.target.value) / 100)}
          className="flex-1 h-1 bg-zinc-800 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:rounded-full"
        />
        <span className="text-xs text-zinc-400 tabular-nums w-10 text-right">
          {(zoom * 100).toFixed(0)}%
        </span>
      </div>

      <button
        onClick={() => setZoom((z: number) => Math.min(3, z * 1.2))}
        title="Zoom In"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <ZoomIn size={14} />
      </button>

      <div className="w-px h-5 bg-zinc-800" />

      <button
        onClick={handleReset}
        title="Reset Zoom"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
      >
        <RotateCcw size={13} />
      </button>
    </div>
  );
};

/* ─── Exported CropToolbar ─── */
export const CropToolbar: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { imageRotation } = useEditor();

  const pages: ToolbarPage[] = [
    { id: "main", label: "Crop", content: <CropMainContent /> },
    {
      id: "angle",
      label: "Straighten",
      content: <CropAngleContent />,
    },
    { id: "zoom", label: "Zoom", content: <CropZoomContent /> },
  ];

  return <BottomToolbarWithNav visible={visible} pages={pages} />;
};
