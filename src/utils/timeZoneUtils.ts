import { CoordinateSpot, HoppingScheduleItem } from '../types/pokemon';

/**
 * Calculates timezone offset in minutes from UTC for a specific IANA timezone at a specific point in time.
 * Uses Intl.DateTimeFormat parts to ensure 100% browser-timezone independence.
 */
export function getTimeZoneOffsetMinutes(timeZone: string, date: Date = new Date()): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    let pYear = 0, pMonth = 0, pDay = 0, pHour = 0, pMin = 0, pSec = 0;

    for (const p of parts) {
      if (p.type === 'year') pYear = parseInt(p.value, 10);
      if (p.type === 'month') pMonth = parseInt(p.value, 10);
      if (p.type === 'day') pDay = parseInt(p.value, 10);
      if (p.type === 'hour') pHour = parseInt(p.value, 10);
      if (p.type === 'minute') pMin = parseInt(p.value, 10);
      if (p.type === 'second') pSec = parseInt(p.value, 10);
    }

    const localUtcTimestamp = Date.UTC(pYear, pMonth - 1, pDay, pHour % 24, pMin, pSec);
    const actualUtcTimestamp = date.getTime();
    return Math.round((localUtcTimestamp - actualUtcTimestamp) / 60000);
  } catch (e) {
    return 420; // fallback to UTC+7
  }
}

/**
 * Formats offset minutes into standard readable string e.g. "UTC+7", "UTC-4", "UTC+5:30", "UTC+0"
 */
export function formatUtcOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const remainingMinutes = absMinutes % 60;

  if (remainingMinutes === 0) {
    return `UTC${sign}${hours}`;
  }
  return `UTC${sign}${hours}:${String(remainingMinutes).padStart(2, '0')}`;
}

/**
 * Formats current time in specific IANA timeZone
 */
export function getLiveTimeInZone(timeZone: string, now: Date = new Date()): {
  timeStr: string;
  dateStr: string;
  isNight: boolean;
  offsetMinutes: number;
  utcOffsetStr: string;
} {
  try {
    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      timeZone,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    const hourFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      hour12: false,
    });

    const hour = parseInt(hourFormatter.format(now), 10);
    const isNight = hour >= 20 || hour < 6;

    const offsetMinutes = getTimeZoneOffsetMinutes(timeZone, now);
    const utcOffsetStr = formatUtcOffset(offsetMinutes);

    return {
      timeStr: timeFormatter.format(now),
      dateStr: dateFormatter.format(now),
      isNight,
      offsetMinutes,
      utcOffsetStr,
    };
  } catch (e) {
    return {
      timeStr: now.toLocaleTimeString('id-ID'),
      dateStr: now.toLocaleDateString('id-ID'),
      isNight: false,
      offsetMinutes: 420,
      utcOffsetStr: 'UTC+7',
    };
  }
}

/**
 * Calculates timezone difference compared to WIB (Asia/Jakarta = UTC+7) in hours.
 * e.g. Tokyo (UTC+9) vs WIB (UTC+7) = +2 Jam
 * e.g. New York (UTC-4) vs WIB (UTC+7) = -11 Jam
 * e.g. Jakarta (UTC+7) vs WIB (UTC+7) = 0 Jam
 */
export function getTimeDiffFromWibHours(timeZone: string, now: Date = new Date()): number {
  const spotOffsetMin = getTimeZoneOffsetMinutes(timeZone, now);
  const wibOffsetMin = 420; // UTC+7 = 420 minutes
  const diffHours = (spotOffsetMin - wibOffsetMin) / 60;
  return Math.round(diffHours * 10) / 10;
}

/**
 * Given a local event time (e.g. "14:00") on a target date,
 * calculates the corresponding exact time in WIB (Asia/Jakarta) for each coordinate spot.
 */
