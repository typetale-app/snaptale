import React, { useState, useRef, useEffect, useMemo } from 'react';

interface AngleSliderProps {
    min?: number;
    max?: number;
    step?: number;
    initialValue?: number;
    /** Range 0 (slow) to 100 (fast). Default is 50. */
    sensitivity?: number;
    tickWidth?: number;
    onChange?: (value: number) => void;
}

const AngleSlider = ({
    min = -45,
    max = 45,
    step = 1,
    initialValue = 0,
    sensitivity = 50,
    tickWidth = 10,
    onChange,
}: AngleSliderProps) => {
    const [value, setValue] = useState(initialValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const accumulator = useRef(0);

    // Map 0-100 sensitivity to a pixel threshold (20px to 1px)
    const internalThreshold = useMemo(() =>
        Math.max(1, 20 - (sensitivity / 100) * 19),
        [sensitivity]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        accumulator.current = 0;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

        accumulator.current += e.movementX;

        if (Math.abs(accumulator.current) >= internalThreshold) {
            const movementUnits = Math.trunc(accumulator.current / internalThreshold);

            setValue((prev) => {
                // Natural drag: move cursor right (pos), track moves right, value decreases
                const next = prev - (movementUnits * step);
                const clamped = Math.min(Math.max(next, min), max);

                if (clamped !== prev && onChange) {
                    onChange(clamped);
                }
                return clamped;
            });

            accumulator.current %= internalThreshold;
        }
    };

    const ticks = useMemo(() => {
        const arr = [];
        for (let i = min; i <= max; i += step) {
            arr.push(i);
        }
        return arr;
    }, [min, max, step]);

    // The math: Calculate the offset from the start (min)
    // We subtract (tickWidth / 2) to ensure the dot's center aligns with the vertical line
    const currentOffset = ((value - min) / step) * tickWidth;

    return (
        <div className="w-full max-w-xl mx-auto p-10 select-none">
            <div
                ref={containerRef}
                className="relative w-full h-24 overflow-hidden cursor-ew-resize touch-none"
                style={{
                    // Fade effect on the sides
                    maskImage: 'linear-gradient(to right, transparent, black 40%, black 60%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%, black 60%, transparent)'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
            >
                {/* Fixed Center Indicator */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
                    <div className="w-px h-3 bg-gray-400 mb-2" />
                    <span className="text-gray-300 font-bold tabular-nums">
                        {value}°
                    </span>
                </div>

                {/* Slidable Track */}
                <div
                    className="flex items-end h-full transition-transform duration-150 ease-out pointer-events-none"
                    style={{
                        // 50% is the center of the container
                        // currentOffset is how far the "value" is from the start of the list
                        // - tickWidth/2 centers the dot itself
                        transform: `translateX(calc(50% - ${currentOffset}px - ${tickWidth / 2}px))`
                    }}
                >
                    {ticks.map((tick) => {
                        const isMajor = tick % 10 === 0;
                        const isMid = tick % 5 === 0 && !isMajor;
                        const isActive = tick === value;

                        return (
                            <div
                                key={tick}
                                className="flex-shrink-0 flex flex-col items-center justify-end h-full"
                                style={{ width: `${tickWidth}px` }}
                            >
                                <div
                                    className={`rounded-full transition-all duration-300 ${isActive
                                        ? 'w-2 h-2 bg-white ring-4 ring-white/10'
                                        : isMajor
                                            ? 'w-1.5 h-1.5 bg-gray-300'
                                            : isMid
                                                ? 'w-1 h-1 bg-gray-400'
                                                : 'w-[3px] h-[3px] bg-gray-400'
                                        }`}
                                />
                                <div className="h-8" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AngleSlider;