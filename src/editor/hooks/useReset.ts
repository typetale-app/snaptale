import { useEditor } from "../context/EditorContext";

export const useReset = () => {
  const {
    setZoom,
    setStagePos,
    setImageRotation,
    setImageScaleX,
    setImageScaleY,
    setFilters,
    clearAllTexts,
    setCrop,
    imageSize,
  } = useEditor();

  const handleReset = () => {
    // Reset view
    setZoom(0.8);
    setStagePos({
      x: imageSize.width * 0.1,
      y: imageSize.height * 0.1,
    });
    // Reset transforms
    setImageRotation(0);
    setImageScaleX(1);
    setImageScaleY(1);
    // Reset filters
    setFilters({ preset: "none", brightness: 0, contrast: 0, saturation: 0, blur: 0 });
    // Reset text & symbols
    clearAllTexts();
    // Reset crop
    if (imageSize.width > 0 && imageSize.height > 0) {
      setCrop({
        x: imageSize.width * 0.1,
        y: imageSize.height * 0.1,
        width: imageSize.width * 0.8,
        height: imageSize.height * 0.8,
      });
    }
  };

  return { handleReset };
};
