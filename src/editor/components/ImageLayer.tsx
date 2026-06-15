import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Group, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { useEditor } from "../context/EditorContext";

const ClarendonFilter = (imageData: ImageData) => {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i]!;
    let g = data[i+1]!;
    let b = data[i+2]!;
    r = (r - 127) * 1.1 + 127;
    g = (g - 127) * 1.1 + 127;
    b = (b - 127) * 1.1 + 127;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    if (luma < 127) {
      b += (127 - luma) * 0.15;
      g += (127 - luma) * 0.05;
    } else {
      r += (luma - 127) * 0.15;
      g += (luma - 127) * 0.1;
    }
    data[i] = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
};

const GinghamFilter = (imageData: ImageData) => {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i]!;
    let g = data[i+1]!;
    let b = data[i+2]!;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    r = r * 0.7 + luma * 0.3;
    g = g * 0.7 + luma * 0.3;
    b = b * 0.7 + luma * 0.3;
    r = (r - 127) * 0.9 + 127 + 10;
    g = (g - 127) * 0.9 + 127 + 10;
    b = (b - 127) * 0.9 + 127 + 15;
    data[i] = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
};

const JunoFilter = (imageData: ImageData) => {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i]!;
    let g = data[i+1]!;
    let b = data[i+2]!;
    r = (r - 127) * 1.15 + 127 + 10;
    g = (g - 127) * 1.15 + 127 + 8;
    b = (b - 127) * 1.1 + 127 + 2;
    r = r * 1.05;
    g = g * 1.02;
    data[i] = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
};

const LarkFilter = (imageData: ImageData) => {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i]!;
    let g = data[i+1]!;
    let b = data[i+2]!;
    r += 5; g += 5; b += 5;
    g *= 1.05;
    b *= 1.08;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    r = r * 0.8 + luma * 0.2;
    data[i] = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
};

const ValenciaFilter = (imageData: ImageData) => {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i]!;
    let g = data[i+1]!;
    let b = data[i+2]!;
    r = r * 1.08 + 10;
    g = g * 1.04 + 8;
    b = b * 0.9 + 5;
    r = (r - 127) * 0.95 + 127;
    g = (g - 127) * 0.95 + 127;
    b = (b - 127) * 0.95 + 127;
    data[i] = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
};

const LudwigFilter = (imageData: ImageData) => {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i]!;
    let g = data[i+1]!;
    let b = data[i+2]!;
    r = (r - 127) * 1.05 + 127;
    g = (g - 127) * 1.05 + 127;
    b = (b - 127) * 1.05 + 127;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    r = r * 1.15;
    g = g * 0.9 + luma * 0.1;
    b = b * 0.9 + luma * 0.1;
    data[i] = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
};

const LofiFilter = (imageData: ImageData) => {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i]!;
    let g = data[i+1]!;
    let b = data[i+2]!;
    r = (r - 127) * 1.3 + 127;
    g = (g - 127) * 1.3 + 127;
    b = (b - 127) * 1.3 + 127;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    r = r * 1.35 - luma * 0.35;
    g = g * 1.35 - luma * 0.35;
    b = b * 1.35 - luma * 0.35;
    data[i] = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
};

const SierraFilter = (imageData: ImageData) => {
  const data = imageData.data;
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i]!;
    let g = data[i+1]!;
    let b = data[i+2]!;
    r = (r - 127) * 0.85 + 127 + 10;
    g = (g - 127) * 0.85 + 127 + 8;
    b = (b - 127) * 0.85 + 127 + 2;
    r *= 1.05;
    g *= 1.02;
    b *= 0.95;
    data[i] = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
};

