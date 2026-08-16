"use client";

import React, { useState, useEffect, useRef } from "react";
import { COUNTRIES, CountryItem, TimeZoneOption } from "@/lib/timezones";
import { CountryFlag } from "./CountryFlag";
import { Search, X, Check, Globe, ArrowLeft, ChevronRight } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: TimeZoneOption) => void;
  selectedLocationId?: string;
  title?: string;
}

const QUICK_COUNTRIES = [
  { name: "United States", flag: "🇺🇸", code: "US" },
  { name: "United Kingdom", flag: "🇬🇧", code: "GB" },
  { name: "France", flag: "🇫🇷", code: "FR" },
  { name: "Germany", flag: "🇩🇪", code: "DE" },
  { name: "India", flag: "🇮🇳", code: "IN" },
  { name: "Japan", flag: "🇯🇵", code: "JP" },
  { name: "Australia", flag: "🇦🇺", code: "AU" },
  { name: "Canada", flag: "🇨🇦", code: "CA" },
  { name: "Singapore", flag: "🇸🇬", code: "SG" },
  { name: "Brazil", flag: "🇧🇷", code: "BR" },
  { name: "United Arab Emirates", flag: "🇦🇪", code: "AE" },
  { name: "Mexico", flag: "🇲🇽", code: "MX" },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedLocationId,
  title = "Select location",
}) => {
  const [search, setSearch] = useState("");
  const [activeCountry, setActiveCountry] = useState<CountryItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setActiveCountry(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (activeCountry && !search) {
          setActiveCountry(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeCountry, search, onClose]);

  if (!isOpen) return null;

  const handleCountryClick = (country: CountryItem) => {
    if (country.timezones.length === 1) {
      onSelect(country.timezones[0]);
      onClose();
    } else {
      setActiveCountry(country);
    }
  };

  const handleTimeZoneSelect = (tz: TimeZoneOption) => {
    onSelect(tz);
    onClose();
  };

  const handleQuickCountryClick = (code: string) => {
    const found = COUNTRIES.find((c) => c.code === code);
    if (found) {
      if (found.timezones.length === 1) {
        onSelect(found.timezones[0]);
        onClose();
      } else {
        setActiveCountry(found);
        setSearch("");
      }
    }
  };

  // Filter countries by search query
  const q = search.toLowerCase().trim();

  const searchResults = q
    ? COUNTRIES.flatMap((country) => {
        const matchCountry = country.name.toLowerCase().includes(q);
        const matchingTzs = country.timezones.filter(
          (tz) =>
            tz.name.toLowerCase().includes(q) ||
            tz.city.toLowerCase().includes(q) ||
            tz.timezone.toLowerCase().includes(q) ||
            tz.aliases?.some((a) => a.toLowerCase().includes(q))
        );

        if (matchCountry || matchingTzs.length > 0) {
          return {
            country,
            matchingTimezones: matchCountry ? country.timezones : matchingTzs,
          };
        }
        return [];
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden transition-all transform animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeCountry && !search ? (
              <button
                onClick={() => setActiveCountry(null)}
                className="p-1 -ml-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>All Countries</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {title}
                </h2>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input & Quick Pills */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search any country (e.g. Germany, Brazil, Italy, UAE) or city..."
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!search && !activeCountry && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {QUICK_COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleQuickCountryClick(c.code)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <CountryFlag countryCode={c.code} flagEmoji={c.flag} className="w-4 h-3 rounded-xs object-cover" />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Body List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* SEARCH RESULTS */}
          {q ? (
            searchResults.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                <p className="text-sm">No countries or time zones matching &quot;{search}&quot;</p>
              </div>
            ) : (
              searchResults.map(({ country, matchingTimezones }) => (
                <div key={country.code} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2 py-0.5">
                    <CountryFlag countryCode={country.code} flagEmoji={country.flag} className="w-4 h-3 rounded-xs object-cover" />
                    <span>{country.name}</span>
                    <span className="normal-case text-[11px] font-normal text-zinc-400">
                      ({matchingTimezones.length} time zone{matchingTimezones.length > 1 ? "s" : ""})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {matchingTimezones.map((tz) => {
                      const isSelected = tz.id === selectedLocationId;
                      return (
                        <button
                          key={tz.id}
                          onClick={() => handleTimeZoneSelect(tz)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 ring-1 ring-blue-500/30"
                              : "bg-white dark:bg-zinc-850 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CountryFlag countryCode={country.code} flagEmoji={country.flag} className="w-6 h-4.5 rounded-xs object-cover border border-black/10 dark:border-white/10 shrink-0" />
                            <div className="min-w-0">
                              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                                {tz.name}
                              </div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {country.name}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )
          ) : activeCountry ? (
            /* DRILL-DOWN SUB-VIEW FOR ACTIVE COUNTRY TIME ZONES */
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60">
                <CountryFlag countryCode={activeCountry.code} flagEmoji={activeCountry.flag} className="w-8 h-6 rounded-xs object-cover shadow-2xs border border-black/10 dark:border-white/10" />
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {activeCountry.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Select one of {activeCountry.timezones.length} time zones in {activeCountry.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {activeCountry.timezones.map((tz) => {
                  const isSelected = tz.id === selectedLocationId;
                  return (
                    <button
                      key={tz.id}
                      onClick={() => handleTimeZoneSelect(tz)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 ring-1 ring-blue-500/30"
                          : "bg-white dark:bg-zinc-850 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-200 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CountryFlag countryCode={activeCountry.code} flagEmoji={activeCountry.flag} className="w-6 h-4.5 rounded-xs object-cover border border-black/10 dark:border-white/10 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                            {tz.name}
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                          Select
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* DEFAULT COUNTRY LIST VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
                <span>Select Country ({COUNTRIES.length} Countries)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COUNTRIES.map((country) => {
                  const timezoneCount = country.timezones.length;
                  const isSelectedCountry = country.timezones.some(
                    (t) => t.id === selectedLocationId
                  );

                  return (
                    <button
                      key={country.code}
                      onClick={() => handleCountryClick(country)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                        isSelectedCountry
                          ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80"
                          : "bg-white dark:bg-zinc-850 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-200 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CountryFlag
                          countryCode={country.code}
                          flagEmoji={country.flag}
                          className="w-7 h-5 rounded-xs object-cover shadow-2xs border border-black/10 dark:border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {country.name}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timezoneCount === 1
                              ? "1 time zone"
                              : `${timezoneCount} time zones`}
                          </div>
                        </div>
                      </div>

                      {timezoneCount > 1 ? (
                        <div className="flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      ) : (
                        isSelectedCountry && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
