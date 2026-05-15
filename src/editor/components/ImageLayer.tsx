import React, { useEffect } from 'react';
import { Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useEditor } from '../context/EditorContext';

export const ImageLayer: React.FC = () => {
    const { imageUrl, stageSize, setStageSize, setBaseScale, setCrop } = useEditor();
    const [img] = useImage(imageUrl, 'anonymous');

    useEffect(() => {
        if (img) {
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.7;

            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

            setBaseScale(ratio);
            const w = img.width * ratio;
            const h = img.height * ratio;
            setStageSize({ width: w, height: h });
            
            // Center crop box initially
            setCrop({
                x: w * 0.1,
                y: h * 0.1,
                width: w * 0.8,
                height: h * 0.8,
            });
        }
    }, [img, setStageSize, setBaseScale, setCrop]);

    if (!img) return null;

    return (
        <Group>
            {/* Background Image (darkened) */}
            <KonvaImage
                image={img}
                width={stageSize.width}
                height={stageSize.height}
                opacity={0.4}
            />
        </Group>
    );
};
