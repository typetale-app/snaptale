import { FlipHorizontal, Square } from "lucide-react";
import { useEditor } from "../context/EditorContext";
import ImageRotateIcon from "@/components/icons/image-rotate";

export const CropTopToolbar = () => {
  const { setImageRotation, setImageScaleX } = useEditor();

  return (
    <div className="flex items-center justify-center gap-8 py-6 text-zinc-300 w-full">
      <button
        onClick={() => setImageRotation((prev) => prev - 90)}
        className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium"
      >
        <ImageRotateIcon />
        Rotate left
      </button>
      <button
        onClick={() => setImageScaleX((prev) => prev * -1)}
        className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium"
      >
        <FlipHorizontal size={18} />
        Flip horizontal
      </button>
      <button className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium">
        <Square size={18} />
        Crop shape
      </button>
    </div>
  );
};
