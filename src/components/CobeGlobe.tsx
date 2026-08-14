"use client";

/**
 * CobeGlobe — standalone 3-D globe with real-time sun overlay.
 *
 * Root-cause fix: the cobe canvas must use natural block-flow layout
 * (width/height 100%, NOT position:absolute).  An absolutely-positioned
 * canvas has offsetWidth=0 at mount, so createGlobe never receives a
 * valid size and the WebGL context silently renders nothing.
 *
 * This component mirrors the working layout from /components/ui/cobe-globe.tsx
 * and adds the astronomy-based sun glow overlay.
 */

import React, { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export interface GlobeMarker {
  location: [number, number]; // [lat, lon]
  size: number;
  label?: string;
  flag?: string;
}

interface CobeGlobeProps {
  markers?: GlobeMarker[];
  focusedLocation?: [number, number];
  className?: string;
}

// ─── Astronomy ────────────────────────────────────────────────────────────────

function getSunPosition(date: Date): { lat: number; lon: number } {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const n = JD - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * (Math.PI / 180);
  const epsilon = (23.439 - 0.0000004 * n) * (Math.PI / 180);
  const sinDec = Math.sin(epsilon) * Math.sin(lambda);
  const lat = Math.asin(sinDec) * (180 / Math.PI);
  const RA = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
  const GMST = (18.697374558 + 24.06570982441908 * n) % 24;
  const GHA = ((GMST * 15 - RA * (180 / Math.PI)) + 360) % 360;
  const lon = ((180 - GHA + 180) % 360) - 180;
  return { lat, lon };
}

function projectToCanvas(
  lat: number, lon: number,
  phi: number, theta: number, size: number
): { x: number; y: number; visible: boolean } {
  const latR = lat * Math.PI / 180, lonR = lon * Math.PI / 180;
  const px = Math.cos(latR) * Math.sin(lonR);
  const py = Math.sin(latR);
  const pz = Math.cos(latR) * Math.cos(lonR);
  const cosPhi = Math.cos(-phi), sinPhi = Math.sin(-phi);
  const rx = px * cosPhi + pz * sinPhi, ry = py, rz = -px * sinPhi + pz * cosPhi;
  const cosT = Math.cos(-theta), sinT = Math.sin(-theta);
  const fx = rx, fy = ry * cosT - rz * sinT, fz = ry * sinT + rz * cosT;
  return { x: size / 2 + fx * size / 2 * 0.97, y: size / 2 - fy * size / 2 * 0.97, visible: fz > 0 };
}

function drawSunOverlay(overlay: HTMLCanvasElement, size: number, phi: number, theta: number) {
  const ctx = overlay.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, size, size);
  const { lat, lon } = getSunPosition(new Date());
  const p = projectToCanvas(lat, lon, phi, theta, size);
  if (!p.visible) return;
  const { x, y } = p;

  const aura = ctx.createRadialGradient(x, y, 0, x, y, size * 0.22);
  aura.addColorStop(0, "rgba(255,210,60,0.18)");
  aura.addColorStop(0.35, "rgba(255,150,20,0.08)");
  aura.addColorStop(1, "rgba(255,80,0,0)");
  ctx.beginPath(); ctx.arc(x, y, size * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = aura; ctx.fill();

  const mid = ctx.createRadialGradient(x, y, 0, x, y, size * 0.075);
  mid.addColorStop(0, "rgba(255,248,140,0.92)");
  mid.addColorStop(0.45, "rgba(255,190,45,0.65)");
  mid.addColorStop(1, "rgba(255,110,0,0)");
  ctx.beginPath(); ctx.arc(x, y, size * 0.075, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();

  const core = ctx.createRadialGradient(x, y, 0, x, y, size * 0.026);
  core.addColorStop(0, "rgba(255,255,245,1)");
  core.addColorStop(0.38, "rgba(255,228,80,1)");
  core.addColorStop(1, "rgba(255,160,20,0.65)");
  ctx.beginPath(); ctx.arc(x, y, size * 0.026, 0, Math.PI * 2);
  ctx.fillStyle = core; ctx.fill();
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CobeGlobe: React.FC<CobeGlobeProps> = ({
  markers = [],
  focusedLocation,
  className = "",
}) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const lastPointer        = useRef<{ x: number; y: number; t: number } | null>(null);
  const dragOffset         = useRef({ phi: 0, theta: 0 });
  const velocity           = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef       = useRef(0);
  const thetaOffsetRef     = useRef(0);
  const isPausedRef        = useRef(false);

  const propsRef = useRef({ markers, focusedLocation });
  useEffect(() => { propsRef.current = { markers, focusedLocation }; });

  // ── Pointer ────────────────────────────────────────────────────────────────

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!pointerInteracting.current) return;
    const dx = e.clientX - pointerInteracting.current.x;
    const dy = e.clientY - pointerInteracting.current.y;
    dragOffset.current = { phi: dx / 200, theta: dy / 300 };
    const now = Date.now();
    if (lastPointer.current) {
      const dt = Math.max(now - lastPointer.current.t, 1);
      velocity.current = {
        phi:   Math.max(-0.2, Math.min(0.2, ((e.clientX - lastPointer.current.x) / dt) * 0.4)),
        theta: Math.max(-0.2, Math.min(0.2, ((e.clientY - lastPointer.current.y) / dt) * 0.2)),
      };
    }
    lastPointer.current = { x: e.clientX, y: e.clientY, t: now };
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current) {
      phiOffsetRef.current   += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
      lastPointer.current = null;
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup",   handlePointerUp,   { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup",   handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // ── Globe init — mirrors the working shadcn Globe exactly ─────────────────

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    const SPEED = 0.005;
    const THETA = 0.2;

    function init() {
      // Read CSS-pixel width from canvas (natural block layout ensures it's non-zero)
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const p   = propsRef.current;

      if (overlay) {
        overlay.width  = width;
        overlay.height = width;
      }

      // Pass plain CSS-pixel width — cobe applies DPR internally
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width,
        height: width,
        phi:    0,
        theta:  THETA,
        dark:          1,
        diffuse:       2.0,
        mapSamples:    20000,
        mapBrightness: 10,
        baseColor:   [0.18, 0.52, 0.28] as [number, number, number],
        markerColor: [1,    0.72, 0.1 ] as [number, number, number],
        glowColor:   [0.06, 0.1,  0.26] as [number, number, number],
        opacity:     0.55,
        markers: p.markers.map((m) => ({ location: m.location, size: m.size })),
      } as any);

      function animate() {
        const pp = propsRef.current;

        if (!isPausedRef.current) {
          phi += SPEED;
          if (Math.abs(velocity.current.phi) > 0.0001 || Math.abs(velocity.current.theta) > 0.0001) {
            phiOffsetRef.current   += velocity.current.phi;
            thetaOffsetRef.current += velocity.current.theta;
            velocity.current.phi   *= 0.95;
            velocity.current.theta *= 0.95;
          }
        }

        const totalPhi   = phi + phiOffsetRef.current + dragOffset.current.phi;
        const totalTheta = THETA + thetaOffsetRef.current + dragOffset.current.theta;

        if (globe) {
          globe.update({
            phi:   totalPhi,
            theta: totalTheta,
            dark:          1,
            mapBrightness: 10,
            markerColor: [1, 0.72, 0.1] as [number, number, number],
            baseColor:   [0.18, 0.52, 0.28] as [number, number, number],
            markers: pp.markers.map((m) => ({ location: m.location, size: m.size })),
          });
        }

        if (overlay) {
          drawSunOverlay(overlay, width, totalPhi, totalTheta);
        }

        animationId = requestAnimationFrame(animate);
      }

      animate();
      setTimeout(() => {
        if (canvas)  canvas.style.opacity  = "1";
        if (overlay) overlay.style.opacity = "1";
      }, 100);
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      {/*
        Canvas must NOT be position:absolute — that makes offsetWidth = 0.
        Natural block layout (width/height 100%) is what lets canvas.offsetWidth
        return the real CSS width that cobe needs.
      */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width:        "100%",
          height:       "100%",
          cursor:       "grab",
          opacity:      0,
          transition:   "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction:  "none",
        }}
      />

      {/* 2-D sun-glow overlay (absolutely on top, pointer-events disabled) */}
      <canvas
        ref={overlayRef}
        style={{
          position:     "absolute",
          inset:        0,
          width:        "100%",
          height:       "100%",
          opacity:      0,
          transition:   "opacity 1.2s ease",
          pointerEvents:"none",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};