export const ImageLayer: React.FC = () => {
  const {
    imageUrl,
    stageSize,
    setStageSize,
    imageSize,
    setImageSize,
    setBaseScale,
    setCrop,
    crop,
    imageRotation,
    imageScaleX,
    imageScaleY,
    zoom,
    setZoom,
    stagePos,
    setStagePos,
    filters,
    activeTool,
  } = useEditor();
  const [img] = useImage(imageUrl, "anonymous");
  const imageGroupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);

  useLayoutEffect(() => {
    if (!imageGroupRef.current || !img || !crop) return;
    const node = imageGroupRef.current;
    const imageRect = node.getClientRect();

    if (imageRect.width === 0 || imageRect.height === 0) return;

    let newX = stagePos.x;
    let newY = stagePos.y;
    let newZoom = zoom;
    let needsUpdate = false;

    const scaleToFixWidth = crop.width / imageRect.width;
    const scaleToFixHeight = crop.height / imageRect.height;

    if (scaleToFixWidth > 1 || scaleToFixHeight > 1) {
      const requiredExtraScale = Math.max(scaleToFixWidth, scaleToFixHeight);
      newZoom = zoom * requiredExtraScale;
      needsUpdate = true;

      imageRect.width *= requiredExtraScale;
      imageRect.height *= requiredExtraScale;
      imageRect.x =
        stagePos.x + (imageRect.x - stagePos.x) * requiredExtraScale;
      imageRect.y =
        stagePos.y + (imageRect.y - stagePos.y) * requiredExtraScale;
    }

    if (imageRect.width >= crop.width) {
      if (imageRect.x > crop.x) {
        newX -= imageRect.x - crop.x;
        needsUpdate = true;
      } else if (imageRect.x + imageRect.width < crop.x + crop.width) {
        newX += crop.x + crop.width - (imageRect.x + imageRect.width);
        needsUpdate = true;
      }
    }
    if (imageRect.height >= crop.height) {
      if (imageRect.y > crop.y) {
        newY -= imageRect.y - crop.y;
        needsUpdate = true;
      } else if (imageRect.y + imageRect.height < crop.y + crop.height) {
        newY += crop.y + crop.height - (imageRect.y + imageRect.height);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      if (
        Math.abs(newZoom - zoom) > 0.001 ||
        Math.abs(newX - stagePos.x) > 0.5 ||
        Math.abs(newY - stagePos.y) > 0.5
      ) {
        setZoom(newZoom);
        setStagePos({ x: newX, y: newY });
      }
    }
  }, [
    zoom,
    stagePos,
    crop,
    img,
    imageRotation,
    imageScaleX,
    imageScaleY,
    setZoom,
    setStagePos,
  ]);

  useEffect(() => {
    if (img) {
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.7;

      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

      setBaseScale(ratio);
      const w = img.width * ratio;
      const h = img.height * ratio;
      setStageSize({ width: w, height: h });
      setImageSize({ width: w, height: h });

      // Center crop box initially
      setCrop({
        x: w * 0.1,
        y: h * 0.1,
        width: w * 0.8,
        height: h * 0.8,
      });

      // Keep zoom to 80% when first loaded
      setZoom(0.8);
      setStagePos({
        x: w * 0.1,
        y: h * 0.1,
      });
    }
  }, [img, setStageSize, setImageSize, setBaseScale, setCrop, setZoom, setStagePos]);

  // Apply Filters
  useEffect(() => {
    if (imageRef.current) {
      if (
        filters.preset === "none" &&
        filters.brightness === 0 &&
        filters.contrast === 0 &&
        filters.saturation === 0 &&
        filters.blur === 0
      ) {
        imageRef.current.clearCache();
        imageRef.current.filters([]);
      } else {
        const activeFilters = [];
        
        if (filters.preset === "grayscale") activeFilters.push(Konva.Filters.Grayscale);
        if (filters.preset === "sepia") activeFilters.push(Konva.Filters.Sepia);
        if (filters.preset === "invert") activeFilters.push(Konva.Filters.Invert);
        if (filters.preset === "pixelate") activeFilters.push(Konva.Filters.Pixelate);
        if (filters.preset === "noise") activeFilters.push(Konva.Filters.Noise);
        if (filters.preset === "clarendon") activeFilters.push(ClarendonFilter);
        if (filters.preset === "gingham") activeFilters.push(GinghamFilter);
        if (filters.preset === "juno") activeFilters.push(JunoFilter);
        if (filters.preset === "lark") activeFilters.push(LarkFilter);
        if (filters.preset === "valencia") activeFilters.push(ValenciaFilter);
        if (filters.preset === "ludwig") activeFilters.push(LudwigFilter);
        if (filters.preset === "lofi") activeFilters.push(LofiFilter);
        if (filters.preset === "sierra") activeFilters.push(SierraFilter);
        
        if (filters.brightness !== 0) activeFilters.push(Konva.Filters.Brighten);
        if (filters.contrast !== 0) activeFilters.push(Konva.Filters.Contrast);
        if (filters.saturation !== 0) activeFilters.push(Konva.Filters.HSL);
        if (filters.blur > 0) activeFilters.push(Konva.Filters.Blur);

        imageRef.current.filters(activeFilters);
        imageRef.current.cache();
      }
    }
  }, [filters, imageSize]); // Re-cache if size changes

  if (!img) return null;

  // Use imageSize (not stageSize) so the image doesn't squeeze after crop commits
  const centerX = imageSize.width / 2;
  const centerY = imageSize.height / 2;

  return (
    <Group>
      {/* Background Image (darkened) */}
      <Group
        name="image-group"
        ref={imageGroupRef}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={zoom}
        scaleY={zoom}
        draggable={activeTool === "crop"}
        onDragMove={(e) => {
          const node = e.target;
          let newX = node.x();
          let newY = node.y();
          const imageRect = node.getClientRect();

          if (imageRect.width >= crop.width) {
            if (imageRect.x > crop.x) newX -= imageRect.x - crop.x;
            else if (imageRect.x + imageRect.width < crop.x + crop.width)
              newX += crop.x + crop.width - (imageRect.x + imageRect.width);
          }
          if (imageRect.height >= crop.height) {
            if (imageRect.y > crop.y) newY -= imageRect.y - crop.y;
            else if (imageRect.y + imageRect.height < crop.y + crop.height)
              newY += crop.y + crop.height - (imageRect.y + imageRect.height);
          }

          node.position({ x: newX, y: newY });
          setStagePos({ x: newX, y: newY });
        }}
      >
        <KonvaImage
          ref={imageRef}
          image={img}
          width={imageSize.width}
          height={imageSize.height}
          offsetX={centerX}
          offsetY={centerY}
          x={centerX}
          y={centerY}
          rotation={imageRotation}
          scaleX={imageScaleX}
          scaleY={imageScaleY}
          brightness={filters.brightness}
          contrast={filters.contrast}
          luminance={filters.saturation} // Using luminance for saturation as simple workaround or hue
          saturation={filters.saturation}
          blurRadius={filters.blur}
          pixelSize={filters.preset === "pixelate" ? 8 : 1}
          noise={filters.preset === "noise" ? 0.2 : 0}
        />
      </Group>
    </Group>
  );
};
