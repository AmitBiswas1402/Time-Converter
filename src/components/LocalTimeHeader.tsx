"use client";

import React, { useState, useEffect } from "react";
import { TimeZoneOption, detectUserLocation, formatZonedTime } from "@/lib/timezones";
import { CountryFlag } from "./CountryFlag";
import { Clock, Zap, MapPin } from "lucide-react";

interface LocalTimeHeaderProps {
  onSyncToMyTime: (userLocation: TimeZoneOption) => void;
}

export const LocalTimeHeader: React.FC<LocalTimeHeaderProps> = ({ onSyncToMyTime }) => {
  const [userLocation, setUserLocation] = useState<TimeZoneOption | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const loc = detectUserLocation();
    setUserLocation(loc);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!userLocation || !currentTime) return null;

  const formatted = formatZonedTime(
    currentTime,
    userLocation.timezone,
    undefined,
    undefined,
    userLocation.lat,
    userLocation.lon
  );

  const timeFormatterWithSeconds = new Intl.DateTimeFormat("en-US", {
    timeZone: userLocation.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const liveTimeString = timeFormatterWithSeconds.format(currentTime);

  return (
    <div className="w-full bg-gradient-to-r from-blue-600/85 via-indigo-600/85 to-violet-600/85 backdrop-blur-xl text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Device Local Time & Location */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20 shadow-2xs">
          <Clock className="w-5 h-5 text-white animate-pulse" />
        </div>

        <div className="min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-white drop-shadow-2xs">
              {liveTimeString}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs text-white border border-white/30">
              <MapPin className="w-3 h-3 text-white" />
              Your Device Time
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-white/85 mt-1 truncate">
            <CountryFlag
              countryCode={userLocation.countryCode}
              flagEmoji={userLocation.flag}
              className="w-4 h-3 rounded-xs object-cover shrink-0"
            />
            <span className="font-bold text-white truncate">{userLocation.name || userLocation.city}</span>
            <span className="text-white/60">·</span>
            <span>{formatted.fullDateString}</span>
            <span className="text-white/60">·</span>
            <span className="font-mono text-white/90">{formatted.tzAbbr} ({formatted.utcOffset})</span>
          </div>
        </div>
      </div>

      {/* Right: Sync to My Time Button */}
      <button
        onClick={() => onSyncToMyTime(userLocation)}
        className="w-full sm:w-auto px-4 py-2.5 bg-white/90 hover:bg-white text-blue-700 font-bold text-xs rounded-xl shadow-lg backdrop-blur-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:scale-102 active:scale-98 border border-white/40"
      >
        <Zap className="w-3.5 h-3.5 fill-blue-700 stroke-none" />
        <span>Sync Converter to My Time</span>
      </button>
    </div>
  );
};
