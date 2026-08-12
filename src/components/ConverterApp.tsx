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
import { Plus, Sparkles, ArrowRightLeft } from "lucide-react";

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

    // Continuous 1-second ticker for live running seconds
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header title & Subtitle */}
      <div className="text-center space-y-2 pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Live Seconds Time Zone Converter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Time Zone Converter
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
          Convert any time across the world in seconds.
        </p>
      </div>

      {/* Live Device PC Local Time Banner */}
      <LocalTimeHeader onSyncToMyTime={handleSyncToUserDeviceTime} />

      {/* Quick Swap Control Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-3 px-5 shadow-xs">
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <span>Live Comparison Cards</span>
        </div>

        {targetLocations.length > 0 && (
          <button
            onClick={handleQuickSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-zinc-200 dark:border-zinc-700/60 transition-all cursor-pointer"
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
            className="w-full h-full min-h-[220px] bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 transition-all group cursor-pointer shadow-xs hover:shadow-md"
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
