export interface TimeZoneOption {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  name: string;
  city: string;
  timezone: string;
  lat: number;
  lon: number;
  aliases?: string[];
}

export interface CountryItem {
  code: string;
  name: string;
  flag: string;
  popular?: boolean;
  timezones: TimeZoneOption[];
}

export const COUNTRIES: CountryItem[] = [
  // India
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    popular: true,
    timezones: [
      {
        id: "in-kolkata",
        countryCode: "IN",
        countryName: "India",
        flag: "🇮🇳",
        name: "Kolkata / Mumbai / New Delhi (IST)",
        city: "Kolkata",
        timezone: "Asia/Kolkata",
        lat: 22.5726,
        lon: 88.3639,
        aliases: ["Mumbai", "New Delhi", "Delhi", "Bengaluru", "Bangalore", "Chennai", "Hyderabad", "IST"],
      },
    ],
  },

  // United States
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    popular: true,
    timezones: [
      {
        id: "us-new-york",
        countryCode: "US",
        countryName: "United States",
        flag: "🇺🇸",
        name: "New York / Washington DC (Eastern Time)",
        city: "New York",
        timezone: "America/New_York",
        lat: 40.7128,
        lon: -74.006,
        aliases: ["NYC", "Eastern Time", "EDT", "EST", "Miami", "Boston", "Atlanta", "DC"],
      },
      {
        id: "us-chicago",
        countryCode: "US",
        countryName: "United States",
        flag: "🇺🇸",
        name: "Chicago / Dallas (Central Time)",
        city: "Chicago",
        timezone: "America/Chicago",
        lat: 41.8781,
        lon: -87.6298,
        aliases: ["Central Time", "CDT", "CST", "Dallas", "Houston", "Austin"],
      },
      {
        id: "us-denver",
        countryCode: "US",
        countryName: "United States",
        flag: "🇺🇸",
        name: "Denver / Salt Lake City (Mountain Time)",
        city: "Denver",
        timezone: "America/Denver",
        lat: 39.7392,
        lon: -104.9903,
        aliases: ["Mountain Time", "MDT", "MST", "Salt Lake City"],
      },
      {
        id: "us-los-angeles",
        countryCode: "US",
        countryName: "United States",
        flag: "🇺🇸",
        name: "Los Angeles / Seattle (Pacific Time)",
        city: "Los Angeles",
        timezone: "America/Los_Angeles",
        lat: 34.0522,
        lon: -118.2437,
        aliases: ["LA", "Pacific Time", "PDT", "PST", "San Francisco", "Seattle", "San Diego", "Las Vegas"],
      },
      {
        id: "us-phoenix",
        countryCode: "US",
        countryName: "United States",
        flag: "🇺🇸",
        name: "Phoenix (Arizona - No DST)",
        city: "Phoenix",
        timezone: "America/Phoenix",
        lat: 33.4484,
        lon: -112.074,
        aliases: ["Arizona", "MST"],
      },
      {
        id: "us-anchorage",
        countryCode: "US",
        countryName: "United States",
        flag: "🇺🇸",
        name: "Anchorage (Alaska Time)",
        city: "Anchorage",
        timezone: "America/Anchorage",
        lat: 61.2181,
        lon: -149.9003,
        aliases: ["Alaska", "AKDT", "AKST"],
      },
      {
        id: "us-honolulu",
        countryCode: "US",
        countryName: "United States",
        flag: "🇺🇸",
        name: "Honolulu (Hawaii Time)",
        city: "Honolulu",
        timezone: "Pacific/Honolulu",
        lat: 21.3069,
        lon: -157.8583,
        aliases: ["Hawaii", "HST"],
      },
      {
        id: "us-puerto-rico",
        countryCode: "US",
        countryName: "United States",
        flag: "🇵🇷",
        name: "San Juan (Puerto Rico - Atlantic Time)",
        city: "San Juan",
        timezone: "America/Puerto_Rico",
        lat: 18.4655,
        lon: -66.1057,
        aliases: ["Puerto Rico", "AST"],
      },
      {
        id: "us-guam",
        countryCode: "US",
        countryName: "United States",
        flag: "🇬🇺",
        name: "Guam (Chamorro Time)",
        city: "Guam",
        timezone: "Pacific/Guam",
        lat: 13.4443,
        lon: 144.7937,
        aliases: ["Guam", "ChST"],
      },
    ],
  },

  // United Kingdom
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    popular: true,
    timezones: [
      {
        id: "gb-london",
        countryCode: "GB",
        countryName: "United Kingdom",
        flag: "🇬🇧",
        name: "London (UK Metropolitan - GMT/BST)",
        city: "London",
        timezone: "Europe/London",
        lat: 51.5074,
        lon: -0.1278,
        aliases: ["UK", "Great Britain", "England", "BST", "GMT", "Manchester", "Edinburgh"],
      },
      {
        id: "gb-gibraltar",
        countryCode: "GB",
        countryName: "United Kingdom",
        flag: "🇬🇮",
        name: "Gibraltar",
        city: "Gibraltar",
        timezone: "Europe/Gibraltar",
        lat: 36.1408,
        lon: -5.3536,
        aliases: ["CET", "CEST"],
      },
      {
        id: "gb-bermuda",
        countryCode: "GB",
        countryName: "United Kingdom",
        flag: "🇧🇲",
        name: "Bermuda (Atlantic Time)",
        city: "Bermuda",
        timezone: "Atlantic/Bermuda",
        lat: 32.3078,
        lon: -64.7505,
        aliases: ["AST", "ADT"],
      },
      {
        id: "gb-cayman",
        countryCode: "GB",
        countryName: "United Kingdom",
        flag: "🇰🇾",
        name: "Cayman Islands (Eastern Standard Time)",
        city: "Cayman Islands",
        timezone: "America/Cayman",
        lat: 19.3133,
        lon: -81.2546,
        aliases: ["EST"],
      },
    ],
  },

  // France
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    popular: true,
    timezones: [
      {
        id: "fr-paris",
        countryCode: "FR",
        countryName: "France",
        flag: "🇫🇷",
        name: "Paris (Metropolitan France - CET/CEST)",
        city: "Paris",
        timezone: "Europe/Paris",
        lat: 48.8566,
        lon: 2.3522,
        aliases: ["Paris", "Nice", "Lyon", "Marseille", "CEST", "CET"],
      },
      {
        id: "fr-tahiti",
        countryCode: "FR",
        countryName: "France",
        flag: "🇵🇫",
        name: "Tahiti (French Polynesia)",
        city: "Tahiti",
        timezone: "Pacific/Tahiti",
        lat: -17.6509,
        lon: -149.426,
        aliases: ["French Polynesia", "Papeete", "Bora Bora"],
      },
      {
        id: "fr-reunion",
        countryCode: "FR",
        countryName: "France",
        flag: "🇷🇪",
        name: "Saint-Denis (Réunion)",
        city: "Réunion",
        timezone: "Indian/Reunion",
        lat: -20.8823,
        lon: 55.4504,
        aliases: ["Reunion", "RET"],
      },
      {
        id: "fr-guadeloupe",
        countryCode: "FR",
        countryName: "France",
        flag: "🇬🇵",
        name: "Guadeloupe & Martinique (French Antilles)",
        city: "Guadeloupe",
        timezone: "America/Guadeloupe",
        lat: 16.265,
        lon: -61.551,
        aliases: ["Martinique", "Antilles", "AST"],
      },
      {
        id: "fr-french-guiana",
        countryCode: "FR",
        countryName: "France",
        flag: "🇬🇫",
        name: "Cayenne (French Guiana)",
        city: "French Guiana",
        timezone: "America/Cayenne",
        lat: 4.9372,
        lon: -52.326,
        aliases: ["Guiana", "GFT"],
      },
      {
        id: "fr-mayotte",
        countryCode: "FR",
        countryName: "France",
        flag: "🇾🇹",
        name: "Mamoudzou (Mayotte)",
        city: "Mayotte",
        timezone: "Indian/Mayotte",
        lat: -12.7806,
        lon: 45.2278,
        aliases: ["EAT"],
      },
      {
        id: "fr-new-caledonia",
        countryCode: "FR",
        countryName: "France",
        flag: "🇳🇨",
        name: "Nouméa (New Caledonia)",
        city: "New Caledonia",
        timezone: "Pacific/Noumea",
        lat: -22.2758,
        lon: 166.458,
        aliases: ["NCT"],
      },
    ],
  },

  // Japan
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    popular: true,
    timezones: [
      {
        id: "jp-tokyo",
        countryCode: "JP",
        countryName: "Japan",
        flag: "🇯🇵",
        name: "Tokyo / Osaka (JST)",
        city: "Tokyo",
        timezone: "Asia/Tokyo",
        lat: 35.6762,
        lon: 139.6503,
        aliases: ["JST", "Osaka", "Kyoto"],
      },
    ],
  },

  // Australia
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    popular: true,
    timezones: [
      {
        id: "au-sydney",
        countryCode: "AU",
        countryName: "Australia",
        flag: "🇦🇺",
        name: "Sydney / Melbourne (Eastern AEST/AEDT)",
        city: "Sydney",
        timezone: "Australia/Sydney",
        lat: -33.8688,
        lon: 151.2093,
        aliases: ["AEST", "AEDT", "Melbourne", "Canberra"],
      },
      {
        id: "au-brisbane",
        countryCode: "AU",
        countryName: "Australia",
        flag: "🇦🇺",
        name: "Brisbane (Queensland AEST - No DST)",
        city: "Brisbane",
        timezone: "Australia/Brisbane",
        lat: -27.4698,
        lon: 153.0251,
        aliases: ["Queensland", "AEST"],
      },
      {
        id: "au-adelaide",
        countryCode: "AU",
        countryName: "Australia",
        flag: "🇦🇺",
        name: "Adelaide (Central ACST/ACDT)",
        city: "Adelaide",
        timezone: "Australia/Adelaide",
        lat: -34.9285,
        lon: 138.6007,
        aliases: ["ACST", "ACDT"],
      },
      {
        id: "au-perth",
        countryCode: "AU",
        countryName: "Australia",
        flag: "🇦🇺",
        name: "Perth (Western AWST)",
        city: "Perth",
        timezone: "Australia/Perth",
        lat: -31.9505,
        lon: 115.8605,
        aliases: ["AWST", "Western Australia"],
      },
    ],
  },

  // United Arab Emirates
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    popular: true,
    timezones: [
      {
        id: "ae-dubai",
        countryCode: "AE",
        countryName: "United Arab Emirates",
        flag: "🇦🇪",
        name: "Dubai / Abu Dhabi (GST)",
        city: "Dubai",
        timezone: "Asia/Dubai",
        lat: 25.2048,
        lon: 55.2708,
        aliases: ["UAE", "Abu Dhabi", "GST"],
      },
    ],
  },

  // Singapore
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    popular: true,
    timezones: [
      {
        id: "sg-singapore",
        countryCode: "SG",
        countryName: "Singapore",
        flag: "🇸🇬",
        name: "Singapore (SGT)",
        city: "Singapore",
        timezone: "Asia/Singapore",
        lat: 1.3521,
        lon: 103.8198,
        aliases: ["SGT"],
      },
    ],
  },

  // Canada
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    popular: true,
    timezones: [
      {
        id: "ca-toronto",
        countryCode: "CA",
        countryName: "Canada",
        flag: "🇨🇦",
        name: "Toronto / Montreal (Eastern Time)",
        city: "Toronto",
        timezone: "America/Toronto",
        lat: 43.6532,
        lon: -79.3832,
        aliases: ["EDT", "EST", "Ottawa", "Montreal"],
      },
      {
        id: "ca-vancouver",
        countryCode: "CA",
        countryName: "Canada",
        flag: "🇨🇦",
        name: "Vancouver (Pacific Time)",
        city: "Vancouver",
        timezone: "America/Vancouver",
        lat: 49.2827,
        lon: -123.1207,
        aliases: ["PDT", "PST", "British Columbia"],
      },
      {
        id: "ca-calgary",
        countryCode: "CA",
        countryName: "Canada",
        flag: "🇨🇦",
        name: "Calgary / Edmonton (Mountain Time)",
        city: "Calgary",
        timezone: "America/Edmonton",
        lat: 51.0447,
        lon: -114.0719,
        aliases: ["MDT", "MST", "Alberta"],
      },
      {
        id: "ca-halifax",
        countryCode: "CA",
        countryName: "Canada",
        flag: "🇨🇦",
        name: "Halifax (Atlantic Time)",
        city: "Halifax",
        timezone: "America/Halifax",
        lat: 44.6488,
        lon: -63.5752,
        aliases: ["ADT", "AST", "Nova Scotia"],
      },
    ],
  },

  // Germany
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    popular: true,
    timezones: [
      {
        id: "de-berlin",
        countryCode: "DE",
        countryName: "Germany",
        flag: "🇩🇪",
        name: "Berlin / Frankfurt / Munich (CET/CEST)",
        city: "Berlin",
        timezone: "Europe/Berlin",
        lat: 52.52,
        lon: 13.405,
        aliases: ["Frankfurt", "Munich", "CEST", "CET"],
      },
    ],
  },
];

