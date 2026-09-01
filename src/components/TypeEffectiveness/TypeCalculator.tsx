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
  HelpCircle,
  Sparkles,
  Info,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
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
      {/* Header Banner */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl shadow-indigo-950/30">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest font-mono mb-1">
              <span className="w-1.5 h-3.5 bg-indigo-500 rounded-sm"></span>
              <Sparkles className="w-3.5 h-3.5" /> Pokémon GO Battle Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight font-mono">
              Type Effectiveness Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Hitung kelemahan & kekebalan elemen Pokémon dengan aturan rasio damage resmi Pokémon GO:
              <span className="text-indigo-300 font-semibold font-mono"> Super Effective (x1.6 / x2.56)</span>,
              <span className="text-cyan-300 font-semibold font-mono"> Not Very Effective (x0.625)</span>, dan
              <span className="text-emerald-300 font-semibold font-mono"> Immunity (x0.39 / x0.244)</span>.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-indigo-500/30 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setMode('defending')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'defending'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Bertahan (Defender)</span>
            </button>
            <button
              onClick={() => setMode('attacking')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'attacking'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Menyerang (Attacker)</span>
            </button>
            <button
              onClick={() => setMode('matrix')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Matriks 18x18</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: DEFENDER EFFECTIVENESS (Kalkulator Kelemahan Bos / Bertahan) */}
      {mode === 'defending' && (
        <div className="space-y-6">
          {/* Defender Type Selector Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  Pilih Elemen Bertahan (Defender)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pilih tipe tunggal atau kombinasi dual-type untuk menghitung total multiplier kelemahan
                </p>
              </div>

              {/* Active Selection Display */}
              <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-indigo-500/30">
                <span className="text-xs text-slate-400 font-mono">Kombinasi:</span>
                <TypeBadge type={primaryType} size="md" showIndonesian />
                {secondaryType && secondaryType !== primaryType && (
                  <>
                    <span className="text-slate-500">+</span>
                    <TypeBadge type={secondaryType} size="md" showIndonesian />
                  </>
                )}
                {secondaryType && (
                  <button
                    onClick={() => setSecondaryType(null)}
                    className="ml-2 text-slate-400 hover:text-rose-400 text-xs cursor-pointer"
                    title="Hapus tipe kedua"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Contoh Cepat Kombinasi Populer:
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setPrimaryType(p.t1);
                      setSecondaryType(p.t2);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer font-mono ${
                      primaryType === p.t1 && secondaryType === p.t2
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold shadow-md shadow-indigo-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Type 1 Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between font-mono">
                <span>Tipe Utama (Primary Type):</span>
                <span className="text-indigo-400 font-bold">{primaryType}</span>
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
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between font-mono">
                <span>Tipe Kedua (Secondary Type - Opsional):</span>
                <span className="text-cyan-400 font-bold">{secondaryType || 'Tidak ada (Tipe Tunggal)'}</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
                <button
                  type="button"
                  onClick={() => setSecondaryType(null)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer font-mono ${
                    secondaryType === null
                      ? 'bg-indigo-950 border-indigo-400 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
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
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Hasil Efektivitas Kerusakan (Damage Multipliers)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Double Super Effective (2.56x) */}
              {defenderResults.doubleWeakness.length > 0 && (
                <div className="p-4 rounded-xl border border-rose-600/60 bg-gradient-to-br from-rose-950/40 to-slate-900 space-y-3 shadow-lg shadow-rose-950/30 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-black bg-rose-600 text-white uppercase animate-pulse">
                        FATAL WEAKNESS (2.56x)
                      </span>
                      <span className="text-sm font-bold text-rose-300">
                        Double Super Effective
                      </span>
                    </div>
                    <span className="text-xs text-rose-300 font-mono">256% Damage</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Kombinasi elemen bertahan ini mengalami kelemahan ganda terhadap serangan tipe berikut:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {defenderResults.doubleWeakness.map((res) => (
                      <div key={res.attackType} className="flex items-center gap-1.5">
                        <TypeBadge type={res.attackType} size="md" showIndonesian />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Weakness (1.6x) */}
              <div className="p-4 rounded-xl border border-orange-500/40 bg-gradient-to-br from-orange-950/20 to-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-600 text-white uppercase">
                      WEAKNESS (1.6x)
                    </span>
                    <span className="text-sm font-bold text-orange-300">Super Effective</span>
                  </div>
                  <span className="text-xs text-orange-300 font-mono">160% Damage</span>
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
              <div className="p-4 rounded-xl border border-cyan-700/40 bg-gradient-to-br from-cyan-950/20 to-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-700 text-white uppercase">
                      RESIST (0.625x)
                    </span>
                    <span className="text-sm font-bold text-cyan-300">Not Very Effective</span>
                  </div>
                  <span className="text-xs text-cyan-300 font-mono">62.5% Damage</span>
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
              <div className="p-4 rounded-xl border border-teal-600/40 bg-gradient-to-br from-teal-950/20 to-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-600 text-white uppercase">
                      IMMUNITY / 2x RESIST (0.39x)
                    </span>
                    <span className="text-sm font-bold text-teal-300">Kekebalan PoGO</span>
                  </div>
                  <span className="text-xs text-teal-300 font-mono">39.0% Damage</span>
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
                <div className="p-4 rounded-xl border border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 to-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white uppercase">
                        TRIPLE RESIST (0.244x)
                      </span>
                      <span className="text-sm font-bold text-emerald-300">Kekebalan Maksimal</span>
                    </div>
                    <span className="text-xs text-emerald-300 font-mono">24.4% Damage</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {defenderResults.tripleResistance.map((res) => (
                      <TypeBadge key={res.attackType} type={res.attackType} size="sm" showIndonesian />
                    ))}
                  </div>
                </div>
              )}

              {/* Neutral Damage (1.0x) */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-700 text-white uppercase">
                      NEUTRAL (1.0x)
                    </span>
                    <span className="text-sm font-bold text-slate-300">Damage Normal</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">100% Damage</span>
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

      {/* MODE 2: ATTACKER EFFECTIVENESS (Menyerang) */}
      {mode === 'attacking' && (
        <div className="space-y-6">
          {/* Attacker Type Selector Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-400" />
                  Pilih Elemen Serangan (Attacker Move Type)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cari tahu tipe elemen target mana yang akan menerima damage maksimal dari jurus ini
                </p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Jurus Dipilih:</span>
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
            <div className="p-5 rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-950/20 to-slate-900 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white uppercase">
                    DAMAGE 1.6x (160%)
                  </span>
                  <h4 className="text-base font-bold text-emerald-300 mt-1">Super Effective</h4>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300">
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
            <div className="p-5 rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/20 to-slate-900 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-700 text-white uppercase">
                    DAMAGE 0.625x (62.5%)
                  </span>
                  <h4 className="text-base font-bold text-rose-300 mt-1">Not Very Effective</h4>
                </div>
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <p className="text-xs text-slate-300">
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

            {/* Immunity / Reduced Damage Against */}
            <div className="p-5 rounded-2xl border border-slate-700 bg-slate-900 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-700 text-white uppercase">
                    DAMAGE 0.39x (39.0%)
                  </span>
                  <h4 className="text-base font-bold text-slate-300 mt-1">Immunity in PoGO</h4>
                </div>
                <XCircle className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs text-slate-300">
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
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-amber-400" />
                Matriks Interaktif 18x18 Elemen Pokémon GO
              </h3>
              <p className="text-xs text-slate-400">
                Baris = Tipe Serangan (Attacker) | Kolom = Tipe Bertahan (Defender)
              </p>
            </div>

            {/* Matrix Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">1.6x (SE)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">1.0x</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-900 text-amber-200">0.625x (NVE)</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300">0.39x (IMM)</span>
            </div>
          </div>

          {/* Cell Hover Info Bar */}
          {hoveredMatrixCell && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Serangan:</span>
                <TypeBadge type={hoveredMatrixCell.atk} size="xs" />
                <span className="text-slate-400">vs Bertahan:</span>
                <TypeBadge type={hoveredMatrixCell.def} size="xs" />
              </div>
              <div className="font-mono font-bold">
                {(() => {
                  const m = getDualTypeMultiplier(hoveredMatrixCell.atk, hoveredMatrixCell.def);
                  if (m >= 1.5) return <span className="text-emerald-400">💥 1.6x Super Effective</span>;
                  if (m <= 0.4) return <span className="text-rose-400">⛔ 0.39x Immunity</span>;
                  if (m <= 0.65) return <span className="text-amber-400">🛡️ 0.625x Not Very Effective</span>;
                  return <span className="text-slate-300">⚔️ 1.0x Normal Damage</span>;
                })()}
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto pb-4 max-h-[600px]">
            <table className="w-full text-center border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="p-2 sticky left-0 z-20 bg-slate-950 border-b border-r border-slate-800 font-bold text-slate-400 text-left min-w-[90px]">
                    ATK \ DEF
                  </th>
                  {POKEMON_TYPES.map((defType) => (
                    <th
                      key={`head-${defType}`}
                      className="p-1.5 border-b border-slate-800 min-w-[42px] max-w-[42px]"
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
                  <tr key={`row-${atkType}`} className="hover:bg-slate-800/30">
                    <td className="p-1.5 sticky left-0 z-10 bg-slate-950 border-r border-b border-slate-800 text-left">
                      <TypeBadge type={atkType} size="xs" showIcon={false} className="w-full justify-start text-[10px]" />
                    </td>
                    {POKEMON_TYPES.map((defType) => {
                      const mult = getDualTypeMultiplier(atkType, defType);
                      let cellClass = 'bg-slate-900/40 text-slate-500';
                      let displayStr = '-';

                      if (mult >= 1.5) {
                        cellClass = 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/40';
                        displayStr = '1.6';
                      } else if (mult <= 0.4) {
                        cellClass = 'bg-rose-950/80 text-rose-300 font-bold border border-rose-800/50';
                        displayStr = '0.39';
                      } else if (mult <= 0.65) {
                        cellClass = 'bg-amber-950/40 text-amber-400 font-medium';
                        displayStr = '0.62';
                      }

                      return (
                        <td
                          key={`cell-${atkType}-${defType}`}
                          onMouseEnter={() => setHoveredMatrixCell({ atk: atkType, def: defType })}
                          onMouseLeave={() => setHoveredMatrixCell(null)}
                          className={`p-1.5 border border-slate-800/60 font-mono transition-colors cursor-pointer hover:ring-1 hover:ring-amber-400 ${cellClass}`}
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
