"use client"

import React, { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface Marker {
  id: string
  location: [number, number]
  label: string
}

interface Arc {
  id: string
  from: [number, number]
  to: [number, number]
  label?: string
}

interface GlobeProps {
  markers?: Marker[]
  arcs?: Arc[]
  className?: string
  markerColor?: [number, number, number]
  baseColor?: [number, number, number]
  arcColor?: [number, number, number]
  glowColor?: [number, number, number]
  dark?: number
  mapBrightness?: number
  markerSize?: number
  markerElevation?: number
  arcWidth?: number
  arcHeight?: number
  speed?: number
  theta?: number
  diffuse?: number
  mapSamples?: number
  opacity?: number
  showSunGlow?: boolean // Draw real-time sun glow at the terminator
}

// ─── Astronomy: sub-solar position ──────────────────────────────────────────

function getSunPosition(date: Date): { lat: number; lon: number } {
  const JD = date.getTime() / 86400000 + 2440587.5
  const n = JD - 2451545.0
  const L = (280.46 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180)
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * (Math.PI / 180)
  const epsilon = (23.439 - 0.0000004 * n) * (Math.PI / 180)
  const sinDec = Math.sin(epsilon) * Math.sin(lambda)
  const lat = Math.asin(sinDec) * (180 / Math.PI)
  const RA = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda))
  const GMST = (18.697374558 + 24.06570982441908 * n) % 24
  const GHA = ((GMST * 15 - RA * (180 / Math.PI)) + 360) % 360
  const lon = ((180 - GHA + 180) % 360) - 180
  return { lat, lon }
}

/**
 * Project a geographic point (lat, lon) onto the canvas given the
 * current globe rotation angles phi (Y-axis) and theta (X-axis tilt).
 */
function projectGeoToCanvas(
  lat: number,
  lon: number,
  phi: number,
  theta: number,
  size: number,
): { x: number; y: number; visible: boolean } {
  const latR = (lat * Math.PI) / 180
  const lonR = (lon * Math.PI) / 180

  // 3-D unit vector for the geographic point
  const px = Math.cos(latR) * Math.sin(lonR)
  const py = Math.sin(latR)
  const pz = Math.cos(latR) * Math.cos(lonR)

  // Rotate by -phi around Y (undo globe's horizontal rotation)
  const cosPhi = Math.cos(-phi)
  const sinPhi = Math.sin(-phi)
  const rx = px * cosPhi + pz * sinPhi
  const ry = py
  const rz = -px * sinPhi + pz * cosPhi

  // Rotate by -theta around X (undo globe's vertical tilt)
  const cosT = Math.cos(-theta)
  const sinT = Math.sin(-theta)
  const fx = rx
  const fy = ry * cosT - rz * sinT
  const fz = ry * sinT + rz * cosT

  return {
    x: size / 2 + fx * (size / 2) * 0.97,
    y: size / 2 - fy * (size / 2) * 0.97,
    visible: fz > 0,
  }
}

function drawSunGlow(
  ctx: CanvasRenderingContext2D,
  size: number,
  phi: number,
  theta: number,
) {
  ctx.clearRect(0, 0, size, size)
  const { lat, lon } = getSunPosition(new Date())
  const proj = projectGeoToCanvas(lat, lon, phi, theta, size)
  if (!proj.visible) return

  const { x, y } = proj

  // Outer aura
  const aura = ctx.createRadialGradient(x, y, 0, x, y, size * 0.22)
  aura.addColorStop(0, "rgba(255,210,60,0.18)")
  aura.addColorStop(0.35, "rgba(255,150,20,0.08)")
  aura.addColorStop(1, "rgba(255,80,0,0)")
  ctx.beginPath()
  ctx.arc(x, y, size * 0.22, 0, Math.PI * 2)
  ctx.fillStyle = aura
  ctx.fill()

  // Mid glow
  const mid = ctx.createRadialGradient(x, y, 0, x, y, size * 0.075)
  mid.addColorStop(0, "rgba(255,248,140,0.92)")
  mid.addColorStop(0.45, "rgba(255,190,45,0.65)")
  mid.addColorStop(1, "rgba(255,110,0,0)")
  ctx.beginPath()
  ctx.arc(x, y, size * 0.075, 0, Math.PI * 2)
  ctx.fillStyle = mid
  ctx.fill()

  // Core sun disc
  const core = ctx.createRadialGradient(x, y, 0, x, y, size * 0.026)
  core.addColorStop(0, "rgba(255,255,245,1)")
  core.addColorStop(0.38, "rgba(255,228,80,1)")
  core.addColorStop(1, "rgba(255,160,20,0.65)")
  ctx.beginPath()
  ctx.arc(x, y, size * 0.026, 0, Math.PI * 2)
  ctx.fillStyle = core
  ctx.fill()
}

// ─── Globe component ─────────────────────────────────────────────────────────

