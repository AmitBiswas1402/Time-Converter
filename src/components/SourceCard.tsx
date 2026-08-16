"use client";

import React from "react";
import { TimeZoneOption, FormattedZonedTime } from "@/lib/timezones";
import { CountryFlag } from "./CountryFlag";
import { Calendar, Clock, RotateCcw, ChevronDown, Sun, Moon, Sparkles } from "lucide-react";

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
  onFocusGlobe?: () => void;
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

  // Quick adjust helper
  const adjustHour = (delta: number) => {
    let currentH = parseInt(hour, 10);
    if (isNaN(currentH)) currentH = 12;
    let isPM = ampm === "PM";
    let h24 = (currentH % 12) + (isPM ? 12 : 0);

    h24 = (h24 + delta + 24) % 24;

    const newPM = h24 >= 12;
    let newH12 = h24 % 12;
    if (newH12 === 0) newH12 = 12;

    onHourChange(String(newH12).padStart(2, "0"));
    onAmPmChange(newPM ? "PM" : "AM");
  };

  return (
    <div
      className={`relative w-full h-full rounded-3xl p-6 shadow-xl border backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
        isDay
          ? "bg-gradient-to-b from-white/90 via-amber-50/40 to-white/90 dark:from-zinc-900/90 dark:via-amber-950/20 dark:to-zinc-900/90 border-amber-300/40 dark:border-amber-500/20 shadow-amber-500/5 text-zinc-900 dark:text-zinc-100"
          : "bg-gradient-to-b from-slate-950/90 via-indigo-950/50 to-slate-950/90 border-indigo-500/30 text-slate-100 shadow-indigo-950/40"
      }`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDay ? "bg-amber-400/20 dark:bg-amber-500/10" : "bg-indigo-500/20 dark:bg-indigo-600/15"
        }`}
      />

      {/* Top Header Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              Source Base
            </span>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-black/5 dark:bg-white/10 backdrop-blur-md">
              {isDay ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-amber-700 dark:text-amber-300">Daytime</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-300 fill-indigo-300" />
                  <span className="text-indigo-200">Nighttime</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onResetToNow}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Reset to current moment"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Live Now</span>
          </button>
        </div>

        {/* Location Selector Button */}
        <button
          onClick={onOpenLocationModal}
          className="w-full mb-5 flex items-center justify-between p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-black/5 dark:border-white/10 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all text-left group cursor-pointer backdrop-blur-md"
        >
          <div className="flex items-center gap-3 min-w-0">
            <CountryFlag
              countryCode={location.countryCode}
              flagEmoji={location.flag}
              className="w-8 h-6 rounded-md object-cover shadow-sm border border-black/10 dark:border-white/10 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-extrabold text-base leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {location.name}
              </div>
              <div className="text-xs opacity-75 truncate mt-0.5">
                {location.countryName} · <span className="font-mono font-semibold">{formattedTime.tzAbbr}</span> ({formattedTime.utcOffset})
              </div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 ml-2">
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {/* Live Large Time Display */}
        <div className="my-2 p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-violet-500/15 border border-blue-500/20 text-center shadow-inner">
          <div className="text-[11px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 mb-1">
            Active Source Time
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black tracking-tight flex items-baseline justify-center gap-1">
            <span>{hour}:{minute}</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">:{formattedTime.secondsStr}</span>
            <span className="text-base sm:text-lg font-bold ml-1">{ampm}</span>
          </div>
        </div>

        {/* Quick Adjustment Chips */}
        <div className="flex items-center justify-center gap-2 my-4">
          <button
            type="button"
            onClick={() => adjustHour(-1)}
            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/10 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all cursor-pointer shadow-2xs"
          >
            -1 hr
          </button>
          <button
            type="button"
            onClick={() => adjustHour(1)}
            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/10 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all cursor-pointer shadow-2xs"
          >
            +1 hr
          </button>
          <button
            type="button"
            onClick={() => adjustHour(3)}
            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/10 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all cursor-pointer shadow-2xs"
          >
            +3 hrs
          </button>
        </div>

        {/* Date and Time Pickers */}
        <div className="space-y-3.5 mt-2">
          {/* Date Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold opacity-75 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Change Date</span>
            </label>
            <input
              type="date"
              value={dateIso}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-zinc-800/80 border border-black/10 dark:border-white/10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer shadow-2xs"
            />
          </div>

          {/* Time Selectors */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold opacity-75 uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Adjust Time</span>
              </div>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                Seconds :{formattedTime.secondsStr}
              </span>
            </label>
            <div className="flex items-center gap-2">
              {/* Hour Dropdown */}
              <div className="flex-1 relative">
                <select
                  value={hour}
                  onChange={(e) => onHourChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/70 dark:bg-zinc-800/80 border border-black/10 dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer shadow-2xs appearance-none text-center"
                >
                  {hoursOptions.map((h) => (
                    <option key={h} value={h} className="text-zinc-900 bg-white dark:bg-zinc-900 dark:text-zinc-100">
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <span className="font-mono text-lg font-bold opacity-50">:</span>

              {/* Minute Dropdown */}
              <div className="flex-1 relative">
                <select
                  value={minute}
                  onChange={(e) => onMinuteChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/70 dark:bg-zinc-800/80 border border-black/10 dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer shadow-2xs appearance-none text-center"
                >
                  {minutesOptions.map((m) => (
                    <option key={m} value={m} className="text-zinc-900 bg-white dark:bg-zinc-900 dark:text-zinc-100">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* AM/PM Toggle Button */}
              <button
                type="button"
                onClick={() => onAmPmChange(ampm === "AM" ? "PM" : "AM")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm transition-all cursor-pointer shadow-md active:scale-95"
              >
                {ampm}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Solar Info Footer */}
      <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/10 text-center text-xs font-semibold opacity-80 flex items-center justify-center gap-1.5">
        {isDay ? (
          <>
            <span className="text-amber-500">🌇</span>
            <span>Sunset at <strong>{formattedTime.sunInfo.sunsetStr}</strong> (Sunrise {formattedTime.sunInfo.sunriseStr})</span>
          </>
        ) : (
          <>
            <span className="text-indigo-400">🌅</span>
            <span>Sunrise at <strong>{formattedTime.sunInfo.sunriseStr}</strong> (Sunset {formattedTime.sunInfo.sunsetStr})</span>
          </>
        )}
      </div>
    </div>
  );
};
