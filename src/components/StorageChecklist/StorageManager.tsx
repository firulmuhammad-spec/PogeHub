import React, { useState, useEffect, useRef } from 'react';
import { StoragePokemon, RoleTag, PokemonType } from '../../types/pokemon';
import { POPULAR_POKEMON_LIST, searchPokemonCatalog } from '../../data/pokemonList';
import { TypeBadge } from '../common/TypeBadge';
import confetti from 'canvas-confetti';
import {
  PackageCheck,
  Plus,
  Sparkles,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit2,
  Star,
  Shield,
  Swords,
  Trophy,
  Zap,
  Check,
  X,
  RefreshCw,
  FileJson,
  Layers,
  ArrowUpDown,
  Tag,
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
  const [editingItem, setEditingItem] = useState<StoragePokemon | null>(null);

  // Form State
  const [formSearch, setFormSearch] = useState('');
  const [formName, setFormName] = useState('');
  const [formDex, setFormDex] = useState<number>(25);
  const [formTypes, setFormTypes] = useState<PokemonType[]>(['Electric']);
  const [formCp, setFormCp] = useState<string>('');
  const [formIsHundo, setFormIsHundo] = useState(true);
  const [formIsShiny, setFormIsShiny] = useState(false);
  const [formIsLucky, setFormIsLucky] = useState(false);
  const [formIsShadow, setFormIsShadow] = useState(false);
  const [formRoles, setFormRoles] = useState<RoleTag[]>(['Raid Attacker']);
  const [formFastMove, setFormFastMove] = useState('');
  const [formChargedMove, setFormChargedMove] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState(POPULAR_POKEMON_LIST.slice(0, 5));

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
    setFormFastMove('');
    setFormChargedMove('');
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
    setFormChargedMove(item.chargedMoves?.join(', ') || '');
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSelectCatalogPokemon = (p: typeof POPULAR_POKEMON_LIST[0]) => {
    setFormName(p.name);
    setFormDex(p.dex);
    setFormTypes(p.types);
    setFormSearch(p.name);
  };

  const handleSavePokemon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${formDex}.png`;
    const chargedArray = formChargedMove
      ? formChargedMove.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

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
      chargedMoves: chargedArray,
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

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pokego_inventory_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase());

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
              Checklist pencatatan Pokémon IV 100% (4★ Hundo), Shiny ✨, Lucky, dan Shadow dengan tag peran pertempuran.
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
              <span className="hidden sm:inline">Impor JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
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
              placeholder="Cari nama Pokémon, No. Pokédex, atau catatan..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
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
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
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
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Semua ({items.length})
          </button>

          <button
            onClick={() => setFilterCategory('hundo')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              filterCategory === 'hundo'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-300'
            }`}
          >
            💯 IV 100% (4★)
          </button>

          <button
            onClick={() => setFilterCategory('shiny')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              filterCategory === 'shiny'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-cyan-300'
            }`}
          >
            ✨ Shiny
          </button>

          <button
            onClick={() => setFilterCategory('shundo')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              filterCategory === 'shundo'
                ? 'bg-rose-600 text-white border-rose-500 font-bold animate-pulse'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-400'
            }`}
          >
            👑 Shundo (Shiny + 100%)
          </button>

          {/* Role Filter Dropdown */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Role:</span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none cursor-pointer"
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
            Coba sesuaikan kata kunci pencarian atau bersihkan filter yang aktif.
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
                      <h4 className="text-base font-black text-slate-100 tracking-tight">
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
                    title="Edit data Pokémon"
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

              {/* Moveset Info (if provided) */}
              {(item.fastMove || (item.chargedMoves && item.chargedMoves.length > 0)) && (
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-0.5 font-mono">
                  {item.fastMove && (
                    <div className="text-slate-400">
                      <span className="text-slate-500">Fast:</span> {item.fastMove}
                    </div>
                  )}
                  {item.chargedMoves && item.chargedMoves.length > 0 && (
                    <div className="text-slate-300">
                      <span className="text-slate-500">Charged:</span> {item.chargedMoves.join(', ')}
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-cyan-400" />
                {editingItem ? 'Edit Data Pokémon' : 'Tambah Pokémon ke Checklist'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePokemon} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Quick Search Autocomplete */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Cari Nama Pokémon / No. Dex:
                </label>
                <input
                  type="text"
                  value={formSearch}
                  onChange={(e) => {
                    setFormSearch(e.target.value);
                    setFormName(e.target.value);
                  }}
                  placeholder="Ketik nama (contoh: Rayquaza, Lucario, Mewtwo...)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />

                {/* Suggestions List */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 self-center">Rekomendasi:</span>
                  {autocompleteSuggestions.map((p) => (
                    <button
                      key={p.dex}
                      type="button"
                      onClick={() => handleSelectCatalogPokemon(p)}
                      className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                    >
                      #{p.dex} {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row: CP & Dex */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Combat Power (CP):</label>
                  <input
                    type="number"
                    value={formCp}
                    onChange={(e) => setFormCp(e.target.value)}
                    placeholder="Contoh: 4178"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">No. Pokédex:</label>
                  <input
                    type="number"
                    value={formDex}
                    onChange={(e) => setFormDex(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Status Checkboxes: IV 100, Shiny, Lucky, Shadow */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Status & Atribut Spesial:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

              {/* Role Tags Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Label / Tag Peran (Pilih yang sesuai):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

              {/* Moveset Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Fast Move (Opsional):</label>
                  <input
                    type="text"
                    value={formFastMove}
                    onChange={(e) => setFormFastMove(e.target.value)}
                    placeholder="Contoh: Dragon Tail"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Charged Moves (Pisahkan koma):</label>
                  <input
                    type="text"
                    value={formChargedMove}
                    onChange={(e) => setFormChargedMove(e.target.value)}
                    placeholder="Contoh: Dragon Ascent, Outrage"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Catatan Pribadi (Opsional):</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Didapat dari Raid Rayquaza Mega Battle Day, sudah max power up..."
                  rows={2}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition cursor-pointer"
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
