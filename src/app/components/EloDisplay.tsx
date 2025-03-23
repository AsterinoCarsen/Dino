import { easeInOut } from "framer-motion";
import React, { useState, useEffect } from "react";

interface EloDisplayProps {
    elo: number;
}

const ANIMATION_DURATION = 875; // In milliseconds
const FPS = 60;

export default function EloDisplay({ elo }: EloDisplayProps) {
    const [displayElo, setDisplayElo] = useState(elo);

    useEffect(() => {
        let frame = 0;
        const totalFrames = (ANIMATION_DURATION / 1000) * FPS;
        const startElo = displayElo;
        const eloChange = elo - startElo;

        if (eloChange === 0) return;

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            setDisplayElo(startElo + eloChange * easeInOut(progress))

            if (frame >= totalFrames) {
                setDisplayElo(elo);
                clearInterval(interval);
            }
        }, 1000 / FPS);


        return () => clearInterval(interval);
    }, [elo]);

    return (
        <div className="flex text-center">
            <h2 className="text-3xl font-bold">{Math.round(displayElo)}</h2>
            <p>CR</p>
        </div>
    );
}
