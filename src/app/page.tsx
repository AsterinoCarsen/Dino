'use client';

import Image from "next/image";
import Navbar from "./components/core/Navbar";
import HeroImageScroller from "./components/misc/HeroImageScroller";

export default function Main() {
  return (
    <div className="flex flex-col">
        <Navbar />

        <div>
            <div className="absolute inset-0 w-full h-1/2 overflow-hidden -z-10">
                <HeroImageScroller />
            </div>
            <h1 className="select-none text-left font-bold mt-60 ml-80 text-white">Let's climb <br /> something new.</h1>
        </div>
    </div>
  );
}
