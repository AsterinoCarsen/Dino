'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";

const images = ['/hero1.jpg', '/hero2.jpg', '/hero3.jpg'];
const switchDuration = 30000;

export default function HeroImageScroller() {
    const [currIndex, setCurrIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setCurrIndex(nextIndex);
                setNextIndex((nextIndex + 1) % images.length);
                setIsFading(false);
            }, 650);
        }, switchDuration);

        return () => clearInterval(interval);
    }, [nextIndex]);

    return (
        <div className="absolute top-0 left-0 w-full h-full z-[-1]">
            <Image 
                src={images[currIndex]}
                alt="Climbing background"
                layout="fill"
                objectFit="cover"
                className={`absolute w-full h-full transition-opacity duration-650 ${isFading ? 'opacity-0' : 'opacity-100'}`}
            />
            
            <Image 
                src={images[nextIndex]}
                alt="Climbing background"
                layout="fill"
                objectFit="cover"
                className={`absolute w-full h-full transition-opacity duration-650 ${isFading ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
}
