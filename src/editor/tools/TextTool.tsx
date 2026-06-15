import React, { useRef, useEffect, useCallback } from "react";
import { Group, Text, Transformer } from "react-konva";
import Konva from "konva";
import { useEditor, type TextConfig } from "../context/EditorContext";

const TextItem: React.FC<{
  config: TextConfig;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ config, isSelected, onSelect }) => {
  const { updateText, deleteText, stageSize } = useEditor();
  const textRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.forceUpdate();
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, config.fontFamily, config.fontSize, config.fontStyle, config.textDecoration, config.letterSpacing]);

  // Delete on keyboard
  useEffect(() => {
    if (!isSelected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // Only delete if not editing inline (no focused textarea)
        const active = document.activeElement;
        if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) return;
        deleteText(config.id);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSelected, config.id, deleteText]);

  const handleDblClick = useCallback(() => {
    const textNode = textRef.current;
    const stage = textNode?.getStage();
    if (!textNode || !stage) return;

    // Hide text and transformer
    textNode.hide();
    trRef.current?.hide();

    const textPosition = textNode.absolutePosition();
    const stageContainer = stage.container();
    const stageRect = stageContainer.getBoundingClientRect();

    const textarea = document.createElement("textarea");
    stageContainer.appendChild(textarea);

    textarea.value = config.text;
    textarea.style.position = "absolute";
    textarea.style.top = `${textPosition.y + stageRect.top - window.scrollY}px`;
    textarea.style.left = `${textPosition.x + stageRect.left - window.scrollX}px`;
    textarea.style.width = `${Math.max(textNode.width() * textNode.scaleX(), 100)}px`;
    textarea.style.height = `${Math.max(textNode.height() * textNode.scaleY() + 10, 40)}px`;
    textarea.style.fontSize = `${config.fontSize}px`;
    textarea.style.fontFamily = config.fontFamily;
    textarea.style.color = config.fill;
    textarea.style.background = "rgba(0,0,0,0.7)";
    textarea.style.border = "1px solid rgba(255,255,255,0.3)";
    textarea.style.borderRadius = "4px";
    textarea.style.padding = "4px 6px";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.overflow = "hidden";
    textarea.style.lineHeight = "1.2";
    textarea.style.zIndex = "1000";
    textarea.style.transformOrigin = "left top";
    textarea.style.transform = `rotate(${config.rotation}deg)`;

    textarea.focus();
    textarea.select();

    const removeTextarea = () => {
      try { stageContainer.removeChild(textarea); } catch { /* already removed */ }
      textNode.show();
      trRef.current?.show();
      trRef.current?.getLayer()?.batchDraw();
    };

    textarea.addEventListener("blur", () => {
      updateText(config.id, { text: textarea.value });
      removeTextarea();
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        textarea.blur();
      }
      if (e.key === "Escape") {
        removeTextarea();
      }
    });
  }, [config, updateText]);

  return (
    <>
      <Text
        ref={textRef}
        x={config.x}
        y={config.y}
        text={config.text}
        fontSize={config.fontSize}
        fontFamily={config.fontFamily}
        fontStyle={config.fontStyle}
        textDecoration={config.textDecoration}
        fill={config.fill}
        align={config.align}
        opacity={config.opacity}
        rotation={config.rotation}
        scaleX={config.scaleX}
        scaleY={config.scaleY}
        letterSpacing={config.letterSpacing}
        shadowEnabled={config.shadowEnabled}
        shadowColor={config.shadowColor}
        shadowBlur={config.shadowBlur}
        shadowOffsetX={config.shadowOffsetX}
        shadowOffsetY={config.shadowOffsetY}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
        onDragEnd={(e) => {
          updateText(config.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = textRef.current;
          if (!node) return;
          updateText(config.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
          ]}
          anchorSize={10}
          anchorCornerRadius={5}
          anchorFill="#ffffff"
          anchorStroke="#a78bfa"
          anchorStrokeWidth={1.5}
          borderStroke="#a78bfa"
          borderStrokeWidth={1.5}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 10) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

export const TextTool: React.FC = () => {
  const { texts, selectedTextId, setSelectedTextId, activeTool } = useEditor();

  // Always render text items (they're part of the image), but only allow
  // selection/interaction when the text tool is active.
  return (
    <Group>
      {texts.map((t) => (
        <TextItem
          key={t.id}
          config={t}
          isSelected={activeTool === "text" && selectedTextId === t.id}
          onSelect={() => {
            if (activeTool === "text") {
              setSelectedTextId(t.id);
            }
          }}
        />
      ))}
    </Group>
  );
};
