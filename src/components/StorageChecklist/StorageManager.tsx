import React, { useState, useEffect, useRef } from 'react';
import { StoragePokemon, RoleTag, PokemonType } from '../../types/pokemon';
import { POPULAR_POKEMON_LIST, searchPokemonCatalog, findPokemonByNameOrDex } from '../../data/pokemonList';
import {
  getMovesetSuggestions,
  TYPE_FAST_MOVES,
  TYPE_CHARGED_MOVES,
  TYPE_EMOJI_MAP,
  getMoveType,
} from '../../data/pokemonMoves';
import { POKEMON_TYPES } from '../../data/pokemonTypes';
import { TypeBadge } from '../common/TypeBadge';
import { MoveBadge } from '../common/MoveBadge';
import confetti from 'canvas-confetti';
import {
  PackageCheck,
  Plus,
  Sparkles,
  Search,
  Download,
  Upload,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  ArrowUpDown,
  Smartphone,
  Copy,
  Info,
  Zap,
  Swords,
  Shield,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STORAGE_KEY = 'pokego_master_storage_v1';

const ROLE_OPTIONS: { role: RoleTag; label: string; icon: string; color: string }[] = [
  { role: 'Raid Attacker', label: 'Raid Attacker', icon: '⚔️', color: 'bg-rose-950/80 text-rose-300 border-rose-700' },
  { role: 'Gym Defender', label: 'Gym Defender', icon: '🛡️', color: 'bg-blue-950/80 text-blue-300 border-blue-700' },
  { role: 'PvP Great League', label: 'PvP GL (1500)', icon: '🏆', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700' },
  { role: 'PvP Ultra League', label: 'PvP UL (2500)', icon: '🥇', color: 'bg-amber-950/80 text-amber-300 border-amber-700' },
  { role: 'PvP Master League', label: 'PvP ML (Open)', icon: '👑', color: 'bg-purple-950/80 text-purple-300 border-purple-700' },
  { role: 'Mega Evolver', label: 'Mega Evolver', icon: '⚡', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-700' },
  { role: 'Rocket Buster', label: 'Rocket Buster', icon: '🚀', color: 'bg-violet-950/80 text-violet-300 border-violet-700' },
  { role: 'Trophy', label: 'Trophy / Koleksi', icon: '✨', color: 'bg-yellow-950/80 text-yellow-300 border-yellow-700' },
];

const INITIAL_SAMPLE_STORAGE: StoragePokemon[] = [
  {
    id: 'sample-1',
    name: 'Rayquaza',
    dexNumber: 384,
    cp: 4333,
    isHundo: true,
    isShiny: true,
    isLucky: true,
    types: ['Dragon', 'Flying'],
    roles: ['Raid Attacker', 'Mega Evolver', 'PvP Master League'],
    fastMove: 'Dragon Tail',
    chargedMoves: ['Dragon Ascent', 'Breaking Swipe'],
    notes: 'Shundo 100% IV hasil Lucky Trade! Mega Evolution andalan raid.',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'sample-2',
    name: 'Mewtwo',
    dexNumber: 150,
    cp: 4178,
    isHundo: true,
    isShiny: false,
    isShadow: true,
    types: ['Psychic'],
    roles: ['Raid Attacker', 'PvP Master League'],
    fastMove: 'Psycho Cut',
    chargedMoves: ['Psystrike', 'Shadow Ball'],
    notes: 'Shadow Mewtwo IV 100% maxed out level 50!',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'sample-3',
    name: 'Lucario',
    dexNumber: 448,
    cp: 3056,
    isHundo: true,
    isShiny: true,
    types: ['Fighting', 'Steel'],
    roles: ['Raid Attacker', 'Mega Evolver', 'Rocket Buster'],
    fastMove: 'Force Palm',
    chargedMoves: ['Aura Sphere', 'Shadow Ball'],
    notes: 'Mega Lucario siap menghajar raid Tier 5 Normal, Rock, Ice, Dark, Steel.',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'sample-4',
    name: 'Blissey',
    dexNumber: 242,
    cp: 2759,
    isHundo: true,
    isShiny: false,
    types: ['Normal'],
    roles: ['Gym Defender'],
    fastMove: 'Zen Headbutt',
    chargedMoves: ['Dazzling Gleam', 'Hyper Beam'],
    notes: 'Gym Defender terkuat no. 1 di Pokémon GO.',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/242.png',
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'sample-5',
    name: 'Swampert',
    dexNumber: 260,
    cp: 2490,
    isHundo: true,
    isShiny: true,
    types: ['Water', 'Ground'],
    roles: ['PvP Ultra League', 'Raid Attacker', 'Mega Evolver'],
    fastMove: 'Mud Shot',
    chargedMoves: ['Hydro Cannon', 'Earthquake'],
    notes: 'Ultra League beast dengan spamming Hydro Cannon sangat cepat.',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/260.png',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'sample-6',
    name: 'Charizard',
    dexNumber: 6,
    cp: 3266,
    isHundo: false,
    isShiny: true,
    types: ['Fire', 'Flying'],
    roles: ['Mega Evolver', 'Raid Attacker'],
    fastMove: 'Fire Spin',
    chargedMoves: ['Blast Burn', 'Dragon Claw'],
    notes: 'Black Shiny Charizard favorit.',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    createdAt: Date.now() - 86400000 * 1,
  },
];

interface StorageManagerProps {
  onUpdateStats?: (stats: { total: number; hundos: number; shinies: number; shundos: number }) => void;
}

export const StorageManager: React.FC<StorageManagerProps> = ({ onUpdateStats }) => {
  const [items, setItems] = useState<StoragePokemon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load storage from localStorage', e);
    }
    return INITIAL_SAMPLE_STORAGE;
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoragePokemon | null>(null);

  // Form State
  const [formSearch, setFormSearch] = useState('');
  const [formName, setFormName] = useState('');
  const [formDex, setFormDex] = useState<number>(384);
  const [formTypes, setFormTypes] = useState<PokemonType[]>(['Dragon', 'Flying']);
  const [formCp, setFormCp] = useState<string>('');
  const [formIsHundo, setFormIsHundo] = useState(true);
  const [formIsShiny, setFormIsShiny] = useState(false);
  const [formIsLucky, setFormIsLucky] = useState(false);
  const [formIsShadow, setFormIsShadow] = useState(false);
  const [formRoles, setFormRoles] = useState<RoleTag[]>(['Raid Attacker']);
  const [formFastMove, setFormFastMove] = useState('');
  const [formChargedMove1, setFormChargedMove1] = useState('');
  const [formChargedMove2, setFormChargedMove2] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState(POPULAR_POKEMON_LIST.slice(0, 6));

  // Sync / Transfer State
  const [syncJsonInput, setSyncJsonInput] = useState('');
  const [copiedSync, setCopiedSync] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  // Move Catalog Browser State in Modal
  const [isMoveCatalogOpen, setIsMoveCatalogOpen] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState<'Fast' | 'Charged'>('Fast');
  const [catalogTypeFilter, setCatalogTypeFilter] = useState<PokemonType | 'all'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'hundo' | 'shiny' | 'shundo' | 'lucky' | 'shadow'>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'cp' | 'dex' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const onUpdateStatsRef = useRef(onUpdateStats);
  useEffect(() => {
    onUpdateStatsRef.current = onUpdateStats;
  }, [onUpdateStats]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    if (onUpdateStatsRef.current) {
      const hundos = items.filter((i) => i.isHundo).length;
      const shinies = items.filter((i) => i.isShiny).length;
      const shundos = items.filter((i) => i.isHundo && i.isShiny).length;
      onUpdateStatsRef.current({ total: items.length, hundos, shinies, shundos });
    }
  }, [items]);

  // Handle Autocomplete in modal form
  useEffect(() => {
    if (formSearch) {
      setAutocompleteSuggestions(searchPokemonCatalog(formSearch, 6));
    } else {
      setAutocompleteSuggestions(POPULAR_POKEMON_LIST.slice(0, 6));
    }
  }, [formSearch]);

  // Get dynamic move recommendations based on selected form name and types
  const moveSuggestions = getMovesetSuggestions(formName, formTypes);

  const openAddModal = () => {
    setEditingItem(null);
    setFormSearch('');
    setFormName('Rayquaza');
    setFormDex(384);
    setFormTypes(['Dragon', 'Flying']);
    setFormCp('');
    setFormIsHundo(true);
    setFormIsShiny(false);
    setFormIsLucky(false);
    setFormIsShadow(false);
    setFormRoles(['Raid Attacker']);
    setFormFastMove('Dragon Tail');
    setFormChargedMove1('Dragon Ascent');
    setFormChargedMove2('Breaking Swipe');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: StoragePokemon) => {
    setEditingItem(item);
    setFormSearch(item.name);
    setFormName(item.name);
    setFormDex(item.dexNumber);
    setFormTypes(item.types);
    setFormCp(item.cp ? item.cp.toString() : '');
    setFormIsHundo(item.isHundo);
    setFormIsShiny(item.isShiny);
    setFormIsLucky(item.isLucky || false);
    setFormIsShadow(item.isShadow || false);
    setFormRoles(item.roles || []);
    setFormFastMove(item.fastMove || '');
    setFormChargedMove1(item.chargedMoves?.[0] || '');
    setFormChargedMove2(item.chargedMoves?.[1] || '');
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSelectCatalogPokemon = (p: typeof POPULAR_POKEMON_LIST[0]) => {
    setFormName(p.name);
    setFormDex(p.dex);
    setFormTypes(p.types);
    setFormSearch(p.name);

    // Auto-populate recommended moves for this Pokemon
    const rec = getMovesetSuggestions(p.name, p.types);
    if (rec.recommendedRaid) {
      setFormFastMove(rec.recommendedRaid.fast);
      setFormChargedMove1(rec.recommendedRaid.charged[0] || '');
      setFormChargedMove2(rec.recommendedRaid.charged[1] || '');
    } else {
      setFormFastMove(rec.fastMoves[0] || '');
      setFormChargedMove1(rec.chargedMoves[0] || '');
      setFormChargedMove2(rec.chargedMoves[1] || '');
    }
  };

  const handleApplyRaidMoveset = () => {
    if (moveSuggestions.recommendedRaid) {
      setFormFastMove(moveSuggestions.recommendedRaid.fast);
      setFormChargedMove1(moveSuggestions.recommendedRaid.charged[0] || '');
      setFormChargedMove2(moveSuggestions.recommendedRaid.charged[1] || '');
    }
  };

  const handleApplyPvpMoveset = () => {
    if (moveSuggestions.recommendedPvp) {
      setFormFastMove(moveSuggestions.recommendedPvp.fast);
      setFormChargedMove1(moveSuggestions.recommendedPvp.charged[0] || '');
      setFormChargedMove2(moveSuggestions.recommendedPvp.charged[1] || '');
    }
  };

  const handleSavePokemon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${formDex}.png`;
    const chargedArray = [formChargedMove1.trim(), formChargedMove2.trim()].filter(Boolean);

    const itemData: StoragePokemon = {
      id: editingItem ? editingItem.id : `poke-${Date.now()}`,
      name: formName.trim(),
      dexNumber: formDex,
      cp: formCp ? parseInt(formCp, 10) : undefined,
      isHundo: formIsHundo,
      isShiny: formIsShiny,
      isLucky: formIsLucky,
      isShadow: formIsShadow,
      types: formTypes,
      roles: formRoles,
      fastMove: formFastMove.trim() || undefined,
      chargedMoves: chargedArray.length > 0 ? chargedArray : undefined,
      notes: formNotes.trim() || undefined,
      spriteUrl,
      createdAt: editingItem ? editingItem.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    if (editingItem) {
      setItems((prev) => prev.map((item) => (item.id === editingItem.id ? itemData : item)));
    } else {
      setItems((prev) => [itemData, ...prev]);

      // Confetti celebration if Shundo or Hundo or Shiny!
      if (formIsHundo && formIsShiny) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF4500', '#00FFFF', '#FF1493'],
        });
      } else if (formIsHundo || formIsShiny) {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
        });
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Hapus Pokémon ini dari inventory checklist?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleToggleRole = (role: RoleTag) => {
    if (formRoles.includes(role)) {
      setFormRoles((prev) => prev.filter((r) => r !== role));
    } else {
      setFormRoles((prev) => [...prev, role]);
    }
  };

  // Export JSON File
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pokego_inventory_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy sync string to clipboard for transfer to second device
  const handleCopySyncCode = () => {
    const jsonStr = JSON.stringify(items);
    navigator.clipboard.writeText(jsonStr);
    setCopiedSync(true);
    setSyncStatusMsg('Kode Data Inventory berhasil disalin ke clipboard! Siap dipaste di HP kedua Anda.');
    setTimeout(() => setCopiedSync(false), 3000);
  };

  // Import JSON via Paste Text
  const handleImportPastedCode = (mode: 'replace' | 'merge') => {
    if (!syncJsonInput.trim()) {
      setSyncStatusMsg('Silakan tempelkan kode data JSON terlebih dahulu.');
      return;
    }
    try {
      const parsed = JSON.parse(syncJsonInput.trim());
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (mode === 'replace') {
          setItems(parsed);
          setSyncStatusMsg(`Berhasil menimpa data dengan ${parsed.length} Pokémon!`);
        } else {
          // Merge: add items that don't exist by id or name+dex
          setItems((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newItems = parsed.filter((p: StoragePokemon) => !existingIds.has(p.id));
            return [...prev, ...newItems];
          });
          setSyncStatusMsg(`Berhasil menggabungkan data baru ke inventory!`);
        }
        setSyncJsonInput('');
      } else {
        setSyncStatusMsg('Format kode data JSON tidak valid (harus array list Pokémon).');
      }
    } catch (e) {
      setSyncStatusMsg('Gagal memproses kode data. Pastikan format teks JSON lengkap.');
    }
  };

  // Import JSON via File Upload
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setItems(parsed);
            alert(`Berhasil mengimpor ${parsed.length} Pokémon ke inventory!`);
          } else {
            alert('Format file JSON tidak valid.');
          }
        } catch (err) {
          alert('Gagal membaca file JSON.');
        }
      };
    }
  };

  // Reset to Sample Data
  const handleResetSample = () => {
    if (window.confirm('Muat ulang data contoh starter pack Pokémon IV 100% & Shiny?')) {
      setItems(INITIAL_SAMPLE_STORAGE);
    }
  };

  // Filtering & Sorting logic
  const filteredItems = items
    .filter((item) => {
      // Search
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dexNumber.toString().includes(searchQuery) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fastMove?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chargedMoves?.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      // Category filter
      if (filterCategory === 'hundo' && !item.isHundo) return false;
      if (filterCategory === 'shiny' && !item.isShiny) return false;
      if (filterCategory === 'shundo' && (!item.isHundo || !item.isShiny)) return false;
      if (filterCategory === 'lucky' && !item.isLucky) return false;
      if (filterCategory === 'shadow' && !item.isShadow) return false;

      // Role filter
      if (selectedRoleFilter !== 'all' && !item.roles.includes(selectedRoleFilter as RoleTag)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comp = 0;
      if (sortBy === 'date') {
        comp = (b.createdAt || 0) - (a.createdAt || 0);
      } else if (sortBy === 'cp') {
        comp = (b.cp || 0) - (a.cp || 0);
      } else if (sortBy === 'dex') {
        comp = a.dexNumber - b.dexNumber;
      } else if (sortBy === 'name') {
        comp = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? -comp : comp;
    });

  const totalHundos = items.filter((i) => i.isHundo).length;
  const totalShinies = items.filter((i) => i.isShiny).length;
  const totalShundos = items.filter((i) => i.isHundo && i.isShiny).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Stats Overview */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl shadow-indigo-950/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest font-mono mb-1">
              <span className="w-1.5 h-3.5 bg-indigo-500 rounded-sm"></span>
              <PackageCheck className="w-3.5 h-3.5" /> Personal Collection Inventory
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight font-mono">
              My Storage Checklist
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Checklist pencatatan Pokémon IV 100% (4★ Hundo), Shiny ✨, Lucky, dan Shadow dengan set jurus & peran raid/PvP.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(79,70,229,0.35)] transition cursor-pointer font-mono uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah Pokémon</span>
            </button>

            {/* Sync & Backup 2 Devices Modal Trigger */}
            <button
              onClick={() => {
                setSyncStatusMsg('');
                setIsSyncModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-bold text-indigo-300 hover:text-white transition cursor-pointer font-mono"
              title="Sinkronisasi ke HP Lain & Backup"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sync 2 Perangkat & Backup</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-indigo-500/30 text-xs font-semibold text-slate-300 hover:text-indigo-300 transition cursor-pointer font-mono"
              title="Ekspor Data ke File JSON"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Ekspor JSON</span>
            </button>

            <label
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-indigo-500/30 text-xs font-semibold text-slate-300 hover:text-indigo-300 transition cursor-pointer font-mono"
              title="Impor Data dari File JSON"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Impor File</span>
              <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
            </label>

            <button
              onClick={handleResetSample}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Muat Ulang Contoh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3 border-t border-indigo-500/20">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-indigo-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-base">📦</div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Total Koleksi</div>
              <div className="text-lg font-black text-slate-100 font-mono">{items.length}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-amber-500/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-base">💯</div>
            <div>
              <div className="text-[10px] text-amber-300/80 font-medium font-mono uppercase tracking-wider">Hundo (IV 100%)</div>
              <div className="text-lg font-black text-amber-400 font-mono">{totalHundos}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-cyan-500/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-base">✨</div>
            <div>
              <div className="text-[10px] text-cyan-300/80 font-medium font-mono uppercase tracking-wider">Shiny Pokémon</div>
              <div className="text-lg font-black text-cyan-400 font-mono">{totalShinies}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-rose-500/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 font-bold text-base">👑</div>
            <div>
              <div className="text-[10px] text-rose-300/80 font-medium font-mono uppercase tracking-wider">Shundo (Shiny 100%)</div>
              <div className="text-lg font-black text-rose-400 font-mono">{totalShundos}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama Pokémon, No. Dex (#1 s/d #1028), move, atau catatan..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
            >
              <option value="date">Urutkan: Baru Ditambahkan</option>
              <option value="cp">Urutkan: CP Tertinggi</option>
              <option value="dex">Urutkan: No. Pokédex</option>
              <option value="name">Urutkan: Nama A-Z</option>
            </select>
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Balik Urutan"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer font-mono ${
              filterCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Semua ({items.length})
          </button>

          <button
            onClick={() => setFilterCategory('hundo')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer font-mono ${
              filterCategory === 'hundo'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-300'
            }`}
          >
            💯 IV 100% (4★)
          </button>

          <button
            onClick={() => setFilterCategory('shiny')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer font-mono ${
              filterCategory === 'shiny'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-cyan-300'
            }`}
          >
            ✨ Shiny
          </button>

          <button
            onClick={() => setFilterCategory('shundo')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer font-mono ${
              filterCategory === 'shundo'
                ? 'bg-rose-600 text-white border-rose-500 font-bold animate-pulse'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-400'
            }`}
          >
            👑 Shundo (Shiny + 100%)
          </button>

          {/* Role Filter Dropdown */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">Role:</span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer font-mono"
            >
              <option value="all">Semua Peran</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.icon} {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-bold text-slate-200">Tidak ada Pokémon yang cocok</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian (nama, nomor dex 1-1028) atau bersihkan filter yang aktif.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
              setSelectedRoleFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-md space-y-3"
            >
              {/* Card Header: Sprite + Name + Tags */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Sprite Box */}
                  <div className="relative w-16 h-16 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center p-1 overflow-hidden group-hover:scale-105 transition-transform">
                    {item.isShiny && (
                      <div className="absolute top-1 left-1 text-cyan-400 animate-bounce">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {item.isHundo && (
                      <div className="absolute bottom-1 right-1 px-1 rounded bg-amber-500 text-[8px] font-black text-slate-950">
                        100%
                      </div>
                    )}
                    <img
                      src={
                        item.spriteUrl ||
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.dexNumber}.png`
                      }
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain drop-shadow-md"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-black text-slate-100 tracking-tight font-mono">
                        {item.name}
                      </h4>
                      {item.isShiny && (
                        <span className="text-cyan-400 text-xs" title="Shiny">
                          ✨
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <span>#{String(item.dexNumber).padStart(3, '0')}</span>
                      {item.cp && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-amber-400 font-bold">CP {item.cp}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition cursor-pointer"
                    title="Edit data Pokémon & Moveset"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                    title="Hapus dari checklist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Badges: Types + Hundo / Shiny / Lucky / Shadow */}
              <div className="flex flex-wrap items-center gap-1.5">
                {item.types.map((t) => (
                  <TypeBadge key={t} type={t} size="xs" />
                ))}

                {item.isHundo && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    💯 IV 100 (4★)
                  </span>
                )}

                {item.isShiny && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    ✨ Shiny
                  </span>
                )}

                {item.isLucky && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                    🍀 Lucky
                  </span>
                )}

                {item.isShadow && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/30 text-purple-300 border border-purple-700/50">
                    🔥 Shadow
                  </span>
                )}
              </div>

              {/* Roles Tags */}
              {item.roles && item.roles.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/60">
                  {item.roles.map((r) => {
                    const opt = ROLE_OPTIONS.find((ro) => ro.role === r);
                    return (
                      <span
                        key={r}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                          opt?.color || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <span>{opt?.icon}</span>
                        <span>{opt?.label || r}</span>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Moveset Info with Element Type Logos & Badges */}
              {(item.fastMove || (item.chargedMoves && item.chargedMoves.length > 0)) && (
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-[11px] space-y-1.5 font-mono">
                  {item.fastMove && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fast:</span>
                      <MoveBadge moveName={item.fastMove} category="Fast" size="xs" />
                    </div>
                  )}
                  {item.chargedMoves && item.chargedMoves.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Charged:</span>
                      {item.chargedMoves.map((m, idx) => (
                        <MoveBadge key={`${m}-${idx}`} moveName={m} category="Charged" size="xs" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <p className="text-[11px] text-slate-400 italic bg-slate-950/30 p-1.5 rounded line-clamp-2">
                  "{item.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sync 2 Perangkat & Backup Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                Sinkronisasi Antar 2 Perangkat & Backup Data
              </h3>
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* FAQ & Transparency Box */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-300 text-xs font-mono">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Bagaimana Data Disimpan & Apakah Akan Hilang?
                </div>
                <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <p>
                    <strong>A. Hanya di HP ini?</strong> Ya, data tersimpan secara lokal dan privat di memori peramban (<strong>LocalStorage</strong>) HP Anda tanpa pihak ketiga.
                  </p>
                  <p>
                    <strong>B. Jika aplikasi terupdate, apakah list hilang?</strong> <span className="text-emerald-400 font-bold">TIDAK AKAN HILANG.</span> Pembaruan sistem atau web tidak menghapus data Anda. Data hanya hilang jika Anda sengaja melakukan <em>Clear Cache / Hapus Data Situs</em> di browser.
                  </p>
                  <p>
                    <strong>C. Cara Sync ke HP kedua:</strong> Cukup klik <strong>"Salin Kode Sync"</strong> di bawah, lalu buka aplikasi ini di HP kedua dan <strong>"Tempel & Terapkan"</strong>.
                  </p>
                </div>
              </div>

              {/* Status Message */}
              {syncStatusMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{syncStatusMsg}</span>
                </div>
              )}

              {/* Step 1: Export / Copy */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-black">1</span>
                    Salin Data Dari HP Ini (Untuk Dipindah):
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{items.length} Pokémon</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopySyncCode}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition cursor-pointer font-mono"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedSync ? '✅ Tersalin ke Clipboard!' : 'Salin Kode Sync (Clipboard)'}</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer font-mono"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>Download File .JSON</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Import / Paste on 2nd Device */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black">2</span>
                  Tempelkan Data di HP Kedua (Impor):
                </div>

                <textarea
                  value={syncJsonInput}
                  onChange={(e) => setSyncJsonInput(e.target.value)}
                  placeholder='Tempelkan kode JSON data Pokémon di sini (contoh: [{"name": "Rayquaza", ...}])'
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-400"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleImportPastedCode('replace')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer font-mono"
                  >
                    Terapkan (Timpa Semua Data)
                  </button>

                  <button
                    onClick={() => handleImportPastedCode('merge')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer font-mono"
                  >
                    Gabungkan (Merge dengan Data Saat Ini)
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/95 flex justify-end">
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                <PackageCheck className="w-5 h-5 text-cyan-400" />
                {editingItem ? 'Edit Data Pokémon & Moveset' : 'Tambah Pokémon ke Checklist'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePokemon} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Quick Search Autocomplete */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Cari Nama Pokémon / No. Pokédex (#1 s/d #1028):
                </label>
                <input
                  type="text"
                  value={formSearch}
                  onChange={(e) => {
                    setFormSearch(e.target.value);
                    setFormName(e.target.value);
                    const matched = findPokemonByNameOrDex(e.target.value);
                    if (matched) {
                      setFormDex(matched.dex);
                      setFormTypes(matched.types);
                    }
                  }}
                  placeholder="Ketik nama atau No. Pokédex (contoh: Rayquaza, Lucario, #1025 Pecharunt...)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />

                {/* Suggestions List */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 self-center font-mono">Saran Cepat:</span>
                  {autocompleteSuggestions.map((p) => (
                    <button
                      key={p.dex}
                      type="button"
                      onClick={() => handleSelectCatalogPokemon(p)}
                      className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 transition cursor-pointer font-mono flex items-center gap-1"
                    >
                      <span>#{p.dex}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row: CP & Dex */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono">Combat Power (CP):</label>
                  <input
                    type="number"
                    value={formCp}
                    onChange={(e) => setFormCp(e.target.value)}
                    placeholder="Contoh: 4178"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono">No. Pokédex (1 - 1028):</label>
                  <input
                    type="number"
                    min={1}
                    max={1028}
                    value={formDex}
                    onChange={(e) => {
                      const d = parseInt(e.target.value, 10) || 1;
                      setFormDex(d);
                      const matched = findPokemonByNameOrDex(d.toString());
                      if (matched) {
                        setFormName(matched.name);
                        setFormTypes(matched.types);
                      }
                    }}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Status Checkboxes: IV 100, Shiny, Lucky, Shadow */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Status & Atribut Spesial:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      formIsHundo
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formIsHundo}
                      onChange={(e) => setFormIsHundo(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>💯 IV 100% (4★)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      formIsShiny
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formIsShiny}
                      onChange={(e) => setFormIsShiny(e.target.checked)}
                      className="rounded accent-cyan-500"
                    />
                    <span>✨ Shiny</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      formIsLucky
                        ? 'bg-yellow-950/60 border-yellow-500 text-yellow-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formIsLucky}
                      onChange={(e) => setFormIsLucky(e.target.checked)}
                      className="rounded accent-yellow-500"
                    />
                    <span>🍀 Lucky</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      formIsShadow
                        ? 'bg-purple-950/60 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formIsShadow}
                      onChange={(e) => setFormIsShadow(e.target.checked)}
                      className="rounded accent-purple-500"
                    />
                    <span>🔥 Shadow</span>
                  </label>
                </div>
              </div>

              {/* Quick Meta Moveset Recommendation Auto-fill Bar */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950/60 border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 font-mono">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Saran & Rekomendasi Jurus ({formName}):
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">1-Klik Terapkan</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {moveSuggestions.recommendedRaid && (
                    <button
                      type="button"
                      onClick={handleApplyRaidMoveset}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/80 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Swords className="w-3.5 h-3.5 text-rose-400" />
                      <span>Raid Set: {moveSuggestions.recommendedRaid.fast} + {moveSuggestions.recommendedRaid.charged.join('/')}</span>
                    </button>
                  )}

                  {moveSuggestions.recommendedPvp && (
                    <button
                      type="button"
                      onClick={handleApplyPvpMoveset}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>PvP Set: {moveSuggestions.recommendedPvp.fast} + {moveSuggestions.recommendedPvp.charged.join('/')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Fast Move with 1-Click Type Badges + Categorized Dropdown */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                    <span>⚡ Fast Move:</span>
                    {formFastMove && (
                      <MoveBadge moveName={formFastMove} category="Fast" size="xs" />
                    )}
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Pilih chip, dropdown, atau ketik</span>
                </div>

                {/* 1-Click Fast Move Chips with Elemental Type Logos */}
                {moveSuggestions.fastMoves.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono block">Jurus Cepat Populer:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {moveSuggestions.fastMoves.map((m) => (
                        <MoveBadge
                          key={`chip-fast-${m}`}
                          moveName={m}
                          category="Fast"
                          size="xs"
                          selected={formFastMove === m}
                          onClick={() => setFormFastMove(m)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <select
                    value={formFastMove}
                    onChange={(e) => setFormFastMove(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                  >
                    <option value="">-- Pilih Fast Move ({formName || 'Pokémon'}) --</option>
                    <optgroup label={`⭐ Rekomendasi Jurus ${formName || 'Pokémon'}`}>
                      {moveSuggestions.fastMoves.map((m) => {
                        const mType = getMoveType(m);
                        return (
                          <option key={`opt-rec-fast-${m}`} value={m}>
                            {TYPE_EMOJI_MAP[mType] || '⚡'} [{mType}] {m}
                          </option>
                        );
                      })}
                    </optgroup>
                    {POKEMON_TYPES.map((t) => {
                      const movesInType = TYPE_FAST_MOVES[t] || [];
                      if (movesInType.length === 0) return null;
                      return (
                        <optgroup key={`optgroup-fast-${t}`} label={`${TYPE_EMOJI_MAP[t]} Tipe ${t} (${movesInType.length} jurus)`}>
                          {movesInType.map((m) => (
                            <option key={`opt-all-fast-${t}-${m}`} value={m}>
                              {TYPE_EMOJI_MAP[t]} {m}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>

                  <input
                    type="text"
                    value={formFastMove}
                    onChange={(e) => setFormFastMove(e.target.value)}
                    placeholder="Atau ketik jurus kustom..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Charged Moves with 1-Click Type Badges + Categorized Dropdowns */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                    <span>💥 Charged Moves (Jurus Charge):</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Pilih chip rekomendasi atau dropdown</span>
                </div>

                {/* 1-Click Charged Move Chips with Elemental Type Logos */}
                {moveSuggestions.chargedMoves.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono block">Jurus Charge Populer ({formName}):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {moveSuggestions.chargedMoves.map((m) => (
                        <MoveBadge
                          key={`chip-ch-${m}`}
                          moveName={m}
                          category="Charged"
                          size="xs"
                          selected={formChargedMove1 === m || formChargedMove2 === m}
                          onClick={() => {
                            if (!formChargedMove1) {
                              setFormChargedMove1(m);
                            } else if (formChargedMove1 === m) {
                              // toggle off or do nothing
                            } else if (!formChargedMove2) {
                              setFormChargedMove2(m);
                            } else {
                              // Replace move 1 or 2
                              setFormChargedMove1(m);
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-300 font-mono">Charged Move #1:</label>
                      {formChargedMove1 && <MoveBadge moveName={formChargedMove1} category="Charged" size="xs" />}
                    </div>
                    <select
                      value={formChargedMove1}
                      onChange={(e) => setFormChargedMove1(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
                    >
                      <option value="">-- Pilih Charged Move 1 --</option>
                      <optgroup label={`⭐ Rekomendasi Jurus ${formName || 'Pokémon'}`}>
                        {moveSuggestions.chargedMoves.map((m) => {
                          const mType = getMoveType(m);
                          return (
                            <option key={`opt-rec-ch1-${m}`} value={m}>
                              {TYPE_EMOJI_MAP[mType] || '💥'} [{mType}] {m}
                            </option>
                          );
                        })}
                      </optgroup>
                      {POKEMON_TYPES.map((t) => {
                        const movesInType = TYPE_CHARGED_MOVES[t] || [];
                        if (movesInType.length === 0) return null;
                        return (
                          <optgroup key={`optgroup-ch1-${t}`} label={`${TYPE_EMOJI_MAP[t]} Tipe ${t} (${movesInType.length} jurus)`}>
                            {movesInType.map((m) => (
                              <option key={`opt-all-ch1-${t}-${m}`} value={m}>
                                {TYPE_EMOJI_MAP[t]} {m}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                    <input
                      type="text"
                      value={formChargedMove1}
                      onChange={(e) => setFormChargedMove1(e.target.value)}
                      placeholder="Ketik manual jurus 1..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-300 font-mono">Charged Move #2 (Opsional):</label>
                      {formChargedMove2 && <MoveBadge moveName={formChargedMove2} category="Charged" size="xs" />}
                    </div>
                    <select
                      value={formChargedMove2}
                      onChange={(e) => setFormChargedMove2(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
                    >
                      <option value="">-- Pilih Charged Move 2 (Kosongkan bila 1 move) --</option>
                      <optgroup label={`⭐ Rekomendasi Jurus ${formName || 'Pokémon'}`}>
                        {moveSuggestions.chargedMoves.map((m) => {
                          const mType = getMoveType(m);
                          return (
                            <option key={`opt-rec-ch2-${m}`} value={m}>
                              {TYPE_EMOJI_MAP[mType] || '💥'} [{mType}] {m}
                            </option>
                          );
                        })}
                      </optgroup>
                      {POKEMON_TYPES.map((t) => {
                        const movesInType = TYPE_CHARGED_MOVES[t] || [];
                        if (movesInType.length === 0) return null;
                        return (
                          <optgroup key={`optgroup-ch2-${t}`} label={`${TYPE_EMOJI_MAP[t]} Tipe ${t} (${movesInType.length} jurus)`}>
                            {movesInType.map((m) => (
                              <option key={`opt-all-ch2-${t}-${m}`} value={m}>
                                {TYPE_EMOJI_MAP[t]} {m}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                    <input
                      type="text"
                      value={formChargedMove2}
                      onChange={(e) => setFormChargedMove2(e.target.value)}
                      placeholder="Ketik manual jurus 2..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Expandable 18-Type Complete Move Catalog Explorer */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
                <button
                  type="button"
                  onClick={() => setIsMoveCatalogOpen(!isMoveCatalogOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Katalog Semua Jurus Pokémon GO (18 Tipe Elemen)</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span>{isMoveCatalogOpen ? 'Sembunyikan' : 'Buka & Pilih Elemen'}</span>
                    {isMoveCatalogOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isMoveCatalogOpen && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    {/* Category Selector (Fast vs Charged) */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCatalogCategory('Fast')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          catalogCategory === 'Fast'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ⚡ Fast Moves
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatalogCategory('Charged')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          catalogCategory === 'Charged'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        💥 Charged Moves
                      </button>

                      {/* Search box for moves */}
                      <div className="flex-1 ml-2">
                        <input
                          type="text"
                          value={catalogSearch}
                          onChange={(e) => setCatalogSearch(e.target.value)}
                          placeholder="Cari nama jurus (cth: Yawn, Hydro, Blast)..."
                          className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* 18 Element Type Filter Tabs */}
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setCatalogTypeFilter('all')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                          catalogTypeFilter === 'all'
                            ? 'bg-slate-200 text-slate-900'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Semua Tipe
                      </button>
                      {POKEMON_TYPES.map((t) => (
                        <button
                          key={`cat-filter-${t}`}
                          type="button"
                          onClick={() => setCatalogTypeFilter(t)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition flex items-center gap-1 ${
                            catalogTypeFilter === t
                              ? 'bg-cyan-500 text-slate-950 font-black'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>{TYPE_EMOJI_MAP[t]}</span>
                          <span>{t}</span>
                        </button>
                      ))}
                    </div>

                    {/* Move Grid Display with 1-Click Assignment */}
                    <div className="max-h-52 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
                      {POKEMON_TYPES.filter((t) => catalogTypeFilter === 'all' || catalogTypeFilter === t).map((t) => {
                        const moves = (catalogCategory === 'Fast' ? TYPE_FAST_MOVES[t] : TYPE_CHARGED_MOVES[t]) || [];
                        const filteredMoves = catalogSearch
                          ? moves.filter((m) => m.toLowerCase().includes(catalogSearch.toLowerCase()))
                          : moves;

                        if (filteredMoves.length === 0) return null;

                        return (
                          <div key={`cat-grid-${t}`} className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <span>{TYPE_EMOJI_MAP[t]}</span>
                              <span className="uppercase">{t}</span>
                              <span className="text-slate-600">({filteredMoves.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {filteredMoves.map((m) => (
                                <div key={`cat-move-${t}-${m}`} className="flex items-center gap-1">
                                  <MoveBadge
                                    moveName={m}
                                    type={t}
                                    category={catalogCategory}
                                    size="xs"
                                    onClick={() => {
                                      if (catalogCategory === 'Fast') {
                                        setFormFastMove(m);
                                      } else {
                                        if (!formChargedMove1) {
                                          setFormChargedMove1(m);
                                        } else {
                                          setFormChargedMove2(m);
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Role Tags Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Label / Tag Peran (Pilih yang sesuai):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  {ROLE_OPTIONS.map((r) => {
                    const isSelected = formRoles.includes(r.role);
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => handleToggleRole(r.role)}
                        className={`flex items-center gap-1.5 p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{r.icon}</span>
                        <span className="truncate">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 font-mono">Catatan Pribadi (Opsional):</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Didapat dari Raid Rayquaza Mega Battle Day, sudah max level 50..."
                  rows={2}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 text-xs font-mono"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer font-mono"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition cursor-pointer font-mono uppercase tracking-wider"
                >
                  {editingItem ? 'Perbarui Data' : 'Simpan ke Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
