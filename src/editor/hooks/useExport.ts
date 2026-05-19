import Konva from "konva";
import { useEditor } from "../context/EditorContext";

export const useExport = () => {
  const { stageRef, baseScale, zoom, activeTool, crop } = useEditor();

  const handleExport = () => {
    const stage = stageRef.current;
    // We get the img from the EditorContext indirectly or we check if there is an imageNode.
    if (!stage) return;

    // 1. Find the Konva.Image node
    const imageNode = stage.findOne("Image") as Konva.Image | undefined;
    if (!imageNode) return;
    
    const wasCached = imageNode.isCached();

    // 2. Find and hide all Transformers (for texts and symbols)
    const transformers = stage.find("Transformer");
    transformers.forEach((tr) => tr.hide());

    // 3. Find and hide the crop tool overlay group (if active)
    const cropGroup = stage.findOne(".crop-group");
    if (cropGroup) {
      cropGroup.hide();
    }

    // 4. If image has filters and is cached, temporarily cache it at original high-resolution
    if (wasCached) {
      imageNode.clearCache();
      imageNode.cache({
        pixelRatio: 1 / baseScale,
      });
    }

    // 5. Force redraw the layers to apply hidden/high-res state
    stage.getLayers().forEach((layer) => {
      layer.draw();
    });

    // 6. Determine region and pixelRatio to export at high/original resolution
    let options: any = {
      pixelRatio: 1 / (baseScale * zoom),
    };

    if (activeTool === "crop") {
      // In crop mode, export only the crop bounding box area
      options = {
        ...options,
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
      };
    }

    // 7. Generate data URL
    const dataUrl = stage.toDataURL(options);

    // 8. Download the image
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = dataUrl;
    link.click();

    // 9. Restore visibility of transformers and crop group
    transformers.forEach((tr) => tr.show());
    if (cropGroup) {
      cropGroup.show();
    }

    // 10. Restore image cache to normal display resolution if it was cached
    if (wasCached) {
      imageNode.clearCache();
      imageNode.cache();
    }

    stage.getLayers().forEach((layer) => {
      layer.batchDraw();
    });
  };

  return { handleExport };
};
