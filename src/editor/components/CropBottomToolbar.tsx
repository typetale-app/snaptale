import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import AngleSlider from '@/components/AngleSlider';

export const CropBottomToolbar = () => {
    const { imageRotation, setImageRotation } = useEditor();
    // Use local state for smooth sliding, then update context
    const [localRot, setLocalRot] = useState<number | null>(null);

    const displayRot = localRot !== null ? localRot : (imageRotation % 360);

    const handleSliderChange = (val: number) => {
        setLocalRot(val);
        setImageRotation(val);
    };

    return (
        <AngleSlider onChange={handleSliderChange} />
    );
};
