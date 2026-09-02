import React from 'react';
import {
  Zap,
  PackageCheck,
  Swords,
  Globe,
  Sparkles,
  HelpCircle,
  Smartphone,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type ActiveTab = 'types' | 'storage' | 'raids' | 'coordinates';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  storageStats: {
    total: number;
    hundos: number;
    shinies: number;
    shundos: number;
  };
  onOpenHelp: () => void;
  onOpenInstallPwa: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  storageStats,
  onOpenHelp,
  onOpenInstallPwa,
}) => {
  const { theme, toggleTheme } = useTheme();

  const navTabs = [
    {
      id: 'types' as ActiveTab,
      label: 'Type Calculator',
      sublabel: 'Element Matrix & Multiplier',
      shortName: 'Type Chart',
      icon: Zap,
    },
    {
      id: 'storage' as ActiveTab,
      label: 'Storage Checklist',
      sublabel: 'Hundo 100% & Shiny Tracker',
      shortName: 'Storage',
      icon: PackageCheck,
    },
    {
      id: 'raids' as ActiveTab,
      label: 'Raid Boss Counter',
      sublabel: 'PokéAPI & Counter Terbaik',
      shortName: 'Raid Hub',
      icon: Swords,
    },
    {
      id: 'coordinates' as ActiveTab,
      label: 'World Coordinates',
      sublabel: 'Global Clocks & Hotspots',
      shortName: 'World Time',
      icon: Globe,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div
              className="relative group cursor-pointer"
              onClick={() => setActiveTab('types')}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/20 border border-emerald-400/50 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">PokéGO</span>
                  <span>Master Hub</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 tracking-wider">
                  COMPANION
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate font-medium">
                Kalkulator Tipe, Koleksi Hundo/Shiny, Raid Boss & Koordinat
              </p>
            </div>
          </div>

          {/* Trainer HUD Pill, Theme Switcher & Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              title={theme === 'light' ? 'Beralih ke Tema Gelap (Night Mode)' : 'Beralih ke Tema Terang Pokémon GO (Light Mode)'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="hidden md:inline">Tema Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="hidden md:inline">Tema Gelap</span>
                </>
              )}
            </button>

            {/* Quick Storage Stats */}
            <button
              onClick={() => setActiveTab('storage')}
              className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 transition cursor-pointer text-xs"
              title="Buka Storage Checklist"
            >
              <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-bold">
                <span className="text-[10px] px-1 bg-amber-500 text-white rounded font-black">100% IV</span>
                <span>{storageStats.hundos}</span>
              </div>
              <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
              <div className="flex items-center gap-1 text-cyan-700 dark:text-cyan-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{storageStats.shinies} ✨</span>
              </div>
            </button>

            {/* Install PWA Button */}
            <button
              onClick={onOpenInstallPwa}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 transition cursor-pointer"
              title="Install aplikasi ke HP / Komputer (PWA)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden text-[10px]">PWA</span>
            </button>

            {/* Help / Guide Trigger */}
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer"
              title="Panduan menjalankan & deploy"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Panduan</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 -mb-px border-t border-slate-200 dark:border-slate-800">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] sm:min-w-[160px] flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer relative ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/50 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.2} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs sm:text-sm font-bold tracking-tight truncate ${
                        isActive ? 'text-emerald-900 dark:text-emerald-200 font-bold' : 'text-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {tab.sublabel}
                  </div>
                </div>

                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
