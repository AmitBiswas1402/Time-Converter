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

  // Sync to User's PC local time on one-tap button
  const handleSyncToUserDeviceTime = (userLoc: TimeZoneOption) => {
    setSourceLocation(userLoc);
    handleResetToNow();
  };

  // Modal Handlers
  const handleSelectLocationFromModal = (location: TimeZoneOption) => {
    if (modalMode === "source") {
      setSourceLocation(location);
    } else if (modalMode === "target") {
      // Prevent duplicates
      if (!targetLocations.some((t) => t.id === location.id) && location.id !== sourceLocation.id) {
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
    if (targetLocations.length <= 1) return;
    setTargetLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakeTargetSource = (targetIndex: number) => {
    const newSource = targetLocations[targetIndex];
    const oldSource = sourceLocation;

    setSourceLocation(newSource);
    setTargetLocations((prev) => {
      const next = [...prev];
      next[targetIndex] = oldSource;
      return next;
    });
  };

  // Quick swap source with first target
  const handleQuickSwap = () => {
    if (targetLocations.length > 0) {
      handleMakeTargetSource(0);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* HERO HEADER */}
      <section className="space-y-6 text-center pt-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Time Zone Converter & World Clock</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-xs">
            Time Zone Converter
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Convert any time across the globe in seconds with live solar tracking & instant side-by-side comparison.
          </p>
        </div>

        {/* Live Device PC Local Time Banner */}
        <LocalTimeHeader onSyncToMyTime={handleSyncToUserDeviceTime} />
      </section>

      {/* CONVERTER CARDS (HERO POSITION) */}
      <section className="space-y-5">
        {/* Quick Swap & Section Bar */}
        <div className="flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-xl rounded-2xl p-3.5 px-5 shadow-xs">
          <div className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <span>Live Comparison Cards</span>
            <span className="text-[11px] font-normal lowercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              {targetLocations.length + 1} locations active
            </span>
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

          {/* Enhanced "+ Add Time Zone" Glass Card */}
          <div className="w-full min-h-[360px]">
            <div className="w-full h-full min-h-[360px] rounded-3xl p-6 bg-gradient-to-b from-white/60 via-white/40 to-white/60 dark:from-zinc-900/60 dark:via-zinc-900/40 dark:to-zinc-900/60 hover:bg-white/80 dark:hover:bg-zinc-900/80 border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-between text-center backdrop-blur-2xl group">
              {/* Top Section */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Quick Add
                </span>
                <span className="text-[11px] font-semibold opacity-60">
                  {LOCATIONS.length}+ world cities
                </span>
              </div>

              {/* Center Main Action */}
              <button
                type="button"
                onClick={() => {
                  setModalMode("target");
                  setModalOpen(true);
                }}
                className="my-auto py-4 flex flex-col items-center justify-center space-y-3 cursor-pointer group/add w-full"
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover/add:scale-110 group-hover/add:rotate-90 transition-all duration-300 border border-white/30">
                  <Plus className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-black text-lg text-zinc-800 dark:text-zinc-100 group-hover/add:text-blue-600 dark:group-hover/add:text-blue-400 transition-colors">
                    Add Time Zone
                  </div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 max-w-[200px] mx-auto mt-0.5">
                    Browse all countries & cities across all continents
                  </div>
                </div>
              </button>

              {/* Bottom Quick-Add City Pills */}
              <div className="w-full pt-3 border-t border-black/5 dark:border-white/10 space-y-2">
                <div className="text-[11px] font-bold opacity-75 uppercase tracking-wider">
                  Popular Time Zones:
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {LOCATIONS.filter(
                    (loc) =>
                      loc.id !== sourceLocation.id &&
                      !targetLocations.some((t) => t.id === loc.id)
                  )
                    .slice(0, 4)
                    .map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => handleSelectLocationFromModal(loc)}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/80 dark:bg-white/10 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-zinc-700 dark:text-zinc-300 border border-black/5 dark:border-white/10 shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <span>{loc.flag}</span>
                        <span>{loc.city}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
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
