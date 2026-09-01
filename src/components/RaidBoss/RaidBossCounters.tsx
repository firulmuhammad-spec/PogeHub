import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RaidBossData, StoragePokemon, PokemonType } from '../../types/pokemon';
import { fetchRaidBossData, PRESET_RAID_BOSSES } from '../../services/pokeApiService';
import { calculateDefenderEffectiveness } from '../../data/pokemonTypes';
import { searchPokemonCatalog, PokemonCatalogItem } from '../../data/pokemonList';
import { TypeBadge } from '../common/TypeBadge';
import { MoveBadge } from '../common/MoveBadge';
import {
  Swords,
  Search,
  Sparkles,
  Shield,
  Zap,
  Activity,
  AlertCircle,
  CheckCircle2,
  Star,
  RefreshCw,
  Info,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Trophy,
  Heart,
  HelpCircle,
} from 'lucide-react';

const STORAGE_KEY = 'pokego_master_storage_v1';

export const RaidBossCounters: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('rayquaza');
  const [selectedBoss, setSelectedBoss] = useState<RaidBossData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Autocomplete / Suggestions State
  const [suggestions, setSuggestions] = useState<PokemonCatalogItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // User's owned inventory from localStorage to cross-reference
  const [userStorage, setUserStorage] = useState<StoragePokemon[]>([]);

  // Filtering & Sorting State for Counter Attackers
  const [filterMode, setFilterMode] = useState<'all' | 'owned' | 'double_weak'>('all');
  const [typeFilter, setTypeFilter] = useState<PokemonType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'power' | 'attack' | 'max_cp'>('power');
  const [showFormulaExplainer, setShowFormulaExplainer] = useState<boolean>(false);

  // Load user's storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUserStorage(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions on query change
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      const results = searchPokemonCatalog(searchQuery, 8);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Fetch raid boss data
  const loadBossData = async (name: string) => {
    setLoading(true);
    setError(null);
    setIsDropdownOpen(false);
    try {
      const data = await fetchRaidBossData(name);
      setSelectedBoss(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data Pokémon dari PokéAPI.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBossData('rayquaza');
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadBossData(searchQuery.trim());
    }
  };

  const handleSelectSuggestion = (pokemon: PokemonCatalogItem) => {
    setSearchQuery(pokemon.name);
    setIsDropdownOpen(false);
    loadBossData(pokemon.name);
  };

  // Calculate effectiveness breakdown for the boss's types
  const type1 = selectedBoss?.types[0] || 'Dragon';
  const type2 = selectedBoss?.types[1] || null;
  const effectiveness = calculateDefenderEffectiveness(type1, type2);

  // Helper to find matching pokemon in user's inventory
  const getMatchingUserPokemon = (counterName: string, counterDex: number) => {
    return userStorage.filter(
      (item) =>
        item.name.toLowerCase() === counterName.toLowerCase() ||
        item.dexNumber === counterDex ||
        (counterName.includes('Mega') && item.name.toLowerCase() === counterName.replace('Mega ', '').toLowerCase())
    );
  };

  // Process and sort counters strictly by User-Owned status and Highest Power / Base Stats
  const processedCounters = useMemo(() => {
    if (!selectedBoss?.bestCounters) return [];

    let list = selectedBoss.bestCounters.map((counter) => {
      const matchingOwned = getMatchingUserPokemon(counter.name, counter.dexNumber);
      return {
        ...counter,
        isOwned: matchingOwned.length > 0,
        ownedPokemon: matchingOwned[0] || null,
        ownedCount: matchingOwned.length,
      };
    });

    // Apply filters
    if (filterMode === 'owned') {
      list = list.filter((c) => c.isOwned);
    } else if (filterMode === 'double_weak') {
      list = list.filter((c) => c.multiplier >= 2.5);
    }

    if (typeFilter !== 'all') {
      list = list.filter(
        (c) =>
          c.types.includes(typeFilter) ||
          c.fastMoveType === typeFilter ||
          c.chargedMoveType === typeFilter
      );
    }

    // Sort logic: Owned Pokémon in checklist FIRST, then sorted by highest metric!
    list.sort((a, b) => {
      // 1. Owned status priority
      if (a.isOwned !== b.isOwned) {
        return a.isOwned ? -1 : 1;
      }

      // 2. Metric sorting
      if (sortBy === 'attack') {
        return (b.attack || 0) - (a.attack || 0);
      }
      if (sortBy === 'max_cp') {
        return (b.maxCp || 0) - (a.maxCp || 0);
      }
      // Default: Power Score (Combination of Base Attack, Multiplier, STAB, and Durability)
      return (b.powerScore || 0) - (a.powerScore || 0);
    });

    return list;
  }, [selectedBoss, userStorage, filterMode, typeFilter, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl shadow-indigo-950/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest font-mono mb-1">
              <span className="w-1.5 h-3.5 bg-indigo-500 rounded-sm"></span>
              <Swords className="w-3.5 h-3.5" /> PokéAPI Live Integration & Counter Matcher
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight font-mono">
              Raid Boss Counter & Info
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Analisis statistik, artwork resmi, kelemahan fatal, dan pencocokan otomatis dengan daftar Pokémon yang Anda miliki di checklist.
            </p>
          </div>
        </div>

        {/* Search Bar & Quick Preset Chips */}
        <div className="space-y-3 pt-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div ref={searchContainerRef} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Ketik nama Pokémon (contoh: Mewtwo, Rayquaza, Kyogre, Lucario, Groudon)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-indigo-500/30 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 font-mono transition"
                autoComplete="off"
              />

              {/* Suggestions Dropdown */}
              {isDropdownOpen && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-indigo-500/40 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80 animate-in fade-in-50 duration-150">
                  <div className="px-3 py-1.5 bg-slate-950/90 text-[10px] font-mono text-indigo-300 uppercase tracking-wider flex items-center justify-between border-b border-indigo-500/20">
                    <span>Saran Pokémon ({suggestions.length})</span>
                    <span className="text-slate-500">Klik untuk memilih</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {suggestions.map((pokemon) => (
                      <button
                        key={pokemon.dex}
                        type="button"
                        onClick={() => handleSelectSuggestion(pokemon)}
                        className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-indigo-950/50 transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={pokemon.sprite}
                            alt={pokemon.name}
                            className="w-8 h-8 object-contain shrink-0 group-hover:scale-110 transition-transform"
                            loading="lazy"
                          />
                          <div>
                            <div className="font-bold text-slate-100 text-xs sm:text-sm group-hover:text-indigo-300 transition-colors font-mono">
                              {pokemon.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              #{String(pokemon.dex).padStart(3, '0')}
                              {pokemon.isLegendary && ' • Legendary'}
                              {pokemon.isMythical && ' • Mythical'}
                              {pokemon.isUltraBeast && ' • Ultra Beast'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {pokemon.types.map((t) => (
                            <TypeBadge key={t} type={t} size="xs" showIcon={false} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(79,70,229,0.35)] transition cursor-pointer flex items-center gap-2 font-mono uppercase tracking-wider shrink-0"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Analisis Boss</span>
            </button>
          </form>

          {/* Quick Boss Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 self-center mr-1 flex items-center gap-1 font-mono uppercase tracking-wider">
              <Flame className="w-3 h-3 text-indigo-400" />
              Bos Populer:
            </span>
            {PRESET_RAID_BOSSES.map((b) => (
              <button
                key={b.name}
                onClick={() => {
                  setSearchQuery(b.name);
                  loadBossData(b.name);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer font-mono ${
                  selectedBoss?.name.toLowerCase() === b.name.toLowerCase()
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold shadow-md shadow-indigo-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {b.displayName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message if Fetch Fails */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/60 flex items-start gap-3 text-rose-200 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-rose-300">Pencarian Gagal</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !selectedBoss && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto"></div>
          <div className="text-slate-400 text-xs">Menghubungkan ke PokéAPI & menganalisis elemen...</div>
        </div>
      )}

      {/* Main Boss View */}
      {selectedBoss && !loading && (
        <div className="space-y-6">
          {/* Boss Overview Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Artwork Box */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/80 relative overflow-hidden group">
                <div className="absolute -top-12 -left-12 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl"></div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400">
                  #{String(selectedBoss.id).padStart(3, '0')}
                </div>

                <img
                  src={selectedBoss.officialArtwork}
                  alt={selectedBoss.displayName}
                  referrerPolicy="no-referrer"
                  className="w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />

                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600/60 text-rose-300 font-bold text-xs">
                    <Flame className="w-3.5 h-3.5" />
                    {selectedBoss.tier} Raid Boss
                  </span>
                </div>
              </div>

              {/* Boss Information & Base Stats */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                      {selectedBoss.displayName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-400">Tipe Elemen:</span>
                      {selectedBoss.types.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" showIndonesian />
                      ))}
                    </div>
                  </div>

                  {selectedBoss.height && selectedBoss.weight && (
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <div>Tinggi: <span className="text-slate-200 font-bold">{selectedBoss.height}m</span></div>
                      <div>Berat: <span className="text-slate-200 font-bold">{selectedBoss.weight}kg</span></div>
                    </div>
                  )}
                </div>

                {/* Base Stats Meters */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      Statistik Dasar (PokéAPI Stats):
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Attack */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-400">
                        <span>Attack</span>
                        <span className="text-rose-400 font-mono font-bold">{selectedBoss.baseStats.attack}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"
                          style={{ width: `${Math.min(100, (selectedBoss.baseStats.attack / 300) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Defense */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-400">
                        <span>Defense</span>
                        <span className="text-cyan-400 font-mono font-bold">{selectedBoss.baseStats.defense}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${Math.min(100, (selectedBoss.baseStats.defense / 300) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stamina / HP */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-slate-400">
                        <span>HP / Stamina</span>
                        <span className="text-emerald-400 font-mono font-bold">{selectedBoss.baseStats.hp}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${Math.min(100, (selectedBoss.baseStats.hp / 300) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weakness Summary Chips */}
                <div className="pt-1">
                  <div className="text-xs font-bold text-slate-300 mb-1.5">Target Serangan Terbaik:</div>
                  <div className="flex flex-wrap gap-2">
                    {effectiveness.doubleWeakness.map((w) => (
                      <div key={w.attackType} className="flex items-center gap-1">
                        <TypeBadge type={w.attackType} size="sm" showIndonesian />
                        <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] animate-pulse">
                          2.56x
                        </span>
                      </div>
                    ))}
                    {effectiveness.weakness.map((w) => (
                      <div key={w.attackType} className="flex items-center gap-1">
                        <TypeBadge type={w.attackType} size="sm" showIndonesian />
                        <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white font-bold text-[10px]">
                          1.6x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Counter Attackers with Inventory Cross-Reference */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Swords className="w-5 h-5 text-rose-400" />
                  Rekomendasi Pokémon Penyerang Terbaik (Counters)
                </h3>
                <p className="text-xs text-slate-400">
                  Diurutkan berdasarkan <span className="text-amber-300 font-semibold">Pokémon Milik Anda Terlebih Dahulu</span> lalu <span className="text-indigo-300 font-semibold">Stat Serangan & Skor Kekuatan Raid Tertinggi</span> (bukan ID Pokédex).
                </p>
              </div>

              {/* Explainer Toggle Button */}
              <button
                type="button"
                onClick={() => setShowFormulaExplainer(!showFormulaExplainer)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bagaimana "Terkuat" Dihitung?</span>
                {showFormulaExplainer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Formula & Strongest Mechanics Explainer Accordion */}
            {showFormulaExplainer && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-3 text-xs text-slate-300 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-amber-300 font-bold font-mono">
                  <Trophy className="w-4 h-4" />
                  STANDAR PERHITUNGAN POKÉMON TERKUAT (RAID POWER INDEX):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-400">
                      <Swords className="w-3.5 h-3.5" /> 1. Base Attack (DPS 70%)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Stat Serangan Pokok adalah penentu tercepat menguras HP bos sebelum timer raid habis.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <Flame className="w-3.5 h-3.5" /> 2. Multiplier Tipe (2.56x / 1.6x)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Kelemahan ganda (2.56x) melipatgandakan damage secara eksponensial dibanding kelemahan tunggal (1.6x).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <Zap className="w-3.5 h-3.5" /> 3. STAB & Moveset (1.2x)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Bonus Same-Type Attack (1.2x) saat elemen jurus Fast/Charged sama dengan tipe Pokémon Anda.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                      <Shield className="w-3.5 h-3.5" /> 4. Durabilitas Def + HP
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Defense & Stamina menjaga Pokémon bertahan lebih lama agar dapat menembakkan Charged Move lebih banyak (TDO).
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-amber-200/90 font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                  💡 <span className="font-bold">Prioritas Koleksi:</span> Pokémon yang telah Anda simpan di menu <strong>Checklist Storage</strong> secara otomatis ditempatkan di paling atas agar Anda langsung tahu penyerang terbaik dari kantong Pokémon Anda sendiri!
                </div>
              </div>
            )}

            {/* Filter & Sort Toolbar */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Quick Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    filterMode === 'all'
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Semua Terkuat ({selectedBoss.bestCounters.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('owned')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filterMode === 'owned'
                      ? 'bg-amber-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Dimiliki di Checklist ({processedCounters.filter((c) => c.isOwned).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('double_weak')}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    filterMode === 'double_weak'
                      ? 'bg-rose-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Kelemahan Fatal (2.56x)
                </button>
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Urutan:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                >
                  <option value="power">⚡ Skor Kekuatan Raid (DPS + Durabilitas)</option>
                  <option value="attack">⚔️ Base Attack Tertinggi</option>
                  <option value="max_cp">🛡️ Perkiraan Max CP Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Counters Grid */}
            {processedCounters.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-slate-200">
                  Tidak ada Pokémon counter yang cocok dengan filter aktif.
                </p>
                <p className="text-xs text-slate-400">
                  {filterMode === 'owned'
                    ? 'Anda belum memiliki Pokémon dengan tipe counter ini di menu Storage Checklist. Coba ubah filter ke "Semua Terkuat".'
                    : 'Coba ubah opsi filter atau tipe di atas.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('all');
                    setTypeFilter('all');
                  }}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
                >
                  Tampilkan Semua Counter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {processedCounters.map((counter, idx) => {
                  const isOwned = counter.isOwned;
                  const bestOwned = counter.ownedPokemon;

                  // Color gradient for tier ranks
                  const tierColor =
                    counter.rankTier === 'S+'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-amber-500/20'
                      : counter.rankTier === 'S'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-amber-500/20'
                      : counter.rankTier === 'A+'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-200';

                  return (
                    <div
                      key={`${counter.name}-${counter.dexNumber}-${idx}`}
                      className={`relative p-4 rounded-2xl border transition-all duration-200 space-y-3 ${
                        isOwned
                          ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/70 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Owned Highlight Ribbon */}
                      {isOwned && (
                        <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                          <span className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                            <span>DIMILIKI DI INVENTORY ({counter.ownedCount})</span>
                            {bestOwned?.isHundo && (
                              <span className="text-[10px] px-1 bg-amber-500 text-slate-950 rounded font-black">
                                100% IV
                              </span>
                            )}
                            {bestOwned?.isShiny && <span className="text-[10px]">✨</span>}
                          </span>
                          {bestOwned?.cp ? (
                            <span className="font-mono text-amber-400">CP {bestOwned.cp}</span>
                          ) : (
                            <span className="text-[10px] text-amber-400/80">Siap Tempur</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {/* Counter Sprite */}
                          <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 overflow-hidden shrink-0 relative">
                            <img
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${counter.dexNumber}.png`}
                              alt={counter.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                            {/* Rank Tier Badge */}
                            {counter.rankTier && (
                              <span
                                className={`absolute top-0.5 right-0.5 px-1 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${tierColor}`}
                              >
                                {counter.rankTier}
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-slate-100 tracking-tight">
                                {counter.name}
                              </h4>
                              <span className="text-xs text-slate-500 font-mono">
                                #{counter.dexNumber}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-1">
                              {counter.types.map((t) => (
                                <TypeBadge key={t} type={t} size="xs" />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Multiplier & Power Score */}
                        <div className="flex flex-col items-end gap-1">
                          {counter.multiplier >= 2.5 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white uppercase animate-pulse">
                              2.56x Fatal
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white uppercase">
                              1.6x Super
                            </span>
                          )}

                          {counter.powerScore && (
                            <span className="text-[10px] font-mono font-bold text-amber-300/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              Skor: {counter.powerScore}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stat Breakdown Chips (Attack, Defense, Stamina, Max CP) */}
                      <div className="grid grid-cols-4 gap-1.5 py-1.5 px-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono">
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                            <Swords className="w-2.5 h-2.5 text-rose-400" /> ATK
                          </span>
                          <span className="font-bold text-rose-300">{counter.attack || '-'}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                            <Shield className="w-2.5 h-2.5 text-blue-400" /> DEF
                          </span>
                          <span className="font-bold text-blue-300">{counter.defense || '-'}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                            <Heart className="w-2.5 h-2.5 text-emerald-400" /> STA
                          </span>
                          <span className="font-bold text-emerald-300">{counter.stamina || '-'}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5 text-amber-400" /> MAX CP
                          </span>
                          <span className="font-bold text-amber-300">{counter.maxCp ? `~${counter.maxCp}` : '-'}</span>
                        </div>
                      </div>

                      {/* Recommended Moveset */}
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs font-mono">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Rekomendasi Jurus Terbaik:
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-1.5 text-slate-300">
                          <span className="text-slate-500 text-[11px]">Fast:</span>
                          <MoveBadge
                            moveName={counter.fastMove}
                            type={counter.fastMoveType}
                            category="Fast"
                            size="xs"
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-1.5 text-slate-200">
                          <span className="text-slate-500 text-[11px]">Charged:</span>
                          <MoveBadge
                            moveName={counter.chargedMove}
                            type={counter.chargedMoveType}
                            category="Charged"
                            size="xs"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
