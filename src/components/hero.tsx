import React from "react";
import { FlipWords } from "./ui/flip-words";

export function FlipWordsDemo() {
  const words = ["Doctors", "Police", "Ambulance"];

  return (
    <div className="h-screen flex justify-center items-center px-4 bg-white">
      <div className="text-4xl md:text-6xl lg:text-7xl mx-auto font-semibold text-neutral-700 text-center leading-snug inter-var">
        Connecting
        <FlipWords words={words} /> <br />
        <span className="mt-4 text-lg md:text-2xl font-light text-neutral-500">
          Seamless communication for life-saving assistance
        </span>
      </div>
    </div>
  );
}
