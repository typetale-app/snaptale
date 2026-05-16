import React, { useRef, useEffect } from "react";
import {
  Group,
  Text,
  Transformer,
  Rect,
  Circle,
  RegularPolygon,
  Star,
  Arrow,
  Line,
} from "react-konva";
import Konva from "konva";
import { useEditor, type SymbolConfig } from "../context/EditorContext";

const SymbolItem: React.FC<{
  config: SymbolConfig;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ config, isSelected, onSelect }) => {
  const { updateSymbol, deleteSymbol } = useEditor();
  const shapeRef = useRef<any>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Delete on keyboard
  useEffect(() => {
    if (!isSelected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const active = document.activeElement;
        if (
          active &&
          (active.tagName === "TEXTAREA" || active.tagName === "INPUT")
        )
          return;
        deleteSymbol(config.id);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSelected, config.id, deleteSymbol]);

  const commonProps = {
    ref: shapeRef,
    x: config.x,
    y: config.y,
    opacity: config.opacity,
    rotation: config.rotation,
    scaleX: config.scaleX,
    scaleY: config.scaleY,
    draggable: true,
    stroke: config.stroke,
    strokeWidth: config.strokeWidth,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (e: any) => {
      updateSymbol(config.id, {
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: () => {
      const node = shapeRef.current;
      if (!node) return;
      updateSymbol(config.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      });
    },
  };

  let node = null;
  if (config.type === "emoji") {
    node = (
      <Text
        {...commonProps}
        text={config.emoji}
        fontSize={config.fontSize}
        fontFamily="sans-serif"
      />
    );
  } else {
    const w = config.width || 80;
    const h = config.height || 80;
    const fill = config.fill || "#ffffff";

    switch (config.shapeType) {
      case "rect":
        node = <Rect {...commonProps} width={w} height={h} fill={fill} />;
        break;
      case "circle":
        node = <Circle {...commonProps} radius={w / 2} fill={fill} />;
        break;
      case "triangle":
        node = (
          <RegularPolygon
            {...commonProps}
            sides={3}
            radius={w / 2}
            fill={fill}
          />
        );
        break;
      case "star":
        node = (
          <Star
            {...commonProps}
            numPoints={5}
            innerRadius={w / 4}
            outerRadius={w / 2}
            fill={fill}
          />
        );
        break;
      case "arrow":
        node = (
          <Arrow
            {...commonProps}
            points={[0, 0, w, 0]}
            pointerLength={w * 0.2}
            pointerWidth={w * 0.2}
            fill={fill}
            stroke={commonProps.stroke || fill}
            strokeWidth={commonProps.strokeWidth || Math.max(4, w * 0.05)}
          />
        );
        break;
      case "line":
        node = (
          <Line
            {...commonProps}
            points={[0, 0, w, 0]}
            stroke={commonProps.stroke || fill}
            strokeWidth={commonProps.strokeWidth || Math.max(4, w * 0.05)}
            lineCap="round"
            lineJoin="round"
          />
        );
        break;
    }
  }

  return (
    <>
      {node}
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={
            config.keepRatio
              ? ["top-left", "top-right", "bottom-left", "bottom-right"]
              : undefined
          }
          anchorSize={10}
          anchorCornerRadius={5}
          anchorFill="#ffffff"
          anchorStroke="#a78bfa"
          anchorStrokeWidth={1.5}
          borderStroke="#a78bfa"
          borderStrokeWidth={1.5}
          keepRatio={config.keepRatio}
        />
      )}
    </>
  );
};

export const SymbolsTool: React.FC = () => {
  const { symbols, selectedSymbolId, setSelectedSymbolId, activeTool } =
    useEditor();

  return (
    <Group>
      {symbols.map((s) => (
        <SymbolItem
          key={s.id}
          config={s}
          isSelected={activeTool === "symbols" && selectedSymbolId === s.id}
          onSelect={() => {
            if (activeTool === "symbols") {
              setSelectedSymbolId(s.id);
            }
          }}
        />
      ))}
    </Group>
  );
};
