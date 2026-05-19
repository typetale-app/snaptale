import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import AngleSlider from '@/components/AngleSlider';

export const CropBottomToolbar = () => {
    const { imageRotation, setImageRotation } = useEditor();

    const nearest90 = Math.round(imageRotation / 90) * 90;
    const deviation = imageRotation - nearest90;

    const handleSliderChange = (val: number) => {
        setImageRotation(nearest90 + val);
    };

    return (
        <AngleSlider initialValue={deviation} onChange={handleSliderChange} />
    );
};