export function calculateGlobalHoppingSchedule(
  spots: CoordinateSpot[],
  localStartTimeStr: string = '14:00',
  durationHours: number = 3,
  baseDate: Date = new Date()
): HoppingScheduleItem[] {
  const [startHourStr, startMinStr] = localStartTimeStr.split(':');
  const startHour = parseInt(startHourStr || '14', 10);
  const startMin = parseInt(startMinStr || '0', 10);

  const now = new Date();

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-indexed
  const day = baseDate.getDate();

  const items: HoppingScheduleItem[] = spots.map((spot) => {
    try {
      // 1. Initial candidate UTC timestamp if wall-clock was UTC
      const candidateUtcMs = Date.UTC(year, month, day, startHour, startMin, 0);
      
      // 2. Find exact offset of this spot's timezone at that candidate time
      const spotOffsetMin = getTimeZoneOffsetMinutes(spot.timeZone, new Date(candidateUtcMs));
      
      // 3. True event start UTC timestamp:
      // When wall-clock in spot.timeZone is 14:00, UTC time is 14:00 minus spotOffset
      const actualEventStartUtcMs = candidateUtcMs - spotOffsetMin * 60000;
      const actualEventEndUtcMs = actualEventStartUtcMs + durationHours * 3600000;

      const eventStartDate = new Date(actualEventStartUtcMs);
      const eventEndDate = new Date(actualEventEndUtcMs);

      // 4. Format event time in WIB (Asia/Jakarta)
      const wibTimeFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const wibDateFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });

      const wibStart = wibTimeFormatter.format(eventStartDate);
      const wibEnd = wibTimeFormatter.format(eventEndDate);
      const wibDateStr = wibDateFormatter.format(eventStartDate);

      // 5. Local end formatted string
      const endTotalMin = startHour * 60 + startMin + durationHours * 60;
      const endHour = Math.floor(endTotalMin / 60) % 24;
      const endMin = endTotalMin % 60;
      const localEnd = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      // 6. Live status calculation
      const nowMs = now.getTime();
      let status: 'live' | 'upcoming' | 'ended' = 'upcoming';
      let timeUntilOrRemaining = '';

      if (nowMs >= actualEventStartUtcMs && nowMs <= actualEventEndUtcMs) {
        status = 'live';
        const remMs = actualEventEndUtcMs - nowMs;
        const remMins = Math.floor(remMs / 60000);
        const remH = Math.floor(remMins / 60);
        const remM = remMins % 60;
        timeUntilOrRemaining = `Sisa ${remH > 0 ? `${remH}j ` : ''}${remM}m`;
      } else if (nowMs > actualEventEndUtcMs) {
        status = 'ended';
        timeUntilOrRemaining = 'Telah Berakhir';
      } else {
        status = 'upcoming';
        const diffMs = actualEventStartUtcMs - nowMs;
        const diffMins = Math.floor(diffMs / 60000);
        const diffH = Math.floor(diffMins / 60);
        const diffM = diffMins % 60;
        if (diffH > 24) {
          const days = Math.floor(diffH / 24);
          timeUntilOrRemaining = `Dalam ${days} hari`;
        } else if (diffH > 0) {
          timeUntilOrRemaining = `Dalam ${diffH}j ${diffM}m`;
        } else {
          timeUntilOrRemaining = `Dalam ${diffM} menit`;
        }
      }

      const diffWibHours = (spotOffsetMin - 420) / 60;
      const utcOffsetStr = formatUtcOffset(spotOffsetMin);

      return {
        spot,
        localStart: localStartTimeStr,
        localEnd,
        wibStart,
        wibEnd,
        wibDateStr,
        utcOffsetStr,
        utcOffsetMinutes: spotOffsetMin,
        startTimestampWib: actualEventStartUtcMs,
        endTimestampWib: actualEventEndUtcMs,
        status,
        timeUntilOrRemaining,
        timeDifferenceWibHours: Math.round(diffWibHours * 10) / 10,
      };
    } catch (e) {
      return {
        spot,
        localStart: localStartTimeStr,
        localEnd: '17:00',
        wibStart: '14:00',
        wibEnd: '17:00',
        wibDateStr: 'Hari Ini',
        utcOffsetStr: 'UTC+7',
        utcOffsetMinutes: 420,
        startTimestampWib: Date.now(),
        endTimestampWib: Date.now() + 10800000,
        status: 'upcoming' as const,
        timeUntilOrRemaining: 'Waktu Standar',
        timeDifferenceWibHours: 0,
      };
    }
  });

  // Sort chronologically: Earliest to start in WIB time first (e.g. Kiribati / NZ first, then Asia, Europe, Americas)
  items.sort((a, b) => a.startTimestampWib - b.startTimestampWib);

  return items;
}

/**
 * Cooldown distance table for Pokémon GO
 */
export const POGO_COOLDOWN_CHART = [
  { maxKm: 1, distance: '1 km', cooldownSec: 30, cooldown: '30 detik' },
  { maxKm: 5, distance: '5 km', cooldownSec: 120, cooldown: '2 menit' },
  { maxKm: 10, distance: '10 km', cooldownSec: 360, cooldown: '6 menit' },
  { maxKm: 25, distance: '25 km', cooldownSec: 660, cooldown: '11 menit' },
  { maxKm: 50, distance: '50 km', cooldownSec: 1200, cooldown: '20 menit' },
  { maxKm: 100, distance: '100 km', cooldownSec: 2400, cooldown: '40 menit' },
  { maxKm: 250, distance: '250 km', cooldownSec: 2700, cooldown: '45 menit' },
  { maxKm: 500, distance: '500 km', cooldownSec: 3600, cooldown: '60 menit' },
  { maxKm: 1000, distance: '1000 km', cooldownSec: 5400, cooldown: '90 menit' },
  { maxKm: Infinity, distance: '1500+ km', cooldownSec: 7200, cooldown: '120 menit (2 Jam Maksimal)' },
];

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateCoordinateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 100) / 100;
}

/**
 * Parses user input like "-6.2088, 106.8456" or "-6.2088 106.8456" into { lat: number, lng: number } or null
 */
export function parseCoordinateInput(input: string): { lat: number; lng: number } | null {
  if (!input) return null;
  const clean = input.trim().replace(/[°\s]+/g, ' ');
  const parts = clean.includes(',')
    ? clean.split(',').map((s) => s.trim())
    : clean.split(' ').map((s) => s.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }
  return null;
}

/**
 * Calculates required Pokémon GO cooldown in seconds based on distance (km)
 */
export function calculateRequiredCooldownSec(distanceKm: number): {
  seconds: number;
  formattedText: string;
} {
  if (distanceKm <= 0) {
    return { seconds: 0, formattedText: '0 detik (Lokasi sama)' };
  }

  for (const step of POGO_COOLDOWN_CHART) {
    if (distanceKm <= step.maxKm) {
      return {
        seconds: step.cooldownSec,
        formattedText: step.cooldown,
      };
    }
  }

  return {
    seconds: 7200,
    formattedText: '120 menit (2 Jam Maksimal)',
  };
}
