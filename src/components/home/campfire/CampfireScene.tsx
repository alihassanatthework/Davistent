"use client";

import { useEffect, useRef } from "react";
import { createScene } from "./engine";

/**
 * Animated night campsite used as the hero background (canvas, no video).
 * Decorative: hidden from assistive technology. Honours reduced motion, Save-Data
 * and low-power devices by drawing one still frame of the same scene.
 */
export function CampfireScene({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const scene = createScene(canvas);
    return () => scene.destroy();
  }, []);
  return <canvas ref={ref} aria-hidden className={className} />;
}