export const LOCATIONS: TimeZoneOption[] = COUNTRIES.flatMap((c) => c.timezones);

export interface SunInfo {
  isDay: boolean;
  sunriseStr: string;
  sunsetStr: string;
}

export function calculateSunInfo(
  utcDate: Date,
  lat: number,
  lon: number,
  timezone: string
): SunInfo {
  const comps = getZonedDateComponents(utcDate, timezone);
  const localDecimalHour = comps.hour24 + comps.minute / 60;

  const startOfYear = new Date(Date.UTC(comps.year, 0, 1));
  const dateInUtc = new Date(Date.UTC(comps.year, comps.month - 1, comps.day));
  const dayOfYear =
    Math.floor((dateInUtc.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  const declination = 0.409 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365);
  const latRad = (lat * Math.PI) / 180;

  let cosH =
    (Math.sin((-0.833 * Math.PI) / 180) - Math.sin(latRad) * Math.sin(declination)) /
    (Math.cos(latRad) * Math.cos(declination));

  cosH = Math.max(-1, Math.min(1, cosH));

  const H = Math.acos(cosH);
  const hHours = (H * 180) / Math.PI / 15;

  const sunriseHour = Math.max(4, 12 - hHours);
  const sunsetHour = Math.min(22, 12 + hHours);

  const isDay = localDecimalHour >= sunriseHour && localDecimalHour < sunsetHour;

  const formatTimeStr = (decimalHr: number) => {
    let h = Math.floor(decimalHr);
    let m = Math.round((decimalHr - h) * 60);
    if (m >= 60) {
      h += 1;
      m = 0;
    }
    const ampm = h >= 12 && h < 24 ? "PM" : "AM";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return {
    isDay,
    sunriseStr: formatTimeStr(sunriseHour),
    sunsetStr: formatTimeStr(sunsetHour),
  };
}

export function createUtcDateFromLocal(
  year: number,
  month: number,
  day: number,
  hour24: number,
  minute: number,
  timezone: string
): Date {
  let estimatedUtcMs = Date.UTC(year, month - 1, day, hour24, minute);

  for (let i = 0; i < 3; i++) {
    const d = new Date(estimatedUtcMs);
    const parts = getZonedDateComponents(d, timezone);

    const yearDiff = year - parts.year;
    const monthDiff = month - parts.month;
    const dayDiff = day - parts.day;
    const hourDiff = hour24 - parts.hour24;
    const minuteDiff = minute - parts.minute;

    const totalDiffMinutes =
      yearDiff * 525600 +
      monthDiff * 43200 +
      dayDiff * 1440 +
      hourDiff * 60 +
      minuteDiff;

    if (totalDiffMinutes === 0) break;
    estimatedUtcMs += totalDiffMinutes * 60 * 1000;
  }

  return new Date(estimatedUtcMs);
}

export function getZonedDateComponents(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  let year = 2026,
    month = 1,
    day = 1,
    hour24 = 0,
    minute = 0,
    second = 0;

  for (const p of parts) {
    if (p.type === "year") year = parseInt(p.value, 10);
    if (p.type === "month") month = parseInt(p.value, 10);
    if (p.type === "day") day = parseInt(p.value, 10);
    if (p.type === "hour") {
      let h = parseInt(p.value, 10);
      if (h === 24) h = 0;
      hour24 = h;
    }
    if (p.type === "minute") minute = parseInt(p.value, 10);
    if (p.type === "second") second = parseInt(p.value, 10);
  }

  return { year, month, day, hour24, minute, second };
}

export interface FormattedZonedTime {
  timeString: string; // e.g. "09:00:25 AM"
  timeWithoutSec: string; // "09:00 AM"
  hourStr: string; // "09"
  minuteStr: string; // "00"
  secondsStr: string; // "25"
  secondsNum: number; // 25
  ampm: "AM" | "PM";
  dateString: string; // e.g. "Wednesday, Aug 12"
  fullDateString: string; // e.g. "Wednesday, 12 August 2026"
  dateIso: string; // e.g. "2026-08-12"
  tzAbbr: string; // e.g. "EDT", "IST", "BST"
  utcOffset: string; // e.g. "UTC-4", "UTC+5:30"
  relativeDay: string; // "Same day", "Tomorrow", "Yesterday"
  relativeDiffText: string; // e.g. "9.5 hours behind", "Same time"
  diffMinutes: number;
  sunInfo: SunInfo;
}

export function formatZonedTime(
  utcDate: Date,
  targetTimezone: string,
  sourceUtcDate?: Date,
  sourceTimezone?: string,
  lat: number = 22.5726,
  lon: number = 88.3639
): FormattedZonedTime {
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: targetTimezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const timeParts = timeFormatter.formatToParts(utcDate);
  let hourStr = "12";
  let minuteStr = "00";
  let secondsStr = "00";
  let ampm: "AM" | "PM" = "AM";

  for (const p of timeParts) {
    if (p.type === "hour") hourStr = p.value;
    if (p.type === "minute") minuteStr = p.value;
    if (p.type === "second") secondsStr = p.value;
    if (p.type === "dayPeriod") ampm = p.value.toUpperCase() as "AM" | "PM";
  }

  const timeString = `${hourStr}:${minuteStr}:${secondsStr} ${ampm}`;
  const timeWithoutSec = `${hourStr}:${minuteStr} ${ampm}`;
  const secondsNum = parseInt(secondsStr, 10) || 0;

  const dateShortFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: targetTimezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const dateString = dateShortFormatter.format(utcDate);

  const dateFullFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: targetTimezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const fullDateString = dateFullFormatter.format(utcDate);

  const dateComponents = getZonedDateComponents(utcDate, targetTimezone);
  const yyyy = dateComponents.year;
  const mm = String(dateComponents.month).padStart(2, "0");
  const dd = String(dateComponents.day).padStart(2, "0");
  const dateIso = `${yyyy}-${mm}-${dd}`;

  const tzAbbrFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: targetTimezone,
    timeZoneName: "short",
  });
  const tzParts = tzAbbrFormatter.formatToParts(utcDate);
  let tzAbbr = "";
  for (const p of tzParts) {
    if (p.type === "timeZoneName") {
      tzAbbr = p.value;
    }
  }

  const utcOffsetMinutes = getUtcOffsetMinutes(utcDate, targetTimezone);
  const utcOffset = formatUtcOffset(utcOffsetMinutes);

  let relativeDay = "";
  let relativeDiffText = "";
  let diffMinutes = 0;

  if (sourceUtcDate && sourceTimezone) {
    const srcComponents = getZonedDateComponents(sourceUtcDate, sourceTimezone);
    const tgtComponents = getZonedDateComponents(utcDate, targetTimezone);

    const srcDateVal = Date.UTC(srcComponents.year, srcComponents.month - 1, srcComponents.day);
    const tgtDateVal = Date.UTC(tgtComponents.year, tgtComponents.month - 1, tgtComponents.day);
    const dayDiff = Math.round((tgtDateVal - srcDateVal) / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) relativeDay = "Same day";
    else if (dayDiff === 1) relativeDay = "Tomorrow";
    else if (dayDiff === -1) relativeDay = "Yesterday";
    else if (dayDiff > 1) relativeDay = `+${dayDiff} days`;
    else relativeDay = `${dayDiff} days`;

    const srcOffset = getUtcOffsetMinutes(sourceUtcDate, sourceTimezone);
    diffMinutes = utcOffsetMinutes - srcOffset;

    if (diffMinutes === 0) {
      relativeDiffText = "Same time";
    } else {
      const absMinutes = Math.abs(diffMinutes);
      const hours = Math.floor(absMinutes / 60);
      const mins = absMinutes % 60;
      let durationStr = "";
      if (hours > 0 && mins > 0) durationStr = `${hours}.${Math.round((mins / 60) * 10)} hrs`;
      else if (hours > 0) durationStr = `${hours} hrs`;
      else durationStr = `${mins} mins`;

      relativeDiffText = diffMinutes > 0 ? `${durationStr} ahead` : `${durationStr} behind`;
    }
  }

  const sunInfo = calculateSunInfo(utcDate, lat, lon, targetTimezone);

  return {
    timeString,
    timeWithoutSec,
    hourStr,
    minuteStr,
    secondsStr,
    secondsNum,
    ampm,
    dateString,
    fullDateString,
    dateIso,
    tzAbbr,
    utcOffset,
    relativeDay,
    relativeDiffText,
    diffMinutes,
    sunInfo,
  };
}

