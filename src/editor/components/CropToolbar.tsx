import React from "react";
import {
  FlipHorizontal,
  FlipVertical,
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
const CropOptionBtn: React.FC<{
  label: string;
  icon: React.ReactNode;
  detail?: string;
  pageId: string;
}> = ({ label, icon, detail, pageId }) => {
  const { navigateTo } = useToolbarNav();
  return (
    <button
      onClick={() => navigateTo(pageId)}
      className="flex items-center gap-1.5 h-8 px-2.5 rounded-xl transition-all text-xs text-white/70 hover:text-white hover:bg-white/10"
    >
      {icon}
      <span className="font-medium">{label}</span>
      {detail && (
        <span className="text-white/50 tabular-nums text-[10px]">{detail}</span>
      )}
      <ChevronRight size={11} className="text-white/40 ml-0.5" />
    </button>
  );
};

/* ─── Main crop controls ─── */
const CropMainContent: React.FC = () => {
  const { setImageRotation, setImageScaleX, setImageScaleY, zoom, imageRotation } = useEditor();

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        onClick={() =>
          setImageRotation(
            (r: number) => Math.round((r - 90) / 90) * 90
          )
        }
        title="Rotate Left 90°"
        className="flex items-center gap-2 px-3 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
      >
        <RotateCcw size={14} />
        <span>Rotate</span>
      </button>

      <button
        onClick={() => setImageScaleX((s: number) => s * -1)}
        title="Flip Horizontal"
        className="flex items-center gap-2 px-3 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
      >
        <FlipHorizontal size={14} />
        <span>Flip H</span>
      </button>

      <button
        onClick={() => setImageScaleY((s: number) => s * -1)}
        title="Flip Vertical"
        className="flex items-center gap-2 px-3 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
      >
        <FlipVertical size={14} />
        <span>Flip V</span>
      </button>

      <div className="w-[1px] h-4 bg-white/10" />

      {/* Navigate to Straighten sub-page */}
      <CropOptionBtn
        label="Straighten"
        icon={<RotateCw size={13} />}
        pageId="angle"
        detail={`${imageRotation % 360}°`}
      />

      {/* Navigate to Zoom sub-page */}
      <CropOptionBtn
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
  const baseRotation = Math.floor(imageRotation / 90) * 90;
  const angle = imageRotation % 360;

  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={() => setImageRotation((r: number) => r - 1)}
        title="Rotate Left"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
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
          onChange={(e) =>
            setImageRotation(baseRotation + Number(e.target.value))
          }
          className="flex-1 h-1 bg-white/10 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
        />
        <span className="text-xs text-white/50 tabular-nums w-10 text-right">
          {angle}°
        </span>
      </div>

      <button
        onClick={() => setImageRotation((r: number) => r + 1)}
        title="Rotate Right"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <RotateCwSquare size={14} />
      </button>

      <div className="w-[1px] h-4 bg-white/10" />

      <button
        onClick={() => setImageRotation(0)}
        title="Reset Angle"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <RotateCcw size={13} />
      </button>
    </div>
  );
};

/* ─── Zoom Sub-Page ─── */
const CropZoomContent: React.FC = () => {
  const { zoom, setZoom, setStagePos } = useEditor();

  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
        title="Zoom Out"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <ZoomOut size={14} />
      </button>

      <div className="flex-1 flex items-center gap-2">
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 h-1 bg-white/10 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
        />
        <span className="text-xs text-white/50 tabular-nums w-10 text-right">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <button
        onClick={() => setZoom(Math.min(3, zoom + 0.1))}
        title="Zoom In"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <ZoomIn size={14} />
      </button>

      <div className="w-[1px] h-4 bg-white/10" />

      <button
        onClick={() => {
          setZoom(1);
          setStagePos({ x: 0, y: 0 });
        }}
        title="Reset Zoom"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
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
