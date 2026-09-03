import React, { useState, useMemo, useEffect } from 'react';
import { PokemonType, TypeTopPokemonFamily } from '../../types/pokemon';
import { POKEMON_TYPE_DETAILS, POKEMON_TYPES } from '../../data/pokemonTypes';
import { getTopPokemonForType } from '../../data/pokemonEvolutions';
import { TypeBadge } from '../common/TypeBadge';
import {
  X,
  Search,
  Sparkles,
  Trophy,
  Zap,
  Shield,
  Heart,
  ChevronRight,
  Info,
  Swords,
  Layers,
  Flame,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface TypePokemonModalProps {
  isOpen: boolean;
  type: PokemonType | null;
  onClose: () => void;
  onSelectType?: (newType: PokemonType) => void;
}

export const TypePokemonModal: React.FC<TypePokemonModalProps> = ({
  isOpen,
  type,
  onClose,
  onSelectType,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'wild_evolve' | 'legendary'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'cp' | 'attack'>('rating');
  const [selectedFamilyDex, setSelectedFamilyDex] = useState<number | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset filters when type changes
  useEffect(() => {
    setSearchQuery('');
    setCategoryFilter('all');
    setSelectedFamilyDex(null);
  }, [type]);

  // Retrieve and memoize top Pokémon families for current type
  const rawFamilies = useMemo(() => {
    if (!type) return [];
    return getTopPokemonForType(type);
  }, [type]);

  // Filter and sort
  const filteredFamilies = useMemo(() => {
    let list = [...rawFamilies];

    // Filter by Category
    if (categoryFilter === 'wild_evolve') {
      list = list.filter((p) => !p.isLegendary && !p.isMythical && !p.isUltraBeast);
    } else if (categoryFilter === 'legendary') {
      list = list.filter((p) => p.isLegendary || p.isMythical || p.isUltraBeast);
    }

    // Filter by Search (checks represented Pokemon and any ancestor/descendant in evolution line)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDex = p.dex.toString().includes(q);
        const matchesEvolution = p.evolutionLine.some(
          (stage) => stage.name.toLowerCase().includes(q) || stage.dex.toString().includes(q)
        );
        return matchesName || matchesDex || matchesEvolution;
      });
    }

    // Sort
    if (sortBy === 'cp') {
      list.sort((a, b) => b.maxCp - a.maxCp);
    } else if (sortBy === 'attack') {
      list.sort((a, b) => b.attack - a.attack);
    } else {
      list.sort((a, b) => b.powerScore - a.powerScore);
    }

    return list;
  }, [rawFamilies, categoryFilter, searchQuery, sortBy]);

  if (!isOpen || !type) return null;

  const typeDetails = POKEMON_TYPE_DETAILS[type] || POKEMON_TYPE_DETAILS.Normal;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto backdrop-blur-sm bg-black/60 animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          className="p-5 sm:p-6 text-white relative overflow-hidden flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${typeDetails.color}DD 0%, ${typeDetails.color} 50%, #064e3b 100%)`,
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={type} size="md" showIndonesian />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-black/30 backdrop-blur-xs text-white border border-white/20">
                  Total {rawFamilies.length} Keluarga Pokémon
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Rekomendasi Pokémon Tipe {type} Terbaik</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl font-medium leading-relaxed">
                Diurutkan berdasar Combat Rating & Max CP. Seluruh garis evolusi dirangkum dalam 1 nomor
                daftar agar memudahkan Anda mengetahui Pokémon mana yang harus diincar dan ditangkap.
              </p>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer border border-white/20 shadow-xs"
              aria-label="Tutup popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Type Switcher Pills */}
          <div className="relative z-10 mt-4 pt-3 border-t border-white/15 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-white/80 whitespace-nowrap mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Ganti Tipe:
            </span>
            {POKEMON_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onSelectType && onSelectType(t)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  t === type
                    ? 'bg-white text-slate-900 shadow-sm ring-2 ring-white scale-105'
                    : 'bg-black/25 text-white/90 hover:bg-white/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between flex-shrink-0">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari Pokémon tipe ${type} (misal: Magnezone, Elekid, Charizard)...`}
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Semua ({rawFamilies.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('wild_evolve')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'wild_evolve'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Khusus Pokémon yang bisa ditangkap di alam liar & dievolusikan (Non-Legendary)"
            >
              <span>🌿 Bisa Ditangkap & Evolve</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('legendary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === 'legendary'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>⭐ Legendaris / UB</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap hidden sm:inline">
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'cp' | 'attack')}
              className="text-xs font-bold py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="rating">Rating Tempur Tertinggi</option>
              <option value="cp">Max CP Tertinggi</option>
              <option value="attack">Base Attack Tertinggi</option>
            </select>
          </div>
        </div>

        {/* POKEMON LIST CONTAINER */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredFamilies.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Info className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Tidak ada Pokémon yang cocok
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau ganti filter kategori di atas.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
              >
                Reset Filter Pencarian
              </button>
            </div>
          ) : (
            filteredFamilies.map((item, index) => {
              const isSelected = selectedFamilyDex === item.dex;
              const hasMultipleEvol = item.evolutionLine.length > 1;

              // Rank styling
              let rankBadgeStyle = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
              if (index === 0) rankBadgeStyle = 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 shadow-sm';
              else if (index === 1) rankBadgeStyle = 'bg-slate-300 text-slate-900 ring-2 ring-slate-200';
              else if (index === 2) rankBadgeStyle = 'bg-amber-600 text-white ring-2 ring-amber-500';

              // Tier badge styling
              let tierColor = 'bg-emerald-500 text-white';
              if (item.rankTier === 'S+') tierColor = 'bg-purple-600 text-white shadow-xs';
              else if (item.rankTier === 'S') tierColor = 'bg-amber-500 text-white shadow-xs';
              else if (item.rankTier === 'A+') tierColor = 'bg-teal-600 text-white';
              else if (item.rankTier === 'A') tierColor = 'bg-blue-600 text-white';
              else tierColor = 'bg-slate-500 text-white';

              return (
                <div
                  key={`top-family-${item.dex}`}
                  className={`pt-4 first:pt-0 group transition-all rounded-2xl p-4 ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-500 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {/* CARD MAIN ROW */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* LEFT SECTION: Rank + Sprite + Name + Types */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      {/* Rank Index */}
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center rounded-xl text-xs sm:text-sm font-black ${rankBadgeStyle}`}
                      >
                        #{index + 1}
                      </span>

                      {/* Pokémon Avatar */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner">
                        <img
                          src={item.officialArtwork || item.sprite}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to sprite if artwork 404s
                            (e.target as HTMLImageElement).src = item.sprite;
                          }}
                        />
                      </div>

                      {/* Name, Dex & Badges */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                            #{item.dex.toString().padStart(3, '0')}
                          </span>

                          {/* Classification Tag */}
                          {item.isLegendary && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                              ⭐ LEGENDARY
                            </span>
                          )}
                          {item.isUltraBeast && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                              🌌 ULTRA BEAST
                            </span>
                          )}
                          {item.isMythical && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-pink-100 dark:bg-pink-950/60 text-pink-800 dark:text-pink-300 border border-pink-300 dark:border-pink-700">
                              ✨ MYTHICAL
                            </span>
                          )}
                          {!item.isLegendary && !item.isMythical && !item.isUltraBeast && hasMultipleEvol && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              🌿 BISA DITANGKAP LIAR
                            </span>
                          )}
                        </div>

                        {/* Types */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.types.map((t) => (
                            <TypeBadge key={t} type={t} size="xs" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SECTION: Combat Rating + Stats Grid */}
                    <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                      {/* Combat Rating Power Score */}
                      <div className="text-left md:text-right">
                        <div className="flex items-center md:justify-end gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${tierColor}`}
                          >
                            Tier {item.rankTier}
                          </span>
                        </div>
                        <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-none mt-1">
                          {item.powerScore}
                          <span className="text-[10px] font-bold text-slate-400 ml-1">PTS</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          Rating Kekuatan
                        </span>
                      </div>

                      {/* Stat Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-100 dark:bg-slate-800/80 p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Max CP</div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
                            {item.maxCp}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-rose-500 uppercase">Atk</div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
                            {item.attack}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-cyan-500 uppercase">Def</div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono">
                            {item.defense}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EVOLUTION TIMELINE ROW (Cornerstone requirement) */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Garis Evolusi Keluarga:</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {hasMultipleEvol
                          ? `${item.evolutionLine.length} Tahap Evolusi`
                          : 'Bentuk Tunggal (Tanpa Evolusi)'}
                      </span>
                    </div>

                    {/* Timeline visualization */}
                    {hasMultipleEvol ? (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
                        {item.evolutionLine.map((stage, sIdx) => {
                          const isFinal = sIdx === item.evolutionLine.length - 1;
                          const isBase = sIdx === 0;

                          return (
                            <React.Fragment key={`stage-${stage.dex}`}>
                              {sIdx > 0 && (
                                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                              )}
                              <div
                                className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all ${
                                  isFinal
                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <img
                                  src={stage.sprite}
                                  alt={stage.name}
                                  className="w-6 h-6 object-contain"
                                  loading="lazy"
                                />
                                <div className="text-left">
                                  <div className="text-xs font-bold leading-tight flex items-center gap-1">
                                    <span>{stage.name}</span>
                                    {isFinal && (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-600 text-white uppercase tracking-wider">
                                        Hasil Akhir
                                      </span>
                                    )}
                                    {isBase && (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                        Bentuk Dasar
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    #{stage.dex.toString().padStart(3, '0')}
                                  </span>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>
                          <strong>{item.name}</strong> tidak berevolusi dari Pokémon lain. Dapat ditangkap
                          langsung melalui Raid, Telur, atau Alam Liar.
                        </span>
                      </div>
                    )}

                    {/* Pro-tip Note */}
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        💡 Rekomendasi Moveset:
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.recommendedMoves?.fast} + {item.recommendedMoves?.charged}
                      </span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="italic text-slate-500">{item.roleNote}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 sm:p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>
              Menampilkan <strong>{filteredFamilies.length}</strong> keluarga Pokémon tipe{' '}
              <strong>{type}</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-all cursor-pointer shadow-xs"
          >
            Tutup Rekomendasi
          </button>
        </div>
      </div>
    </div>
  );
};
