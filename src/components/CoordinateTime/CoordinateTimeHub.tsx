import React, { useState, useEffect, useRef } from 'react';
import { CoordinateSpot, HoppingScheduleItem } from '../../types/pokemon';
import { DEFAULT_COORDINATES } from '../../data/coordinates';
import {
  getLiveTimeInZone,
  getTimeDiffFromWibHours,
  calculateGlobalHoppingSchedule,
  POGO_COOLDOWN_CHART,
  calculateCoordinateDistanceKm,
  calculateRequiredCooldownSec,
  parseCoordinateInput,
} from '../../utils/timeZoneUtils';
import {
  Globe,
  Clock,
  Copy,
  Check,
  MapPin,
  Calendar,
  Compass,
  Zap,
  Info,
  ExternalLink,
  Plus,
  Trash2,
  Moon,
  Sun,
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Timer,
  Play,
  RotateCcw,
  Navigation,
  ArrowDownUp,
  AlertTriangle,
  Flame,
} from 'lucide-react';

const CUSTOM_SPOTS_KEY = 'pokego_custom_coordinates_v1';

export const CoordinateTimeHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'coordinates' | 'event-converter'>('coordinates');

  // Coordinates Data State
  const [spots, setSpots] = useState<CoordinateSpot[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_SPOTS_KEY);
      if (saved) {
        const custom = JSON.parse(saved);
        return [...DEFAULT_COORDINATES, ...custom];
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_COORDINATES;
  });

  // Ticking Clock State (Updates every second)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Filter for Coordinates
  const [searchCoords, setSearchCoords] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Custom Coordinate Modal State
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotCity, setNewSpotCity] = useState('');
  const [newSpotCountry, setNewSpotCountry] = useState('Indonesia');
  const [newSpotLat, setNewSpotLat] = useState('');
  const [newSpotLng, setNewSpotLng] = useState('');
  const [newSpotTimezone, setNewSpotTimezone] = useState('Asia/Jakarta');
  const [newSpotDesc, setNewSpotDesc] = useState('');

  // Event Converter Form State
  const [eventName, setEventName] = useState('Community Day (14:00 - 17:00)');
  const [localStartTime, setLocalStartTime] = useState('14:00');
  const [durationHours, setDurationHours] = useState<number>(3);
  const [eventDate, setEventDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  // Cooldown Calculator & Countdown Timer State
  const [currentCoordInput, setCurrentCoordInput] = useState('-6.1754, 106.8272'); // Monas Jakarta default
  const [targetCoordInput, setTargetCoordInput] = useState('40.7829, -73.9654'); // Central Park NY default
  const [selectedQuickOrigin, setSelectedQuickOrigin] = useState<string>('');
  const [selectedQuickTarget, setSelectedQuickTarget] = useState<string>('');

  // Countdown timer state
  const [targetDurationSec, setTargetDurationSec] = useState<number>(0);
  const [countdownRemainingSec, setCountdownRemainingSec] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Live timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cooldown Countdown Timer effect
  useEffect(() => {
    if (isTimerRunning && countdownRemainingSec > 0) {
      timerRef.current = setInterval(() => {
        setCountdownRemainingSec((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, countdownRemainingSec]);

  // Derived calculation for coordinates & distance
  const parsedOrigin = parseCoordinateInput(currentCoordInput);
  const parsedTarget = parseCoordinateInput(targetCoordInput);

  let calculatedDistanceKm = 0;
  let calculatedCooldown = { seconds: 0, formattedText: '0 detik' };

  if (parsedOrigin && parsedTarget) {
    calculatedDistanceKm = calculateCoordinateDistanceKm(
      parsedOrigin.lat,
      parsedOrigin.lng,
      parsedTarget.lat,
      parsedTarget.lng
    );
    calculatedCooldown = calculateRequiredCooldownSec(calculatedDistanceKm);
  }

  // Handle Quick Select Origin
  const handleSelectQuickOrigin = (spotId: string) => {
    setSelectedQuickOrigin(spotId);
    const spot = spots.find((s) => s.id === spotId);
    if (spot) {
      setCurrentCoordInput(`${spot.lat}, ${spot.lng}`);
    }
  };

  // Handle Quick Select Target
  const handleSelectQuickTarget = (spotId: string) => {
    setSelectedQuickTarget(spotId);
    const spot = spots.find((s) => s.id === spotId);
    if (spot) {
      setTargetCoordInput(`${spot.lat}, ${spot.lng}`);
    }
  };

  // Swap coordinates
  const handleSwapCoordinates = () => {
    const temp = currentCoordInput;
    setCurrentCoordInput(targetCoordInput);
    setTargetCoordInput(temp);
  };

  // Start / Pause / Reset Timer
  const handleStartTimer = () => {
    if (!isTimerRunning) {
      if (countdownRemainingSec === 0) {
        setTargetDurationSec(calculatedCooldown.seconds);
        setCountdownRemainingSec(calculatedCooldown.seconds);
      }
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTargetDurationSec(calculatedCooldown.seconds);
    setCountdownRemainingSec(calculatedCooldown.seconds);
  };

  // Format seconds to mm:ss or hh:mm:ss
  const formatTimerDisplay = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Save custom spots to localStorage
  const saveCustomSpots = (updatedList: CoordinateSpot[]) => {
    const customOnly = updatedList.filter((s) => !s.isDefault);
    localStorage.setItem(CUSTOM_SPOTS_KEY, JSON.stringify(customOnly));
  };

  // Copy coordinates handler
  const handleCopyCoordinate = (spot: CoordinateSpot) => {
    const coordStr = `${spot.lat}, ${spot.lng}`;
    navigator.clipboard.writeText(coordStr);
    setCopiedId(spot.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Add Custom Spot
  const handleAddCustomSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotName || !newSpotLat || !newSpotLng) return;

    const newSpot: CoordinateSpot = {
      id: `custom-${Date.now()}`,
      name: newSpotName.trim(),
      city: newSpotCity.trim() || 'Custom City',
      country: newSpotCountry.trim() || 'Indonesia',
      flag: '📍',
      lat: parseFloat(newSpotLat),
      lng: parseFloat(newSpotLng),
      timeZone: newSpotTimezone,
      category: 'Custom',
      description: newSpotDesc.trim() || 'Titik koordinat kustom yang ditambahkan pengguna.',
      isDefault: false,
    };

    const updated = [...spots, newSpot];
    setSpots(updated);
    saveCustomSpots(updated);
    setIsAddSpotModalOpen(false);

    // Reset Form
    setNewSpotName('');
    setNewSpotCity('');
    setNewSpotLat('');
    setNewSpotLng('');
    setNewSpotDesc('');
  };

  // Delete Custom Spot
  const handleDeleteSpot = (id: string) => {
    if (window.confirm('Hapus titik koordinat kustom ini?')) {
      const updated = spots.filter((s) => s.id !== id);
      setSpots(updated);
      saveCustomSpots(updated);
    }
  };

  // Filter Coordinates
  const filteredSpots = spots.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchCoords.toLowerCase()) ||
      s.city.toLowerCase().includes(searchCoords.toLowerCase()) ||
      s.country.toLowerCase().includes(searchCoords.toLowerCase()) ||
      s.description.toLowerCase().includes(searchCoords.toLowerCase());

    if (!matchSearch) return false;

    if (selectedCategory !== 'all' && s.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  // Calculate WIB event hopping schedule
  const hoppingSchedule = calculateGlobalHoppingSchedule(
    spots,
    localStartTime,
    durationHours,
    new Date(eventDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner - Pokémon GO Emerald Palette */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-100 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> World Timezones & Coordinate Hub
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Coordinate Book & Global Event Converter
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-2xl font-medium leading-relaxed">
              Daftar koordinat hotspot dunia dengan jam digital live per zona waktu serta kalkulator konversi jadwal event global ke Waktu Indonesia Barat (WIB).
            </p>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center p-1 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setSubTab('coordinates')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subTab === 'coordinates'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Coordinate Book & Clocks</span>
            </button>
            <button
              onClick={() => setSubTab('event-converter')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subTab === 'event-converter'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Event Converter (WIB)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: COORDINATE BOOK & LIVE CLOCKS */}
      {subTab === 'coordinates' && (
        <div className="space-y-6">
          {/* Controls Bar: Search + Category + Add Custom Spot */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <input
                type="text"
                value={searchCoords}
                onChange={(e) => setSearchCoords(e.target.value)}
                placeholder="Cari lokasi, kota, negara, atau hotspot..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 font-mono transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer font-mono font-semibold"
              >
                <option value="all">Semua Kategori ({spots.length})</option>
                <option value="Indonesia Hotspot">🇮🇩 Indonesia Hotspot</option>
                <option value="Hotspot Dunia">🌐 Hotspot Dunia</option>
                <option value="Gym Cluster">⚔️ Gym Cluster</option>
                <option value="Farm Spot">🌾 Farm Spot</option>
                <option value="Custom">📍 Kustom Saya</option>
              </select>

              <button
                onClick={() => setIsAddSpotModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer font-mono uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tambah Titik Koordinat</span>
              </button>
            </div>
          </div>

          {/* Coordinate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpots.map((spot) => {
              const live = getLiveTimeInZone(spot.timeZone, currentTime);
              const diffHours = getTimeDiffFromWibHours(spot.timeZone, currentTime);
              const isCopied = copiedId === spot.id;

              return (
                <div
                  key={spot.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 shadow-xs space-y-3.5 relative group"
                >
                  {/* Top Bar: Flag & Name */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl">{spot.flag}</span>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                          {spot.name}
                        </h4>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {spot.city}, {spot.country}
                        </div>
                      </div>
                    </div>

                    {/* Category Pill */}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      {spot.category}
                    </span>
                  </div>

                  {/* Live Clock Card */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono font-medium">
                        <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Waktu Lokal ({spot.timeZone.split('/')[1] || spot.timeZone}):</span>
                      </div>
                      <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono tracking-wider flex items-center gap-2">
                        <span>{live.timeStr}</span>
                        {live.isNight ? (
                          <Moon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" title="Malam Hari" />
                        ) : (
                          <Sun className="w-3.5 h-3.5 text-amber-500" title="Siang Hari" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{live.dateStr}</div>
                    </div>

                    {/* Time diff vs WIB */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Selisih vs WIB:</span>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                          diffHours === 0
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : diffHours > 0
                            ? 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        }`}
                      >
                        {diffHours === 0 ? 'WIB (0j)' : diffHours > 0 ? `+${diffHours} Jam` : `${diffHours} Jam`}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {spot.description}
                  </p>

                  {/* Bottom: Coordinates Bar + One Click Copy */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 truncate font-semibold">
                      {spot.lat}, {spot.lng}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyCoordinate(spot)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-mono ${
                          isCopied
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {!spot.isDefault && (
                        <button
                          onClick={() => handleDeleteSpot(spot.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Hapus titik kustom"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GLOBAL EVENT CONVERTER (WIB TIMEZONE HOPPING PLANNER) */}
      {subTab === 'event-converter' && (
        <div className="space-y-6">
          {/* Planner Setup Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Konfigurasi Jam Event Global Pokémon GO
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                Masukkan jam lokal diadakannya event (misal Community Day jam 14:00 - 17:00 waktu setempat). Aplikasi otomatis menghitung jam tayang dalam <strong>Waktu Indonesia Barat (WIB)</strong> dan mengurutkannya dari yang paling pagi!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Nama Event:</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Contoh: Community Day, Raid Day, Spotlight Hour..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Jam Mulai Lokal:</label>
                <input
                  type="time"
                  value={localStartTime}
                  onChange={(e) => setLocalStartTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Durasi (Jam):</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer font-mono font-semibold"
                >
                  <option value={1}>1 Jam (Spotlight / Raid Hour)</option>
                  <option value={3}>3 Jam (Community Day)</option>
                  <option value={8}>8 Jam (GO Fest / Safari)</option>
                  <option value={10}>10 Jam (Special Raid / Ultra Unlock)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Table in WIB (Earliest to Latest) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Jadwal Urutan Event Konversi WIB (Timezone Hopping Order)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Diurutkan otomatis dari wilayah yang mulai paling pagi hingga paling malam dalam waktu WIB.
                </p>
              </div>

              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-700">
                Zona Waktu Referensi: WIB (UTC+7)
              </div>
            </div>

            {/* Schedule List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                    <th className="py-3 px-3">No & Lokasi Hotspot</th>
                    <th className="py-3 px-3 text-emerald-700 dark:text-emerald-400">Zona UTC & Selisih</th>
                    <th className="py-3 px-3">Jam Lokal</th>
                    <th className="py-3 px-3 text-amber-700 dark:text-amber-400">Jadwal di WIB (UTC+7)</th>
                    <th className="py-3 px-3">Status Event</th>
                    <th className="py-3 px-3 text-right">Koordinat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {hoppingSchedule.map((item, idx) => {
                    const isCopied = copiedId === item.spot.id;
                    let statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {item.timeUntilOrRemaining}
                      </span>
                    );

                    if (item.status === 'live') {
                      statusBadge = (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white uppercase animate-pulse shadow-md shadow-emerald-600/30">
                          🟢 LIVE NOW ({item.timeUntilOrRemaining})
                        </span>
                      );
                    } else if (item.status === 'upcoming') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          ⏳ {item.timeUntilOrRemaining}
                        </span>
                      );
                    }

                    return (
                      <tr
                        key={item.spot.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                          item.status === 'live' ? 'bg-emerald-50/70 dark:bg-emerald-950/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 dark:text-slate-500 font-mono text-xs w-4">#{idx + 1}</span>
                            <span className="text-base">{item.spot.flag}</span>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100 font-mono">{item.spot.name}</div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                {item.spot.city}, {item.spot.country}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* UTC Offset & Difference vs WIB */}
                        <td className="py-3 px-3 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                              {item.utcOffsetStr}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                item.timeDifferenceWibHours === 0
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                  : item.timeDifferenceWibHours > 0
                                  ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700'
                                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              }`}
                            >
                              {item.timeDifferenceWibHours === 0
                                ? '0j (WIB)'
                                : item.timeDifferenceWibHours > 0
                                ? `+${item.timeDifferenceWibHours}j vs WIB`
                                : `${item.timeDifferenceWibHours}j vs WIB`}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[140px]" title={item.spot.timeZone}>
                            {item.spot.timeZone}
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">
                          <div className="font-bold">{item.localStart} - {item.localEnd}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Waktu Kota Setempat</div>
                        </td>

                        <td className="py-3 px-3 font-mono">
                          <div className="font-bold text-amber-700 dark:text-amber-400 text-sm">
                            {item.wibStart} - {item.wibEnd} WIB
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.wibDateStr}</div>
                        </td>

                        <td className="py-3 px-3">{statusBadge}</td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleCopyCoordinate(item.spot)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer inline-flex items-center gap-1 font-mono ${
                              isCopied
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                            <span>{isCopied ? 'Tersalin' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Cooldown Distance Calculator & Countdown Timer */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/40 shadow-xl space-y-5 text-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/30">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-100 text-base font-mono">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Kalkulator Jeda Cooldown Berpindah Wilayah (Softban Guard)
                </div>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  Hitung jarak otomatis antar dua koordinat dan ketahui persis durasi cooldown yang dibutuhkan. Nyalakan timer untuk memantau sisa waktu cooldown Anda.
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Anti-Softban Protection</span>
              </div>
            </div>

            {/* Coordinate Input Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Origin Coordinate */}
              <div className="lg:col-span-5 space-y-2 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-mono">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" /> 1. Koordinat Asal / Sekarang:
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Format: Lat, Lng</span>
                </div>
                <input
                  type="text"
                  value={currentCoordInput}
                  onChange={(e) => {
                    setCurrentCoordInput(e.target.value);
                    setSelectedQuickOrigin('');
                  }}
                  placeholder="Contoh: -6.1754, 106.8272"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-400 transition"
                />
                {/* Quick preset selector */}
                <div className="pt-1">
                  <select
                    value={selectedQuickOrigin}
                    onChange={(e) => handleSelectQuickOrigin(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-emerald-400 font-mono"
                  >
                    <option value="">-- Pilih dari Daftar Hotspot Terkenal --</option>
                    {spots.map((s) => (
                      <option key={`origin-${s.id}`} value={s.id}>
                        {s.flag} {s.name} ({s.city}) [{s.lat}, {s.lng}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapCoordinates}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white transition-all shadow-md cursor-pointer group"
                  title="Tukar Posisi Koordinat"
                >
                  <ArrowDownUp className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>

              {/* Target Coordinate */}
              <div className="lg:col-span-5 space-y-2 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-teal-300 flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" /> 2. Koordinat Tujuan / Yang Dituju:
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Format: Lat, Lng</span>
                </div>
                <input
                  type="text"
                  value={targetCoordInput}
                  onChange={(e) => {
                    setTargetCoordInput(e.target.value);
                    setSelectedQuickTarget('');
                  }}
                  placeholder="Contoh: 40.7829, -73.9654"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:border-teal-400 transition"
                />
                {/* Quick preset selector */}
                <div className="pt-1">
                  <select
                    value={selectedQuickTarget}
                    onChange={(e) => handleSelectQuickTarget(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
                  >
                    <option value="">-- Pilih dari Daftar Hotspot Terkenal --</option>
                    {spots.map((s) => (
                      <option key={`target-${s.id}`} value={s.id}>
                        {s.flag} {s.name} ({s.city}) [{s.lat}, {s.lng}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Calculation Result & Interactive Countdown Timer HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Distance Result */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" /> Jarak Geografis:
                </div>
                <div className="text-xl font-black text-slate-100 font-mono tracking-wide">
                  {parsedOrigin && parsedTarget ? (
                    <span>{calculatedDistanceKm.toLocaleString()} <span className="text-sm font-normal text-slate-400">km</span></span>
                  ) : (
                    <span className="text-sm text-rose-400 font-sans">Format koordinat tidak valid</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Dihitung berdasarkan Haversine formula
                </div>
              </div>

              {/* Required Cooldown Result */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Wajib Jeda Cooldown:
                </div>
                <div className="text-xl font-black text-amber-300 font-mono tracking-wide">
                  {calculatedCooldown.formattedText}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {calculatedDistanceKm >= 1350
                    ? 'Jarak > 1350 km = batas maksimum (2 jam)'
                    : `Jeda aman sebelum interaksi berikutnya`}
                </div>
              </div>

              {/* Countdown Timer HUD */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/60 border border-emerald-500/50 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-mono flex items-center gap-1.5 font-bold">
                    <Timer className="w-3.5 h-3.5 text-emerald-400 animate-spin" /> Cooldown Timer:
                  </div>
                  {countdownRemainingSec === 0 && isTimerRunning === false && targetDurationSec > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700 animate-pulse font-mono">
                      SELESAI! AMAN
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-2xl font-black font-mono tracking-widest text-emerald-400">
                    {countdownRemainingSec > 0
                      ? formatTimerDisplay(countdownRemainingSec)
                      : countdownRemainingSec === 0 && isTimerRunning === false && targetDurationSec > 0
                      ? '00:00 (Aman!)'
                      : formatTimerDisplay(calculatedCooldown.seconds)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleStartTimer}
                      disabled={calculatedCooldown.seconds === 0}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                        isTimerRunning
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
                      } ${calculatedCooldown.seconds === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isTimerRunning ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Mulai Timer</span>
                        </>
                      )}
                    </button>

                    {(isTimerRunning || countdownRemainingSec > 0) && (
                      <button
                        type="button"
                        onClick={handleResetTimer}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Reset Countdown"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {targetDurationSec > 0 && (
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, ((targetDurationSec - countdownRemainingSec) / targetDurationSec) * 100)
                        )}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Softban Rule Chart */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-200 mb-2 font-mono flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" /> Tabel Referensi Jarak vs Cooldown Pokémon GO:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                {POGO_COOLDOWN_CHART.map((c) => (
                  <div
                    key={c.distance}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      calculatedDistanceKm > 0 &&
                      (c.maxKm === Infinity
                        ? calculatedDistanceKm >= 1000
                        : calculatedDistanceKm <= c.maxKm &&
                          (POGO_COOLDOWN_CHART[POGO_COOLDOWN_CHART.indexOf(c) - 1]?.maxKm || 0) <
                            calculatedDistanceKm)
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-950/50 scale-[1.02]'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{c.distance}</div>
                    <div className="text-emerald-400 font-bold text-[11px] mt-0.5">{c.cooldown}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Spot Modal */}
      {isAddSpotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Tambah Titik Koordinat Kustom
              </h3>
              <button
                onClick={() => setIsAddSpotModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomSpot} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Nama Tempat / Hotspot:</label>
                <input
                  type="text"
                  value={newSpotName}
                  onChange={(e) => setNewSpotName(e.target.value)}
                  placeholder="Contoh: Taman Mini Indonesia Indah"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Kota:</label>
                  <input
                    type="text"
                    value={newSpotCity}
                    onChange={(e) => setNewSpotCity(e.target.value)}
                    placeholder="Contoh: Jakarta"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Negara:</label>
                  <input
                    type="text"
                    value={newSpotCountry}
                    onChange={(e) => setNewSpotCountry(e.target.value)}
                    placeholder="Contoh: Indonesia"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Latitude (Garis Lintang):</label>
                  <input
                    type="number"
                    step="any"
                    value={newSpotLat}
                    onChange={(e) => setNewSpotLat(e.target.value)}
                    placeholder="Contoh: -6.3024"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Longitude (Garis Bujur):</label>
                  <input
                    type="number"
                    step="any"
                    value={newSpotLng}
                    onChange={(e) => setNewSpotLng(e.target.value)}
                    placeholder="Contoh: 106.8951"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Timezone (Zona Waktu IANA):</label>
                <select
                  value={newSpotTimezone}
                  onChange={(e) => setNewSpotTimezone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer font-mono font-semibold"
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB - UTC+7)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA - UTC+8)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT - UTC+9)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (Jepang - UTC+9)</option>
                  <option value="Europe/Madrid">Europe/Madrid (Spanyol - UTC+1/2)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (SF / LA - UTC-8/7)</option>
                  <option value="America/New_York">America/New_York (NY - UTC-5/4)</option>
                  <option value="Pacific/Auckland">Pacific/Auckland (NZ - UTC+12/13)</option>
                  <option value="Pacific/Honolulu">Pacific/Honolulu (Hawaii - UTC-10)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Deskripsi Singkat:</label>
                <input
                  type="text"
                  value={newSpotDesc}
                  onChange={(e) => setNewSpotDesc(e.target.value)}
                  placeholder="Contoh: Spot farming sarang Dratini dan banyak Gym EX."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSpotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition font-mono"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer transition font-mono"
                >
                  Simpan Koordinat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