export function getUtcOffsetMinutes(date: Date, timezone: string): number {
  const zonedComp = getZonedDateComponents(date, timezone);
  const zonedUtcMs = Date.UTC(
    zonedComp.year,
    zonedComp.month - 1,
    zonedComp.day,
    zonedComp.hour24,
    zonedComp.minute
  );
  return Math.round((zonedUtcMs - date.getTime()) / (60 * 1000));
}

export function formatUtcOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "−";
  const absMins = Math.abs(offsetMinutes);
  const hrs = Math.floor(absMins / 60);
  const mins = absMins % 60;

  if (mins === 0) return `UTC${sign}${hrs}`;
  return `UTC${sign}${hrs}:${String(mins).padStart(2, "0")}`;
}

export function detectUserLocation(): TimeZoneOption {
  try {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (userTz) {
      const match = LOCATIONS.find((loc) => loc.timezone === userTz);
      if (match) return match;

      const cityName = userTz.split("/")[1]?.replace(/_/g, " ");
      if (cityName) {
        const cityMatch = LOCATIONS.find(
          (loc) => loc.city.toLowerCase() === cityName.toLowerCase()
        );
        if (cityMatch) return cityMatch;
      }
    }

    const userOffsetMs = -new Date().getTimezoneOffset();
    const offsetMatch = LOCATIONS.find(
      (loc) => getUtcOffsetMinutes(new Date(), loc.timezone) === userOffsetMs
    );
    if (offsetMatch) return offsetMatch;
  } catch (e) {
    console.error("Could not detect browser timezone", e);
  }

  return LOCATIONS[0];
}
