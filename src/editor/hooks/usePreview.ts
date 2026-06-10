import Konva from "konva";
import { useEditor } from "../context/EditorContext";

export const usePreview = () => {
  const { stageRef, baseScale, zoom, activeTool, crop } = useEditor();

  const generatePreview = (): string | null => {
    const stage = stageRef.current;
    if (!stage) return null;

    const imageNode = stage.findOne("Image") as Konva.Image | undefined;
    if (!imageNode) return null;

    const wasCached = imageNode.isCached();

    // Hide UI overlays
    const transformers = stage.find("Transformer");
    transformers.forEach((tr) => tr.hide());
    const cropGroup = stage.findOne(".crop-group");
    if (cropGroup) cropGroup.hide();

    // Temporarily cache at high-res if needed
    if (wasCached) {
      imageNode.clearCache();
      imageNode.cache({ pixelRatio: 1 / baseScale });
    }

    stage.getLayers().forEach((layer) => layer.draw());

    let options: any = { pixelRatio: 1 / (baseScale * zoom) };
    if (activeTool === "crop") {
      options = { ...options, x: crop.x, y: crop.y, width: crop.width, height: crop.height };
    }

    const dataUrl = stage.toDataURL(options);

    // Restore
    transformers.forEach((tr) => tr.show());
    if (cropGroup) cropGroup.show();
    if (wasCached) {
      imageNode.clearCache();
      imageNode.cache();
    }
    stage.getLayers().forEach((layer) => layer.batchDraw());

    return dataUrl;
  };

  return { generatePreview };
};
