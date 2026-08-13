"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export interface GlobeMarker {
  location: [number, number]; // [lat, lon]
  size: number;
  label?: string;
  flag?: string;
}

interface CobeGlobeProps {
  markers?: GlobeMarker[];
  focusedLocation?: [number, number]; // [lat, lon]
  isDay?: boolean; // Real-time Day/Night lighting state
  className?: string;
}

export const CobeGlobe: React.FC<CobeGlobeProps> = ({
  markers = [],
  focusedLocation,
  isDay = true,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);

  useEffect(() => {
    let width = 0;
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    const updateDimensions = () => {
      if (currentCanvas) {
        width = currentCanvas.offsetWidth;
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const cobeMarkers = markers.map((m) => ({
      location: m.location as [number, number],
      size: m.size,
    }));

    let targetPhi = phiRef.current;
    if (focusedLocation) {
      const [_, lon] = focusedLocation;
      // Convert longitude to phi radians
      targetPhi = ((180 - lon) * Math.PI) / 180;
    }

    // Dynamic Day vs Night Globe Lighting Configuration
    const baseColor: [number, number, number] = isDay
      ? [0.75, 0.85, 0.95] // Light daylight land/sea
      : [0.08, 0.1, 0.22]; // Deep WebGL midnight land/sea

    const markerColor: [number, number, number] = isDay
      ? [0.1, 0.5, 0.95] // Bright azure daylight marker
      : [0.2, 0.65, 1.0]; // Glowing electric blue midnight marker

    const glowColor: [number, number, number] = isDay
      ? [1.0, 0.92, 0.75] // Golden daylight sun glow
      : [0.15, 0.35, 0.85]; // Deep indigo night glow

    const globeOptions = {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: phiRef.current,
      theta: 0.25,
      dark: isDay ? 0 : 1,
      diffuse: isDay ? 1.6 : 1.1,
      mapSamples: 18000,
      mapBrightness: isDay ? 7.5 : 4.2,
      baseColor,
      markerColor,
      glowColor,
      markers: cobeMarkers,
      onRender: (state: Record<string, any>) => {
        if (pointerInteracting.current === null) {
          if (focusedLocation) {
            const diff = targetPhi - phiRef.current;
            phiRef.current += diff * 0.04;
          } else {
            phiRef.current += 0.003;
          }
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    };

    const globe = createGlobe(currentCanvas, globeOptions as any);

    setTimeout(() => {
      if (currentCanvas) {
        currentCanvas.style.opacity = "1";
      }
    }, 100);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [markers, focusedLocation, isDay]);

  return (
    <div className={`relative w-full aspect-square max-w-[480px] mx-auto flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grabbing";
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.008;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.008;
          }
        }}
        className="w-full h-full max-w-[480px] max-h-[480px] opacity-0 transition-opacity duration-1000 cursor-grab touch-none"
      />
    </div>
  );
};
