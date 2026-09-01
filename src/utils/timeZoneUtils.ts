import { CoordinateSpot, HoppingScheduleItem } from '../types/pokemon';

/**
 * Formats current time in specific IANA timeZone
 */
export function getLiveTimeInZone(timeZone: string, now: Date = new Date()): {
  timeStr: string;
  dateStr: string;
  isNight: boolean;
  offsetMinutes: number;
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

    // Calculate offset relative to UTC
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const targetDate = new Date(now.toLocaleString('en-US', { timeZone }));
    const offsetMinutes = Math.round((targetDate.getTime() - utcDate.getTime()) / 60000);

    return {
      timeStr: timeFormatter.format(now),
      dateStr: dateFormatter.format(now),
      isNight,
      offsetMinutes,
    };
  } catch (e) {
    return {
      timeStr: now.toLocaleTimeString('id-ID'),
      dateStr: now.toLocaleDateString('id-ID'),
      isNight: false,
      offsetMinutes: 420, // default UTC+7
    };
  }
}

/**
 * Calculates timezone offset difference compared to WIB (Asia/Jakarta = UTC+7)
 */
export function getTimeDiffFromWibHours(timeZone: string, now: Date = new Date()): number {
  try {
    const wibDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const targetDate = new Date(now.toLocaleString('en-US', { timeZone }));
    const diffHours = (targetDate.getTime() - wibDate.getTime()) / (1000 * 60 * 60);
    return Math.round(diffHours * 10) / 10;
  } catch (e) {
    return 0;
  }
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

  // Create formatted target year/month/day
  const year = baseDate.getFullYear();
  const month = String(baseDate.getMonth() + 1).padStart(2, '0');
  const day = String(baseDate.getDate()).padStart(2, '0');

  const items: HoppingScheduleItem[] = spots.map((spot) => {
    try {
      // Find the UTC timestamp when it is startHour:startMin in `spot.timeZone`
      // We test a candidate UTC date and adjust by timezone difference
      const isoCandidate = `${year}-${month}-${day}T${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`;
      
      // Compute UTC offset of spot on this date
      const testUtc = new Date(isoCandidate + 'Z');
      const spotDateStr = testUtc.toLocaleString('en-US', { timeZone: spot.timeZone });
      const spotDateObj = new Date(spotDateStr);
      
      const offsetMs = spotDateObj.getTime() - testUtc.getTime();
      const actualEventStartUtcMs = testUtc.getTime() - offsetMs;

      const eventStartDate = new Date(actualEventStartUtcMs);
      const eventEndDate = new Date(actualEventStartUtcMs + durationHours * 60 * 60 * 1000);

      // Convert eventStartDate to WIB
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

      // Local end calculation
      const endHour = (startHour + durationHours) % 24;
      const localEnd = `${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;

      // Status calculation
      const nowMs = now.getTime();
      let status: 'live' | 'upcoming' | 'ended' = 'upcoming';
      let timeUntilOrRemaining = '';

      if (nowMs >= actualEventStartUtcMs && nowMs <= eventEndDate.getTime()) {
        status = 'live';
        const remMs = eventEndDate.getTime() - nowMs;
        const remMins = Math.floor(remMs / 60000);
        const remH = Math.floor(remMins / 60);
        const remM = remMins % 60;
        timeUntilOrRemaining = `Sisa ${remH > 0 ? `${remH}j ` : ''}${remM}m`;
      } else if (nowMs > eventEndDate.getTime()) {
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

      const diffWibHours = getTimeDiffFromWibHours(spot.timeZone, now);

      return {
        spot,
        localStart: localStartTimeStr,
        localEnd,
        wibStart,
        wibEnd,
        wibDateStr,
        startTimestampWib: actualEventStartUtcMs,
        endTimestampWib: eventEndDate.getTime(),
        status,
        timeUntilOrRemaining,
        timeDifferenceWibHours: diffWibHours,
      };
    } catch (e) {
      // Fallback
      return {
        spot,
        localStart: localStartTimeStr,
        localEnd: '17:00',
        wibStart: '14:00',
        wibEnd: '17:00',
        wibDateStr: 'Hari Ini',
        startTimestampWib: Date.now(),
        endTimestampWib: Date.now() + 10800000,
        status: 'upcoming' as const,
        timeUntilOrRemaining: 'Waktu Standar',
        timeDifferenceWibHours: 0,
      };
    }
  });

  // Sort chronologically by startTimestampWib (Earliest in WIB to latest in WIB!)
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
 * Calculates required Pokémon GO cooldown in seconds based on distance (km)
 */
export function calculateRequiredCooldownSec(distanceKm: number): {
  seconds: number;
  formattedText: string;
} {
  if (distanceKm <= 0) {
    return { seconds: 0, formattedText: '0 detik (Lokasi sama)' };
  }
  if (distanceKm <= 1) return { seconds: 30, formattedText: '30 detik' };
  if (distanceKm <= 2) return { seconds: 60, formattedText: '1 menit' };
  if (distanceKm <= 5) return { seconds: 120, formattedText: '2 menit' };
  if (distanceKm <= 10) return { seconds: 360, formattedText: '6 menit' };
  if (distanceKm <= 15) return { seconds: 480, formattedText: '8 menit' };
  if (distanceKm <= 25) return { seconds: 660, formattedText: '11 menit' };
  if (distanceKm <= 40) return { seconds: 900, formattedText: '15 menit' };
  if (distanceKm <= 50) return { seconds: 1200, formattedText: '20 menit' };
  if (distanceKm <= 65) return { seconds: 1500, formattedText: '25 menit' };
  if (distanceKm <= 100) return { seconds: 2400, formattedText: '40 menit' };
  if (distanceKm <= 250) return { seconds: 2700, formattedText: '45 menit' };
  if (distanceKm <= 500) return { seconds: 3600, formattedText: '60 menit (1 Jam)' };
  if (distanceKm <= 750) return { seconds: 4500, formattedText: '75 menit (1.25 Jam)' };
  if (distanceKm <= 1000) return { seconds: 5400, formattedText: '90 menit (1.5 Jam)' };
  if (distanceKm <= 1350) return { seconds: 6300, formattedText: '105 menit (1.75 Jam)' };
  return { seconds: 7200, formattedText: '120 menit (2 Jam - Maksimal)' };
}

/**
 * Parses user input coordinate string like "-6.2088, 106.8456" or "-6.2088 106.8456"
 */
export function parseCoordinateInput(input: string): { lat: number; lng: number } | null {
  if (!input || !input.trim()) return null;
  const cleaned = input.trim().replace(/[°\(\)\[\]]/g, '');
  const parts = cleaned.split(/[\s,]+/);
  if (parts.length >= 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }
  return null;
}
