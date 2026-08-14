"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LOCATIONS,
  TimeZoneOption,
  createUtcDateFromLocal,
  formatZonedTime,
  getZonedDateComponents,
  detectUserLocation,
} from "@/lib/timezones";
import { SourceCard } from "./SourceCard";
import { TargetCard } from "./TargetCard";
import { LocationModal } from "./LocationModal";
import { LocalTimeHeader } from "./LocalTimeHeader";
import { Globe } from "@/components/ui/cobe-globe";
import { Plus, Sparkles, ArrowRightLeft, Globe as GlobeIcon, ChevronDown, Sun, Moon } from "lucide-react";

// Static starfield data — generated once at module level so SSR and client match exactly
const STARS = Array.from({ length: 60 }, (_, i) => {
  // Deterministic pseudo-random using index as seed (avoids hydration mismatch)
  const s = (n: number) => {
    let x = Math.sin(n + i * 9.301 + 0.5) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    width:   s(1) * 1.8 + 0.5,
    height:  s(2) * 1.8 + 0.5,
    top:     s(3) * 100,
    left:    s(4) * 100,
    opacity: s(5) * 0.6 + 0.15,
  };
});

export const ConverterApp: React.FC = () => {
  // Default source location: India (Asia/Kolkata · IST)
  const indiaDefault = LOCATIONS.find((l) => l.id === "in-kolkata") || LOCATIONS[0];
  const [sourceLocation, setSourceLocation] = useState<TimeZoneOption>(indiaDefault);

  // Default target locations: New York (EDT) & London (BST)
  const [targetLocations, setTargetLocations] = useState<TimeZoneOption[]>([
    LOCATIONS.find((l) => l.id === "us-new-york") || LOCATIONS[1],
    LOCATIONS.find((l) => l.id === "gb-london") || LOCATIONS[2],
  ]);

  // Date and Time inputs
  const [dateIso, setDateIso] = useState<string>("2026-08-12");
  const [hour, setHour] = useState<string>("10");
  const [minute, setMinute] = useState<string>("41");
  const [ampm, setAmPm] = useState<"AM" | "PM">("PM");

  // Live ticking seconds state (0-59)
  const [liveSeconds, setLiveSeconds] = useState<number>(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"source" | "target" | "edit-target">("source");
  const [editingTargetIndex, setEditingTargetIndex] = useState<number | null>(null);

  // Client initialization & Live 1-second interval ticker
  useEffect(() => {
    const detected = detectUserLocation();
    setSourceLocation(detected);

    const now = new Date();
    setLiveSeconds(now.getSeconds());

    const comps = getZonedDateComponents(now, detected.timezone);
    const yyyy = comps.year;
    const mm = String(comps.month).padStart(2, "0");
    const dd = String(comps.day).padStart(2, "0");
    setDateIso(`${yyyy}-${mm}-${dd}`);

    let h12 = comps.hour24 % 12;
    if (h12 === 0) h12 = 12;
    setHour(String(h12).padStart(2, "0"));
    setMinute(String(comps.minute).padStart(2, "0"));
    setAmPm(comps.hour24 >= 12 ? "PM" : "AM");

    const timer = setInterval(() => {
      setLiveSeconds(new Date().getSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Compute UTC Date from source time inputs + live running seconds
  const sourceUtcDate = useMemo(() => {
    let h24 = parseInt(hour, 10);
    if (isNaN(h24)) h24 = 12;
    if (ampm === "PM" && h24 < 12) h24 += 12;
    if (ampm === "AM" && h24 === 12) h24 = 0;

    let m = parseInt(minute, 10);
    if (isNaN(m)) m = 0;

    const [yyyy, mm, dd] = dateIso.split("-").map(Number);
    if (!yyyy || !mm || !dd) return new Date();

    const baseUtcDate = createUtcDateFromLocal(yyyy, mm, dd, h24, m, sourceLocation.timezone);
    return new Date(baseUtcDate.getTime() + liveSeconds * 1000);
  }, [dateIso, hour, minute, ampm, sourceLocation, liveSeconds]);

  // Formatted source time with solar info and live seconds
  const sourceFormatted = useMemo(() => {
    return formatZonedTime(
      sourceUtcDate,
      sourceLocation.timezone,
      undefined,
      undefined,
      sourceLocation.lat,
      sourceLocation.lon
    );
  }, [sourceUtcDate, sourceLocation]);

  // Globe markers — all locations
  const globeMarkers = useMemo(() => {
    const all = [sourceLocation, ...targetLocations];
    return all.map((loc) => ({
      id: loc.id,
      location: [loc.lat, loc.lon] as [number, number],
      label: `${loc.flag} ${loc.city}`,
    }));
  }, [sourceLocation, targetLocations]);

  // Arcs connecting source to each target
  const globeArcs = useMemo(() => targetLocations.map((t) => ({
    id: `${sourceLocation.id}-${t.id}`,
    from: [sourceLocation.lat, sourceLocation.lon] as [number, number],
    to: [t.lat, t.lon] as [number, number],
    label: `${sourceLocation.city} → ${t.city}`,
  })), [sourceLocation, targetLocations]);

  // Handlers for date/time adjustments
  const handleResetToNow = () => {
    const now = new Date();
    setLiveSeconds(now.getSeconds());

    const comps = getZonedDateComponents(now, sourceLocation.timezone);

    const yyyy = comps.year;
    const mm = String(comps.month).padStart(2, "0");
    const dd = String(comps.day).padStart(2, "0");
    setDateIso(`${yyyy}-${mm}-${dd}`);

    let h12 = comps.hour24 % 12;
    if (h12 === 0) h12 = 12;
    setHour(String(h12).padStart(2, "0"));
    setMinute(String(comps.minute).padStart(2, "0"));
    setAmPm(comps.hour24 >= 12 ? "PM" : "AM");
  };

  // Sync converter source time & location to PC Device time
  const handleSyncToUserDeviceTime = (userLocation: TimeZoneOption) => {
    setSourceLocation(userLocation);

    const now = new Date();
    setLiveSeconds(now.getSeconds());

    const comps = getZonedDateComponents(now, userLocation.timezone);

    const yyyy = comps.year;
    const mm = String(comps.month).padStart(2, "0");
    const dd = String(comps.day).padStart(2, "0");
    setDateIso(`${yyyy}-${mm}-${dd}`);

    let h12 = comps.hour24 % 12;
    if (h12 === 0) h12 = 12;
    setHour(String(h12).padStart(2, "0"));
    setMinute(String(comps.minute).padStart(2, "0"));
    setAmPm(comps.hour24 >= 12 ? "PM" : "AM");
  };

  // Modal Location Selection
  const handleSelectLocationFromModal = (location: TimeZoneOption) => {
    if (modalMode === "source") {
      setSourceLocation(location);
    } else if (modalMode === "target") {
      if (!targetLocations.some((t) => t.id === location.id)) {
        setTargetLocations((prev) => [...prev, location]);
      }
    } else if (modalMode === "edit-target" && editingTargetIndex !== null) {
      setTargetLocations((prev) => {
        const next = [...prev];
        next[editingTargetIndex] = location;
        return next;
      });
    }
  };

  const handleRemoveTarget = (index: number) => {
    setTargetLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakeTargetSource = (targetIndex: number) => {
    const oldSource = sourceLocation;
    const newSource = targetLocations[targetIndex];

    setSourceLocation(newSource);

    setTargetLocations((prev) => {
      const next = [...prev];
      next[targetIndex] = oldSource;
      return next;
    });

    const comps = getZonedDateComponents(sourceUtcDate, newSource.timezone);
    const yyyy = comps.year;
    const mm = String(comps.month).padStart(2, "0");
    const dd = String(comps.day).padStart(2, "0");
    setDateIso(`${yyyy}-${mm}-${dd}`);

    let h12 = comps.hour24 % 12;
    if (h12 === 0) h12 = 12;
    setHour(String(h12).padStart(2, "0"));
    setMinute(String(comps.minute).padStart(2, "0"));
    setAmPm(comps.hour24 >= 12 ? "PM" : "AM");
  };

  const handleQuickSwap = () => {
    if (targetLocations.length > 0) {
      handleMakeTargetSource(0);
    }
  };

  const scrollToCards = () => {
    const targetElement = document.getElementById("converter-cards-section");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isDay = sourceFormatted.sunInfo.isDay;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* HERO SECTION WITH 3D COBE GLOBE */}
      <section className="space-y-6 text-center pt-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Earth Globe & Live Time Converter</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-xs">
            Time Zone Converter
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Convert any time across the globe in seconds with live 3D Earth tracking.
          </p>
        </div>

        {/* Live Device PC Local Time Banner */}
        <LocalTimeHeader onSyncToMyTime={handleSyncToUserDeviceTime} />

        {/* PROMINENT HERO 3D GLOBE CONTAINER — deep space dark always */}
        <div className="relative w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-900/40 text-slate-100 shadow-indigo-950/50 overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#050a1a] via-[#07102a] to-[#030712]">
          {/* Starfield background — static positions to avoid SSR hydration mismatch */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {STARS.map((star, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: star.width + "px",
                  height: star.height + "px",
                  top: star.top + "%",
                  left: star.left + "%",
                  opacity: star.opacity,
                }}
              />
            ))}
          </div>

          {/* Globe Header Status Bar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 z-10">
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-white/8 backdrop-blur-md border border-white/10">
              <GlobeIcon className="w-4 h-4 text-blue-400" />
              <span className="text-slate-200">Live Solar Position · Day &amp; Night Terminator</span>
            </div>

            {/* Live Day vs Night Solar Status */}
            <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/8 backdrop-blur-md border border-white/10">
              {isDay ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-amber-300">
                    Daytime · Sunset {sourceFormatted.sunInfo.sunsetStr}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-300 fill-indigo-300" />
                  <span className="text-indigo-200">
                    Nighttime · Sunrise {sourceFormatted.sunInfo.sunriseStr}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* shadcn Globe with real-astronomy sun glow */}
          <div className="w-full max-w-[500px] mx-auto py-2 z-10">
            <Globe
              markers={globeMarkers}
              arcs={globeArcs}
              dark={1}
              baseColor={[0.18, 0.52, 0.28]}
              glowColor={[0.06, 0.1, 0.26]}
              markerColor={[1, 0.75, 0.1]}
              arcColor={[0.5, 0.8, 0.4]}
              mapBrightness={10}
              markerSize={0.035}
              arcWidth={0.5}
              diffuse={2.0}
              opacity={0.5}
              showSunGlow={true}
            />
          </div>

          {/* City Location Pills */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md flex items-center gap-1.5 border border-blue-400/30">
              <span>{sourceLocation.flag}</span>
              <span>{sourceLocation.city} (Source)</span>
            </span>

            {targetLocations.map((t, idx) => (
              <span
                key={`${t.id}-${idx}`}
                className="px-3 py-1 rounded-full text-xs font-bold bg-white/70 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-white/60 dark:border-zinc-700 flex items-center gap-1.5 shadow-xs backdrop-blur-md"
              >
                <span>{t.flag}</span>
                <span>{t.city}</span>
              </span>
            ))}
          </div>

          {/* Scroll Down Button */}
          <button
            onClick={scrollToCards}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-900 text-xs font-bold text-blue-600 dark:text-blue-400 border border-zinc-200 dark:border-zinc-800 shadow-md backdrop-blur-md transition-all cursor-pointer group"
          >
            <span>Scroll Down to Cards</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* CONVERTER CARDS SECTION (SCROLL DOWN) */}
      <section id="converter-cards-section" className="space-y-6 pt-4">
        {/* Quick Swap Control Bar */}
        <div className="flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-xl rounded-2xl p-3 px-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <span>Live Comparison Cards</span>
          </div>

          {targetLocations.length > 0 && (
            <button
              onClick={handleQuickSwap}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-zinc-200 dark:border-zinc-700/60 transition-all cursor-pointer"
              title="Swap source with first target location"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Swap Source & Target</span>
            </button>
          )}
        </div>

        {/* Side-by-Side Flex Wrap / Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {/* Source Card */}
          <div className="w-full">
            <SourceCard
              location={sourceLocation}
              formattedTime={sourceFormatted}
              dateIso={dateIso}
              hour={hour}
              minute={minute}
              ampm={ampm}
              onOpenLocationModal={() => {
                setModalMode("source");
                setModalOpen(true);
              }}
              onDateChange={setDateIso}
              onHourChange={setHour}
              onMinuteChange={setMinute}
              onAmPmChange={setAmPm}
              onResetToNow={handleResetToNow}
            />
          </div>

          {/* Target Cards Side-by-Side */}
          {targetLocations.map((targetLoc, index) => {
            const targetFormatted = formatZonedTime(
              sourceUtcDate,
              targetLoc.timezone,
              sourceUtcDate,
              sourceLocation.timezone,
              targetLoc.lat,
              targetLoc.lon
            );

            return (
              <div key={`${targetLoc.id}-${index}`} className="w-full">
                <TargetCard
                  location={targetLoc}
                  formattedTime={targetFormatted}
                  onRemove={() => handleRemoveTarget(index)}
                  onChangeLocation={() => {
                    setModalMode("edit-target");
                    setEditingTargetIndex(index);
                    setModalOpen(true);
                  }}
                  onMakeSource={() => handleMakeTargetSource(index)}
                  canRemove={targetLocations.length > 1}
                />
              </div>
            );
          })}

          {/* "+ Add Time Zone" Grid Card */}
          <div className="w-full min-h-[220px]">
            <button
              onClick={() => {
                setModalMode("target");
                setModalOpen(true);
              }}
              className="w-full h-full min-h-[220px] bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 transition-all group cursor-pointer shadow-xs hover:shadow-md backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-2xs">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="font-bold text-base text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Add Time Zone
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                  Compare another country or city side-by-side
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Location Modal */}
      <LocationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectLocationFromModal}
        selectedLocationId={
          modalMode === "source"
            ? sourceLocation.id
            : modalMode === "edit-target" && editingTargetIndex !== null
            ? targetLocations[editingTargetIndex]?.id
            : undefined
        }
        title={modalMode === "source" ? "Select source country & time zone" : "Add target country & time zone"}
      />
    </div>
  );
};
