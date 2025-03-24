import { easeInOut } from "framer-motion";
import { HelpCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

interface EloDisplayProps {
    elo: number;
}

const ANIMATION_DURATION = 875; // In milliseconds
const FPS = 60;

/**
 * Displays the current user's elo in a stylized, animated, and annotated way.
 * @param elo the current elo from the api
 * @returns 
 */
export default function EloDisplay({ elo }: EloDisplayProps) {
    const [displayElo, setDisplayElo] = useState(elo);
    const [isTooltipVisible, setToolTipVisiblity] = useState(false);

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

            <div
                className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 text-black text-sm font-bold cursor-pointer"
                onMouseEnter={() => setToolTipVisiblity(true)}
                onMouseLeave={() => setToolTipVisiblity(false)}
            >
                <HelpCircle className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black" size={20} />
                {isTooltipVisible && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg">
                        Your Climbing Rating (CR) is based on your climbing history, factoring in difficulty and attempts.
                    </div>
                )}
            </div>
        </div>
    );
}
