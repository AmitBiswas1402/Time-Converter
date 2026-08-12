"use client";

import React from "react";
import { TimeZoneOption, FormattedZonedTime } from "@/lib/timezones";
import { CountryFlag } from "./CountryFlag";
import { Sun, Moon, ArrowRightLeft, X } from "lucide-react";

interface TargetCardProps {
  location: TimeZoneOption;
  formattedTime: FormattedZonedTime;
  onRemove: () => void;
  onChangeLocation: () => void;
  onMakeSource: () => void;
  canRemove: boolean;
}

export const TargetCard: React.FC<TargetCardProps> = ({
  location,
  formattedTime,
  onRemove,
  onChangeLocation,
  onMakeSource,
  canRemove,
}) => {
  const isDay = formattedTime.sunInfo.isDay;

  return (
    <div
      className={`relative w-full rounded-2xl p-5 shadow-lg border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
        isDay
          ? "bg-gradient-to-br from-amber-500/10 via-white to-sky-500/10 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-850 border-amber-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
          : "bg-gradient-to-br from-slate-950 via-indigo-950 to-zinc-950 text-slate-100 border-indigo-900/60 shadow-indigo-950/40"
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b pb-3 mb-4 border-black/5 dark:border-white/10">
        <button
          onClick={onChangeLocation}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-left min-w-0 cursor-pointer"
        >
          <CountryFlag
            countryCode={location.countryCode}
            flagEmoji={location.flag}
            className="w-7 h-5 rounded-xs object-cover shadow-2xs border border-black/10 dark:border-white/10 shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
              {location.name}
            </h3>
            <p className="text-xs opacity-70 truncate">
              {location.countryName} · {formattedTime.tzAbbr} ({formattedTime.utcOffset})
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onMakeSource}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
            title="Make this the Source location"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
          {canRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"
              title="Remove location"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Time Display with Running Seconds Timer */}
      <div className="my-auto py-3 text-center space-y-3">
        {/* Day/Night Badge & Sunrise/Sunset Info */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-xs">
          {isDay ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-amber-700 dark:text-amber-300">
                Daytime · Sunset {formattedTime.sunInfo.sunsetStr}
              </span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-300 fill-indigo-300" />
              <span className="text-indigo-200">
                Nighttime · Sunrise {formattedTime.sunInfo.sunriseStr}
              </span>
            </>
          )}
        </div>

        {/* Live Running Seconds Clock Display: HH:MM:SS AM/PM */}
        <div className="font-mono tracking-tight font-extrabold text-3xl sm:text-4xl flex items-baseline justify-center gap-0.5">
          <span>{formattedTime.hourStr}:{formattedTime.minuteStr}:</span>
          <span className="text-blue-500 dark:text-blue-400 font-bold">{formattedTime.secondsStr}</span>
          <span className="text-lg sm:text-xl font-bold ml-1.5">{formattedTime.ampm}</span>
        </div>

        {/* Date Display */}
        <div className="text-xs sm:text-sm font-medium opacity-80">
          {formattedTime.fullDateString}
        </div>

        {/* Relative Time Difference Pill */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-300 border border-blue-500/20">
            🕒 {formattedTime.relativeDiffText}
          </span>
          {formattedTime.relativeDay && formattedTime.relativeDay !== "Same day" && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
              {formattedTime.relativeDay}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
