"use client";

import React, { useState } from "react";

interface CountryFlagProps {
  countryCode: string; // e.g. "US", "IN", "JP"
  flagEmoji: string; // e.g. "🇺🇸"
  className?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  flagEmoji,
  className = "w-6 h-4.5 rounded-xs object-cover shadow-2xs border border-black/10 dark:border-white/10",
}) => {
  const [error, setError] = useState(false);

  if (error || !countryCode) {
    return <span className="text-xl leading-none">{flagEmoji}</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
      alt={countryCode}
      onError={() => setError(true)}
      className={className}
      loading="lazy"
    />
  );
};
