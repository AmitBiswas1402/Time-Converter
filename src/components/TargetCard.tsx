"use client";

import React from "react";
import { TimeZoneOption, FormattedZonedTime } from "@/lib/timezones";
import { CountryFlag } from "./CountryFlag";
import { Sun, Moon, ArrowRightLeft, X, TrendingUp, TrendingDown, Clock, Sparkles } from "lucide-react";

interface TargetCardProps {
  location: TimeZoneOption;
  formattedTime: FormattedZonedTime;
  onRemove: () => void;
  onChangeLocation: () => void;
  onMakeSource: () => void;
  canRemove: boolean;
  onFocusGlobe?: () => void;
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
  const isAhead = formattedTime.diffHours > 0;
  const isBehind = formattedTime.diffHours < 0;

  return (
    <div
      className={`relative w-full h-full rounded-3xl p-6 shadow-xl border backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
        isDay
          ? "bg-gradient-to-b from-white/90 via-amber-50/40 to-white/90 dark:from-zinc-900/90 dark:via-amber-950/20 dark:to-zinc-900/90 border-amber-300/40 dark:border-amber-500/20 shadow-amber-500/5 text-zinc-900 dark:text-zinc-100"
          : "bg-gradient-to-b from-slate-950/90 via-indigo-950/50 to-slate-950/90 border-indigo-500/30 text-slate-100 shadow-indigo-950/40"
      }`}
    >
      {/* Ambient background glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDay ? "bg-amber-400/20 dark:bg-amber-500/10" : "bg-indigo-500/20 dark:bg-indigo-600/15"
        }`}
      />

      {/* Top Header Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-black/5 dark:border-white/10">
          {/* Location Info (Click to change) */}
          <button
            onClick={onChangeLocation}
            className="flex items-center gap-3 hover:opacity-85 transition-all text-left min-w-0 cursor-pointer group/btn"
          >
            <CountryFlag
              countryCode={location.countryCode}
              flagEmoji={location.flag}
              className="w-8 h-6 rounded-md object-cover shadow-sm border border-black/10 dark:border-white/10 shrink-0 group-hover/btn:scale-105 transition-transform"
            />
            <div className="min-w-0">
              <h3 className="font-extrabold text-base leading-tight truncate group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400 transition-colors">
                {location.name}
              </h3>
              <p className="text-xs opacity-75 truncate mt-0.5">
                {location.countryName} · <span className="font-mono font-semibold">{formattedTime.tzAbbr}</span> ({formattedTime.utcOffset})
              </p>
            </div>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onMakeSource}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Make this the Primary Source location"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
            {canRemove && (
              <button
                onClick={onRemove}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Remove location"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Day/Night Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/5 dark:bg-white/10 backdrop-blur-md">
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

          {/* Relative Time Difference Pill */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md shadow-2xs border ${
                isAhead
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                  : isBehind
                  ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30"
                  : "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30"
              }`}
            >
              {isAhead && <TrendingUp className="w-3 h-3" />}
              {isBehind && <TrendingDown className="w-3 h-3" />}
              <span>{formattedTime.relativeDiffText}</span>
            </span>

            {formattedTime.relativeDay && formattedTime.relativeDay !== "Same day" && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 backdrop-blur-md">
                {formattedTime.relativeDay}
              </span>
            )}
          </div>
        </div>

        {/* Large Digital Time Readout */}
        <div className="my-5 py-4 px-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center">
          <div className="font-mono tracking-tight font-black text-4xl sm:text-5xl flex items-baseline justify-center gap-1">
            <span>{formattedTime.hourStr}:{formattedTime.minuteStr}</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">:{formattedTime.secondsStr}</span>
            <span className="text-lg sm:text-xl font-bold ml-1">{formattedTime.ampm}</span>
          </div>

          {/* Full Date String */}
          <div className="text-xs sm:text-sm font-semibold opacity-75 mt-1.5 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{formattedTime.fullDateString}</span>
          </div>
        </div>
      </div>

      {/* Footer & Quick Actions */}
      <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/10">
        {/* Solar Info */}
        <div className="text-center text-xs font-semibold opacity-80 flex items-center justify-center gap-1.5">
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

        {/* Set as Base Button */}
        <button
          onClick={onMakeSource}
          className="w-full py-2.5 px-3 rounded-xl bg-white/70 dark:bg-white/10 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-bold text-zinc-700 dark:text-zinc-300 border border-black/5 dark:border-white/10 shadow-2xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 group/btn"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 group-hover/btn:rotate-180 transition-transform duration-300" />
          <span>Convert From This Time</span>
        </button>
      </div>
    </div>
  );
};
