import { useState, useEffect, useRef, useCallback } from 'react';

const calculateMean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const calculateSD = (arr, mean) => {
    if (arr.length < 2) return 0;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
};

export const useTypingAnalytics = () => {
    const [stats, setStats] = useState({
        ikiMean: 0,
        ikiSD: 0,
        totalKeystrokes: 0,
        backspaceCount: 0,
        backspacePercent: 0,
        flags: []
    });

    const lastKeyTime = useRef(null);
    const intervals = useRef([]);
    const keyCount = useRef(0);
    const backspaceCount = useRef(0);
    const flags = useRef(new Set());

    const handleKeyDown = useCallback((e) => {
        const currentTime = performance.now();
        keyCount.current += 1;

        if (e.key === 'Backspace') {
            backspaceCount.current += 1;
        }

        if (lastKeyTime.current) {
            const iki = currentTime - lastKeyTime.current;

            if (iki < 2000) {
                intervals.current.push(iki);
                if (intervals.current.length > 30) {
                    intervals.current.shift();
                }
            }
        }
        lastKeyTime.current = currentTime;

        const currentIntervals = intervals.current;
        let mean = 0;
        let sd = 0;
        let newFlags = new Set(flags.current);

        if (currentIntervals.length >= 2) {
            mean = calculateMean(currentIntervals);
            sd = calculateSD(currentIntervals, mean);

            if (currentIntervals.length === 30 && sd < 5) {
                newFlags.add('Likely Autotyper/Bot');
            }

            if (currentIntervals.length >= 10 && mean > 1500) {
                newFlags.add('Suspiciously High Thinking Time');
            }
        }

        if (keyCount.current > 200 && backspaceCount.current === 0) {
            newFlags.add('Suspiciously Perfect Typing');
        }

        flags.current = newFlags;

        setStats({
            ikiMean: mean,
            ikiSD: sd,
            totalKeystrokes: keyCount.current,
            backspaceCount: backspaceCount.current,
            backspacePercent: (backspaceCount.current / keyCount.current) * 100,
            flags: Array.from(newFlags)
        });

    }, []);

    const resetAnalytics = useCallback(() => {
        lastKeyTime.current = null;
        intervals.current = [];
        keyCount.current = 0;
        backspaceCount.current = 0;
        flags.current = new Set();
        setStats({
            ikiMean: 0,
            ikiSD: 0,
            totalKeystrokes: 0,
            backspaceCount: 0,
            backspacePercent: 0,
            flags: []
        });
    }, []);

    return {
        handleKeyDown,
        stats,
        resetAnalytics
    };
};
