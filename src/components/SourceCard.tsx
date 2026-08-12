"use client";

import React from "react";
import { TimeZoneOption, FormattedZonedTime } from "@/lib/timezones";
import { CountryFlag } from "./CountryFlag";
import { Calendar, Clock, RotateCcw, ChevronDown, Sun, Moon } from "lucide-react";

interface SourceCardProps {
  location: TimeZoneOption;
  formattedTime: FormattedZonedTime;
  dateIso: string;
  hour: string;
  minute: string;
  ampm: "AM" | "PM";
  onOpenLocationModal: () => void;
  onDateChange: (val: string) => void;
  onHourChange: (val: string) => void;
  onMinuteChange: (val: string) => void;
  onAmPmChange: (val: "AM" | "PM") => void;
  onResetToNow: () => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  location,
  formattedTime,
  dateIso,
  hour,
  minute,
  ampm,
  onOpenLocationModal,
  onDateChange,
  onHourChange,
  onMinuteChange,
  onAmPmChange,
  onResetToNow,
}) => {
  const hoursOptions = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutesOptions = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const isDay = formattedTime.sunInfo.isDay;

  return (
    <div
      className={`relative w-full rounded-2xl p-5 shadow-lg border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isDay
          ? "bg-gradient-to-br from-amber-500/10 via-white to-sky-500/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-850 border-amber-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
          : "bg-gradient-to-br from-slate-950 via-indigo-950 to-zinc-950 text-slate-100 border-indigo-900/60 shadow-indigo-950/40"
      }`}
    >
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-2 border-b pb-3 mb-4 border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white shadow-2xs">
            Source Location
          </span>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/5 dark:bg-white/10">
            {isDay ? (
              <>
                <Sun className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-amber-700 dark:text-amber-300">Daytime</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-indigo-300 fill-indigo-300" />
                <span className="text-indigo-200">Nighttime</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onResetToNow}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
          title="Reset to current moment"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Now</span>
        </button>
      </div>

      {/* Location Selector Button */}
      <button
        onClick={onOpenLocationModal}
        className="w-full mb-5 flex items-center justify-between p-3.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 transition-all text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <CountryFlag
            countryCode={location.countryCode}
            flagEmoji={location.flag}
            className="w-7 h-5 rounded-xs object-cover shadow-2xs border border-black/10 dark:border-white/10 shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-base leading-tight truncate group-hover:text-blue-500 transition-colors">
              {location.name}
            </div>
            <div className="text-xs opacity-70 truncate">
              {location.countryName} · {formattedTime.tzAbbr} ({formattedTime.utcOffset})
            </div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 opacity-60 group-hover:opacity-100 shrink-0" />
      </button>

      {/* Inputs Form */}
      <div className="space-y-4">
        {/* Date Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold opacity-70 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={dateIso}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Time Selectors */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold opacity-70 uppercase tracking-wider flex items-center gap-1.5 justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Time</span>
            </div>
            <span className="font-mono text-xs font-bold text-blue-500 dark:text-blue-400">
              :{formattedTime.secondsStr}s
            </span>
          </label>
          <div className="flex items-center gap-2">
            {/* Hour Dropdown */}
            <select
              value={hour}
              onChange={(e) => onHourChange(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              {hoursOptions.map((h) => (
                <option key={h} value={h} className="text-zinc-900 bg-white">
                  {h}
                </option>
              ))}
            </select>

            <span className="font-bold text-lg opacity-60">:</span>

            {/* Minute Dropdown */}
            <select
              value={minute}
              onChange={(e) => onMinuteChange(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              {minutesOptions.map((m) => (
                <option key={m} value={m} className="text-zinc-900 bg-white">
                  {m}
                </option>
              ))}
            </select>

            {/* AM/PM Toggle Button */}
            <button
              type="button"
              onClick={() => onAmPmChange(ampm === "AM" ? "PM" : "AM")}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {ampm}
            </button>
          </div>
        </div>
      </div>

      {/* Solar Info Footer */}
      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 text-center text-xs opacity-75">
        {isDay
          ? `🌇 Sunset around ${formattedTime.sunInfo.sunsetStr}`
          : `🌅 Sunrise around ${formattedTime.sunInfo.sunriseStr}`}
      </div>
    </div>
  );
};