export function Globe({
  markers = [],
  arcs = [],
  className = "",
  markerColor = [0.3, 0.45, 0.85],
  baseColor = [1, 1, 1],
  arcColor = [0.3, 0.45, 0.85],
  glowColor = [0.94, 0.93, 0.91],
  dark = 0,
  mapBrightness = 8,
  markerSize = 0.03,
  markerElevation = 0.02,
  arcWidth = 0.6,
  arcHeight = 0.3,
  speed = 0.005,
  theta = 0.25,
  diffuse = 1.6,
  mapSamples = 20000,
  opacity = 0.65,
  showSunGlow = false,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  // Track the CURRENT phi for sun projection
  const currentPhiRef = useRef(0)

  const propsRef = useRef({
    markers, arcs, markerColor, baseColor, arcColor, glowColor, dark,
    mapBrightness, markerSize, markerElevation, arcWidth, arcHeight, speed,
    theta, diffuse, mapSamples, opacity, showSunGlow,
  })

  useEffect(() => {
    propsRef.current = {
      markers, arcs, markerColor, baseColor, arcColor, glowColor, dark,
      mapBrightness, markerSize, markerElevation, arcWidth, arcHeight, speed,
      theta, diffuse, mapSamples, opacity, showSunGlow,
    }
  })

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x
      const deltaY = e.clientY - pointerInteracting.current.y
      dragOffset.current = { phi: deltaX / 200, theta: deltaY / 300 }
      const now = Date.now()
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 1)
        velocity.current = {
          phi: Math.max(-0.2, Math.min(0.2, ((e.clientX - lastPointer.current.x) / dt) * 0.4)),
          theta: Math.max(-0.2, Math.min(0.2, ((e.clientY - lastPointer.current.y) / dt) * 0.2)),
        }
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const currentProps = propsRef.current

      // Sync overlay size to globe
      if (overlay) {
        overlay.width = width
        overlay.height = width
      }

      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width,
        height: width,
        phi: 0,
        theta: currentProps.theta,
        dark: currentProps.dark,
        diffuse: currentProps.diffuse,
        mapSamples: currentProps.mapSamples,
        mapBrightness: currentProps.mapBrightness,
        baseColor: currentProps.baseColor,
        markerColor: currentProps.markerColor,
        glowColor: currentProps.glowColor,
        markerElevation: currentProps.markerElevation,
        markers: currentProps.markers.map((m) => ({
          location: m.location,
          size: currentProps.markerSize,
          id: m.id,
        })),
        arcs: currentProps.arcs.map((a) => ({
          from: a.from,
          to: a.to,
          id: a.id,
        })),
        arcColor: currentProps.arcColor,
        arcWidth: currentProps.arcWidth,
        arcHeight: currentProps.arcHeight,
        opacity: currentProps.opacity,
      } as any)

      function animate() {
        const p = propsRef.current
        if (!isPausedRef.current) {
          phi += p.speed
          if (
            Math.abs(velocity.current.phi) > 0.0001 ||
            Math.abs(velocity.current.theta) > 0.0001
          ) {
            phiOffsetRef.current += velocity.current.phi
            thetaOffsetRef.current += velocity.current.theta
            velocity.current.phi *= 0.95
            velocity.current.theta *= 0.95
          }
        }

        const totalPhi = phi + phiOffsetRef.current + dragOffset.current.phi
        const totalTheta = p.theta + thetaOffsetRef.current + dragOffset.current.theta

        // Store current phi for sun projection
        currentPhiRef.current = totalPhi

        if (globe) {
          globe.update({
            phi: totalPhi,
            theta: totalTheta,
            dark: p.dark,
            mapBrightness: p.mapBrightness,
            markerColor: p.markerColor,
            baseColor: p.baseColor,
            arcColor: p.arcColor,
            markerElevation: p.markerElevation,
            markers: p.markers.map((m) => ({
              location: m.location,
              size: p.markerSize,
              id: m.id,
            })),
            arcs: p.arcs.map((a) => ({
              from: a.from,
              to: a.to,
              id: a.id,
            })),
          })
        }

        // Draw sun overlay if enabled
        if (p.showSunGlow && overlay) {
          const ctx = overlay.getContext("2d")
          if (ctx) {
            drawSunGlow(ctx, width, totalPhi, totalTheta)
          }
        }

        animationId = requestAnimationFrame(animate)
      }

      animate()
      setTimeout(() => {
        if (canvas) canvas.style.opacity = "1"
        if (overlay) overlay.style.opacity = "1"
      }, 100)
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {/* Sun glow overlay canvas — stacked absolutely on top */}
      <canvas
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          transition: "opacity 1.2s ease",
          pointerEvents: "none",
          borderRadius: "50%",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            translate: "-50% 0",
            marginBottom: 8,
            padding: "2px 6px",
            background: "#1a1a2e",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            whiteSpace: "nowrap" as const,
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.8s, filter 0.8s",
          }}
        >
          {m.label}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translate3d(-50%, -1px, 0)",
              border: "5px solid transparent",
              borderTopColor: "#1a1a2e",
            }}
          />
        </div>
      ))}
    </div>
  )
}
