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
import { EditorSlider } from "./EditorSlider";
import ImageRotateIcon from "@/components/icons/image-rotate";
import {
  BottomToolbar,
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
      className="flex items-center gap-1.5 h-8 px-2.5 rounded-xl transition-all text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10"
    >
      {icon}
      <span>{label}</span>
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
  const nearest90 = Math.round(imageRotation / 90) * 90;
  const deviation = imageRotation - nearest90;

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        onClick={() =>
          setImageRotation(
            (r: number) => r - 90
          )
        }
        title="Rotate Left 90°"
        className="flex items-center gap-2 px-3 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
      >
        <RotateCcw size={14} />
        <span>Rotate</span>
      </button>

      <button
        onClick={() => setImageScaleX((s: number) => s * -1)}
        title="Flip Horizontal"
        className="flex items-center gap-2 px-3 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
      >
        <FlipHorizontal size={14} />
        <span>Flip H</span>
      </button>

      <button
        onClick={() => setImageScaleY((s: number) => s * -1)}
        title="Flip Vertical"
        className="flex items-center gap-2 px-3 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
      >
        <FlipVertical size={14} />
        <span>Flip V</span>
      </button>

      <div className="w-px h-4 bg-white/10" />

      {/* Navigate to Straighten sub-page */}
      <CropOptionBtn
        label="Straighten"
        icon={<RotateCw size={13} />}
        pageId="angle"
        detail={`${deviation === 0 ? "0" : deviation > 0 ? `+${deviation}` : deviation}°`}
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
  const nearest90 = Math.round(imageRotation / 90) * 90;
  const deviation = imageRotation - nearest90;

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
        <EditorSlider
          min={-45}
          max={45}
          step={1}
          value={deviation}
          onChange={(val) => setImageRotation(nearest90 + val)}
          className="flex-1"
        />
        <span className="text-xs text-white/50 tabular-nums w-10 text-right">
          {deviation === 0 ? "0" : deviation > 0 ? `+${deviation}` : deviation}°
        </span>
      </div>

      <button
        onClick={() => setImageRotation((r: number) => r + 1)}
        title="Rotate Right"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <RotateCwSquare size={14} />
      </button>

      <div className="w-px h-4 bg-white/10" />

      <button
        onClick={() => setImageRotation(nearest90)}
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
  const { zoom, setZoom, setStagePos, imageSize } = useEditor();

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
        <EditorSlider
          min={0.5}
          max={3}
          step={0.01}
          value={zoom}
          onChange={setZoom}
          className="flex-1"
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

      <div className="w-px h-4 bg-white/10" />

      <button
        onClick={() => {
          setZoom(0.8);
          setStagePos({
            x: imageSize.width * 0.1,
            y: imageSize.height * 0.1,
          });
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

  return <BottomToolbar visible={visible} pages={pages} />;
};
