import React, { useState } from 'react';
import { PokemonType } from '../../types/pokemon';
import {
  POKEMON_TYPES,
  POKEMON_TYPE_DETAILS,
  calculateDefenderEffectiveness,
  calculateAttackerEffectiveness,
  getDualTypeMultiplier,
} from '../../data/pokemonTypes';
import { TypeBadge } from '../common/TypeBadge';
import {
  Shield,
  Swords,
  Grid3X3,
  Sparkles,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const TypeCalculator: React.FC = () => {
  const [mode, setMode] = useState<'defending' | 'attacking' | 'matrix'>('defending');
  const [primaryType, setPrimaryType] = useState<PokemonType>('Dragon');
  const [secondaryType, setSecondaryType] = useState<PokemonType | null>('Flying');
  const [attackingType, setAttackingType] = useState<PokemonType>('Fire');
  const [hoveredMatrixCell, setHoveredMatrixCell] = useState<{
    atk: PokemonType;
    def: PokemonType;
  } | null>(null);

  // Preset popular Pokemon typings for quick testing
  const presets: { name: string; t1: PokemonType; t2: PokemonType | null }[] = [
    { name: 'Rayquaza (Dragon/Flying)', t1: 'Dragon', t2: 'Flying' },
    { name: 'Swampert (Water/Ground)', t1: 'Water', t2: 'Ground' },
    { name: 'Lucario (Fighting/Steel)', t1: 'Fighting', t2: 'Steel' },
    { name: 'Charizard (Fire/Flying)', t1: 'Fire', t2: 'Flying' },
    { name: 'Tyranitar (Rock/Dark)', t1: 'Rock', t2: 'Dark' },
    { name: 'Togekiss (Fairy/Flying)', t1: 'Fairy', t2: 'Flying' },
    { name: 'Dialga (Steel/Dragon)', t1: 'Steel', t2: 'Dragon' },
    { name: 'Garchomp (Dragon/Ground)', t1: 'Dragon', t2: 'Ground' },
    { name: 'Gengar (Ghost/Poison)', t1: 'Ghost', t2: 'Poison' },
    { name: 'Kartana (Grass/Steel)', t1: 'Grass', t2: 'Steel' },
  ];

  // Defender calculation results
  const defenderResults = calculateDefenderEffectiveness(primaryType, secondaryType);

  // Attacker calculation results
  const attackerResults = calculateAttackerEffectiveness(attackingType);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner - Pokémon GO Vibrant Emerald Theme */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-100 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Pokémon GO Battle Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Type Effectiveness Calculator
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-2xl font-medium leading-relaxed">
              Hitung kelemahan & kekebalan elemen Pokémon dengan aturan rasio damage resmi Pokémon GO:
              <span className="font-bold text-amber-200"> Super Effective (x1.6 / x2.56)</span>,
              <span className="font-bold text-cyan-200"> Not Very Effective (x0.625)</span>, dan
              <span className="font-bold text-emerald-200"> Immunity (x0.39 / x0.244)</span>.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setMode('defending')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'defending'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Bertahan (Defender)</span>
            </button>
            <button
              onClick={() => setMode('attacking')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'attacking'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Menyerang (Attacker)</span>
            </button>
            <button
              onClick={() => setMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'matrix'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Matriks 18x18</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: DEFENDER EFFECTIVENESS */}
      {mode === 'defending' && (
        <div className="space-y-6">
          {/* Defender Type Selector Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Pilih Elemen Bertahan (Defender)
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                  Pilih tipe tunggal atau kombinasi dual-type untuk menghitung total multiplier kelemahan
                </p>
              </div>

              {/* Active Selection Display */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Kombinasi:</span>
                <TypeBadge type={primaryType} size="md" showIndonesian />
                {secondaryType && secondaryType !== primaryType && (
                  <>
                    <span className="text-slate-400 font-bold">+</span>
                    <TypeBadge type={secondaryType} size="md" showIndonesian />
                  </>
                )}
                {secondaryType && (
                  <button
                    onClick={() => setSecondaryType(null)}
                    className="ml-1 text-slate-400 hover:text-rose-600 text-xs cursor-pointer p-1"
                    title="Hapus tipe kedua"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Contoh Cepat Kombinasi Populer:
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => {
                  const isSelected = primaryType === p.t1 && secondaryType === p.t2;
                  return (
                    <button
                      key={p.name}
                      onClick={() => {
                        setPrimaryType(p.t1);
                        setSecondaryType(p.t2);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type 1 Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Tipe Utama (Primary Type):</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-black">{primaryType}</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
                {POKEMON_TYPES.map((t) => (
                  <TypeBadge
                    key={`pri-${t}`}
                    type={t}
                    size="sm"
                    selected={primaryType === t}
                    onClick={() => {
                      setPrimaryType(t);
                      if (secondaryType === t) setSecondaryType(null);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Type 2 Selector */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Tipe Kedua (Secondary Type - Opsional):</span>
                <span className="text-teal-700 dark:text-teal-400 font-black">
                  {secondaryType || 'Tidak ada (Tipe Tunggal)'}
                </span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
                <button
                  type="button"
                  onClick={() => setSecondaryType(null)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    secondaryType === null
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Tanpa Tipe 2
                </button>
                {POKEMON_TYPES.map((t) => (
                  <TypeBadge
                    key={`sec-${t}`}
                    type={t}
                    size="sm"
                    selected={secondaryType === t}
                    onClick={() => {
                      if (primaryType === t) {
                        setSecondaryType(null);
                      } else {
                        setSecondaryType(t);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Damage Multiplier Breakdown Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Hasil Efektivitas Kerusakan (Damage Multipliers)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Double Super Effective (2.56x) */}
              {defenderResults.doubleWeakness.length > 0 && (
                <div className="p-4 rounded-2xl border-2 border-rose-400 dark:border-rose-700 bg-rose-50/80 dark:bg-rose-950/40 space-y-3 shadow-sm md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-rose-600 text-white uppercase tracking-wider animate-pulse shadow-xs">
                        FATAL WEAKNESS (2.56x)
                      </span>
                      <span className="text-sm font-bold text-rose-950 dark:text-rose-200">
                        Double Super Effective
                      </span>
                    </div>
                    <span className="text-xs text-rose-800 dark:text-rose-300 font-mono font-bold">256% Damage</span>
                  </div>
                  <p className="text-xs text-rose-950 dark:text-rose-200 font-medium">
                    Kombinasi elemen bertahan ini mengalami kelemahan ganda terhadap serangan tipe berikut:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {defenderResults.doubleWeakness.map((res) => (
                      <TypeBadge key={res.attackType} type={res.attackType} size="md" showIndonesian />
                    ))}
                  </div>
                </div>
              )}

              {/* Single Weakness (1.6x) */}
              <div className="p-4 rounded-2xl border border-orange-300 dark:border-orange-800/60 bg-orange-50/60 dark:bg-orange-950/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-orange-600 text-white uppercase tracking-wider">
                      WEAKNESS (1.6x)
                    </span>
                    <span className="text-sm font-bold text-orange-950 dark:text-orange-200">Super Effective</span>
                  </div>
                  <span className="text-xs text-orange-800 dark:text-orange-300 font-mono font-bold">160% Damage</span>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[36px]">
                  {defenderResults.weakness.length > 0 ? (
                    defenderResults.weakness.map((res) => (
                      <TypeBadge key={res.attackType} type={res.attackType} size="sm" showIndonesian />
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">Tidak ada kelemahan single 1.6x</span>
                  )}
                </div>
              </div>

              {/* Resistance (0.625x) */}
              <div className="p-4 rounded-2xl border border-cyan-300 dark:border-cyan-800/60 bg-cyan-50/60 dark:bg-cyan-950/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-cyan-700 text-white uppercase tracking-wider">
                      RESIST (0.625x)
                    </span>
                    <span className="text-sm font-bold text-cyan-950 dark:text-cyan-200">Not Very Effective</span>
                  </div>
                  <span className="text-xs text-cyan-800 dark:text-cyan-300 font-mono font-bold">62.5% Damage</span>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[36px]">
                  {defenderResults.resistance.length > 0 ? (
                    defenderResults.resistance.map((res) => (
                      <TypeBadge key={res.attackType} type={res.attackType} size="sm" showIndonesian />
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">Tidak ada resistensi tunggal</span>
                  )}
                </div>
              </div>

              {/* Immunity / Double Resist (0.39x) */}
              <div className="p-4 rounded-2xl border border-teal-300 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-950/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-teal-600 text-white uppercase tracking-wider">
                      IMMUNITY / 2x RESIST (0.39x)
                    </span>
                    <span className="text-sm font-bold text-teal-950 dark:text-teal-200">Kekebalan PoGO</span>
                  </div>
                  <span className="text-xs text-teal-800 dark:text-teal-300 font-mono font-bold">39.0% Damage</span>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[36px]">
                  {defenderResults.immunity.length > 0 ? (
                    defenderResults.immunity.map((res) => (
                      <TypeBadge key={res.attackType} type={res.attackType} size="sm" showIndonesian />
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">Tidak ada kekebalan (0.39x)</span>
                  )}
                </div>
              </div>

              {/* Triple Resistance (0.244x) */}
              {defenderResults.tripleResistance.length > 0 && (
                <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-600 text-white uppercase tracking-wider">
                        TRIPLE RESIST (0.244x)
                      </span>
                      <span className="text-sm font-bold text-emerald-950 dark:text-emerald-200">Kekebalan Maksimal</span>
                    </div>
                    <span className="text-xs text-emerald-800 dark:text-emerald-300 font-mono font-bold">24.4% Damage</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {defenderResults.tripleResistance.map((res) => (
                      <TypeBadge key={res.attackType} type={res.attackType} size="sm" showIndonesian />
                    ))}
                  </div>
                </div>
              )}

              {/* Neutral Damage (1.0x) */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-600 text-white uppercase tracking-wider">
                      NEUTRAL (1.0x)
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-300">Damage Normal</span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">100% Damage</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {defenderResults.neutral.map((res) => (
                    <TypeBadge key={res.attackType} type={res.attackType} size="xs" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ATTACKER EFFECTIVENESS */}
      {mode === 'attacking' && (
        <div className="space-y-6">
          {/* Attacker Type Selector Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Swords className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Pilih Elemen Serangan (Attacker Move Type)
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                  Cari tahu tipe elemen target mana yang akan menerima damage maksimal dari jurus ini
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Jurus Dipilih:</span>
                <TypeBadge type={attackingType} size="md" showIndonesian />
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
              {POKEMON_TYPES.map((t) => (
                <TypeBadge
                  key={`atk-${t}`}
                  type={t}
                  size="sm"
                  selected={attackingType === t}
                  onClick={() => setAttackingType(t)}
                />
              ))}
            </div>
          </div>

          {/* Attacker Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Super Effective Against */}
            <div className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-800">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                    DAMAGE 1.6x (160%)
                  </span>
                  <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-200 mt-1">Super Effective</h4>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                Sangat kuat saat menyerang Pokémon dengan tipe bertahan berikut:
              </p>
              <div className="flex flex-wrap gap-2">
                {attackerResults.superEffective.length > 0 ? (
                  attackerResults.superEffective.map((t) => (
                    <TypeBadge key={t} type={t} size="md" showIndonesian />
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">Tidak ada target Super Effective</span>
                )}
              </div>
            </div>

            {/* Not Very Effective Against */}
            <div className="p-5 rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-200 dark:border-rose-800">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider">
                    DAMAGE 0.625x (62.5%)
                  </span>
                  <h4 className="text-base font-bold text-rose-950 dark:text-rose-200 mt-1">Not Very Effective</h4>
                </div>
                <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <p className="text-xs text-rose-950 dark:text-rose-200 font-medium">
                Damage berkurang signifikan jika mengenai tipe bertahan berikut:
              </p>
              <div className="flex flex-wrap gap-2">
                {attackerResults.notVeryEffective.length > 0 ? (
                  attackerResults.notVeryEffective.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" showIndonesian />
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">Tidak ada target Resisten</span>
                )}
              </div>
            </div>

            {/* Immunity Against */}
            <div className="p-5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-700 text-white uppercase tracking-wider">
                    DAMAGE 0.39x (39.0%)
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-200 mt-1">Immunity in PoGO</h4>
                </div>
                <XCircle className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Damage ditekan drastis akibat kekebalan mekanik Pokémon GO:
              </p>
              <div className="flex flex-wrap gap-2">
                {attackerResults.noDamage.length > 0 ? (
                  attackerResults.noDamage.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" showIndonesian />
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">Tidak ada target Imun</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: 18x18 TYPE MATCHUP MATRIX */}
      {mode === 'matrix' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Matriks Interaktif 18x18 Elemen Pokémon GO
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Baris = Tipe Serangan (Attacker) | Kolom = Tipe Bertahan (Defender)
              </p>
            </div>

            {/* Matrix Legend */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white">1.6x (SE)</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">1.0x</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">0.625x (NVE)</span>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">0.39x (IMM)</span>
            </div>
          </div>

          {/* Cell Hover Info Bar */}
          {hoveredMatrixCell && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Serangan:</span>
                <TypeBadge type={hoveredMatrixCell.atk} size="xs" />
                <span className="text-slate-600 dark:text-slate-400 font-medium">vs Bertahan:</span>
                <TypeBadge type={hoveredMatrixCell.def} size="xs" />
              </div>
              <div className="font-mono font-bold">
                {(() => {
                  const m = getDualTypeMultiplier(hoveredMatrixCell.atk, hoveredMatrixCell.def);
                  if (m >= 1.5) return <span className="text-emerald-700 dark:text-emerald-400">💥 1.6x Super Effective</span>;
                  if (m <= 0.4) return <span className="text-rose-700 dark:text-rose-400">⛔ 0.39x Immunity</span>;
                  if (m <= 0.65) return <span className="text-amber-700 dark:text-amber-400">🛡️ 0.625x Not Very Effective</span>;
                  return <span className="text-slate-700 dark:text-slate-300">⚔️ 1.0x Normal Damage</span>;
                })()}
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto pb-4 max-h-[600px]">
            <table className="w-full text-center border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="p-2 sticky left-0 z-20 bg-slate-100 dark:bg-slate-950 border-b border-r border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 text-left min-w-[90px]">
                    ATK \ DEF
                  </th>
                  {POKEMON_TYPES.map((defType) => (
                    <th
                      key={`head-${defType}`}
                      className="p-1.5 border-b border-slate-200 dark:border-slate-800 min-w-[42px] max-w-[42px]"
                      title={defType}
                    >
                      <div className="w-full flex justify-center">
                        <TypeBadge type={defType} size="xs" showIcon={false} className="px-1 py-0.5 text-[9px]" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POKEMON_TYPES.map((atkType) => (
                  <tr key={`row-${atkType}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-1.5 sticky left-0 z-10 bg-slate-100 dark:bg-slate-950 border-r border-b border-slate-200 dark:border-slate-800 text-left">
                      <TypeBadge type={atkType} size="xs" showIcon={false} className="w-full justify-start text-[10px]" />
                    </td>
                    {POKEMON_TYPES.map((defType) => {
                      const mult = getDualTypeMultiplier(atkType, defType);
                      let cellClass = 'bg-slate-50/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400';
                      let displayStr = '-';

                      if (mult >= 1.5) {
                        cellClass = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800/40';
                        displayStr = '1.6';
                      } else if (mult <= 0.4) {
                        cellClass = 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800/50';
                        displayStr = '0.39';
                      } else if (mult <= 0.65) {
                        cellClass = 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-400 font-medium';
                        displayStr = '0.62';
                      }

                      return (
                        <td
                          key={`cell-${atkType}-${defType}`}
                          onMouseEnter={() => setHoveredMatrixCell({ atk: atkType, def: defType })}
                          onMouseLeave={() => setHoveredMatrixCell(null)}
                          className={`p-1.5 border border-slate-200 dark:border-slate-800/60 font-mono transition-colors cursor-pointer hover:ring-1 hover:ring-emerald-500 ${cellClass}`}
                        >
                          {displayStr}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
